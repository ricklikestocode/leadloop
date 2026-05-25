'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Zap, Target, Lightbulb } from 'lucide-react'
import React from 'react'

function AIUnderstandingSectionComponent() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at top right, rgba(34,211,238,0.15) 0%, transparent 40%), 
                        radial-gradient(circle at bottom left, rgba(59,130,246,0.12) 0%, transparent 40%)`,
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-300">
              AI that understands
            </span>
            <br />
            <span className="text-gray-100">conversations.</span>
          </h2>
          <p className="text-lg text-gray-400">
            ReplyFlow isn't a chatbot. It's an AI sales operator that understands intent, urgency, and customer context.
          </p>
        </motion.div>

        {/* Understanding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: Brain,
              title: 'Intent Detection',
              description: 'Analyzes conversation tone, signals, and urgency patterns to understand buyer intent instantly.',
              example: 'Detects high-intent signals: "I\'m ready to buy" vs. casual interest',
              color: 'from-cyan-500/20 to-cyan-500/5'
            },
            {
              icon: Lightbulb,
              title: 'Context Memory',
              description: 'Remembers everything about each lead across all interactions. No context lost.',
              example: 'Knows: past objections, budget hints, decision timeline, family needs',
              color: 'from-blue-500/20 to-blue-500/5'
            },
            {
              icon: Target,
              title: 'Lead Qualification',
              description: 'Automatically qualifies leads based on firmographic, behavioral, and intent data.',
              example: 'Scores: Budget confirmed, decision-maker identified, timeline clear',
              color: 'from-violet-500/20 to-violet-500/5'
            },
            {
              icon: Zap,
              title: 'Smart Routing',
              description: 'Routes leads to the right team member at the right time with full context.',
              example: 'Passes qualified lead to sales with 3-page context summary ready',
              color: 'from-amber-500/20 to-amber-500/5'
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`relative p-6 rounded-xl border border-white/10 bg-gradient-to-br ${item.color} hover:border-white/20 transition-all group`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white/10 text-blue-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">{item.description}</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Example:</p>
                    <p className="text-sm text-blue-200 italic">{item.example}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Live Intelligence Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 bg-white/[0.02] p-8 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30 -z-10" />

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-blue-300 font-medium">Live AI Analysis</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Watching an AI Decision in Real-Time</h3>
            </div>

            {/* Conversation Simulation */}
            <div className="space-y-4 mb-8">
              {[
                {
                  role: 'prospect',
                  message: 'Hey, we\'re interested but need to check with our CFO first.',
                  analysis: [
                    'Intent: High (interested)',
                    'Timeline: Medium (needs CFO approval)',
                    'Objection: Budget authority needed',
                  ]
                },
                {
                  role: 'ai',
                  message: 'I understand. When would be a good time to involve your CFO? I can prepare a customized breakdown showing ROI based on your team size.',
                  analysis: [
                    'Strategy: Address objection proactively',
                    'Action: Request timeline + involve decision-maker',
                    'Tone: Helpful, not pushy',
                  ]
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: item.role === 'prospect' ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex gap-4 ${item.role === 'ai' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Message */}
                  <div className={`flex-1 ${item.role === 'ai' ? 'text-right' : ''}`}>
                    <div className={`inline-block max-w-xs p-4 rounded-lg ${
                      item.role === 'ai'
                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-100'
                        : 'bg-white/5 border border-white/10 text-gray-200'
                    }`}>
                      <p className="text-sm">{item.message}</p>
                    </div>

                    {/* AI Analysis */}
                    {item.role === 'ai' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 + 0.2 }}
                        className="mt-3 space-y-1 text-xs"
                      >
                        {item.analysis.map((point, j) => (
                          <div key={j} className="flex items-center gap-2 text-gray-400">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    item.role === 'ai' ? 'bg-blue-500/30 border border-blue-500/50' : 'bg-white/10 border border-white/20'
                  }`}>
                    {item.role === 'ai' ? 'AI' : 'C'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reasoning Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <p className="text-xs text-gray-400 mb-2">AI REASONING</p>
              <p className="text-sm text-gray-300">
                Lead shows strong buying signals but has authority constraint. Recommended action: Prepare CFO-focused ROI deck, follow up in 2 days if no response, escalate to enterprise support for high-budget scenarios.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const AIUnderstandingSection = memo(AIUnderstandingSectionComponent)
