"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface CelebrationHookProps {
  celebration: string | null
  onDismiss: () => void
  autoClose?: boolean
  autoCloseDuration?: number
}

export function CelebrationHook({
  celebration,
  onDismiss,
  autoClose = true,
  autoCloseDuration = 6000,
}: CelebrationHookProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (celebration) {
      setIsVisible(true)
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          onDismiss()
        }, autoCloseDuration)
        return () => clearTimeout(timer)
      }
    }
  }, [celebration, autoClose, autoCloseDuration, onDismiss])

  return (
    <AnimatePresence>
      {isVisible && celebration && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-2xl p-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 pr-12">
              {/* Close button */}
              <button
                onClick={() => {
                  setIsVisible(false)
                  onDismiss()
                }}
                className="absolute top-3 right-3 text-white/60 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="flex items-start gap-3">
                {/* Sparkle icon with animation */}
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-sm font-black uppercase tracking-tight text-white">{celebration}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Operational Excellence Maintained</p>
                </div>
              </div>

              {/* Progress bar for auto-close */}
              {autoClose && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-b-2xl"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: autoCloseDuration / 1000 }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CelebrationHook
