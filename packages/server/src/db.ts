import mysql from "mysql2/promise";

// 连接池配置来自环境变量（见 .env / .env.example）
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "my_user",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  // DATE 列按字符串返回（yyyy-MM-dd），避免 JS Date 时区偏移
  dateStrings: true,
});

/** 启动时确保 users 表存在（表结构对齐用户提供的建表语句） */
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT PRIMARY KEY AUTO_INCREMENT COMMENT '编号',
      workno      VARCHAR(10) NOT NULL COMMENT '工号',
      name        VARCHAR(10) NOT NULL COMMENT '姓名',
      gender      CHAR(1)     NOT NULL COMMENT '性别',
      age         TINYINT UNSIGNED COMMENT '年龄',
      idcard      CHAR(18) COMMENT '身份证号',
      workaddress VARCHAR(50) COMMENT '工作地址',
      entrydate   DATE COMMENT '入职时间'
    ) DEFAULT CHARSET=utf8mb4
  `);
}

export default pool;
