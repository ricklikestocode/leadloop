"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gloss?: boolean
  delay?: number
}

export function GlassCard({
  children,
  className,
  hover = true,
  gloss = false,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass rounded-xl border border-white/10 backdrop-blur-glass",
        hover && "hover-lift hover:shadow-lg hover:border-white/20",
        gloss && "overflow-hidden relative",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {gloss && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-xl" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

interface AnimatedListProps {
  items: ReactNode[]
  staggerDelay?: number
  className?: string
}

export function AnimatedList({ items, staggerDelay = 0.1, className }: AnimatedListProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("space-y-2", className)}
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}

interface PremiumSectionProps {
  title: string
  children: ReactNode
  className?: string
  accent?: boolean
}

export function PremiumSection({
  title,
  children,
  className,
  accent = false,
}: PremiumSectionProps) {
  return (
    <motion.section
      className={cn("space-y-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className={cn(
          "text-xl font-bold",
          accent && "bg-gradient-primary bg-clip-text text-transparent"
        )}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}
