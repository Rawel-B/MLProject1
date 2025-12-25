"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { ShieldCheck, Zap, Trash2, BrainCircuit, Loader2, ArrowLeft, AlertTriangle, X } from "lucide-react"
import { toast } from "sonner"

export default function SavedReportDetail() {
  const { reportId } = useParams()
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchSavedReport = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`http://localhost:8000/predict/getreportbyid/${reportId}`, { 
          headers: { "Authorization": `Bearer ${token}` }, 
        })
        if (response.ok) {
          const data = await response.json()
          setReport(data)
        }
      } catch (err) {
        toast.error("Failed to load archived report")
      } finally {
        setLoading(false)
      }
    }
    fetchSavedReport()
  }, [reportId])

  const confirmDelete = async () => {
    setIsDeleting(true)
    const token = localStorage.getItem("token")

    try {
      const response = await fetch(`http://localhost:8000/predict/deletereportbyid/${reportId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success("Report deleted successfully")
        router.push("/reports") 
      }
    } catch (err) {
      toast.error("Could not delete report")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black p-6 pt-24 text-brand-white font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-brand-green transition-colors font-mono text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-green mb-4">
            <BrainCircuit className="w-6 h-6" />
            <span className="font-mono text-sm tracking-widest font-bold uppercase italic text-white/40">Archived Analysis</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic">Data Diagnosis</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-brand-green" />
            </div>
            <CardHeader className="p-8 pb-0">
              <div className="bg-brand-green/20 border border-brand-green/30 w-fit px-3 py-1 rounded-full mb-4">
                <span className="text-brand-green text-[10px] font-bold font-mono uppercase tracking-tighter">Bottleneck Record</span>
              </div>
              <CardTitle className="text-4xl font-black uppercase tracking-tighter" style={{ color: 'transparent', WebkitTextStroke: '1.5px #16a34a' }}>
                {report?.primary_issue}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-xl text-white/70 leading-relaxed italic border-l-2 border-brand-green pl-6">
                "{report?.recommendation}"
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 rounded-3xl p-8 flex flex-col justify-between border-l-brand-green border-l-4">
            <ShieldCheck className="w-10 h-10 text-brand-green" />
            <div>
              <div className="text-white/40 font-mono text-xs font-bold uppercase mb-1">Predictor Accuracy</div>
              <div className="text-4xl font-black text-white">{report?.accuracy}%</div>
              <p className="text-white/20 text-[10px] mt-2 font-bold leading-tight uppercase">
                Captured on <br/> {new Date(report?.timestamp).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 rounded-3xl p-8">
          <CardHeader className="px-0">
            <CardTitle className="text-xl font-black uppercase tracking-widest text-brand-green">Impact Ranking</CardTitle>
          </CardHeader>
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.all_metrics} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} width={120} />
                <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #16a34a', borderRadius: '12px' }}
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

        <div className="flex justify-between items-center p-8 bg-white/5 border border-red-500/10 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="text-sm font-bold text-white uppercase tracking-wider">Manage Record</div>
            <div className="text-xs text-white/40 italic text-red-500/60">Note: Deleting this report is permanent.</div>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            disabled={isDeleting}
            className="relative z-10 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all duration-300 border border-red-500/20"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Report
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />   
          <div className="relative w-full max-w-md bg-brand-black border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(239,68,68,0.1)] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-red-500/10 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Delete Report?</h3>
                <p className="text-brand-white/40 text-sm leading-relaxed">
                  Are you sure you want to delete this diagnosis? This action cannot be undone.
                </p>
              </div>

              <div className="flex w-full gap-3 pt-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/60 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 rounded-xl bg-red-500 text-white font-black uppercase text-xs tracking-widest hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </div>
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}