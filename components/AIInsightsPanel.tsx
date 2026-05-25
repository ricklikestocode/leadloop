"use client"

import { motion } from "framer-motion"
import { TrendingUp, Sparkles, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { generateBusinessInsights, getCachedInsights } from "@/actions/ai-insights"
import { LoadingSpinner } from "./LoadingSpinner"

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchInsights = async () => {
    setIsLoading(true)
    const res = await getCachedInsights()
    if (res.success && res.insights) {
      setInsights(res.insights)
    }
    setIsLoading(false)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    const res = await generateBusinessInsights()
    if (res.success && res.insights) {
      setInsights(res.insights)
    }
    setIsGenerating(false)
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <motion.div 
      className="glass-panel p-10 rounded-[2.5rem] bg-primary/[0.02] h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
           <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl"
        >
          <RefreshCcw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-black text-white tracking-tight">Business Intelligence</h2>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : insights.length > 0 ? (
        <div className="space-y-6 mb-8">
          {insights.map((insight, idx) => (
            <p key={idx} className="text-white/60 font-medium leading-relaxed border-l-2 border-primary/20 pl-4">
              {insight}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-white/40 font-medium mb-8 italic">
          No insights generated yet. Click refresh to analyze your workspace.
        </p>
      )}

      <Button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all"
      >
        {isGenerating ? "Analyzing..." : "Regenerate Insights"}
      </Button>
    </motion.div>
  )
}
