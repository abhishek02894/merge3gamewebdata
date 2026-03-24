import { prisma } from "@/lib/db"
import { hashSync, compareSync } from "bcryptjs"
import { cookies } from "next/headers"
import { randomBytes } from "crypto"

const SESSION_COOKIE = "grt_session"
const SESSION_EXPIRY_DAYS = 30

export async function createUser(email: string, password: string, name?: string) {
  const passwordHash = hashSync(password, 12)
  return prisma.user.create({
    data: { email, passwordHash, name },
  })
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const valid = compareSync(password, user.passwordHash)
  if (!valid) return null

  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })

  return user
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true, name: true } } },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session.user
}

export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
    cookieStore.delete(SESSION_COOKIE)
  }
}

export async function getUserCount() {
  return prisma.user.count()
}
