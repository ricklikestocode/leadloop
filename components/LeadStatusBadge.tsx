"use client"

import { Badge } from "@/components/ui/badge"
import { getStatusLabel } from "@/lib/utils"
import { motion } from "framer-motion"

interface LeadStatusBadgeProps {
  status: string
}

const statusVariants = {
  NEW: "default",
  CONTACTED: "outline",
  INTERESTED: "success",
  NEGOTIATION: "warning",
  WON: "success",
  LOST: "destructive",
} as const

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const label = getStatusLabel(status)
  const variant = statusVariants[status as keyof typeof statusVariants] || "outline"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Badge variant={variant as any}>
        {label}
      </Badge>
    </motion.div>
  )
}
