'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Check } from 'lucide-react'
import React, { useState, useEffect } from 'react'

interface Message {
  id: string
  role: 'prospect' | 'ai'
  text: string
  timestamp: string
  metadata?: {
    intent?: string
    confidence?: number
    action?: string
  }
}

function AIConversationSectionComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'prospect',
      text: 'Hi, is ReplyFlow suitable for small agencies?',
      timestamp: '2:15 PM'
    }
  ])

  const [isTyping, setIsTyping] = useState(false)

  // Simulate AI responses
  useEffect(() => {
    if (messages.length === 1) {
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: '2',
            role: 'ai',
            text: 'Absolutely! We\'ve helped 200+ agencies automate their lead follow-up. What\'s your typical team size?',
            timestamp: '2:15 PM',
            metadata: {
              intent: 'Product Fit Question',
              confidence: 94,
              action: 'Gathering Info'
            }
          }])
          setIsTyping(false)

          // Next response
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: '3',
              role: 'prospect',
              text: 'We have 3 people handling 200+ leads monthly. Manual follow-up is killing us.',
              timestamp: '2:16 PM'
            }])
            
            setTimeout(() => {
              setIsTyping(true)
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: '4',
                  role: 'ai',
                  text: 'That\'s exactly our sweet spot. With 200 leads/month, you\'re likely losing $30-50k in revenue to slow responses. We can cut your response time from hours to seconds.',
                  timestamp: '2:16 PM',
                  metadata: {
                    intent: 'High Buyer Intent',
                    confidence: 97,
                    action: 'Show Value Prop'
                  }
                }])
                setIsTyping(false)
              }, 1500)
            }, 2000)
          }, 2500)
        }, 2000)
      }, 800)
    }
  }, [messages.length])

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Watch
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              ReplyFlow in action.
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            This is a real conversation with our AI sales operator responding to a prospect inquiry.
          </p>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-slate-900/80 to-slate-950/80 bg-white/[0.02] overflow-hidden shadow-2xl"
        >
          {/* Glow effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-20 -z-10" />

          {/* Header */}
          <div className="border-b border-white/10 px-6 py-4 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">ReplyFlow AI</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    Active now
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">⋮</button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-3 ${message.role === 'ai' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  message.role === 'ai'
                    ? 'bg-gradient-to-br from-purple-400 to-blue-400'
                    : 'bg-gray-600'
                }`}>
                  {message.role === 'ai' ? 'AI' : 'C'}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-sm ${message.role === 'ai' ? 'text-right' : ''}`}>
                  {/* Message Bubble */}
                  <motion.div
                    className={`inline-block p-4 rounded-lg ${
                      message.role === 'ai'
                        ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                        : 'bg-white/10 border border-white/20 text-gray-100'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.role === 'ai' ? 'text-purple-300/60' : 'text-gray-400'}`}>
                      {message.timestamp}
                    </p>
                  </motion.div>

                  {/* AI Metadata */}
                  {message.metadata && message.role === 'ai' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 space-y-1 text-left ml-auto text-xs text-gray-400"
                    >
                      <div className="flex items-center gap-1 justify-end">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Intent: {message.metadata.intent}</span>
                      </div>
                      <div className="text-right text-gray-500">
                        Confidence: {message.metadata.confidence}%
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 items-end"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 px-6 py-4 bg-white/5">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                disabled
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 disabled:opacity-50"
              />
              <button className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50" disabled>
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Real-Time Intent Detection',
              description: 'Identifies buying signals and urgency instantly'
            },
            {
              title: 'Context-Aware Responses',
              description: 'Generates personalized replies based on lead history'
            },
            {
              title: 'Intelligent Actions',
              description: 'Recommends next steps and schedules follow-ups'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export const AIConversationSection = memo(AIConversationSectionComponent)
