"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BrainCircuit, Calendar, ChevronRight, Loader2, Zap, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch("http://localhost:8000/predict/getallreports", { headers: { "Authorization": `Bearer ${token}` } })
        if (response.ok) {
          const data = await response.json()
          setReports(data)
        }
      } catch (err) {
        console.error("Failed to load history")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-brand-green mb-2">
            <Zap className="w-5 h-5 fill-brand-green" />
            <span className="font-mono text-xs tracking-[0.3em] font-bold uppercase">Report Archive</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">Diagnostic History</h1>
          <p className="text-white/40 max-w-xl font-medium">
            Overview of bookmarked reports
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <BrainCircuit className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 font-mono text-sm uppercase">No reports archived yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
             <Card key={report._id} className="group bg-white/5 border-white/10 hover:border-brand-green/50 transition-all duration-500 rounded-3xl cursor-pointer overflow-hidden"  onClick={() => router.push(`/reportdetails/${report._id}`)}>
               <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center">
                    <div className="bg-brand-green/10 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-white/5 min-w-[140px]">
                      <span className="text-[10px] font-black uppercase text-brand-green/60 mb-1">Accuracy</span>
                      <span className="text-3xl font-black text-brand-green">{report.accuracy}%</span>
                    </div>
                    <div className="flex-1 p-6 space-y-2">
                      <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/30">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-green">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Analysis
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-green transition-colors">
                        {report.primary_issue}
                      </h3>
                      <p className="text-sm text-white/50 line-clamp-1 italic font-medium">
                        "{report.recommendation}"
                      </p>
                    </div>
                    <div className="p-6 flex items-center justify-end">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-green transition-all">
                        <ChevronRight className="w-5 h-5 text-white group-hover:text-brand-black" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}