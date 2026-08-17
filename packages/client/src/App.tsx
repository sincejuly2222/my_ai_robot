import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { HomeOutlined, RobotOutlined, TeamOutlined } from "@ant-design/icons";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import TablePage from "./pages/TablePage";
import "./App.css";

const { Sider, Header, Content } = Layout;

const navItems = [
  { path: "/", label: "首页", icon: <HomeOutlined /> },
  { path: "/chat", label: "聊天", icon: <RobotOutlined /> },
  { path: "/table", label: "用户管理", icon: <TeamOutlined /> },
];

export default function App() {
  const location = useLocation();
  const current =
    navItems.find((item) => item.path === location.pathname) ?? navItems[0];

  const menuItems = navItems.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  return (
    <Layout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo">🤖 my-ai-robot</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current.path]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <span>{current.label}</span>
        </Header>
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/table" element={<TablePage />} />
            {/* 未匹配的路径回退到首页 */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
