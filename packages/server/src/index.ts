import "dotenv/config";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3001);
const app = createApp();

app.listen(port, () => {
  console.log(`✅ 后端服务已启动：http://localhost:${port}`);
});
