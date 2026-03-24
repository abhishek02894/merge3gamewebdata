import { login } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }

    const user = await login(email, password)
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 })
    }

    return Response.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}
