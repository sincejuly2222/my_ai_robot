# my-ai-robot

基于 pnpm workspaces 的 monorepo 项目，包含前端与后端。

## 结构

```
packages/
├── shared/    # 前后端共享的 TypeScript 类型
├── server/    # 后端：Express + LangChain
└── client/    # 前端：Vite + React
```

## 环境要求

- Node.js >= 20
- pnpm >= 9

## 安装

```bash
pnpm install
```

## 启动开发环境

```bash
pnpm dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:3001

也可分别启动：

```bash
pnpm dev:server   # 只启动后端
pnpm dev:client   # 只启动前端
```

## 配置后端 LLM

后端通过环境变量接入大模型（默认「留接口」，未配置 key 时返回友好提示）。

复制模板并填写：

```bash
cp packages/server/.env.example packages/server/.env
```

关键变量：

| 变量 | 说明 |
|------|------|
| `LLM_PROVIDER` | 模型提供商，默认 `openai`（OpenAI 兼容协议） |
| `LLM_API_KEY` | 你的 API Key |
| `LLM_MODEL` | 模型名 |
| `LLM_BASE_URL` | 接口地址（DeepSeek 用 `https://api.deepseek.com/v1`） |

## 构建

```bash
pnpm build
```

## 说明

- 开发阶段后端用 `tsx` 直接运行 TS 源码，`build` 用 `tsc` 做类型检查与产物输出。
- 前端通过 Vite 的 `/api` 代理转发到后端，避免开发期 CORS 问题。
