import type { User, UserInput } from "@my-ai-robot/shared";

const BASE = "/api/users";

/** 统一封装请求：非 2xx 时解析后端 { error } 并抛出 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? `请求失败（${res.status}）`);
  }
  return res.json() as Promise<T>;
}

export function listUsers(): Promise<User[]> {
  return request<User[]>(BASE);
}

export function createUser(input: UserInput): Promise<User> {
  return request<User>(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateUser(id: number, input: UserInput): Promise<User> {
  return request<User>(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteUser(id: number): Promise<void> {
  return request<void>(`${BASE}/${id}`, { method: "DELETE" });
}
