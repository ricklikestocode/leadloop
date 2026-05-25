"use client"

import { motion } from "framer-motion"
import { BrainCircuit, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AIAnalysisPanelProps {
  intent: "HOT" | "WARM" | "COLD" | "DEAD"
  confidence: number
  reasoning: string
  hasObjection?: boolean
  objectionType?: string
  strategy?: string
  estimatedConversionProbability?: number
  isLoading?: boolean
  className?: string
}

export function AIAnalysisPanel({
  intent,
  confidence,
  reasoning,
  hasObjection,
  objectionType,
  strategy,
  estimatedConversionProbability,
  isLoading = false,
  className,
}: AIAnalysisPanelProps) {
  const intentColors = {
    HOT: {
      bg: "from-red-500/20 to-red-500/5",
      border: "border-red-500/30",
      badge: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: "🔥",
      text: "HOT",
    },
    WARM: {
      bg: "from-orange-500/20 to-orange-500/5",
      border: "border-orange-500/30",
      badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      icon: "🌊",
      text: "WARM",
    },
    COLD: {
      bg: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/30",
      badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: "❄️",
      text: "COLD",
    },
    DEAD: {
      bg: "from-gray-500/20 to-gray-500/5",
      border: "border-gray-500/30",
      badge: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      icon: "💀",
      text: "NO INTEREST",
    },
  }

  const colors = intentColors[intent]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        `bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 backdrop-blur-xl`,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{colors.icon}</div>
          <div>
            <h3 className="text-white font-bold text-lg">Lead Intent Analysis</h3>
            <p className="text-white/40 text-xs">AI-Powered Classification</p>
          </div>
        </div>
        <Badge className={cn("border", colors.badge, "px-3 py-1 text-sm font-bold")}>
          {colors.text}
        </Badge>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm font-semibold">Confidence Score</span>
          <span className="text-white font-bold text-lg">{confidence}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full transition-all",
              confidence >= 75
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : confidence >= 50
                ? "bg-gradient-to-r from-orange-500 to-amber-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <BrainCircuit className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white/80 text-sm leading-relaxed">{reasoning}</p>
            <p className="text-white/40 text-xs mt-2">
              AI Reasoning: This analysis is based on message content, keywords, and conversation history patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Objection Detection */}
      {hasObjection && objectionType && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-200 text-sm font-semibold">Objection Detected</p>
              <p className="text-orange-100/60 text-xs mt-1">
                Type: <span className="font-bold">{objectionType}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Strategy */}
      {strategy && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-200 text-sm font-semibold">Recommended Strategy</p>
              <p className="text-green-100/80 text-xs mt-1">{strategy}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Estimated Conversion Probability */}
      {estimatedConversionProbability !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/10 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">
                Conversion Probability
              </p>
              <p className="text-white text-sm font-bold mt-0.5">
                ~{estimatedConversionProbability}% chance to close
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary">{estimatedConversionProbability}%</div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  )
}

export default AIAnalysisPanel
