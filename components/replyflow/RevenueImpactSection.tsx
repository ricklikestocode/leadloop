'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react'
import React from 'react'

function RevenueImpactSectionComponent() {
  const metrics = [
    {
      icon: Clock,
      metric: '86%',
      label: 'Faster Response',
      description: 'Average time from lead inquiry to first response',
      before: '4-6 hours',
      after: '30 seconds'
    },
    {
      icon: TrendingUp,
      metric: '31%',
      label: 'Conversion Increase',
      description: 'Improvement in qualified lead conversions',
      before: '8.2%',
      after: '10.8%'
    },
    {
      icon: Users,
      metric: '45%',
      label: 'More Meetings',
      description: 'Additional meetings booked per month',
      before: '28 meetings',
      after: '40 meetings'
    },
    {
      icon: DollarSign,
      metric: '+$240k',
      label: 'Revenue Impact',
      description: 'Average yearly revenue increase',
      before: 'Variable',
      after: 'Per team member'
    }
  ]

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            background: `radial-gradient(circle at top right, rgba(16,185,129,0.1) 0%, transparent 40%), 
                        radial-gradient(circle at bottom left, rgba(59,130,246,0.08) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
              The results speak
            </span>
            <br />
            <span className="text-gray-100">for themselves.</span>
          </h2>
          <p className="text-lg text-gray-400">
            Real metrics from companies using ReplyFlow. These aren't theoretical numbers.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {metrics.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 transition-all group overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                {/* Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                </div>

                {/* Metric */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, type: 'spring' }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="mb-2"
                >
                  <p className="text-4xl md:text-5xl font-bold text-emerald-300 mb-1">{item.metric}</p>
                  <p className="text-lg font-semibold text-white">{item.label}</p>
                </motion.div>

                <p className="text-sm text-gray-400 mb-6">{item.description}</p>

                {/* Before/After */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">BEFORE</p>
                    <p className="text-sm text-gray-300 font-medium">{item.before}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-400 mb-1">AFTER</p>
                    <p className="text-sm text-emerald-300 font-semibold">{item.after}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Analytics Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/60 to-slate-950/80 bg-white/[0.02] p-8 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl opacity-30 -z-10" />

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Revenue Growth Over Time</h3>
            <p className="text-gray-400">Typical customer arc: 30-90 days to ROI</p>
          </div>

          {/* Chart Placeholder */}
          <div className="h-80 relative bg-gradient-to-b from-white/5 to-transparent rounded-lg border border-white/10 p-6 flex items-end justify-between">
            {/* Bars with animation */}
            {[
              { month: 'Month 1', height: 30, label: 'Setup' },
              { month: 'Month 2', height: 50, label: '+15%' },
              { month: 'Month 3', height: 75, label: '+31%' },
              { month: 'Month 4', height: 85, label: '+45%' },
              { month: 'Month 5', height: 92, label: '+58%' },
              { month: 'Month 6', height: 95, label: '+68%' },
            ].map((bar, i) => (
              <motion.div
                key={i}
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: `${bar.height}%`, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="flex-1 mx-1 rounded-t-lg bg-gradient-to-t from-emerald-500/80 to-emerald-400/40 relative group hover:from-emerald-500 transition-all"
              >
                <motion.div
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/10 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {bar.label}
                </motion.div>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white text-center font-semibold">
                  {bar.height}%
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className="text-xs text-gray-400">Revenue Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400/40 rounded-full" />
              <span className="text-xs text-gray-400">Projected Growth</span>
            </div>
          </div>
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent"
        >
          <div className="flex gap-4 items-start max-w-3xl">
            <div className="text-3xl flex-shrink-0">📊</div>
            <div>
              <p className="text-xl font-bold text-white mb-2">Measured Impact</p>
              <p className="text-gray-300">
                These metrics come from real customers tracking their ReplyFlow performance. We don't inflate numbers. We don't exaggerate. These are conservative estimates from enterprises and agencies deploying ReplyFlow today.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const RevenueImpactSection = memo(RevenueImpactSectionComponent)
