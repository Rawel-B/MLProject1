"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, AlertTriangle, X } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Reports", href: "/reports" },
    { name: "Goals & Strategy", href: "/goalsandstrategy" },
    { name: "Profile", href: "/profile" },
  ]

  const confirmLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-brand-black/80 backdrop-blur-md border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="group">
          <div className="text-brand-green font-black text-xl tracking-tighter flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_10px_#16a34a] group-hover:scale-125 transition-transform" />
            WEALTH.AI
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-medium ml-4 mt-[-2px] group-hover:text-white transition-colors">
            Go Green
          </span>
        </Link>

        <div className="flex gap-8 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                  isActive ? "text-brand-green" : "text-brand-white/40 hover:text-brand-white"
                }`}
              >
                {item.name}             
                {isActive && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-brand-green shadow-[0_0_12px_#16a34a] rounded-full" />
                )}
              </Link>
            )
          })}

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="ml-2 group relative flex items-center justify-center w-10 h-10 rounded-full bg-brand-black border border-brand-green/30 shadow-[0_0_15px_rgba(22,163,74,0.2)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)] transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-full bg-brand-green/5 group-hover:bg-brand-green/10" />
            <LogOut className="w-5 h-5 text-brand-green group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />   
          <div className="relative w-full max-w-md bg-brand-black border border-brand-green/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(22,163,74,0.1)] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-green/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-brand-green/10 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-brand-green animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Sign out?</h3>
                <p className="text-brand-white/40 text-sm leading-relaxed">
                  You are about to leave.
                </p>
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/60 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                >
                  Stay
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-4 rounded-xl bg-brand-green text-brand-black font-black uppercase text-xs tracking-widest hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:scale-[1.02] transition-all"
                >
                  Leave
                </button>
              </div>
            </div>
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}