"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/[0.05] bg-[#020202]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#638de9] flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">ReplyFlow</span>
        </div>
        
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/security" className="hover:text-white transition-colors">Security</Link>
        </div>
        
        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
          © 2026 ReplyFlow AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
