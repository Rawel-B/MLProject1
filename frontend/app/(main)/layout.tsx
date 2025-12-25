"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.replace("/login") 
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  // This avoids a "flash" of private data
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}