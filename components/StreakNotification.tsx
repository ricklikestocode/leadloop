"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Flame, Trophy, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StreakNotificationProps {
  isOpen: boolean
  milestone?: string | null
  streak: number
  icon: any
  label: string
  reward: string
  onClose: () => void
}

export function StreakNotification({
  isOpen,
  milestone,
  streak,
  icon: Icon,
  label,
  reward,
  onClose,
}: StreakNotificationProps) {
  if (!isOpen || !milestone) return null

  return (
    <AnimatePresence>
      <motion.div
        key="streak-notification"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        {/* Backdrop blur */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Celebration box */}
        <motion.div
          className="relative pointer-events-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-3xl p-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 max-w-md">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated emoji */}
              <motion.div
                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-[2.5rem] flex items-center justify-center border border-yellow-500/30"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Icon className="w-16 h-16 text-yellow-400" />
              </motion.div>

              {/* Title */}
              <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                {label}
              </h2>

              {/* Streak counter */}
              <div className="text-center mb-6">
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Current System Streak</p>
                <p className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                  {streak} Days
                </p>
              </div>

              {/* Reward message */}
              <p className="text-center text-lg text-white mb-6">{reward}</p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-white text-black hover:bg-white/90 font-black h-14 rounded-2xl text-base uppercase tracking-widest shadow-xl shadow-white/5 transition-all"
                >
                  Continue Excellence
                </Button>
              </div>

              {/* Confetti effect indicators */}
              <div className="mt-8 flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400"
                    animate={{
                      y: [0, -20, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StreakNotification
