"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BrainCircuit, 
  Sparkles, 
  Target, 
  Activity, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  Copy, 
  Check 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateLeadIntelligence } from "@/actions/ai-insights"
import { generateLeadFollowUpMessage } from "@/actions/automation"
import { toast } from "sonner"

interface LeadIntelligenceProps {
  lead: any
  onUpdate?: (data: any) => void
}

export function LeadIntelligence({ lead, onUpdate }: LeadIntelligenceProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDrafting, setIsDrafting] = useState(false)
  const [draftedMessage, setDraftedMessage] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await generateLeadIntelligence(lead.id)
      if (res.success && res.data) {
        if (onUpdate) onUpdate(res.data)
        toast.success("Lead intelligence updated successfully.")
      } else {
        toast.error(res.error || "Failed to update lead intelligence.")
      }
    } catch (err: any) {
      toast.error("Error generating intelligence.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDraftFollowUp = async () => {
    setIsDrafting(true)
    setDraftedMessage("")
    try {
      const res = await generateLeadFollowUpMessage(lead.id)
      if (res.success && res.followUpMessage) {
        setDraftedMessage(res.followUpMessage)
        toast.success("AI draft created and saved to messages!")
      } else {
        toast.error(res.error || "Failed to draft follow-up.")
      }
    } catch (err) {
      toast.error("Error generating follow-up draft.")
    } finally {
      setIsDrafting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedMessage)
    setCopied(true)
    toast.success("Copied draft to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  // Parse suggested actions
  let suggestedActions: string[] = []
  if (lead.suggestedActions) {
    try {
      const parsed = JSON.parse(lead.suggestedActions)
      if (Array.isArray(parsed)) {
        suggestedActions = parsed
      }
    } catch {
      if (Array.isArray(lead.suggestedActions)) {
        suggestedActions = lead.suggestedActions
      }
    }
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getIntentStyles = (intent: string) => {
    switch (intent?.toUpperCase()) {
      case "HOT":
        return "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.15)]"
      case "WARM":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400"
      case "COLD":
        return "bg-sky-500/10 border-sky-500/20 text-sky-400"
      case "LOST":
        return "bg-white/5 border-white/10 text-white/30"
      default:
        return "bg-white/5 border-white/5 text-white/50"
    }
  }

  return (
    <motion.div 
      className="glass-panel p-6 rounded-3xl bg-primary/[0.02] border-white/5 space-y-6 shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-xl bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
            <BrainCircuit className="w-4.5 h-4.5 text-primary" />
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-widest">Lead Intelligence</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="h-8 w-8 rounded-xl hover:bg-white/5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="space-y-5">
        {/* Core Indicators */}
        <div className="grid grid-cols-2 gap-4">
          {/* Score */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-2">Lead Score</span>
            <span className={`text-2xl font-black leading-none ${scoreColor(lead.leadScore || 0)}`}>
              {lead.leadScore || 0}<span className="text-xs text-white/20">/100</span>
            </span>
          </div>

          {/* Intent */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-2">Intent</span>
            <div className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-center border rounded-lg ${getIntentStyles(lead.intent || "WARM")}`}>
              {lead.intent || "WARM"}
            </div>
          </div>
        </div>

        {/* Confidence & Conversion Probability Bars */}
        <div className="space-y-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          {/* Confidence */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
              <span className="text-white/40">Confidence Score</span>
              <span className="text-primary">{lead.confidenceScore || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${lead.confidenceScore || 0}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Probability */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
              <span className="text-white/40">Conversion probability</span>
              <span className="text-secondary">{lead.conversionProbability || 0}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary" 
                initial={{ width: 0 }}
                animate={{ width: `${lead.conversionProbability || 0}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">AI Intelligence Summary</span>
          </div>
          <p className="text-xs font-bold text-white/70 leading-relaxed italic bg-white/[0.01] p-3 rounded-xl border border-white/5">
            "{lead.summary || "Run intelligence scan to summarize lead characteristics."}"
          </p>
        </div>

        {/* Next Recommended Action */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Next Recommended Action</span>
          </div>
          <div className="p-3.5 rounded-xl bg-green-500/[0.03] border border-green-500/10">
            <p className="text-xs font-black text-green-400">
              {lead.nextAction || "Scan lead to recommend next sales action."}
            </p>
          </div>
        </div>

        {/* Suggested Actions Checklist */}
        {suggestedActions.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Suggested Pipeline Tasks</span>
            </div>
            <div className="space-y-1.5">
              {suggestedActions.map((act, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 text-[11px] font-bold text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 flex-shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-3 border-t border-white/5">
        <Button 
          onClick={handleDraftFollowUp}
          disabled={isDrafting || isGenerating}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-black font-black text-[10px] uppercase tracking-widest"
        >
          {isDrafting ? "Drafting follow-up..." : "Draft AI Follow-Up"}
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating || isDrafting}
          variant="outline"
          className="w-full h-10 rounded-xl border-white/5 bg-white/5 text-white/60 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
        >
          {isGenerating ? "Analyzing Lead..." : "Refresh Intelligence"}
        </Button>
      </div>

      {/* Follow-up Draft Overlay Drawer */}
      <AnimatePresence>
        {draftedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-4 rounded-2xl bg-black/60 border border-primary/20 space-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 rounded-bl-xl border-l border-b border-primary/20">
              Draft Saved
            </div>
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Suggested Response Draft</span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-bold whitespace-pre-line bg-white/[0.02] p-3 rounded-xl border border-white/5 select-all">
              {draftedMessage}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                className="flex-1 h-9 rounded-lg bg-white/5 border border-white/5 text-white/80 text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-green-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy to Clipboard"}
              </Button>
              <Button
                onClick={() => setDraftedMessage("")}
                className="h-9 rounded-lg bg-white/5 border border-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
