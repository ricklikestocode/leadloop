'use client'

import { memo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { MessageSquare, Clock, TrendingDown } from 'lucide-react'
import React, { useRef } from 'react'

function ProblemSectionComponent() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const fadeOut = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  return (
    <section 
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20"
    >
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 50%)`,
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
            <span className="text-gray-100">Revenue dies</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">
              in silence.
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Most businesses lose 40%+ of potential revenue because they can't respond fast enough.
          </p>
        </motion.div>

        {/* Two-column layout: Problem + Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Lost Conversations */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">The Silent Revenue Leak</h3>
              <p className="text-gray-300">Every unresponded message is a lost opportunity. Every delayed follow-up is revenue walking out the door.</p>
            </div>

            {/* Animated Conversation Cards */}
            <div className="space-y-4 mt-8">
              {[
                { name: 'Sarah M.', message: 'I\'m ready to buy...', time: '2:15 PM', status: 'unread' },
                { name: 'John D.', message: 'What are your pricing options?', time: 'Yesterday', status: 'unread' },
                { name: 'Lisa T.', message: 'Can you help us scale?', time: '3 days ago', status: 'abandoned' },
              ].map((conversation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3, x: -20 }}
                  whileInView={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white">{conversation.name}</p>
                      <p className="text-sm text-gray-400">{conversation.time}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                      conversation.status === 'unread' 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {conversation.status}
                    </span>
                  </div>
                  <p className="text-gray-400 italic line-through">{conversation.message}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">The Cost of Doing Nothing</h3>
              <p className="text-gray-300">Manual follow-up is broken. Your sales team can't scale fast enough. Neither can email sequences.</p>
            </div>

            {/* Impact Cards */}
            <div className="space-y-4 mt-8">
              {[
                {
                  icon: Clock,
                  metric: '2-4 hours',
                  description: 'Average response time',
                  problem: 'Leads go cold',
                  impact: '-60% conversion'
                },
                {
                  icon: MessageSquare,
                  metric: '3 in 10',
                  description: 'Leads never get follow-ups',
                  problem: 'Manual work overload',
                  impact: '-$120k/year per team'
                },
                {
                  icon: TrendingDown,
                  metric: '42%',
                  description: 'Of qualified leads lost',
                  problem: 'No context awareness',
                  impact: '-$500k+ annually'
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
                    className="relative p-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-3xl -z-10 group-hover:bg-red-500/20 transition-all" />
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-red-500/20 text-red-300 mt-1">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-1">The Problem</p>
                        <p className="text-2xl font-bold text-white mb-3">{item.metric}</p>
                        <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                        <div className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-400">{item.problem}</p>
                            <p className="text-red-300 font-semibold mt-1">{item.impact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Emotion-driving statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 p-8 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-transparent"
        >
          <p className="text-2xl md:text-3xl font-bold text-white">
            Your team is drowning in conversations they can't keep up with. <span className="text-red-300">The system is broken.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export const ProblemSection = memo(ProblemSectionComponent)
