"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ShieldCheck, AlertTriangle, Zap, ArrowRight, BrainCircuit, Loader2 } from "lucide-react"

export default function ReportPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
          const token = localStorage.getItem("token")

          try {
          const response = await fetch("http://localhost:8000/predict/generatereport", { 
               headers: { "Authorization": `Bearer ${token}` }, 
          })

          if (response.ok) {
               const data = await response.json()
               setReport(data)
          }
          } catch (err) {
          console.error("Report fetch failed")
          } finally {
          setLoading(false)
          }
     }

          fetchReport()
     }, [])

     if (loading) return (
     <div className="min-h-screen bg-brand-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
     </div>
     )

  const handleSave = async () => {
     if (isSaved) return;
     const token = localStorage.getItem("token")
     
     try {
          const response = await fetch("http://localhost:8000/predict/savereport", {
               method: "POST",
               headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
               },
               body: JSON.stringify({
                    primary_issue: report.primary_issue,
                    recommendation: report.recommendation,
                    accuracy: report.accuracy,
                    all_metrics: report.all_metrics // Ranking Data
               })
          })

          if (response.ok) {
               setIsSaved(true);
               setShowToast(true);
               setTimeout(() => setShowToast(false), 3000);
          } else {
               console.error("Failed to save to database")
          }
     } catch (err) {
          console.error("Network error during save")
     }
  };

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-green mb-4">
            <BrainCircuit className="w-6 h-6" />
            <span className="font-mono text-sm tracking-widest font-bold uppercase">Report Output</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Data Diagnosis</h1>
          <p className="text-white/40 max-w-2xl font-medium">
            This is an automated report analyzing <span className="text-white">100+</span> decision pathways to identify your financial bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-brand-green" />
            </div>
            <CardHeader className="p-8 pb-0">
              <div className="bg-brand-green/20 border border-brand-green/30 w-fit px-3 py-1 rounded-full mb-4">
                <span className="text-brand-green text-[10px] font-bold font-mono uppercase tracking-tighter italic">Critical Bottleneck Identified</span>
              </div>
               <CardTitle className="text-4xl font-black uppercase tracking-tighter" style={{ color: 'transparent', WebkitTextStroke: '1.5px #16a34a', textShadow: '0 0 3px rgba(22,163,74,0.5)' }}>
                    {report?.primary_issue}
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-xl text-white/70 leading-relaxed italic border-l-2 border-brand-green pl-6">
                "{report?.recommendation}"
              </p>
            </CardContent>
          </Card>
          <Card className="bg-brand-green border-none rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_50px_-12px_rgba(22,163,74,0.5)]">
            <ShieldCheck className="w-10 h-10 text-brand-black" />
            <div>
              <div className="text-brand-black/60 font-mono text-xs font-bold uppercase mb-1">Predictor Accuracy</div>
              <div className="text-4xl font-black text-brand-black">{report?.accuracy}%</div>
              <p className="text-brand-black/60 text-[10px] mt-2 font-bold leading-tight uppercase">
                Validated against standard <br/> financial archetypes.
              </p>
            </div>
          </Card>
        </div>
        <Card className="bg-white/5 border-white/10 rounded-3xl p-8">
          <CardHeader className="px-0">
               <CardTitle className="text-xl font-black uppercase tracking-widest" style={{ color: 'transparent', WebkitTextStroke: '1px #16a34a', textShadow: '0 0 2px rgba(22,163,74,0.4)' }}>
                    Impact Ranking
               </CardTitle>
            <CardDescription className="text-white/30 italic">High impact indicates a high priority for model-driven optimization.</CardDescription>
          </CardHeader>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.all_metrics} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} width={120} />
                    <Tooltip 
                         cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                         contentStyle={{ 
                         backgroundColor: '#0a0a0a', 
                         border: '1px solid #16a34a', 
                         borderRadius: '12px',
                         color: '#fff',
                         fontSize: '12px',
                         fontWeight: 'bold'
                         }}
                         itemStyle={{
                         color: '#16a34a',
                         textTransform: 'uppercase',
                         fontSize: '10px'
                         }}
                    />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {report?.all_metrics?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#16a34a44'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
          <div className="flex justify-between items-center p-8 bg-white/5 border border-white/10 rounded-3xl relative">
               <div className="flex items-center gap-4">
               <div className="p-3 bg-brand-green/20 rounded-2xl">
               <ShieldCheck className="text-brand-green w-6 h-6" />
               </div>
               <div>
               <div className="text-sm font-bold text-white uppercase tracking-wider">Analysis Complete</div>
               <div className="text-xs text-white/40 italic">You may choose to keep this report for later viewing or discard it by leaving this page.</div>
               </div>
               </div>
               <button onClick={handleSave} disabled={isSaved} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${
                    isSaved ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-brand-green text-brand-black hover:bg-white"}`}
               >
                    {isSaved ? "Report Archived" : "Save Report"} 
                    {!isSaved && <ArrowRight className="w-4 h-4" />}
               </button>
               {showToast && (
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-green text-brand-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-tighter shadow-[0_0_20px_rgba(22,163,74,0.4)] animate-in fade-in slide-in-from-bottom-2">
                    Saved Successfully!
               </div>
               )}
        </div>
      </div>
    </div>
  )
}