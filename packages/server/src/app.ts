import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { chatRouter } from "./routes/chat";
import { userRouter } from "./routes/user";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  
  app.use("/api/health", healthRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/users", userRouter);


  return app;
}
