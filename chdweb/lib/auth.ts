import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/neonClient";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface User {
  id: string;
  username: string;
  phone_number: string;
  full_name?: string | null;
  is_active: boolean;
  created_at: string;
}

export async function registerUser(
  username: string,
  phoneNumber: string,
  password: string,
  fullName: string
): Promise<User> {
  const existing = await pool.query(
    "SELECT id FROM users WHERE username = $1 OR phone_number = $2",
    [username, phoneNumber]
  );
  if (existing.rows.length > 0) {
    throw new Error("اسم المستخدم أو رقم الهاتف موجود مسبقاً");
  }

  // حفظ كلمة المرور كما هي بدون تشفير
  const result = await pool.query(
    `INSERT INTO users (username, phone_number, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, phone_number, full_name, is_active, created_at`,
    [username, phoneNumber, password, fullName]
  );
  return result.rows[0];
}

export async function loginUser(
  usernameOrPhone: string,
  password: string
): Promise<{ user: User; token: string }> {
  const res = await pool.query(
    `SELECT id, username, phone_number, password_hash, full_name, is_active, created_at
     FROM users WHERE username = $1 OR phone_number = $1`,
    [usernameOrPhone]
  );
  if (res.rows.length === 0) {
    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
  }
  const row = res.rows[0];
  
  // مقارنة كلمة المرور مباشرة بدون تشفير
  if (password !== row.password_hash) {
    throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
  }
  
  if (!row.is_active) throw new Error("الحساب معطل");

  const token = jwt.sign(
    { userId: row.id, username: row.username, phone_number: row.phone_number },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await pool.query(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
    [row.id, token, expiresAt]
  );

  delete row.password_hash;
  return { user: row, token };
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const s = await pool.query(
      "SELECT 1 FROM sessions WHERE token = $1 AND expires_at > NOW()",
      [token]
    );
    if (s.rows.length === 0) return null;
    const u = await pool.query(
      `SELECT id, username, phone_number, full_name, is_active, created_at
       FROM users WHERE id = $1`,
      [decoded.userId]
    );
    if (u.rows.length === 0 || !u.rows[0].is_active) return null;
    await pool.query("UPDATE sessions SET last_activity = NOW() WHERE token = $1", [token]);
    return u.rows[0];
  } catch {
    return null;
  }
}

export async function logoutUser(token: string): Promise<void> {
  await pool.query("DELETE FROM sessions WHERE token = $1", [token]);
}

export async function getAllUsers(): Promise<User[]> {
  const r = await pool.query(
    "SELECT id, username, phone_number, email, full_name, is_active, created_at FROM users ORDER BY created_at DESC"
  );
  return r.rows;
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<void> {
  await pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [isActive, userId]);
}
