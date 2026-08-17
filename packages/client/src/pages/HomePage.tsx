import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Card className="home-page">
      <Typography.Title level={3}>欢迎使用 my-ai-robot 🤖</Typography.Title>
      <Typography.Paragraph type="secondary">
        这是一个基于 React + antd + Express 的多页面应用示例。后续新页面只需在{" "}
        <code>src/pages</code> 下新建组件，并在 <code>App.tsx</code> 里注册路由即可。
      </Typography.Paragraph>
      <Button type="primary" onClick={() => navigate("/chat")}>
        开始聊天
      </Button>
    </Card>
  );
}
