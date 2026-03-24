"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login"
      const body = isRegister
        ? { email, password, name }
        : { email, password }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-sky-50 p-4">
      <Card className="w-full max-w-sm border-0 shadow-xl">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <Sparkles className="size-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Release Tracker</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister ? "Create your admin account" : "Sign in to continue"}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Abhishek"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full gap-1.5" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError("") }}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "First time? Create admin account"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
