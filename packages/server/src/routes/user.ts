import { Router } from "express";
import type { ResultSetHeader } from "mysql2";
import type { User, UserInput } from "@my-ai-robot/shared";
import pool from "../db";

export const userRouter = Router();

type ValidationResult = { error: string } | { data: UserInput };

/** 校验并规整请求体，返回错误消息或标准化后的字段 */
function validateInput(body: unknown): ValidationResult {
  const b = (body ?? {}) as Record<string, unknown>;

  const workno = typeof b.workno === "string" ? b.workno.trim() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const gender =
    b.gender === "男" || b.gender === "女" ? (b.gender as "男" | "女") : "";

  if (!workno) return { error: "工号不能为空" };
  if (workno.length > 10) return { error: "工号最多 10 个字符" };
  if (!name) return { error: "姓名不能为空" };
  if (name.length > 10) return { error: "姓名最多 10 个字符" };
  if (!gender) return { error: "性别必须是「男」或「女」" };

  const data: UserInput = { workno, name, gender };

  if (typeof b.age === "number" && Number.isFinite(b.age)) {
    if (!Number.isInteger(b.age) || b.age < 0 || b.age > 150) {
      return { error: "年龄必须是 0-150 的整数" };
    }
    data.age = b.age;
  }

  const idcard = typeof b.idcard === "string" ? b.idcard.trim() : "";
  if (idcard) {
    if (!/^\d{17}[\dXx]$/.test(idcard)) return { error: "身份证号必须是 18 位" };
    data.idcard = idcard;
  }

  const workaddress =
    typeof b.workaddress === "string" ? b.workaddress.trim() : "";
  if (workaddress) {
    if (workaddress.length > 50) return { error: "工作地址最多 50 个字符" };
    data.workaddress = workaddress;
  }

  const entrydate = typeof b.entrydate === "string" ? b.entrydate.trim() : "";
  if (entrydate) data.entrydate = entrydate;

  return { data };
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

// 列表
userRouter.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, workno, name, gender, age, idcard, workaddress, entrydate FROM sys_user ORDER BY id"
    );
    res.json(rows as User[]);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err, "查询失败") });
  }
});

// 新增
userRouter.post("/", async (req, res) => {
  const result = validateInput(req.body);
  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  const input = result.data;

  try {
    const [r] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (workno, name, gender, age, idcard, workaddress, entrydate) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        input.workno,
        input.name,
        input.gender,
        input.age ?? null,
        input.idcard ?? null,
        input.workaddress ?? null,
        input.entrydate ?? null,
      ]
    );
    res.status(201).json({ id: r.insertId, ...input } satisfies User);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err, "新增失败") });
  }
});

// 更新
userRouter.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "无效的 id" });
    return;
  }

  const result = validateInput(req.body);
  if ("error" in result) {
    res.status(400).json({ error: result.error });
    return;
  }
  const input = result.data;

  try {
    const [r] = await pool.query<ResultSetHeader>(
      "UPDATE users SET workno=?, name=?, gender=?, age=?, idcard=?, workaddress=?, entrydate=? WHERE id=?",
      [
        input.workno,
        input.name,
        input.gender,
        input.age ?? null,
        input.idcard ?? null,
        input.workaddress ?? null,
        input.entrydate ?? null,
        id,
      ]
    );
    if (r.affectedRows === 0) {
      res.status(404).json({ error: "用户不存在" });
      return;
    }
    res.json({ id, ...input } satisfies User);
  } catch (err) {
    res.status(500).json({ error: errorMessage(err, "更新失败") });
  }
});

// 删除
userRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "无效的 id" });
    return;
  }

  try {
    const [r] = await pool.query<ResultSetHeader>(
      "DELETE FROM users WHERE id=?",
      [id]
    );
    if (r.affectedRows === 0) {
      res.status(404).json({ error: "用户不存在" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: errorMessage(err, "删除失败") });
  }
});
