"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.access_token)
        toast.success("Logging in...")
        router.push("/dashboard") 
      } else {
        toast.error(data.detail || "Invalid credentials!")
      }
    } catch (error) {
      toast.error("Connection to server failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-black">
      <Card className="w-full max-w-sm bg-brand-white text-brand-black border border-brand-green/30 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Sign in
          </CardTitle>
          <p className="text-sm text-black/60">
            Grow in wealth
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-black/20 focus:border-brand-green focus:ring-brand-green"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-black/20 focus:border-brand-green focus:ring-brand-green"
          />

          <Button
            className="w-full bg-brand-green text-brand-white hover:bg-brand-green/90"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-black/60">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-green hover:underline font-medium">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
