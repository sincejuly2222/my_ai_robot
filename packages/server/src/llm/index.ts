import { ChatOpenAI } from "@langchain/openai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

/**
 * 根据环境变量创建聊天模型实例（「留接口」核心）。
 *
 * 环境变量：
 * - LLM_PROVIDER: 提供商，目前支持 "openai"（默认，OpenAI 兼容协议）
 * - LLM_API_KEY:  API Key
 * - LLM_MODEL:    模型名
 * - LLM_BASE_URL: 接口地址（可选，DeepSeek 用 https://api.deepseek.com/v1）
 *
 * 未来接入 DeepSeek 专用包时，增加 "deepseek" 分支即可：
 *   import { ChatDeepSeek } from "@langchain/deepseek";
 *   return new ChatDeepSeek({ model, apiKey });
 */
export function getChatModel(): BaseChatModel {
  const provider = process.env.LLM_PROVIDER ?? "openai";
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL ?? "gpt-4o-mini";
  const baseURL = process.env.LLM_BASE_URL;

  if (!apiKey) {
    throw new Error(
      "未配置 LLM_API_KEY。请在 packages/server/.env 中填入你的 API Key。"
    );
  }

  switch (provider) {
    case "openai": {
      return new ChatOpenAI({
        model,
        apiKey,
        configuration: { baseURL },
      });
    }
    default:
      throw new Error(`不支持的 LLM_PROVIDER: ${provider}`);
  }
}
