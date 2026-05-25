"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  Brain, 
  BarChart3, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard,
  Users
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* ─── Steps Configuration ──────────────────────────────── */
const STEPS = [
  {
    id: "showcase",
    title: "Interactive Showcase",
    subtitle: "Experience the speed of ReplyFlow.",
    description: "Watch how our engine captures and processes leads in milliseconds.",
    icon: Zap,
    color: "#638de9"
  },
  {
    id: "simulation",
    title: "AI Simulation",
    subtitle: "Real-time reasoning.",
    description: "See the neural engine analyze intent, urgency, and sentiment.",
    icon: Brain,
    color: "#8e5cdb"
  },
  {
    id: "analytics",
    title: "Intelligence & Analytics",
    subtitle: "Data-driven growth.",
    description: "Visualize your conversion velocity and pipeline health.",
    icon: BarChart3,
    color: "#49d4ce"
  },
  {
    id: "dashboard",
    title: "Dashboard Preview",
    subtitle: "Your command center.",
    description: "A glimpse into the professional dashboard waiting for you.",
    icon: LayoutDashboard,
    color: "#ffffff"
  }
]

export default function DemoPage() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const currentStep = STEPS[currentStepIdx]

  const nextStep = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-20 max-w-2xl mx-auto">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center gap-4">
              <div 
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border",
                  idx <= currentStepIdx 
                    ? "bg-white text-black border-white shadow-lg" 
                    : "bg-white/5 text-white/20 border-white/5"
                )}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em]",
                idx <= currentStepIdx ? "text-white" : "text-white/20"
              )}>
                {step.id}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md mb-8">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentStep.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Step {currentStepIdx + 1} of 4</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                  {currentStep.title}
                </h1>
                <p className="text-xl text-white/40 font-medium mb-10 leading-relaxed max-w-lg">
                  {currentStep.description}
                </p>

                <div className="flex gap-4">
                  {currentStepIdx < STEPS.length - 1 ? (
                    <Button size="lg" onClick={nextStep} className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-14 font-bold group">
                      Next Step <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button size="lg" className="bg-[#638de9] text-white hover:bg-[#638de9]/90 rounded-full px-10 h-14 font-bold" asChild>
                      <Link href="/signup">
                        Get Full Access Now
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="text-white/40 hover:text-white hover:bg-white/5 rounded-full px-8 h-14 font-bold" asChild>
                    <Link href="/">Exit Demo</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Visuals */}
          <div className="relative aspect-square rounded-[3rem] bg-white/[0.02] border border-white/[0.05] p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStep.id === "showcase" && (
                <motion.div 
                  key="showcase-vis"
                  className="h-full flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="p-6 rounded-3xl bg-black border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Live Lead Intake</div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#638de9]/10 flex items-center justify-center text-[#638de9]">
                            <Users className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 w-24 bg-white/10 rounded-full mb-2" />
                            <div className="h-1.5 w-16 bg-white/5 rounded-full" />
                          </div>
                          <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">Captured</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep.id === "simulation" && (
                <motion.div 
                  key="sim-vis"
                  className="h-full flex flex-col justify-center gap-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative text-center">
                    <Brain className="w-32 h-32 text-[#8e5cdb] mx-auto mb-8 opacity-50" />
                    <div className="space-y-6 max-w-sm mx-auto">
                      {[
                        { label: "Intent Detection", val: 98 },
                        { label: "Sentiment Analysis", val: 94 },
                        { label: "Response Accuracy", val: 99 }
                      ].map((s, i) => (
                        <div key={i} className="space-y-2 text-left">
                          <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                            <span>{s.label}</span>
                            <span>{s.val}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#8e5cdb]"
                              style={{ width: `${s.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep.id === "analytics" && (
                <motion.div 
                  key="ana-vis"
                  className="h-full flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Rev Lift", val: "+312%", color: "#49d4ce" },
                      { label: "Time Saved", val: "14h/wk", color: "#638de9" },
                      { label: "Closure", val: "84%", color: "#8e5cdb" },
                      { label: "Satisfaction", val: "4.9/5", color: "#ffffff" }
                    ].map((s, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-black border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep.id === "dashboard" && (
                <motion.div 
                  key="dash-vis"
                  className="h-full flex flex-col gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="p-6 rounded-3xl bg-black border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-2 w-32 bg-white/20 rounded-full" />
                        <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-video rounded-2xl bg-white/5 border border-white/5" />
                      <div className="aspect-video rounded-2xl bg-white/5 border border-white/5" />
                      <div className="col-span-2 h-20 rounded-2xl bg-[#638de9]/10 border border-[#638de9]/20" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Enterprise Grade Interface</div>
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
