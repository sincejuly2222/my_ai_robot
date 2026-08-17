import "dotenv/config";
import { createApp } from "./app";
import { initDb } from "./db";

const port = Number(process.env.PORT ?? 3001);

async function main() {
  try {
    await initDb();
    console.log("✅ 数据库连接成功，users 表已就绪");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("⚠️ 数据库初始化失败（用户接口将不可用）：", message);
  }

  const app = createApp();
  app.listen(port, () => {
    console.log(`✅ 后端服务已启动：http://localhost:${port}`);
  });
}

main();
