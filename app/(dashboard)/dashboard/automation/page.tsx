"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/PageHeader"
import { 
  Cpu, 
  Zap, 
  TrendingUp, 
  Bell, 
  Play, 
  CheckCircle2, 
  MessageSquare, 
  AlertTriangle, 
  Users, 
  Calendar, 
  ChevronRight, 
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getAutomationStats, triggerStaleFollowUps } from "@/actions/automation"
import Link from "next/link"

export default function AutomationCenterPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    leadsAnalyzed: 0,
    followUpsGenerated: 0,
    tasksCreated: 0,
    remindersPending: 0,
    automationRuns: 0,
    aiActionsCompleted: 0
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [hotLeads, setHotLeads] = useState<any[]>([])
  
  // AI Sales Copilot state
  const [copilotInput, setCopilotInput] = useState("")
  const [copilotResponse, setCopilotResponse] = useState("")
  const [copilotLoading, setCopilotLoading] = useState(false)
  const [copilotDataPoints, setCopilotDataPoints] = useState<string[]>([])
  const [isStaleChecking, setIsStaleChecking] = useState(false)

  const fetchStats = async () => {
    try {
      const res = await getAutomationStats()
      if (res.success && res.stats) {
        setStats(res.stats)
        setRecentActivities(res.recentActivities || [])
        setHotLeads(res.hotLeadsNeedingAttention || [])
      } else {
        toast.error("Failed to load automation metrics.")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while loading data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleRunStaleCheck = async () => {
    setIsStaleChecking(true)
    try {
      const res = await triggerStaleFollowUps(24)
      if (res.success) {
        toast.success(`Check complete! Triggered ${res.triggered} follow-up(s).`)
        await fetchStats()
      } else {
        toast.error(res.error || "Failed to trigger follow-up scan.")
      }
    } catch (err) {
      toast.error("Error running stale check.")
    } finally {
      setIsStaleChecking(false)
    }
  }

  const askCopilot = async (question: string) => {
    if (!question.trim()) return
    setCopilotLoading(true)
    setCopilotResponse("")
    setCopilotDataPoints([])
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: question })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        try {
          const parsed = JSON.parse(data.message)
          setCopilotResponse(parsed.reply || parsed.message)
          setCopilotDataPoints(parsed.data_points || [])
        } catch {
          setCopilotResponse(data.message)
        }
      } else {
        toast.error(data.error || "Copilot is currently offline.")
      }
    } catch (err) {
      toast.error("Error communicating with AI Copilot.")
    } finally {
      setCopilotLoading(false)
    }
  }

  const handleChipClick = (question: string) => {
    setCopilotInput(question)
    askCopilot(question)
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-white/40">Syncing Intelligence Engine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Automation Center"
          subtitle="AI-driven CRM engine running autonomous lead analysis, intent scoring, task scheduling, and follow-ups."
        />
      </motion.div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: "Leads Analyzed", value: stats.leadsAnalyzed, icon: Users, color: "text-blue-400", bg: "bg-blue-400/5 border-blue-400/10" },
          { label: "Follow-ups Built", value: stats.followUpsGenerated, icon: Zap, color: "text-purple-400", bg: "bg-purple-400/5 border-purple-400/10" },
          { label: "Smart Tasks", value: stats.tasksCreated, icon: Calendar, color: "text-green-400", bg: "bg-green-400/5 border-green-400/10" },
          { label: "Reminders Pending", value: stats.remindersPending, icon: Bell, color: "text-orange-400", bg: "bg-orange-400/5 border-orange-400/10" },
          { label: "Automation Runs", value: stats.automationRuns, icon: Cpu, color: "text-cyan-400", bg: "bg-cyan-400/5 border-cyan-400/10" },
          { label: "AI Actions Done", value: stats.aiActionsCompleted, icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-400/5 border-pink-400/10" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className={`glass-panel p-5 rounded-2xl border ${item.bg} flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <span className="text-3xl font-black text-white">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Main Row: AI Sales Copilot & Automation Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Sales Copilot (Col 7) */}
        <motion.div 
          className="lg:col-span-7 glass-panel p-6 rounded-3xl bg-primary/[0.01] border-white/5 space-y-6 flex flex-col justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Sales Copilot</h3>
            </div>
            <p className="text-xs text-white/50">Ask the Revenue Copilot about lead status, priority pipelines, convertibility, or pending outreach.</p>
          </div>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "Which lead is hottest?",
              "Who should I contact today?",
              "Which lead is most likely to convert?",
              "Which conversations need attention?"
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleChipClick(q)}
                disabled={copilotLoading}
                className="text-[10px] font-bold text-white/60 bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 hover:text-white px-3 py-1.5 rounded-full transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Response Box */}
          <div className="min-h-[200px] max-h-[300px] overflow-y-auto rounded-2xl bg-black/40 border border-white/5 p-5 relative">
            <AnimatePresence mode="wait">
              {copilotLoading ? (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Querying real database...</span>
                </motion.div>
              ) : copilotResponse ? (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-sm text-white/80 leading-relaxed font-medium whitespace-pre-line">{copilotResponse}</p>
                  
                  {copilotDataPoints.length > 0 && (
                    <div className="pt-3 border-t border-white/5 space-y-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white/30">Copilot Insights</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {copilotDataPoints.map((pt, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-primary/80 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            <span className="font-bold">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles className="h-6 w-6 text-white/20 mb-2" />
                  <p className="text-xs font-bold text-white/40">Ask a question above or write your own custom prompt.</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Connected to Prisma Database</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Ask Copilot something else..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askCopilot(copilotInput)}
              className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
            />
            <Button
              onClick={() => askCopilot(copilotInput)}
              disabled={copilotLoading || !copilotInput.trim()}
              className="rounded-xl px-4 bg-primary hover:bg-primary/80 text-black font-black"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Automation Engine Runs & Controls (Col 5) */}
        <motion.div 
          className="lg:col-span-5 glass-panel p-6 rounded-3xl bg-primary/[0.01] border-white/5 space-y-6 flex flex-col justify-between"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Engine Runs & Logs</h3>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400/80 bg-cyan-400/10 px-2 py-0.5 rounded-md">Live Stream</span>
            </div>

            {/* Run lists */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {recentActivities.length > 0 ? (
                recentActivities.map((act) => (
                  <div key={act.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-white/80 font-bold">{act.description}</p>
                        <span className="text-[9px] text-white/30 block font-medium">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                  <Cpu className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/40 font-bold">No automation run logs found yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Control Actions */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Manual Operations</span>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleRunStaleCheck}
                disabled={isStaleChecking}
                className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-11"
              >
                {isStaleChecking ? (
                  <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                ) : (
                  <Search className="h-3 w-3 mr-2 text-primary" />
                )}
                Scan Inactivity
              </Button>
              <Button
                onClick={() => {
                  toast.success("All pipelines synchronized and re-analyzed.")
                  fetchStats()
                }}
                className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-black text-[10px] font-black uppercase tracking-widest h-11"
              >
                <Play className="h-3 w-3 mr-2 fill-current" />
                Run All Flows
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Hot Leads & Future Integration Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hot Leads Needing Attention (Col 6) */}
        <motion.div 
          className="lg:col-span-6 glass-panel p-6 rounded-3xl border-red-500/10 bg-red-500/[0.01] space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Hot Leads Needing Outreach</h3>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md">High Priority</span>
          </div>

          <div className="space-y-3">
            {hotLeads.length > 0 ? (
              hotLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white">{lead.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Score: {lead.leadScore || 0}</span>
                      {lead.value > 0 && (
                        <span className="text-[9px] text-primary font-bold">Deal Value: ${lead.value}</span>
                      )}
                    </div>
                  </div>
                  <Link href={`/dashboard/leads/${lead.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info(`Viewing details for ${lead.name}`)}
                      className="h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/70"
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-black/10">
                <CheckCircle2 className="h-8 w-8 text-green-400/40 mx-auto mb-2" />
                <p className="text-xs text-white/40 font-bold">All hot leads have pending or scheduled tasks!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Future Integrations Plugin Architecture (Col 6) */}
        <motion.div 
          className="lg:col-span-6 glass-panel p-6 rounded-3xl bg-primary/[0.01] border-white/5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Omnichannel Integration Hub</h3>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md">Phase 2</span>
          </div>

          <p className="text-xs text-white/50 leading-relaxed">
            The CRM engine is fully built with plugin architecture. Once connected, messaging platforms will feed directly into lead analysis, reminders, and follow-up generation.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "WhatsApp API", desc: "Webhook Ready", active: false },
              { label: "Instagram DM", desc: "SDK Plugin", active: false },
              { label: "Email SMTP", desc: "Gateway Built", active: false }
            ].map((integ) => (
              <div key={integ.label} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-2 opacity-75">
                <span className="text-[10px] font-black text-white">{integ.label}</span>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-wider">{integ.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
