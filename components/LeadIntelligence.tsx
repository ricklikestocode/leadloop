"use client"

import { motion } from "framer-motion"
import { BrainCircuit, Sparkles, Target, Activity, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { generateLeadIntelligence } from "@/actions/ai-insights"

interface LeadIntelligenceProps {
  lead: any
  onUpdate?: (data: any) => void
}

export function LeadIntelligence({ lead, onUpdate }: LeadIntelligenceProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateLeadIntelligence(lead.id)
    if (res.success && res.data) {
      if (onUpdate) onUpdate(res.data)
    }
    setIsGenerating(false)
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <motion.div 
      className="glass-panel p-6 rounded-3xl bg-primary/[0.02] space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-black text-white text-sm uppercase tracking-widest">Lead Intelligence</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="h-8 w-8 rounded-lg hover:bg-white/5"
        >
          <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Score */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-white/40" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Lead Score</span>
          </div>
          <span className={`text-2xl font-black ${scoreColor(lead.leadScore || 0)}`}>
            {lead.leadScore || 0}
          </span>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Summary</span>
          </div>
          <p className="text-sm font-medium text-white/70 leading-relaxed italic">
            "{lead.summary || "No summary generated yet."}"
          </p>
        </div>

        {/* Next Action */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Suggested Next Action</span>
          </div>
          <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
            <p className="text-xs font-bold text-green-500">
              {lead.nextAction || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleGenerate}
        disabled={isGenerating}
        variant="outline"
        className="w-full h-10 rounded-xl border-white/5 bg-white/5 text-white/60 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
      >
        {isGenerating ? "Analyzing Lead..." : "Refresh Intelligence"}
      </Button>
    </motion.div>
  )
}
