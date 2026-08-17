export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  content: string;
}

export interface User {
  id: number;
  workno: string;
  name: string;
  gender: "男" | "女";
  age?: number;
  idcard?: string;
  workaddress?: string;
  entrydate?: string; // yyyy-MM-dd
}

export type UserInput = Omit<User, "id">;
