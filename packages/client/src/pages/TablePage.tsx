import { useEffect, useMemo, useState } from "react";
import { Button, Input, Popconfirm, Space, Table, Tag, message } from "antd";
import type { TableColumnsType } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { User, UserInput } from "@my-ai-robot/shared";
import { createUser, deleteUser, listUsers, updateUser } from "../api/user";
import UserFormModal from "../components/UserFormModal";

export default function TablePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setUsers(await listUsers());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // 按工号 / 姓名做关键字过滤（前端本地检索）
  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return users;
    return users.filter(
      (u) =>
        u.workno.toLowerCase().includes(k) || u.name.toLowerCase().includes(k)
    );
  }, [users, keyword]);

  const columns: TableColumnsType<User> = [
    { title: "工号", dataIndex: "workno" },
    { title: "姓名", dataIndex: "name" },
    {
      title: "性别",
      dataIndex: "gender",
      render: (gender: User["gender"]) => (
        <Tag color={gender === "男" ? "blue" : "magenta"}>{gender}</Tag>
      ),
    },
    { title: "年龄", dataIndex: "age", render: (v?: number) => v ?? "—" },
    {
      title: "身份证号",
      dataIndex: "idcard",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "工作地址",
      dataIndex: "workaddress",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "入职时间",
      dataIndex: "entrydate",
      render: (v?: string) => v ?? "—",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该用户吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setModalOpen(true);
  }

  async function handleSubmit(values: UserInput) {
    if (editing) {
      await updateUser(editing.id, values);
      message.success("已更新");
    } else {
      await createUser(values);
      message.success("已新增");
    }
    setModalOpen(false);
    refresh();
  }

  async function handleDelete(id: number) {
    await deleteUser(id);
    message.success("已删除");
    refresh();
  }

  return (
    <div>
      <div className="table-toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="按工号 / 姓名搜索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新增用户
        </Button>
      </div>

      <Table<User>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 5, showSizeChanger: true }}
      />

      <UserFormModal
        open={modalOpen}
        initialUser={editing}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
