"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "accent"
  text?: string
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 56,
}

const colorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
}

export function LoadingSpinner({ size = "md", color = "primary", text }: LoadingSpinnerProps) {
  const dimension = sizeMap[size]

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.svg
        className={`${colorMap[color]}`}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="12" cy="12" r="10" opacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      </motion.svg>
      {text && (
        <motion.p
          className="text-sm text-foreground-muted"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Skeleton Loader
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={`skeleton rounded-lg ${className}`}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

// Loading Card (for replacing content while loading)
export function LoadingCard() {
  return (
    <div className="glass rounded-xl border border-white/10 p-6 space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

// Loading Grid
export function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass rounded-xl border border-white/10 p-6 space-y-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

// Full Page Loading
export function FullPageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass rounded-2xl border border-white/10 p-12 text-center"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSpinner size="lg" text={message} />
      </motion.div>
    </motion.div>
  )
}
