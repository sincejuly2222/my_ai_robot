import { useEffect } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Radio } from "antd";
import type { User, UserInput } from "@my-ai-robot/shared";
import dayjs, { type Dayjs } from "dayjs";

interface UserFormModalProps {
  open: boolean;
  initialUser?: User | null;
  onCancel: () => void;
  onSubmit: (values: UserInput) => void;
}

interface FormValues {
  workno: string;
  name: string;
  gender: "男" | "女";
  age?: number;
  idcard?: string;
  workaddress?: string;
  entrydate?: Dayjs;
}

export default function UserFormModal({
  open,
  initialUser,
  onCancel,
  onSubmit,
}: UserFormModalProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (!open) return;
    if (initialUser) {
      form.setFieldsValue({
        workno: initialUser.workno,
        name: initialUser.name,
        gender: initialUser.gender,
        age: initialUser.age,
        idcard: initialUser.idcard,
        workaddress: initialUser.workaddress,
        entrydate: initialUser.entrydate
          ? dayjs(initialUser.entrydate)
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialUser, form]);

  function handleOk() {
    form.validateFields().then((values) => {
      onSubmit({
        workno: values.workno,
        name: values.name,
        gender: values.gender,
        age: values.age,
        idcard: values.idcard,
        workaddress: values.workaddress,
        entrydate: values.entrydate
          ? values.entrydate.format("YYYY-MM-DD")
          : undefined,
      });
    });
  }

  return (
    <Modal
      title={initialUser ? "编辑用户" : "新增用户"}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
      cancelText="取消"
      forceRender
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="workno"
          label="工号"
          rules={[
            { required: true, message: "请输入工号" },
            { max: 10, message: "最多 10 个字符" },
          ]}
        >
          <Input placeholder="请输入工号" maxLength={10} />
        </Form.Item>

        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: "请输入姓名" },
            { max: 10, message: "最多 10 个字符" },
          ]}
        >
          <Input placeholder="请输入姓名" maxLength={10} />
        </Form.Item>

        <Form.Item
          name="gender"
          label="性别"
          rules={[{ required: true, message: "请选择性别" }]}
        >
          <Radio.Group>
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="age" label="年龄">
          <InputNumber
            min={0}
            max={150}
            precision={0}
            style={{ width: "100%" }}
            placeholder="请输入年龄"
          />
        </Form.Item>

        <Form.Item
          name="idcard"
          label="身份证号"
          rules={[{ pattern: /^\d{17}[\dXx]$/, message: "请输入 18 位身份证号" }]}
        >
          <Input placeholder="选填，18 位" maxLength={18} />
        </Form.Item>

        <Form.Item
          name="workaddress"
          label="工作地址"
          rules={[{ max: 50, message: "最多 50 个字符" }]}
        >
          <Input placeholder="选填" maxLength={50} />
        </Form.Item>

        <Form.Item name="entrydate" label="入职时间">
          <DatePicker style={{ width: "100%" }} placeholder="请选择入职时间" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
