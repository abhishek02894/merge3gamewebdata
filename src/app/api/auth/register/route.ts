import { createUser, getUserCount, login } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const count = await getUserCount()
    if (count > 0) {
      return Response.json({ error: "Registration disabled. Admin already exists." }, { status: 403 })
    }

    const { email, password, name } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    await createUser(email, password, name)
    await login(email, password)

    return Response.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}
