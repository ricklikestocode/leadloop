"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface EmptyStateProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Icon Background */}
      <motion.div
        className="mb-6 p-5 bg-gradient-primary/20 rounded-full border border-primary/30 shadow-lg shadow-primary/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Icon className="w-10 h-10 text-primary" />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-2xl font-bold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-foreground-muted text-center max-w-sm mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {actionLabel && actionHref && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Link href={actionHref}>
            <Button size="lg">{actionLabel}</Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
