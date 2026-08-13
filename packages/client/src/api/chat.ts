import type { ChatRequest } from "@my-ai-robot/shared";

/** 流式调用后端 /api/chat，逐 chunk 回调（SSE 协议） */
export async function sendChatStream(
  messages: ChatRequest["messages"],
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages } satisfies ChatRequest),
  });

  if (!res.ok || !res.body) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? `请求失败（${res.status}）`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 事件以空行分隔
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const dataLine = rawEvent
        .split("\n")
        .find((line) => line.startsWith("data:"));
      if (!dataLine) continue;

      const payload = dataLine.slice(5).trim();
      if (payload === "[DONE]") return;

      const parsed = JSON.parse(payload) as {
        content?: string;
        error?: string;
      };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.content) onChunk(parsed.content);
    }
  }
}
