"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Cell, Legend, LineChart, Line } from "recharts"
import { Zap, TrendingUp, ShieldCheck, Loader2, PieChart, AlertCircle, ArrowUpRight, ArrowDownRight, BrainCircuit } from "lucide-react"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [flowData, setFlowData] = useState<any[]>([])
  const [aiInsight, setAiInsight] = useState({ text: "Analyzing financial patterns...", type: "neutral" })
  const [spiderData, setSpiderData] = useState([
    { subject: 'Savings', A: 0 },
    { subject: 'Investing', A: 0 },
    { subject: 'Spending', A: 0 },
    { subject: 'Debt', A: 0 },
    { subject: 'Stability', A: 0 },
  ])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState({ salary: 0, percentage: 0, score: 0, monthlyBurn: 0, accuracy: 0 })
  const [showReportModal, setShowReportModal] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("http://localhost:8000/user/currentuser", { headers: { "Authorization": `Bearer ${token}` }, })
        
        if (response.ok) {
          const data = await response.json()      
          const now = new Date()
          const target = data.target_date ? new Date(data.target_date) : new Date(now.getFullYear(), now.getMonth() + 12, 1)
          const monthDiff = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
          const displayMonthsCount = Math.max(1, Math.min(monthDiff, 36))
          const dynamicMonths = []

          for (let i = 0; i <= displayMonthsCount; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
            dynamicMonths.push(d.toLocaleString('default', { month: 'short' }))
          }

          const salary = parseFloat(data.salary) || 0
          const savingsPercentage = parseFloat(data.savings_percentage) || 0
          const monthlyIncome = salary / 12
          const necessityPct = parseFloat(data.necessity_percentage) || 0 
          const lifestylePct = parseFloat(data.spending_rate) || 0         
          const monthlyNecessities = monthlyIncome * (necessityPct / 100)
          const monthlyLifestyle = monthlyIncome * (lifestylePct / 100)       
          const debtPct = parseFloat(data.debt_load) || 0;
          const investPct = parseFloat(data.investing_rate) || 0;
          const monthlyDebt = monthlyIncome * (debtPct / 100);
          const monthlyInvest = monthlyIncome * (investPct / 100);
          const totalBurn = monthlyLifestyle + monthlyDebt + monthlyInvest
          const monthlySavings = monthlyIncome * (savingsPercentage / 100)
          const burnPctOfIncome = monthlyIncome > 0 ? (totalBurn / (monthlyIncome - monthlySavings)) * 100 : 0;
          
          if (data.spider_data) {
            setSpiderData(data.spider_data)
          }

          setFlowData(dynamicMonths.map(m => ({
            month: m,
            necessities: Math.round(monthlyNecessities),
            lifestyle: Math.round(monthlyLifestyle),
            debt: Math.round(monthlyDebt),
            investing: Math.round(monthlyInvest)
          })))

          if (data.ai_score > 80) {
            setAiInsight({ text: "Optimal Efficiency: Your savings velocity is outpacing burn rate. Consider high-yield deployment.", type: "green" })
          } else if (burnPctOfIncome > 75) {
            setAiInsight({ text: `Critical Alert: Lifestyle burn is consuming ${Math.round(burnPctOfIncome)}%+ of revenue. Sustainability score decreasing.`, type: "red" })
          } else {
            setAiInsight({ text: "Steady Growth: Maintain current strategy to hit year-end projections.", type: "neutral" })
          }

          setUserStats({ 
            salary, 
            percentage: savingsPercentage, 
            score: data.ai_score || savingsPercentage,
            monthlyBurn: totalBurn,
            accuracy: data.ml_accuracy
          })

          const generatedData = dynamicMonths.map((month, index) => ({
            month: month,
            gain: Math.round(monthlySavings * (index + 1)),
            loss: Math.round(totalBurn * (index + 1)),
          }))
          
          setProjectionData(generatedData)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
    </div>
  )

  const triggerAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => { router.push("/report") }, 2000)
  }

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className={`lg:col-span-2 border rounded-3xl p-6 flex items-center gap-6 transition-colors duration-500 ${
            aiInsight.type === 'red' ? 'bg-red-950/20 border-red-900/40' : 'bg-brand-green/10 border-brand-green/20'
          }`}>
            <div className={`p-4 rounded-2xl shadow-lg ${
              aiInsight.type === 'red' ? 'bg-red-600 shadow-red-600/50' : 'bg-brand-green shadow-brand-green/50'
            }`}>
              {aiInsight.type === 'red' ? <AlertCircle className="w-8 h-8 text-white" /> : <Zap className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Insights
              </h2>
              <p className="text-brand-white/80 italic mt-1 font-medium">{aiInsight.text}</p>
            </div>
          </div>      
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between group">
            <div>
              <span className="text-brand-white/40 font-mono text-sm uppercase tracking-widest">Efficiency</span>
              <div className="text-5xl font-black mt-2 text-brand-white">
                {userStats.score}<span className="text-brand-green text-2xl">/100</span>
              </div>
            </div>
            <button onClick={() => setShowReportModal(true)} className="mt-6 w-full py-3 px-4 bg-brand-green/10 border border-brand-green/30 rounded-2xl text-brand-green font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-green hover:text-white transition-all duration-300">
              <BrainCircuit className="w-4 h-4" />
              Generate Report
            </button>
            <div className="mt-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] text-white/20 font-mono italic">Get detailed breakdown of your metrics...</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-brand-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-green" /> Strength Profile
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={spiderData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #16a34a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Radar name="Rate" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 shadow-2xl backdrop-blur-md lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-brand-white">Spending Flow</CardTitle>
                <CardDescription className="text-white/40">Resource distribution until target date</CardDescription>
              </div>
              <PieChart className="text-brand-green w-5 h-5" />
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={flowData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #16a34a', borderRadius: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase' }} />
                  <Bar dataKey="lifestyle" stackId="a" fill="#14532d" name="Lifestyle" />
                  <Bar dataKey="debt" stackId="a" fill="#7f1d1d" name="Debt Service" />
                  <Bar dataKey="investing" stackId="a" fill="#16a34a" name="Investing" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-white/5 border-white/10 shadow-2xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-brand-white flex items-center gap-2"><TrendingUp className="text-brand-green w-5 h-5" /> Velocity Projection</CardTitle>
                <CardDescription className="text-white/40">Projected Net Gains vs Cumulative Capital Burn</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-brand-green font-bold">Monthly Gain</span>
                  <div className="flex items-center text-brand-green font-black text-xl"><ArrowUpRight className="w-4 h-4 mr-1"/>+${Math.round((userStats.salary/12)*(userStats.percentage/100)).toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end border-l border-white/10 pl-4">
                  <span className="text-[10px] uppercase text-red-500 font-bold">Monthly Burn</span>
                  <div className="flex items-center text-red-500 font-black text-xl"><ArrowDownRight className="w-4 h-4 mr-1"/>-${Math.round(userStats.monthlyBurn).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #16a34a', borderRadius: '12px' }}
                   itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="gain" name="Cumulative Gain" stroke="#16a34a" strokeWidth={3} fill="url(#colorGain)" />
                <Line type="monotone" dataKey="loss" name="Cumulative Burn" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
          
          <div className="relative w-full max-w-md bg-brand-black border border-brand-green/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(22,163,74,0.1)] overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-brand-green/10 rounded-2xl">
                <BrainCircuit className={`w-8 h-8 text-brand-green ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`} />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  {isAnalyzing ? "Analyzing Data" : "Analytical Report"}
                </h3>
                <p className="text-brand-white/40 text-xs font-mono leading-relaxed uppercase tracking-wider px-4">
                  {isAnalyzing 
                    ? "Analyzing And Generating Report..."
                    : "This May Take A Few Moments, Proceed?"}
                </p>
              </div>

              <div className="flex w-full gap-3 pt-4">
                {!isAnalyzing ? (
                  <>
                    <button onClick={() => setShowReportModal(false)} className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/60 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/5 transition-all">
                      Abort
                    </button>
                    <button onClick={triggerAnalysis} className="flex-1 px-6 py-4 rounded-xl bg-brand-green text-brand-black font-black uppercase text-[10px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all">
                      Proceed
                    </button>
                  </>
                ) : (
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green animate-progress-indefinite" style={{ width: '60%' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}