'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Shield, Zap } from 'lucide-react'
import React from 'react'

function CTASectionComponent() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at center, rgba(59,130,246,0.2) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 w-full text-center">
        {/* Emotional headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-gray-100">Every</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-300">
            unanswered
          </span>
          <br />
          <span className="text-gray-100">lead costs revenue.</span>
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto mb-12"
        >
          ReplyFlow answers first. Your competitors respond tomorrow. By then, your lead is already talking to someone else.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-6 rounded-lg flex items-center justify-center gap-2 group transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-6 rounded-lg transition-all duration-300 bg-white/5"
          >
            Schedule Demo
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Badge Row */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap mb-8">
            {[
              { icon: Check, text: 'No credit card needed' },
              { icon: Zap, text: '14-day full access' },
              { icon: Shield, text: 'Enterprise-grade security' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{item.text}</span>
                </motion.div>
              )
            })}
          </div>

          {/* Testimonial/Social Proof */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-6 rounded-xl bg-white/5 border border-white/10 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-black"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">500+ teams scaling revenue</p>
                <p className="text-xs text-gray-400">Join the growth revolution</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 italic">
              "ReplyFlow transformed our follow-up process from chaos to system. We're now closing 31% more deals with the same team size."
            </p>
            <p className="text-xs text-gray-500 mt-3">— Sarah Chen, Growth Lead at TechScale Agency</p>
          </motion.div>
        </motion.div>

        {/* Final Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-4">The path forward</p>
          <p className="text-2xl font-bold text-white max-w-2xl mx-auto mb-6">
            Your business is at an inflection point. You can keep losing leads to slow replies. Or you can step into the future where AI operates your revenue system 24/7.
          </p>
          <p className="text-lg text-blue-300 font-semibold">Which will you choose?</p>
        </motion.div>
      </div>
    </section>
  )
}

export const CTASection = memo(CTASectionComponent)
