"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Lock, Briefcase, Mail, Save, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profession: "",
    salary: ""
  })
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      
      try {
        const response = await fetch("http://localhost:8000/user/currentuser", {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUserData({
            name: data.name || "",
            email: data.email || "",
            profession: data.profession || "",
            salary: data.salary || ""
          })
        } else if (response.status === 401) {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!userData.email.trim()) {
      return toast.error("Email address cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
      return toast.error("Please enter a valid email address format");
    }
    if (newPassword || confirmPassword || oldPassword) {
      if (newPassword !== confirmPassword) {
        return toast.error("New passwords do not match")
      }
      if (!oldPassword) {
        return toast.error("Current password required to authorize changes")
      }
    }

    setIsSaving(true)
    const token = localStorage.getItem("token")

    try {
      const response = await fetch("http://localhost:8000/user/update-profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          ...userData,
          old_password: oldPassword,
          new_password: newPassword
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Profile Updated Successfully!")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(result.detail || "Update failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">Account Settings</h1>
          <p className="text-brand-white/40">Manage settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">      
          {/* Personal Details */}
          <ProfileSection 
            title="Personal Details" 
            description="Set up your personal details."
            icon={<User className="w-5 h-5 text-brand-green" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-brand-green font-bold">Full Name</Label>
                <Input 
                  id="name" 
                  value={userData.name} 
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-brand-green text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-brand-green font-bold">Email Address</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    value={userData.email} 
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="bg-white/5 border-white/10 focus:border-brand-green pl-10 text-white" 
                  />
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 opacity-30 text-brand-green" />
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Professional Details */}
          <ProfileSection 
            title="Professional Details" 
            description="Provide your professional details."
            icon={<Briefcase className="w-5 h-5 text-brand-green" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-xs uppercase tracking-widest text-brand-green font-bold">Current Profession</Label>
                <Input 
                  id="profession" 
                  value={userData.profession} 
                  onChange={(e) => setUserData({...userData, profession: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-brand-green text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-xs uppercase tracking-widest text-brand-green font-bold">Annual Salary (USD)</Label>
                <Input 
                  id="salary" 
                  type="number" 
                  value={userData.salary} 
                  onChange={(e) => setUserData({...userData, salary: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-brand-green text-white" 
                />
              </div>
            </div>
          </ProfileSection>

          {/* Security */}
          <ProfileSection 
            title="Security" 
            description="Keep your information safe."
            icon={<Lock className="w-5 h-5 text-brand-green" />}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="old-password" className="text-xs uppercase tracking-widest text-brand-green font-bold">
                  Current Password
                </Label>
                <Input 
                  id="old-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white/10 border-brand-green/30 focus:border-brand-green text-white" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-xs uppercase tracking-widest text-brand-green font-bold">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-brand-green text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-xs uppercase tracking-widest text-brand-green font-bold">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-brand-green text-white" 
                  />
                </div>
              </div>
            </div>
          </ProfileSection>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end items-center gap-4 pt-4">
            <Button 
              variant="outline"
              className="bg-transparent border-white/10 hover:bg-white/5 text-white/60 hover:text-white px-8 py-6 rounded-2xl transition-all flex gap-2"
              onClick={() => window.location.reload()}
            >
                <RotateCcw className="w-4 h-4" />
                Revert Changes
            </Button>  
            <Button 
              className="bg-brand-green hover:bg-brand-green/80 text-brand-black font-bold px-8 py-6 rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isSaving}
            >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? "Saving..." : "Save Profile Changes"}
            </Button>
        </div>
      </div>
    </div>
  )
}

function ProfileSection({ title, description, icon, children }: { 
  title: string, 
  description: string, 
  icon: React.ReactNode, 
  children: React.ReactNode 
}) {
  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green/10 rounded-lg">{icon}</div>
          <div>
            <CardTitle className="text-brand-white text-xl">{title}</CardTitle>
            <CardDescription className="text-white/40">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}