"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Badge {
  id: string
  label: string
  icon: any
  description: string
  progress: number // 0-100
}

interface AchievementBadgesProps {
  badges: Badge[]
  className?: string
}

export function AchievementBadges({ badges, className }: AchievementBadgesProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4", className)}>
      {badges.map((badge, idx) => {
        const isUnlocked = badge.progress >= 100
        const percentage = Math.round(badge.progress)
        const Icon = badge.icon

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={cn(
              "p-5 rounded-2xl border transition-all relative overflow-hidden group",
              isUnlocked
                ? "bg-gradient-to-br from-amber-500/[0.08] to-yellow-500/[0.04] border-amber-500/30"
                : "bg-white/[0.02] border-white/5"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                isUnlocked 
                  ? "bg-amber-500/20 text-amber-500" 
                  : "bg-white/5 text-white/40"
              )}
            >
              <Icon className="w-6 h-6" />
            </div>

            {/* Label */}
            <h3
              className={cn(
                "text-xs font-bold uppercase tracking-wide mb-1",
                isUnlocked ? "text-amber-300" : "text-white/60"
              )}
            >
              {badge.label}
            </h3>

            {/* Description */}
            <p className="text-xs text-white/50 mb-2 h-8 leading-tight">
              {badge.description}
            </p>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-all",
                  isUnlocked
                    ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: idx * 0.05 + 0.2 }}
              />
            </div>

            {/* Progress text */}
            <p className="text-xs text-white/40 mt-1 text-right">
              {percentage}%
            </p>

            {/* Unlock badge */}
            {isUnlocked && (
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-xs font-bold px-2 py-1 rounded-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default AchievementBadges
