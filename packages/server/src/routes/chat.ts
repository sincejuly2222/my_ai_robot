import { Router } from "express";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import type { ChatRequest } from "@my-ai-robot/shared";
import { getChatModel } from "../llm/index";

export const chatRouter = Router();

/** 把 role 风格的消息（OpenAI 协议）转成 LangChain 的消息对象 */
function toLangChainMessages(messages: ChatRequest["messages"]) {
  return messages.map((m) => {
    switch (m.role) {
      case "user":
        return new HumanMessage(m.content);
      case "assistant":
        return new AIMessage(m.content);
      case "system":
        return new SystemMessage(m.content);
    }
  });
}

chatRouter.post("/", async (req, res) => {
  const { messages } = req.body as ChatRequest;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages 不能为空" });
    return;
  }

  try {
    const model = getChatModel();
    const chain = model.pipe(new StringOutputParser());

    // 设置 SSE 响应头，开始流式输出
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await chain.stream(toLangChainMessages(messages));
    for await (const chunk of stream) {
      // 跳过空 chunk（豆包偶发会先吐一批空 token）
      if (!chunk) continue;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    res.write("data: [DONE]\n\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    if (res.headersSent) {
      // 流已开始，只能以 SSE 事件形式返回错误
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.write("data: [DONE]\n\n");
    } else {
      res.status(500).json({ error: message });
    }
  } finally {
    res.end();
  }
});
