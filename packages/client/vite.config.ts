import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // 开发期把 /api 转发到后端，避免 CORS
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // antd 及其生态（含 rc-* 底层组件、@ant-design/* 图标与 X）
          if (
            id.includes("antd") ||
            id.includes("@ant-design") ||
            id.includes("rc-")
          ) {
            return "antd";
          }
          // React 运行时
          if (id.includes("react") || id.includes("scheduler")) {
            return "react";
          }
          // 其余第三方库
          return "vendor";
        },
      },
    },
  },
});
