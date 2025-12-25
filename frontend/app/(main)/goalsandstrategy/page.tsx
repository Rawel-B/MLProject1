"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Target, TrendingUp, Calendar, Save, Loader2, DollarSign, RotateCcw, PieChart, Activity, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

export default function SavingsGoalPage() {
  const [goalData, setGoalData] = useState({
    target_amount: "",
    target_date: "",
    savings_percentage: 20,
    investing_rate: 10,
    spending_rate: 50,
    debt_load: 0,
    stability_buffer: 3,
  })
  
  const [userSalary, setUserSalary] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("http://localhost:8000/user/currentuser", {
          headers: { "Authorization": `Bearer ${token}` },
        })
        if (response.ok) {
          const data = await response.json()
          const salary = parseFloat(data.salary) || 0
          setUserSalary(salary)
          setGoalData({
            target_amount: data.target_amount || "",
            target_date: data.target_date || "",
            savings_percentage: data.savings_percentage || 20,
            investing_rate: data.investing_rate || 10,
            spending_rate: data.spending_rate || 50,
            debt_load: data.debt_load || 0,
            stability_buffer: data.stability_buffer || 3,
          })
        }
      } catch (error) {
        toast.error("Failed to load goal settings")
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const handleDateChange = (dateValue: string) => {
    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 36);

    if (selectedDate < today) {
      toast.error("Target date cannot be in the past");
      return;
    }

    if (selectedDate > maxDate) {
      toast.error("Target date cannot exceed 3 years (36 months)");
      return;
    }

    setGoalData({ ...goalData, target_date: dateValue });
  }

  const updateByAmount = (val: string) => {
    if (userSalary <= 0) return;
    let numVal = parseFloat(val) || 0
    if (numVal > userSalary) {
        numVal = userSalary
        toast.info("Amount capped at your total salary")
    }
    const percentage = Math.round((numVal / userSalary) * 100)
    setGoalData({ ...goalData, target_amount: numVal.toString(), savings_percentage: percentage })
  }

  const updateByPercentage = (percent: number) => {
    if (userSalary <= 0) return;
    const amount = (userSalary * (percent / 100)).toFixed(2)
    setGoalData({ ...goalData, savings_percentage: percent, target_amount: amount })
  }

  const handleSave = async () => {
    if (goalData.target_date) {
      const selectedDate = new Date(goalData.target_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 36);

      if (selectedDate < today) {
        toast.error("Save blocked: Target date is in the past");
        return;
      }
      if (selectedDate > maxDate) {
        toast.error("Save blocked: Target date exceeds 36 months");
        return;
      }
    } else {
        toast.error("Please select a target date before saving");
        return;
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
        body: JSON.stringify(goalData),
      })

      if (response.ok) {
        toast.success("Preferences Saved!")
      } else {
        toast.error("Update failed")
      }
    } catch (error) {
      toast.error("Network error")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-brand-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-green animate-spin" /></div>

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">Financial Strategy</h1>
          <p className="text-brand-white/40">Strategize and tweak different criterias to hit your mark.</p>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <GoalSection 
            title="Savings Goal" 
            description={userSalary > 0 ? `You currently have a salary of $${userSalary}` : "Please set your salary in profile to enable calculator"}
            icon={<Target className="w-5 h-5 text-brand-green" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Target Amount (USD/Year)</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    disabled={userSalary <= 0}
                    value={goalData.target_amount} 
                    onChange={(e) => updateByAmount(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-brand-green pl-10 text-white disabled:opacity-20" 
                    placeholder="e.g. 10000"
                  />
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 opacity-30 text-brand-green" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Target Date</Label>
                <div className="relative">
                  <Input 
                    type="date" 
                    value={goalData.target_date} 
                    onChange={(e) => handleDateChange(e.target.value)} 
                    className="bg-white/5 border-white/10 focus:border-brand-green pl-10 text-white" 
                  />
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 opacity-30 text-brand-green" />
                </div>
              </div>
            </div>
          </GoalSection>
          <GoalSection title="Cash Flow & Investing" description="Define how your income is distributed" icon={<PieChart className="w-5 h-5 text-brand-green" />}>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Savings Rate</Label>
                  <span className="text-xl font-black text-brand-green">{goalData.savings_percentage}%</span>
                </div>
                <Slider value={[goalData.savings_percentage]} max={100} step={1} disabled={userSalary <= 0} onValueChange={(val) => updateByPercentage(val[0])} className="py-2 disabled:opacity-20" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Investing Rate</Label>
                  <span className="text-xl font-black text-brand-green">{goalData.investing_rate}%</span>
                </div>
                <Slider value={[goalData.investing_rate]} max={100} step={1} disabled={userSalary <= 0} onValueChange={(val) => setGoalData({...goalData, investing_rate: val[0]})} className="py-2 disabled:opacity-20" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Necessities & Spending</Label>
                  <span className="text-xl font-black text-brand-green">{goalData.spending_rate}%</span>
                </div>
                <Slider value={[goalData.spending_rate]} max={100} step={1} disabled={userSalary <= 0} onValueChange={(val) => setGoalData({...goalData, spending_rate: val[0]})} className="py-2 disabled:opacity-20" />
              </div>
            </div>
          </GoalSection>
          <GoalSection title="Liability & Stability" description="Account for debts and emergency buffers" icon={<ShieldAlert className="w-5 h-5 text-brand-green" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Debt Load Score</Label>
                <div className="flex items-center gap-4">
                  <Slider value={[goalData.debt_load]} max={100} step={1} onValueChange={(val) => setGoalData({...goalData, debt_load: val[0]})} className="flex-1" />
                  <span className="text-lg font-black text-brand-green w-12 text-right">{goalData.debt_load}</span>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-widest text-brand-green font-bold">Emergency Buffer (Months)</Label>
                <div className="flex items-center gap-4">
                  <Slider value={[goalData.stability_buffer]} max={12} step={1} onValueChange={(val) => setGoalData({...goalData, stability_buffer: val[0]})} className="flex-1" />
                  <span className="text-lg font-black text-brand-green w-12 text-right">{goalData.stability_buffer}m</span>
                </div>
              </div>
            </div>
          </GoalSection>
        </div>

        <div className="flex justify-end items-center gap-4 pt-4">
            <Button variant="outline" className="bg-transparent border-white/10 hover:bg-white/5 text-white/60 hover:text-white px-8 py-6 rounded-2xl transition-all flex gap-2" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4" /> Revert Changes
            </Button>   
            <Button className="bg-brand-green hover:bg-brand-green/80 text-brand-black font-bold px-10 py-6 rounded-2xl shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Update Predictions
            </Button>
        </div>
      </div>
    </div>
  )
}

function GoalSection({ title, description, icon, children }: { title: string, description: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-md">
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