'use client'

import React from 'react'
import { HeroSection, ProblemSection, AIUnderstandingSection, AIConversationSection, AutomationEngineSection, RevenueImpactSection, CTASection } from '@/components/replyflow'

export default function ReplyFlowHome() {
  return (
    <main className="bg-[#050505] text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* AI Understanding Section */}
      <AIUnderstandingSection />

      {/* Live Conversation Demo */}
      <AIConversationSection />

      {/* Automation Engine */}
      <AutomationEngineSection />

      {/* Revenue Impact */}
      <RevenueImpactSection />

      {/* Final CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="relative z-10 bg-[#030303] border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-white mb-4">ReplyFlow</h3>
              <p className="text-sm text-gray-400">
                AI-powered revenue operating system for modern businesses.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Product</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Resources</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2026 ReplyFlow AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
