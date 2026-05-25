'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Zap, GitBranch, CheckCircle, Clock } from 'lucide-react'
import React from 'react'

function AutomationEngineSectionComponent() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            background: `radial-gradient(circle at top left, rgba(249,115,22,0.1) 0%, transparent 40%), 
                        radial-gradient(circle at bottom right, rgba(59,130,246,0.08) 0%, transparent 40%)`,
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
            Revenue
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              operates automatically.
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Once deployed, ReplyFlow runs your entire sales workflow 24/7 without manual intervention.
          </p>
        </motion.div>

        {/* Workflow Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative mb-16"
        >
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-slate-900/60 to-slate-950/80 bg-white/[0.02] p-8 overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl opacity-30 -z-10" />

            <h3 className="text-xl font-bold text-white mb-8">Automated Workflow Example</h3>

            {/* Workflow Steps */}
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  trigger: 'Lead arrives via WhatsApp',
                  action: 'AI analyzes urgency, intent, budget',
                  icon: Zap,
                  delay: 0
                },
                {
                  step: 2,
                  trigger: 'Intent detected: HIGH',
                  action: 'Instant AI response sent within 30 seconds',
                  icon: Clock,
                  delay: 0.2
                },
                {
                  step: 3,
                  trigger: 'Lead qualified: READY',
                  action: 'Automatically added to follow-up sequence',
                  icon: CheckCircle,
                  delay: 0.4
                },
                {
                  step: 4,
                  trigger: 'Day 1: No response',
                  action: 'AI sends contextual follow-up message',
                  icon: Clock,
                  delay: 0.6
                },
                {
                  step: 5,
                  trigger: 'Day 3: Prospect replies',
                  action: 'AI analyzes response, updates lead score',
                  icon: Zap,
                  delay: 0.8
                },
                {
                  step: 6,
                  trigger: 'Ready for sales: YES',
                  action: 'Lead routed to sales team with full context',
                  icon: GitBranch,
                  delay: 1.0
                },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative"
                  >
                    {/* Connection Line */}
                    {i < 5 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-amber-500/50 to-transparent" />
                    )}

                    {/* Step Card */}
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: item.delay + 0.1, type: 'spring' }}
                          className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300"
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: item.delay + 0.1 }}
                        className="flex-1 pt-1"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold uppercase text-amber-400">Step {item.step}</span>
                          <span className="text-sm font-semibold text-white">{item.trigger}</span>
                        </div>
                        <p className="text-sm text-gray-400 ml-0">{item.action}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Automation Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: '24/7 Operation',
              description: 'No sleep, no breaks. Every lead gets instant responses, even at midnight.',
              metrics: ['Responds while competitors sleep', '30 seconds average reply time', '100% lead engagement']
            },
            {
              title: 'Intelligent Scaling',
              description: 'Handle 10 leads or 10,000 with the same quality. Zero manual overhead.',
              metrics: ['Same quality at 1000x volume', 'No team expansion needed', 'Costs stay flat as you scale']
            },
            {
              title: 'Never Miss Follow-Ups',
              description: 'Automated sequences ensure every lead gets the right message at the right time.',
              metrics: ['Zero forgotten follow-ups', 'Adaptive messaging by lead', 'Dynamic timing based on behavior']
            },
            {
              title: 'Context-Preserved Handoff',
              description: 'When leads reach your team, they arrive with complete context and history.',
              metrics: ['3-page context summary included', 'Objections already documented', 'Budget & timeline clear']
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative p-6 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/30 transition-all group"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                
                <ul className="space-y-2">
                  {item.metrics.map((metric, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                      className="flex items-center gap-2 text-xs text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                      {metric}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Insight */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 p-8 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent"
        >
          <div className="flex gap-4 items-start">
            <div className="text-2xl mt-1">⚡</div>
            <div>
              <p className="text-xl font-bold text-white mb-2">The Automation Revolution</p>
              <p className="text-gray-300">
                Your sales process stops being a manual chaos of spreadsheets and email threads. It becomes an intelligent machine. Every conversation is analyzed. Every lead is qualified. Every follow-up is scheduled. Your team focuses on closing deals, not chasing leads.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const AutomationEngineSection = memo(AutomationEngineSectionComponent)
