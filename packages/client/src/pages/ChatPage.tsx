import { useRef, useState } from "react";
import { Bubble, Sender } from "@ant-design/x";
import type { BubbleItemType } from "@ant-design/x";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import type { ChatMessage } from "@my-ai-robot/shared";
import { sendChatStream } from "../api/chat";

export default function ChatPage() {
  const [items, setItems] = useState<BubbleItemType[]>([]);
  const [loading, setLoading] = useState(false);
  // 手动维护多轮对话上下文，传给后端
  const historyRef = useRef<ChatMessage[]>([]);
  const idRef = useRef(0);

  async function handleSubmit(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = { role: "user", content };
    const userKey = idRef.current++;
    const aiKey = idRef.current++;

    setItems((prev) => [
      ...prev,
      { key: userKey, role: "user", content },
      { key: aiKey, role: "ai", content: "", loading: true },
    ]);
    setLoading(true);

    const requestMessages = [...historyRef.current, userMessage];
    let full = "";

    try {
      await sendChatStream(requestMessages, (chunk) => {
        full += chunk;
        setItems((prev) =>
          prev.map((item) =>
            item.key === aiKey
              ? { ...item, content: full, loading: false }
              : item
          )
        );
      });
      historyRef.current = [
        ...requestMessages,
        { role: "assistant", content: full },
      ];
    } catch (err) {
      const message = err instanceof Error ? err.message : "请求失败";
      setItems((prev) =>
        prev.map((item) =>
          item.key === aiKey
            ? { ...item, content: `⚠️ ${message}`, loading: false }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-page">
      <h1>🤖 聊天</h1>
      <div className="chat-panel">
        <Bubble.List
          role={{
            user: {
              placement: "end",
              avatar: (
                <Avatar icon={<UserOutlined />} style={{ background: "#1677ff" }} />
              ),
            },
            ai: {
              placement: "start",
              avatar: (
                <Avatar icon={<RobotOutlined />} style={{ background: "#52c41a" }} />
              ),
            },
          }}
          items={items}
          autoScroll
        />
      </div>
      <Sender
        loading={loading}
        onSubmit={handleSubmit}
        placeholder="输入消息，按回车发送…"
      />
    </div>
  );
}
