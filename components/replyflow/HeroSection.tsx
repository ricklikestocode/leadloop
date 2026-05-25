'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'
import React from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

function HeroSectionComponent() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient - subtle and cinematic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at top left, rgba(59,130,246,0.15) 0%, transparent 40%), 
                        radial-gradient(circle at bottom right, rgba(124,58,237,0.12) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-block">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-400 font-medium">AI-Powered Revenue Operating System</span>
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Your AI sales
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300">
                  employee
                </span>
                <br />
                never sleeps.
              </h1>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-lg leading-relaxed"
            >
              ReplyFlow answers leads instantly, qualifies prospects automatically, and follows up intelligently — so your business never loses revenue to silence.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-6 rounded-lg flex items-center gap-2 group transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-6 rounded-lg flex items-center gap-2 transition-all duration-300 bg-white/5"
              >
                <Play className="w-5 h-5" />
                Watch AI Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="pt-4 space-y-2"
            >
              <p className="text-sm text-gray-400">No credit card required. 14-day full access.</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border border-white/10"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400">Join 500+ growth teams</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:block relative h-[600px]"
          >
            {/* Floating Dashboard Preview */}
            <div className="relative w-full h-full">
              {/* Main Card */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 bg-white/[0.02] overflow-hidden shadow-2xl">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-20" />

                {/* Dashboard Content */}
                <div className="relative z-10 p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">AI Revenue Dashboard</p>
                      <h3 className="text-lg font-semibold text-white">Live Lead Activity</h3>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Replies', value: '89', change: '+12%' },
                      { label: 'Qualified', value: '34', change: '+8%' },
                      { label: 'Meetings', value: '12', change: '+15%' },
                      { label: 'Revenue', value: '$48k', change: '+31%' },
                    ].map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="rounded-lg bg-white/5 border border-white/10 p-3"
                      >
                        <p className="text-xs text-gray-400 mb-1">{metric.label}</p>
                        <div className="flex items-baseline justify-between">
                          <p className="text-lg font-bold text-white">{metric.value}</p>
                          <span className="text-xs text-emerald-400">{metric.change}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity Feed */}
                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Recent Activity</p>
                    {[
                      'AI replied to Sarah M.',
                      'Lead qualified: High intent',
                      'Follow-up scheduled',
                      'Meeting booked',
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-300 px-2 py-1 rounded hover:bg-white/5 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        <span>{activity}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-500/10 rounded-2xl border border-blue-500/20"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Scroll to explore</p>
          <div className="w-6 h-10 border border-white/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export const HeroSection = memo(HeroSectionComponent)
