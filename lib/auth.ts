import { cookies } from "next/headers"
import { sql, type User } from "./db"
import { getSession } from "./redis"
import bcrypt from "bcryptjs"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) return null

  const userId = await getSession(sessionId)
  if (!userId) return null

  const users = await sql`SELECT * FROM users WHERE id = ${userId}`
  return users[0] as User | null
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function generateSessionId(): string {
  return crypto.randomUUID()
}
