"use client"

import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: string
  trendDirection?: "up" | "down"
  delay?: number
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = "up",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <div className="h-full glass-card p-8 rounded-[2.5rem] relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
        
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-500 shadow-inner">
               <Icon className="w-6 h-6" />
            </div>
            {trend && (
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                trendDirection === "up" 
                  ? "bg-green-500/10 border-green-500/20 text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              )}>
                {trend}
              </div>
            )}
          </div>

          <div className="mt-auto">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{title}</h3>
            <p className="text-4xl font-black text-white tracking-tighter">
              {value}
            </p>
          </div>
        </div>

        {/* Glow corner */}
        <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  )
}


function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
