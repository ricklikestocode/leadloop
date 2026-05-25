"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/PageHeader"

export default function FollowUpsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Follow-ups"
          subtitle="Track and manage all your follow-up tasks."
        />
      </motion.div>

      <motion.div
        className="p-12 rounded-xl border border-white/10 bg-white/5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-2">Follow-ups Management</h3>
        <p className="text-foreground-secondary">
          Your follow-up tasks will appear here.
        </p>
      </motion.div>
    </div>
  )
}
