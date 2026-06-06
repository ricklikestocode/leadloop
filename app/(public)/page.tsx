"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, Check, Zap, Users, BarChart3, Clock, Play, Brain,
  MessageSquare, Shield, Globe, Sparkles, TrendingUp, Target,
  Layers, MousePointer2, ChevronDown, Rocket, Search, Activity,
  Quote, ShieldCheck, Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"

function ParallaxText({ children, baseVelocity = 5 }: { children: string; baseVelocity?: number }) {
  return (
    <div className="overflow-hidden flex flex-nowrap whitespace-nowrap">
      <div className="flex flex-nowrap whitespace-nowrap">
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
        <span className="block mr-12">{children}</span>
      </div>
    </div>
  )
}

function ScrollReveal({ children, delay = 0, direction = "up", distance = 40 }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right"; distance?: number }) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0
      }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ 
        duration: 0.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      {children}
    </motion.div>
  )
}

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

/* ─── Components ────────────────────────────────────── */

function FeatureCard({ icon: Icon, title, desc, delay, details }: { icon: any; title: string; desc: string; delay: number; details?: string[] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#638de9]/30 transition-all duration-500 overflow-hidden h-full min-h-[380px] md:min-h-0 flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#638de9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-[#638de9]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#638de9]/20 transition-all duration-500">
          <Icon className="w-6 h-6 text-[#638de9]" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/40 leading-relaxed text-sm mb-4">{desc}</p>

        <AnimatePresence>
          {isHovered && details && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-4 border-t border-white/5"
            >
              {details.map((d, i) => (
                <li key={i} className="text-[10px] font-bold uppercase tracking-widest text-[#638de9]/60 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#638de9]" />
                  {d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function InteractiveCalculator() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [leads, setLeads] = useState(500)
  const [avgDealSize, setAvgDealSize] = useState(2000)

  const leakageRate = 0.62
  const recoveryRate = 0.85

  const lostLeads = Math.round(leads * leakageRate)
  const lostRevenue = lostLeads * avgDealSize
  const recoveredRevenue = Math.round(lostRevenue * recoveryRate)

  if (!mounted) return null

  return (
    <section className="py-20 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-[#638de9]/20 bg-gradient-to-br from-white/[0.03] to-transparent bg-white/[0.02] relative overflow-hidden shadow-[0_0_100px_-20px_rgba(99,141,233,0.1)]"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <TrendingUp className="w-32 h-32 text-[#638de9]" />
        </div>

        <div className="relative z-10">
          <div className="mb-12">
            <Badge className="bg-[#638de9]/10 text-[#638de9] mb-4">Revenue Logic Engine</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">How much revenue are you losing?</h2>
            <p className="text-white/40 font-medium">Adjust the sliders to simulate your current pipeline leakage.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/40">Monthly Inbound Leads</label>
                  <span className="text-2xl font-black text-white">{leads.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={leads}
                  onChange={(e) => setLeads(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#638de9]"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/40">Average Deal Size ($)</label>
                  <span className="text-2xl font-black text-white">${avgDealSize.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={avgDealSize}
                  onChange={(e) => setAvgDealSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#638de9]"
                />
              </div>

              <div className="pt-8 flex items-center gap-4 text-xs font-bold text-white/20 italic">
                <Search className="w-4 h-4" /> Based on cross-industry CRM audit data (2024)
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <motion.div
                className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-red-500/5 border border-red-500/10"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 mb-2">Estimated Leakage</div>
                <div className="text-4xl md:text-5xl font-black text-red-500">${lostRevenue.toLocaleString()}</div>
                <div className="mt-2 text-xs font-bold text-red-500/30 uppercase tracking-widest">{lostLeads} leads ignored or slow-response</div>
              </motion.div>

              <motion.div
                className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#638de9] text-black shadow-2xl shadow-[#638de9]/20"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Recovery Potential</div>
                  <Sparkles className="w-5 h-5 text-black/30" />
                </div>
                <div className="text-4xl md:text-5xl font-black">${recoveredRevenue.toLocaleString()}</div>
                <p className="mt-4 text-sm font-bold leading-relaxed opacity-60">
                  Recovered by instant AI engagement within 30 seconds of lead creation.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function AIScoringSimulation() {
  const [activeLead, setActiveLead] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const leads = [
    { name: "TechFlow Solutions", intent: "High", scoring: 98, status: "Urgent", query: "Need pricing for 50 seats ASAP.", metrics: "4/5 high-intent keywords detected" },
    { name: "Acme Retail", intent: "Medium", scoring: 64, status: "Evaluating", query: "Do you support Shopify?", metrics: "Integration query matches knowledge base" },
    { name: "Global Logix", intent: "High", scoring: 92, status: "Critical", query: "Need a demo for the CTO tomorrow.", metrics: "C-suite intent detected" },
    { name: "SaaS Pioneer", intent: "High", scoring: 89, status: "Urgent", query: "Can we migrate from Salesforce?", metrics: "Churn risk alert / Competitive switch" }
  ]

  useEffect(() => {
    if (isScrolling) return
    const timer = setInterval(() => {
      setActiveLead((prev) => (prev + 1) % leads.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isScrolling])

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    const handleScroll = () => {
      setIsScrolling(true)
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => setIsScrolling(false), 1500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="w-full h-full p-8 space-y-6 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-[#638de9]/10 to-transparent" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#638de9]" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Neural Core Live</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[#638de9] animate-ping" />
          <Activity className="w-3 h-3 text-[#638de9]/50" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeLead}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 bg-white/[0.02] space-y-4 relative z-10"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-base font-bold text-white mb-1">{leads[activeLead].name}</div>
              <div className="text-[10px] text-white/40 italic leading-relaxed">"{leads[activeLead].query}"</div>
            </div>
            <Badge className={cn(
              "text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 border-none",
              leads[activeLead].status === "Urgent" ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"
            )}>
              {leads[activeLead].status}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
              <span>Intent Analysis</span>
              <span className="text-[#638de9]">{leads[activeLead].scoring}% match</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#638de9] to-[#8e5cdb] rounded-full shadow-[0_0_10px_rgba(99,141,233,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${leads[activeLead].scoring}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-[9px] text-white/30 font-medium flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#638de9]/50" />
              {leads[activeLead].metrics}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-2 overflow-hidden opacity-20">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1 h-[2px] bg-white/10 rounded-full">
            <motion.div
              className="h-full bg-[#638de9]"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function NeuralDataStream() {
  const [activeQuery, setActiveQuery] = useState(0)
  const [hovered, setHovered] = useState(false)
  
  const queries = [
    { intent: "Pricing Match", file: "Pricing_Rules.xlsx", latency: "12ms", match: "98.2%" },
    { intent: "Security Audit", file: "Compliance.pdf", latency: "8ms", match: "99.1%" },
    { intent: "Feature Query", file: "Product_Specs.pdf", latency: "14ms", match: "95.4%" },
    { intent: "Tone Check", file: "Brand_Guide.doc", latency: "11ms", match: "97.8%" },
  ]
  
  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(() => {
      setActiveQuery(prev => (prev + 1) % queries.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [hovered])

  return (
    <div 
      className="p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group flex-shrink-0 cursor-crosshair"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Background Matrix Rain / Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#a855f7_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
             <Search className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Vector Search Live</div>
            <div className="text-[8px] text-purple-500/60 font-mono mt-0.5">Watching Semantic Queries</div>
          </div>
        </div>
        <Badge className="bg-purple-500/10 text-purple-400 text-[9px] border-none font-mono">
          {queries[activeQuery].latency}
        </Badge>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        {/* Animated Rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-purple-500/20"
            style={{ width: (i + 1) * 70, height: (i + 1) * 70 }}
            animate={{ 
              rotate: hovered ? 360 : -360, 
              scale: hovered ? [1, 1.1, 1] : 1 
            }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Central Core */}
        <motion.div 
          className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center relative z-10 bg-white/[0.02] border border-purple-500/30"
          animate={{ scale: hovered ? 1.1 : 1 }}
        >
          <div className="w-6 h-6 rounded-full bg-purple-500 animate-pulse shadow-[0_0_25px_#a855f7]" />
        </motion.div>

        {/* Floating Data Nodes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuery}
            initial={{ opacity: 0, scale: 0.5, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)", x: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 p-4 rounded-2xl bg-black/60 border border-purple-500/30 bg-white/[0.02] shadow-2xl"
          >
            <div className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-2 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              {queries[activeQuery].intent}
            </div>
            <div className="text-sm font-bold text-white mb-2">
              {queries[activeQuery].file}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Similarity: {queries[activeQuery].match}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-2 overflow-hidden opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 bg-purple-500 rounded-full flex-1"
            animate={{ opacity: hovered ? [0.2, 1, 0.2] : 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

/* ═══ MAIN PAGE ═══════════════════════════════════════ */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const [tone, setTone] = useState<'Professional' | 'Aggressive'>('Professional')
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      mouseX.set(clientX)
      mouseY.set(clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  const orbX = useTransform(mouseX, [0, 1920], [-20, 20])
  const orbY = useTransform(mouseY, [0, 1080], [-20, 20])

  const orbXInverse = useTransform(orbX, v => -v)
  const orbYInverse = useTransform(orbY, v => -v)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })


  return (
    <div ref={containerRef} className="relative bg-[#020202] text-white selection:bg-[#638de9]/30 font-sans overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#638de9] origin-left z-[110] shadow-[0_0_20px_rgba(99,141,233,0.5)]"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          style={{ x: isMobile ? 0 : orbX, y: isMobile ? 0 : orbY }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#638de9]/10 blur-[50px] md:blur-[150px] rounded-full"
        />
        <motion.div
          style={{ x: isMobile ? 0 : orbXInverse, y: isMobile ? 0 : orbYInverse }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#8e5cdb]/10 blur-[50px] md:blur-[150px] rounded-full"
        />
      </div>

      <section ref={heroRef} className="relative min-h-[120vh] flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          style={{ opacity: 1 }}
          className="max-w-6xl mx-auto text-center z-10"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] bg-white/[0.02] mb-12 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-[#638de9]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">Intelligence Driven Growth</span>
          </motion.div>

          <h1 className="text-6xl md:text-[8.5rem] font-black tracking-tighter leading-[0.8] mb-12">
            <motion.div
              style={{ x: 0 }}
            >
              Scale Your
            </motion.div>
            <motion.div 
              className="relative text-[#638de9]"
              style={{ x: 0 }}
            >
              Revenue.
              <motion.svg
                className="absolute -bottom-4 left-0 w-full h-4 text-[#638de9]/40"
                viewBox="0 0 400 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 1 }}
              >
                <path d="M2 18C100 18 200 2 398 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </motion.svg>
            </motion.div>
          </h1>

          <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed mb-16 px-4">
            ReplyFlow AI turns your complex communication channels into a <span className="text-white">self-operating revenue engine</span>. <br className="hidden md:block" />
            <span className="text-white/60 font-bold italic tracking-tight">Qualify leads, book meetings, and scale revenue while you sleep.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton>
              <Button size="lg" className="group bg-white text-black hover:bg-[#638de9] hover:text-white px-10 h-16 text-base font-bold rounded-full transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)]" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button size="lg" variant="outline" className="px-10 h-16 text-base font-bold text-white/80 hover:text-white border-white/10 hover:bg-white/5 rounded-full bg-white/[0.02] transition-all duration-300" asChild>
                <Link href="/demo">
                  <Play className="mr-2 w-5 h-5 fill-current" /> Watch Demo
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-[#638de9]" />
        </motion.div>
      </section>

      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-12">Accelerating revenue for industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {["Acme Corp", "Globex", "Soylent", "Initech", "Umbrella", "Hooli"].map((logo) => (
              <span key={logo} className="text-2xl font-black italic tracking-tighter hover:text-[#638de9] cursor-default transition-colors">{logo}</span>
            ))}
          </div>

          <div className="mt-16 flex justify-center gap-8 border-t border-white/5 pt-10">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
              <ShieldCheck className="w-4 h-4 text-primary/50" />
              SOC2 Type II Compliant
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
              <ShieldCheck className="w-4 h-4 text-primary/50" />
              GDPR & CCPA Ready
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
              <ShieldCheck className="w-4 h-4 text-primary/50" />
              256-bit AES Encryption
            </div>
          </div>
        </div>
      </section>

      <ScrollReveal direction="up">
        <InteractiveCalculator />
      </ScrollReveal>

      <section className="py-32 px-6">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-6 px-4 py-1">Inbound Decay</Badge>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                  Your leads are <br />
                  <span className="text-[#638de9]">ghosting you.</span>
                </h2>
                <p className="text-white/40 text-xl leading-relaxed mb-12 max-w-lg">
                  Speed to lead isn't just a metric; it's the entire game.
                  Responding in 10 minutes vs. 5 minutes reduces qualification rates by <span className="text-white font-bold">80%</span>.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Clock, label: "Response Lag", value: "42h Avg", color: "red" },
                    { icon: Zap, label: "Required Speed", value: "< 5 mins", color: "blue" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.color === 'red' ? 'bg-red-500/10 text-red-500' : 'bg-[#638de9]/10 text-[#638de9]')}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.label}</div>
                        <div className="text-2xl font-bold">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group h-auto md:h-[500px]">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#638de9] to-[#8e5cdb] rounded-[2rem] md:rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative h-full min-h-[400px] md:min-h-0 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 p-6 md:p-12 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xs font-bold text-white/30 uppercase tracking-widest">Live Lead Decay Monitor</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-red-500/30" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    {[
                      { name: "John D.", time: "12m", decay: 40 },
                      { name: "Sarah K.", time: "45m", decay: 75 },
                      { name: "Mike R.", time: "2h", decay: 95 }
                    ].map((lead, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold">{lead.name}</span>
                          <span className="text-[10px] text-red-500 font-black">-{lead.decay}% Chance</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                          <motion.div
                            className="h-full bg-red-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lead.decay}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                          />
                        </div>
                        <div className="mt-2 text-[10px] text-white/20">Waiting for {lead.time} • High Intent</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 text-center text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">System Leaking Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="intelligence" className="py-20 md:py-32 px-6 bg-white/[0.01] scroll-mt-24">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <Badge className="bg-[#638de9]/10 text-[#638de9] mb-4">Enterprise Grade</Badge>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Engineered for speed.</h2>
              <p className="text-white/40 text-xl max-w-2xl mx-auto">
                Built on a proprietary neural layer designed specifically for high-velocity revenue operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="md:col-span-4 h-auto md:h-[450px]">
                <div className="w-full h-full min-h-[400px] md:min-h-0 p-1 rounded-[2rem] md:rounded-[2.8rem] bg-gradient-to-br from-[#638de9]/20 to-transparent border border-white/5">
                  <div className="w-full h-full min-h-[390px] md:min-h-0 rounded-[1.9rem] md:rounded-[2.7rem] bg-[#020202] overflow-hidden relative group">
                    <AIScoringSimulation />
                    <div className="absolute top-8 right-8 max-w-[200px] text-right">
                      <h3 className="text-2xl font-bold mb-2">Neural Scoring</h3>
                      <p className="text-white/30 text-xs leading-relaxed">
                        Real-time intent analysis using 50+ behavioral vectors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 h-auto md:h-[450px]">
                <FeatureCard
                  icon={Target}
                  title="Hyper-Targeted"
                  desc="Autonomous outreach that sounds exactly like your brand."
                  delay={0.1}
                  details={["Voice Cloning", "Brand Alignment", "Dynamic Context"]}
                />
              </div>

              <div className="md:col-span-2 h-auto md:h-[450px]">
                <FeatureCard
                  icon={Globe}
                  title="Global Sync"
                  desc="Process leads in 50+ languages with zero latency."
                  delay={0.2}
                  details={["Native Translation", "24/7 Response", "Geofencing"]}
                />
              </div>

              <div className="md:col-span-4 h-auto md:h-[450px]">
                <div className="w-full h-full min-h-[450px] md:min-h-0 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 bg-gradient-to-bl from-white/[0.03] to-transparent relative overflow-hidden group hover:border-[#638de9]/20 transition-all duration-500">
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                      <div>
                        <h3 className="text-3xl font-bold mb-2">Adaptive Brand Voice</h3>
                        <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                          Our AI mirrors your specific sales tone with mathematical precision.
                          Switch between tones to see the neural shift.
                        </p>
                      </div>
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 flex-shrink-0">
                        {['Professional', 'Aggressive'].map(t => (
                          <button
                            key={t}
                            onClick={() => setTone(t as any)}
                            className={cn(
                              "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                              tone === t ? "bg-[#638de9] text-white" : "text-white/30 hover:text-white/60"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="p-6 rounded-2xl bg-black border border-white/5 space-y-4 relative">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">AI Response Preview</div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={tone}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-medium italic text-white/80 leading-relaxed"
                          >
                            {tone === 'Professional'
                              ? "“Thank you for your interest in our enterprise solution. I've analyzed your requirements and would love to schedule a brief consultation to discuss how we can align with your goals.”"
                              : "“I see you're looking for a solution that actually works. We're already helping 500+ teams dominate their market. Let's get you on a call today before your competitors beat you to it.”"}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  <Layers className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] text-white/[0.02] -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="features" className="py-20 md:py-32 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="space-y-12 lg:space-y-24">
              <div>
                <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6 px-4 py-1">The Architecture</Badge>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">How it works.</h2>
                <p className="text-white/40 text-xl leading-relaxed mb-12 max-w-lg">
                  ReplyFlow isn't just a chatbot; it's a complete revenue operating system.
                </p>
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Ingestion", desc: "Sync all inbound lead channels instantly." },
                    { step: "02", title: "Reasoning", desc: "AI analyzes intent and trains on your data." },
                    { step: "03", title: "Execution", desc: "Autonomous engagement via WhatsApp, Email & SMS with 99.9% uptime." }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#638de9]/30 transition-all duration-300"
                    >
                      <span className="text-3xl font-black text-[#638de9]/20 group-hover:text-[#638de9] transition-colors">{item.step}</span>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-[#638de9] transition-colors">{item.title}</h4>
                        <p className="text-xs text-white/30">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-[#638de9]/10 to-transparent border border-[#638de9]/10 relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="w-4 h-4 text-[#638de9] animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Revenue Velocity</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">+412%</div>
                    <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                      Average increase in lead qualification rate within the first 30 days of autonomous execution.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-12 h-12 text-[#638de9]" />
                  </div>
                </motion.div>
              </div>

              <NeuralDataStream />

              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                {/* Neural Base Background Animation */}
                <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {[...Array(15)].map((_, i) => (
                      <motion.circle
                        key={`node-${i}`}
                        cx={20 + ((i * 73) % 360)}
                        cy={20 + ((i * 127) % 360)}
                        r="1.2"
                        fill="#638de9"
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          scale: [1, 1.8, 1],
                        }}
                        transition={{
                          duration: 3 + (i % 3),
                          repeat: Infinity,
                          delay: (i * 0.2) % 2
                        }}
                        filter="url(#glow)"
                      />
                    ))}
                    {[...Array(12)].map((_, i) => (
                      <motion.line
                        key={`edge-${i}`}
                        x1={20 + ((i * 89) % 360)}
                        y1={20 + ((i * 139) % 360)}
                        x2={20 + ((i * 197) % 360)}
                        y2={20 + ((i * 47) % 360)}
                        stroke="#638de9"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: [0, 1, 0],
                          opacity: [0, 0.4, 0]
                        }}
                        transition={{
                          duration: 6 + (i % 6),
                          repeat: Infinity,
                          delay: (i * 0.4) % 5
                        }}
                      />
                    ))}
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#638de9]">Neural Knowledge Base</div>
                    <Badge className="bg-[#638de9]/10 text-[#638de9] text-[8px] border-none animate-pulse">Syncing...</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Product_Specs_v2.pdf", size: "2.4MB", status: "Indexed", insight: "42 pricing rules extracted" },
                      { name: "Pricing_Rules.xlsx", size: "1.1MB", status: "Indexed", insight: "3 tiers, 12 discount codes" },
                      { name: "Brand_Voice_Guide.doc", size: "0.8MB", status: "Active", insight: "Tone: Professional/Empathetic" },
                      { name: "Competitive_Matrix.pdf", size: "3.2MB", status: "Indexing", insight: "Scanning feature deltas..." },
                      { name: "Legal_Compliance.txt", size: "0.4MB", status: "Indexed", insight: "GDPR protocols identified" }
                    ].map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col gap-1 p-3 rounded-xl bg-black/40 border border-white/5 group/file hover:border-[#638de9]/30 hover:bg-[#638de9]/5 transition-all cursor-default"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              file.status === "Indexing" ? "bg-yellow-500 animate-spin" : "bg-[#638de9] animate-pulse shadow-[0_0_8px_#638de9]"
                            )} />
                            <span className="text-[10px] font-medium text-white/60 group-hover/file:text-white transition-colors">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-white/20">{file.size}</span>
                            <span className={cn(
                              "text-[9px] font-bold uppercase tracking-widest",
                              file.status === "Indexing" ? "text-yellow-500/50" : "text-[#638de9]/50"
                            )}>{file.status}</span>
                          </div>
                        </div>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          whileHover={{ height: "auto", opacity: 1 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 text-[8px] text-[#638de9]/80 font-mono flex items-center gap-2">
                            <div className="w-1 h-1 bg-[#638de9]/40" />
                            {file.insight}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#638de9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="space-y-12 lg:space-y-24">
              <motion.div
                whileInView={{ y: [40, 0], opacity: [0, 1] }}
                className="p-1 border border-white/10 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] shadow-2xl"
              >
                <div className="aspect-auto min-h-[460px] md:aspect-[4/5] md:min-h-0 rounded-[1.9rem] md:rounded-[2.8rem] bg-gradient-to-b from-white/[0.05] to-transparent p-6 md:p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-3xl bg-[#638de9]/10 flex items-center justify-center mb-10 group">
                    <Rocket className="w-10 h-10 text-[#638de9] group-hover:translate-y-[-5px] transition-transform" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Zero-Code Launch</h3>
                  <p className="text-white/30 leading-relaxed mb-8">
                    Connect your website form, WhatsApp Business, or Email in one click.
                    Our system maps your lead fields automatically using AI field-matching.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 uppercase">No SDK Required</Badge>
                    <Badge variant="outline" className="text-[9px] border-white/10 text-white/40 uppercase">API First</Badge>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileInView={{ y: [40, 0], opacity: [0, 1] }}
                className="p-1 border border-white/10 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] shadow-2xl group hover:border-purple-500/30 transition-all duration-500"
              >
                <div className="aspect-auto min-h-[460px] md:aspect-[4/5] md:min-h-0 rounded-[1.9rem] md:rounded-[2.8rem] bg-gradient-to-b from-white/[0.05] to-transparent p-6 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 150 }}
                        animate={{
                          opacity: [0, 0.3, 0],
                          y: -150,
                          x: Math.sin(i) * 20
                        }}
                        transition={{
                          duration: 3 + (i % 2),
                          delay: i * 0.15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute text-[7px] font-mono text-purple-500/30 whitespace-nowrap"
                        style={{ left: `${(i / 12) * 100}%` }}
                      >
                        {["0x8F", "EMBED", "SYNC", "MEM", "VECT", "GRID", "NODE"][i % 7]}::${((i * 987) % 4096).toString(16).padStart(4, "0")}
                      </motion.div>
                    ))}
                  </div>
                  <div className="w-24 h-24 rounded-3xl bg-purple-500/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform relative z-10 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                    <Brain className="w-10 h-10 text-purple-500 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white relative z-10">Semantic Memory</h3>

                  <div className="w-full space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                      <span>Context Retrieval</span>
                      <span className="text-purple-500">Sub-second Latency</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                      <motion.div className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 2.5 }} />
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 bg-purple-500/20 rounded-full"
                          animate={{
                            opacity: [0.2, 1, 0.2],
                            backgroundColor: ["rgba(168,85,247,0.1)", "rgba(168,85,247,0.4)", "rgba(168,85,247,0.1)"]
                          }}
                          transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-white/30 text-sm leading-relaxed relative z-10 max-w-xs mx-auto">
                    Our AI reads your PDF whitepapers, Notion docs, and pricing sheets.
                    It remembers every detail and <span className="text-purple-400/60 font-bold italic">never</span> hallucinates.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileInView={{ y: [40, 0], opacity: [0, 1] }}
                className="p-1 border border-white/10 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] shadow-2xl group hover:border-[#638de9]/30 transition-all duration-500"
              >
                <div className="aspect-auto min-h-[460px] md:aspect-[4/5] md:min-h-0 rounded-[1.9rem] md:rounded-[2.8rem] bg-gradient-to-b from-white/[0.05] to-transparent p-6 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="w-24 h-24 rounded-3xl bg-[#638de9]/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-[#638de9]/20 rounded-3xl blur-2xl animate-pulse" />
                    <MessageSquare className="w-10 h-10 text-[#638de9] relative z-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Omni-Channel Sync</h3>

                  <div className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[8px] font-black uppercase tracking-widest text-white/30">Live Sync Status</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="flex justify-around items-center relative py-2">
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2" />
                      {[Globe, MessageSquare, Search].map((Icon, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            color: ["rgba(255,255,255,0.2)", "#638de9", "rgba(255,255,255,0.2)"]
                          }}
                          transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
                          className="relative z-10 p-2 rounded-lg bg-black border border-white/5"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="mt-4 text-[9px] font-mono text-[#638de9]/60">Context preserved across 3 channels</p>
                  </div>

                  <p className="text-white/30 text-sm leading-relaxed mb-8">
                    Replies are delivered instantly via WhatsApp, Email, or SMS.
                    The AI maintains <span className="text-white font-bold">100% context</span> across channels.
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                      <div className="text-[#638de9] font-black text-xl">0.5s</div>
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Latency</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                      <div className="text-[#638de9] font-black text-xl">100%</div>
                      <div className="text-[8px] text-white/20 uppercase tracking-widest">Accuracy</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileInView={{ y: [40, 0], opacity: [0, 1] }}
                className="p-1 border border-white/10 rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] shadow-2xl group hover:border-[#638de9]/30 transition-all duration-500"
              >
                <div className="aspect-auto min-h-[460px] md:aspect-[4/5] md:min-h-0 rounded-[1.9rem] md:rounded-[2.8rem] bg-gradient-to-b from-white/[0.05] to-transparent p-6 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="w-24 h-24 rounded-3xl bg-green-500/10 flex items-center justify-center mb-10 group-hover:rotate-12 transition-all duration-500 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ShieldCheck className="w-10 h-10 text-green-500 relative z-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white">Trust Layer</h3>

                  <div className="w-full space-y-3 mb-10 relative">
                    {[
                      { label: "Brand Safety", value: "Verified" },
                      { label: "Legal Terms", value: "Compliant" },
                      { label: "Sales Protocol", value: "Locked" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex justify-between items-center p-3 rounded-xl bg-green-500/5 border border-green-500/10"
                      >
                        <span className="text-[8px] font-black uppercase tracking-widest text-green-500/40">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                          <span className="text-[9px] font-bold text-green-500">{item.value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-white/30 text-sm leading-relaxed mb-8 relative z-10">
                    Every response passes through our <span className="text-green-500/80 font-bold">Brand-Sync filter</span>.
                    We ensure 100% adherence to your guidelines.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["SOC2", "GDPR", "HIPAA"].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-[9px] font-black text-white/40 uppercase group-hover:border-green-500/30 group-hover:text-green-500/60 transition-colors">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black relative overflow-hidden">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6">Performance Audit</Badge>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                  Response velocity <br />
                  <span className="text-[#638de9]">is your edge.</span>
                </h2>
                <div className="space-y-8 text-white/40 text-lg leading-relaxed">
                  <p>
                    Most sales teams lose <span className="text-white font-bold">78%</span> of leads simply because they respond after the "Golden Window" of 5 minutes.
                  </p>
                  <p>
                    ReplyFlow eliminates this gap by maintaining a constant <span className="text-white font-bold">0.5s response time</span>, 24/7, across 50+ languages.
                  </p>
                </div>
              </div>

              <div className="relative p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent">
                <div className="rounded-[2.8rem] bg-[#0a0a0a] p-10 overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Lead Qualification Probability</div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-bold text-white/40 uppercase">Manual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#638de9]" />
                        <span className="text-[10px] font-bold text-white/40 uppercase">ReplyFlow</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-64 flex items-end gap-2">
                    {[...Array(24)].map((_, i) => {
                      const manualHeight = Math.max(10, 100 - i * 4);
                      const replyFlowHeight = 94 + (i % 3) * 2;
                      return (
                        <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${manualHeight}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.02 }}
                            className="w-full bg-red-500/20 group-hover:bg-red-500/40 transition-colors rounded-t-sm"
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${replyFlowHeight}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.02 }}
                            className="w-full bg-[#638de9] shadow-[0_0_15px_rgba(99,141,233,0.3)] rounded-t-sm"
                          />
                        </div>
                      );
                    })}
                    <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-[8px] font-black text-white/20 uppercase tracking-widest">
                      <span>1 min</span>
                      <span>10 mins</span>
                      <span>30 mins</span>
                      <span>1 hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 md:py-48 bg-white/[0.02] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6">Neural Pipeline</Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white">The reasoning layer.</h2>
          </div>
          <div className="flex gap-2 mb-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  Math.floor(Date.now() / 3000) % 5 === i ? "w-8 bg-[#638de9]" : "w-2 bg-white/10"
                )}
                animate={{
                  width: Math.floor(Date.now() / 3000) % 5 === i ? 32 : 8,
                  backgroundColor: Math.floor(Date.now() / 3000) % 5 === i ? "#638de9" : "rgba(255,255,255,0.1)"
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-12 px-6 overflow-hidden pb-12">
            <motion.div
              className="flex gap-12"
              animate={{
                x: [0, -2100],
              }}
              transition={{
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {[...Array(2)].map((_, groupIndex) => (
                <div key={groupIndex} className="flex gap-12">
                  {[
                    {
                      title: "Vectorization",
                      fact: "1,536 Dimensional Mapping",
                      desc: "Inbound messages are instantly tokenized and mapped into our high-dimensional vector space to understand semantic intent beyond simple keywords.",
                      stat: "Tokenized in 12ms"
                    },
                    {
                      title: "Sentiment Audit",
                      fact: "Emotional Tone Detection",
                      desc: "We analyze the underlying emotional tone and urgency of the lead. A 'need this now' is treated differently than a 'just browsing' query.",
                      stat: "99.4% Accuracy"
                    },
                    {
                      title: "Memory Recall",
                      fact: "Semantic Context Lookup",
                      desc: "The engine cross-references the query with your uploaded PDFs, Notion docs, and pricing sheets to find the exact, factual answer.",
                      stat: "Retrieving 50+ chunks"
                    },
                    {
                      title: "Response Synthesis",
                      fact: "Brand-Voice Mirroring",
                      desc: "Our model generates a response that isn't just correct, but sounds exactly like your top-performing sales rep using neural style transfer.",
                      stat: "Zero Hallucination"
                    },
                    {
                      title: "Execution",
                      fact: "Multi-Platform Delivery",
                      desc: "The final response is pushed through your chosen channels (WhatsApp/Email) and logged in your CRM (Salesforce/Hubspot) automatically.",
                      stat: "Logged to CRM"
                    }
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="min-w-[450px] p-12 rounded-[3rem] bg-black border border-white/5 group hover:border-[#638de9]/40 hover:bg-white/[0.01] transition-all duration-700 relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#638de9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                          <div className="text-sm font-black text-[#638de9] uppercase tracking-[0.4em]">Phase 0{i + 1}</div>
                          <div className="px-3 py-1 rounded-full bg-[#638de9]/10 border border-[#638de9]/20 text-[8px] font-black text-[#638de9] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            {step.stat}
                          </div>
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-6 group-hover:text-[#638de9] transition-colors leading-tight">{step.title}</h3>
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-bold text-white/40 uppercase tracking-widest mb-10 flex justify-between items-center group-hover:border-[#638de9]/20 transition-all">
                          {step.fact}
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Zap className="w-4 h-4 text-[#638de9]" />
                          </motion.div>
                        </div>
                        <p className="text-white/30 text-lg leading-relaxed group-hover:text-white/60 transition-colors font-medium">{step.desc}</p>
                      </div>

                      <div className="mt-12 flex gap-1 relative z-10">
                        {[...Array(20)].map((_, j) => (
                          <motion.div
                            key={j}
                            className="flex-1 h-1 bg-white/5 rounded-full"
                            animate={{
                              backgroundColor: i === Math.floor(Date.now() / 1000) % 5 ? ["rgba(255,255,255,0.05)", "#638de9", "rgba(255,255,255,0.05)"] : "rgba(255,255,255,0.05)"
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-[#638de9] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 w-0 group-hover:w-full" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Vignette overlays for smooth loop transition */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      <section className="py-20 md:py-48 px-6 bg-black relative overflow-hidden">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto relative z-10 text-center mb-24">
            <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6">Global Network</Badge>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">
              Live revenue <br />
              <span className="text-[#638de9]">intercepts.</span>
            </h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto">
              Our engine processes 100k+ interactions daily across every continent,
              maintaining sub-second latency regardless of distance.
            </p>
          </div>

          <div className="max-w-5xl mx-auto aspect-auto min-h-[350px] md:aspect-[16/9] md:min-h-0 rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full p-4 md:p-20 opacity-40">
                {/* Simulated Map points */}
                {[
                  { top: "30%", left: "20%", name: "San Francisco", recovery: "$12,400" },
                  { top: "45%", left: "48%", name: "London", recovery: "$8,200" },
                  { top: "60%", left: "75%", name: "Tokyo", recovery: "$15,100" },
                  { top: "25%", left: "80%", name: "Seoul", recovery: "$9,400" },
                  { top: "70%", left: "25%", name: "São Paulo", recovery: "$6,800" }
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="absolute"
                    style={{ top: point.top, left: point.left }}
                  >
                    <div className="w-3 h-3 bg-[#638de9] rounded-full animate-ping absolute inset-0" />
                    <div className="w-3 h-3 bg-[#638de9] rounded-full relative group" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 bg-white/[0.02] border border-white/10 p-3 rounded-xl pointer-events-none">
                      <div className="text-[8px] font-black uppercase text-[#638de9] tracking-widest">{point.name}</div>
                      <div className="text-lg font-black text-white">{point.recovery} recovered</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:bottom-8 md:left-8 p-4 md:p-6 rounded-xl md:rounded-2xl bg-black/60 md:bg-black/40 bg-white/[0.02] border border-white/10">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">System Throughput</div>
              <div className="text-xl md:text-2xl font-bold flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#638de9] animate-pulse" />
                1,242 <span className="text-white/20 text-xs md:text-sm font-medium">active intercepts/min</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="pricing" className="relative py-20 md:py-48 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Badge className="bg-[#638de9]/10 text-[#638de9] mb-4">Pricing</Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">Simple, transparent.</h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto">
              Choose the plan that fits your current revenue velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "0",
                desc: "Perfect for solopreneurs",
                features: ["100 Leads / mo", "Basic AI Chatbot", "Email Support", "1 User Seat"],
                cta: "Start for Free",
                href: "/signup"
              },
              {
                name: "Pro",
                price: "50",
                desc: "For growing sales teams",
                features: ["1,000 Leads / mo", "Neural Lead Scoring", "WhatsApp Integration", "Priority Support", "5 User Seats"],
                cta: "Go Pro",
                featured: true,
                href: "/signup"
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "Global revenue operations",
                features: ["Unlimited Leads", "Custom Model Training", "Dedicated Success Manager", "SLA & Security Audit", "Unlimited Seats"],
                cta: "Contact Sales",
                href: "/demo"
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                className={cn(
                  "relative p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2",
                  plan.featured
                    ? "bg-white/[0.03] border-[#638de9]/50 shadow-[0_0_80px_-20px_rgba(99,141,233,0.3)]"
                    : "bg-white/[0.01] border-white/5"
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-[#638de9] text-[10px] font-black uppercase tracking-widest text-black">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-bold text-white/50 mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-white">{plan.price === "Custom" ? "" : "$"}{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-white/30 text-sm">/month</span>}
                </div>
                <p className="text-white/40 text-sm mb-10 leading-relaxed">{plan.desc}</p>

                <ul className="space-y-4 mb-12">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-5 h-5 rounded-full bg-[#638de9]/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#638de9]" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold transition-all duration-500",
                    plan.featured ? "bg-[#638de9] text-black hover:bg-[#638de9]/90 hover:scale-[1.02]" : "text-white/70 border-white/10 hover:bg-white/5"
                  )}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 md:py-48 px-6 relative overflow-hidden bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6">The Journey</Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">ROI in <span className="text-[#638de9]">30 days.</span></h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto">
              Our implementation lifecycle is engineered for immediate impact and long-term scaling.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/5 hidden md:block" />

            <div className="space-y-16 md:space-y-32">
              {[
                {
                  day: "Day 01",
                  title: "Instant Ingestion",
                  desc: "Connect your entire stack. We map your lead fields and train the first neural weights on your historical CRM data.",
                  fact: "Setup completes in < 15 mins",
                  side: "left"
                },
                {
                  day: "Day 07",
                  title: "Performance Lock",
                  desc: "The engine reaches 95%+ brand alignment. Automated responses handle 100% of 'simple' queries and 60% of complex qualifications.",
                  fact: "1,200 leads processed avg.",
                  side: "right"
                },
                {
                  day: "Day 15",
                  title: "Neural Refinement",
                  desc: "Continuous learning kicks in. The AI begins identifying 'Hidden Intent' patterns in lead messages that your humans missed.",
                  fact: "35% conversion lift detected",
                  side: "left"
                },
                {
                  day: "Day 30",
                  title: "Revenue Zenith",
                  desc: "The system is fully autonomous. Your sales team only speaks to qualified, high-intent leads who are ready for a demo.",
                  fact: "ROI typically hits 10x+",
                  side: "right"
                }
              ].map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "200px" }}
                  className={cn("flex flex-col md:flex-row items-center gap-12", milestone.side === "right" ? "md:flex-row-reverse" : "")}
                >
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-2xl font-black text-[#638de9] mb-4 italic tracking-tighter">{milestone.day}</div>
                    <h3 className="text-3xl font-bold text-white mb-6">{milestone.title}</h3>
                    <p className="text-white/40 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">{milestone.desc}</p>
                    <div className="inline-block px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-[9px] font-black text-[#638de9] uppercase tracking-widest">
                      {milestone.fact}
                    </div>
                  </div>
                  <div className="relative z-10 hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#638de9]/50 flex items-center justify-center shadow-[0_0_20px_rgba(99,141,233,0.2)]">
                      <div className="w-3 h-3 bg-[#638de9] rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div>
                <Badge className="bg-[#638de9]/10 text-[#638de9] mb-6 px-4 py-1">Success Stories</Badge>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8">What teams are <br /><span className="text-[#638de9]">saying.</span></h2>
                <div className="flex gap-4 mb-12">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30">G2 Rating</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Retention</div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                {[
                  {
                    quote: "ReplyFlow turned our weekend lead response time from 48 hours to 30 seconds. Our conversion rate tripled in month one.",
                    author: "Alex Rivera",
                    role: "Head of Sales, TechFlow"
                  },
                  {
                    quote: "The neural lead scoring is scary accurate. It knows which leads are ready to buy before my reps even open their laptops.",
                    author: "Sarah Chen",
                    role: "COO, Global Logix"
                  }
                ].map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "200px" }}
                    transition={{ delay: i * 0.2 }}
                    className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-black border border-white/5 relative overflow-hidden group"
                  >
                    <div className="relative z-10">
                      <p className="text-xl font-medium text-white/80 italic mb-8 leading-relaxed">“{t.quote}”</p>
                      <div>
                        <div className="font-bold text-white">{t.author}</div>
                        <div className="text-sm text-white/30">{t.role}</div>
                      </div>
                    </div>
                    <Quote className="absolute top-8 right-8 w-16 h-16 text-white/[0.03] group-hover:text-[#638de9]/5 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="py-20 md:py-32 px-6 bg-white/[0.01]">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">Expert FAQ.</h2>
            </div>
            <div className="space-y-6">
              {[
                { q: "Is it really autonomous?", a: "Yes. Once you connect your data sources and train the AI, it handles initial outreach and qualifying questions without human intervention." },
                { q: "Does it integrate with my CRM?", a: "We have native integrations with Hubspot, Salesforce, and Pipedrive, plus a Zapier app for everything else." },
                { q: "How long is the setup?", a: "Most teams are up and running in under 15 minutes. It's designed to be zero-code." },
                { q: "What about data security?", a: "We are SOC2 compliant and use enterprise-grade encryption. Your data is used only for your specific AI model training." }
              ].map((item, i) => (
                <details key={i} className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] cursor-pointer transition-all duration-300 hover:border-[#638de9]/30">
                  <summary className="flex items-center justify-between font-bold text-white list-none">
                    {item.q}
                    <ChevronDown className="w-5 h-5 text-white/30 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="mt-4 text-white/40 leading-relaxed text-sm">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative py-24 md:py-64 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#638de9]/10 blur-[150px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-5xl md:text-[9rem] font-black tracking-tighter leading-none mb-12">
            Ready to <br />
            <span className="text-[#638de9]">dominate?</span>
          </h2>
          <p className="text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed px-4">
            Join 500+ high-growth teams using ReplyFlow to automate their revenue engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center px-4">
            <MagneticButton>
              <Button size="lg" className="bg-[#638de9] text-black hover:bg-[#638de9]/90 h-16 px-12 rounded-2xl text-lg font-bold shadow-2xl shadow-[#638de9]/20" asChild>
                <Link href="/signup">Start Your Free Trial</Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl text-lg font-bold border-white/10 text-white/70 hover:bg-white/5" asChild>
                <Link href="/demo">Book Demo</Link>
              </Button>
            </MagneticButton>
          </div>
          <p className="mt-12 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">No credit card required • Secure SOC2 Infrastructure</p>
        </motion.div>
      </section>

      <footer className="py-24 px-6 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-[#638de9] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Reply<span className="text-[#638de9]">Flow</span></span>
              </Link>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                The world's first autonomous revenue engine for high-growth B2B teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-white/40 font-medium">
                <li><Link href="#features" className="hover:text-[#638de9] transition-colors">Features</Link></li>
                <li><Link href="#intelligence" className="hover:text-[#638de9] transition-colors">Neural Engine</Link></li>
                <li><Link href="#pricing" className="hover:text-[#638de9] transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-[#638de9] transition-colors">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/40 font-medium">
                <li><Link href="/about" className="hover:text-[#638de9] transition-colors">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-[#638de9] transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-[#638de9] transition-colors">Careers</Link></li>
                <li><Link href="https://mail.google.com/mail/?view=cm&fs=1&to=rutwiksharma.1@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#638de9] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Connect</h4>
              <div className="flex gap-4">
                {[
                  { name: "Gmail", href: "https://mail.google.com/mail/?view=cm&fs=1&to=rutwiksharma.1@gmail.com", isEmail: true },
                  { name: "Twitter", href: "#", isEmail: false },
                  { name: "LinkedIn", href: "#", isEmail: false },
                  { name: "GitHub", href: "#", isEmail: false }
                ].map(social => (
                  <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-[#638de9]/10 hover:border-[#638de9]/30 transition-all">
                    <span className="sr-only">{social.name}</span>
                    {social.isEmail ? (
                      <Mail className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
                    ) : (
                      <div className="w-4 h-4 bg-white/20 rounded-sm" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">
              © 2024 ReplyFlow AI. All rights reserved. • Made by Rutwik Vadali
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
