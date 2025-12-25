"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        toast.success("Account created successfully! Redirecting...")        
        setTimeout(() => { router.push("/login") }, 2000)
      } else {
        const errorData = await response.json()
        toast.error(errorData.detail || "Registration failed")
      }
    } catch (error) {
      toast.error("Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-black">
      <Card className="w-full max-w-sm bg-brand-white text-brand-black border border-brand-green/30 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight text-brand-green">
            Sign Up
          </CardTitle>
          <p className="text-sm text-black/60">
            Get a better grasp over finances today!
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-black/20 focus:border-brand-green focus:ring-brand-green"
          />
          <Input
            placeholder="Email Address"
            type="email"
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
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-black/60">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-green hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}