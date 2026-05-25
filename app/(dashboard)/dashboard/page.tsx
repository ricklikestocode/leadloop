"use client"

import { motion } from "framer-motion"
import { StatCard } from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Clock, TrendingUp, MessageSquare, Zap, BrainCircuit, AlertCircle, Target, Flame, Trophy, Sparkles, Rocket, ChevronRight } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { getUserName, getWorkspaceAnalytics } from "@/actions/analytics"
import { AnalyticsCharts } from "@/components/AnalyticsCharts"
import { AIInsightsPanel } from "@/components/AIInsightsPanel"
import { triggerStaleFollowUps } from "@/actions/automation"
import { getWorkspaceSettings } from "@/actions/settings"
import { simulateIncomingLead as _simulateIncomingLead, runDemoJourney } from "@/actions/demo"
import { getStreakInfo, checkAndCelebrate } from "@/actions/streak"
import { StreakNotification } from "@/components/StreakNotification"
import { CelebrationHook } from "@/components/CelebrationHook"
import { AchievementBadges } from "@/components/AchievementBadges"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [userName, setUserName] = useState<string | undefined>("User")
  const [isLoading, setIsLoading] = useState(true)
  const [isTriggering, setIsTriggering] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const [isRunningDemo, setIsRunningDemo] = useState(false)
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState<any[]>([])
  const [celebration, setCelebration] = useState<string | null>(null)
  const [streakMilestone, setStreakMilestone] = useState<any>(null)
  const [showStreakModal, setShowStreakModal] = useState(false)

  const badgeIconMap: Record<string, any> = {
    'first_win': Target,
    'hot_starter': Flame,
    'ai_master': BrainCircuit,
    'conversion_expert': TrendingUp,
    'daily_driver': Zap,
  }

  const fetchData = useCallback(async () => {
    try {
      const [nameRes, analyticsRes, settingsRes, streakRes] = await Promise.all([
        getUserName(),
        getWorkspaceAnalytics("" as any),
        getWorkspaceSettings(),
        getStreakInfo(),
      ])

      if (nameRes.success) {
        setUserName(nameRes.name)
      }

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.analytics)
      }

      if (streakRes.success) {
        setStreak(streakRes.streak || 0)
        const mappedAchievements = (streakRes.achievements || []).map((badge: any) => ({
          ...badge,
          icon: badgeIconMap[badge.id] || Zap
        }))
        setAchievements(mappedAchievements)
        setCelebration(streakRes.celebration || null)
      }

      if (settingsRes.success && !settingsRes.settings?.businessDescription) {
        setNeedsOnboarding(true)
      } else {
        setNeedsOnboarding(false)
      }
    } catch (error) {
      console.error("Neural Fetch Error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkStreak = useCallback(async () => {
    try {
      const res = await checkAndCelebrate()
      if (res.success && res.milestone) {
        const milestoneIcons: any = {
          FIRST_WIN: { icon: Target, label: 'Initial Milestone', reward: 'Neural sync established!' },
          THREE_DAYS: { icon: Flame, label: 'Momentum Builder', reward: 'Operational excellence!' },
          SEVEN_DAYS: { icon: Trophy, label: 'Strategic Dominance', reward: 'Market authority confirmed!' },
          FOURTEEN_DAYS: { icon: Rocket, label: 'Industry Master', reward: 'Peak performance unlocked!' },
          THIRTY_DAYS: { icon: Rocket, label: 'Elite Partner', reward: 'Full system synergy!' },
        }
        const milestone = milestoneIcons[res.milestone as keyof typeof milestoneIcons]
        if (milestone) {
          setStreakMilestone({ ...milestone, streak: res.streak })
          setShowStreakModal(true)
        }
        toast.success(`🎉 Neural Milestone: ${res.streak} Day Sync established!`)
      }
    } catch (error) {
      console.error("Streak Engine Error:", error)
    }
  }, [])

  useEffect(() => {
    fetchData()
    checkStreak()
    const interval = setInterval(fetchData, 10000)
    const streakInterval = setInterval(checkStreak, 60000)
    return () => {
      clearInterval(interval)
      clearInterval(streakInterval)
    }
  }, [fetchData, checkStreak])

  const handleTriggerAutomation = async () => {
    setIsTriggering(true)
    try {
      await triggerStaleFollowUps(24)
      toast.success("System Pulse: Automations synchronized successfully.")
      await fetchData()
    } catch {
      toast.error("Bridge Error: Automation pulse failed.")
    } finally {
      setIsTriggering(false)
    }
  }

  const handleRunFullDemo = async () => {
    if (isRunningDemo) return
    setIsRunningDemo(true)
    toast.info("Initializing Neural Simulation Journey...", { 
      description: "Establishing high-velocity communication protocols.",
      duration: 3000 
    })

    try {
      const result = await runDemoJourney("" as any)
      if (result.success) {
        toast.success("Simulation Live: Monitor Neural Nodes in Feed.", { 
          icon: <Rocket className="w-4 h-4 text-primary" />,
          duration: 4000 
        })
        setTimeout(() => fetchData(), 2000)
      } else {
        toast.error(result.error || "Simulation Bridge Failure")
      }
    } catch (e: any) {
      toast.error("Internal Engine Fault")
    } finally {
      setIsRunningDemo(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <motion.div
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center"
        >
           <Zap className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Initializing Command Center</p>
      </div>
    )
  }

  const summary = analytics?.summary || {}
  const timeSaved = Math.max(5, Math.floor((summary.messagesCount || 0) * 0.12))
  const conversionTrend = summary.wonLeads > 0 ? "+45%" : "+0%"

  return (
    <div className="space-y-12 pb-24">
      <CelebrationHook 
        celebration={celebration}
        onDismiss={() => setCelebration(null)}
        autoClose={true}
        autoCloseDuration={5000}
      />

      {streakMilestone && (
        <StreakNotification
          isOpen={showStreakModal}
          milestone={streakMilestone}
          streak={streakMilestone.streak}
          icon={streakMilestone.icon}
          label={streakMilestone.label}
          reward={streakMilestone.reward}
          onClose={() => setShowStreakModal(false)}
        />
      )}

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[3rem] bg-black/40 border border-white/5 p-10 md:p-16 shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3 group-hover:rotate-6 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[10px] font-black text-green-500/80 uppercase tracking-[0.2em]">Neural Pulse: Active</span>
                   </div>
                   <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                     Operational <span className="text-primary text-glow-primary">Dominance</span>
                   </h1>
                   <p className="text-meaningful mt-2">Neural Link Established: {userName} • Response Protocol V2.4</p>
                </div>
              </motion.div>
              <p className="text-white/60 font-medium text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
                The AI reasoning engine has stabilized. Your communication pipeline is operating at <span className="text-white font-bold">peak velocity</span>.
              </p>
              
              <div className="flex flex-wrap gap-4">
                 <motion.button
                   onClick={handleTriggerAutomation}
                   disabled={isTriggering}
                   className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-primary/40 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Zap className={cn("w-4 h-4 text-primary", isTriggering && "animate-pulse")} />
                   Sync Protocols
                 </motion.button>
                 <Link href="/dashboard/chats">
                   <motion.button
                     className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     Active Feeds
                     <ChevronRight className="w-4 h-4" />
                   </motion.button>
                 </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full md:w-80">
                {[
                 { label: "Efficiency Gain", sub: "Time saved via AI", value: `${timeSaved}h`, icon: Clock, color: "text-cyan-400" },
                 { label: "Sync Momentum", sub: "Consecutive active days", value: `${streak}d`, icon: Flame, color: "text-orange-400" },
                 { label: "Growth Delta", sub: "Conversion rate lift", value: conversionTrend, icon: TrendingUp, color: "text-green-400" },
               ].map((item, idx) => (
                 <motion.div
                   key={item.label}
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.4 + (idx * 0.1) }}
                   className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl group/item hover:bg-white/[0.04] transition-all hover:scale-[1.02] hover:border-white/10"
                 >
                   <div className="flex items-center gap-3 mb-2">
                     <item.icon className={cn("w-4 h-4", item.color)} />
                     <div className="flex flex-col">
                       <span className="text-white/30 text-[9px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                       <span className="text-[8px] text-white/10 font-bold uppercase tracking-tighter mt-0.5">{item.sub}</span>
                     </div>
                   </div>
                   <div className="text-3xl font-black text-white">{item.value}</div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Onboarding & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {needsOnboarding && (
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-10 rounded-[2.5rem] bg-primary/[0.03] border border-primary/20 flex flex-col items-start gap-8 relative overflow-hidden group"
           >
             <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] group-hover:bg-primary/20 transition-all" />
             <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
               <BrainCircuit className="w-8 h-8 text-primary" />
             </div>
             <div>
               <h3 className="text-2xl font-black text-white mb-3">Intelligence Calibration</h3>
               <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                 Feed the neural engine with your business context to unlock high-fidelity AI reasoning and strategic auto-replies.
               </p>
             </div>
             <Link href="/dashboard/onboarding" className="w-full">
               <motion.button
                 className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-3xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                 whileHover={{ y: -2 }}
                 whileTap={{ scale: 0.98 }}
               >
                 Begin Calibration
               </motion.button>
             </Link>
           </motion.div>
         )}

         {achievements.length > 0 && (
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-10 rounded-[2.5rem] glass-panel border-white/5 flex flex-col gap-8"
           >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Trophy className="w-6 h-6 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Milestone Vault</h2>
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Achievements</span>
             </div>
             <AchievementBadges badges={achievements} />
           </motion.div>
         )}
      </div>

      {/* Intelligence Feed Actions */}
      {summary.totalLeads > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-[3rem] border-white/5"
        >
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Priority Transmissions</h2>
             </div>
             <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Response Optimization Required</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summary.activeConversations > 0 && (
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-br from-red-500/10 to-red-500/[0.02] border border-red-500/20 rounded-[2rem] p-8 flex flex-col justify-between gap-8 group cursor-pointer"
              >
                <div>
                  <div className="text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5" />
                     Critical Sync Required
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 leading-tight">
                    {summary.activeConversations} High-Value Nodes in Standby
                  </h4>
                  <p className="text-white/40 text-sm font-medium">
                    Neural engine suggests immediate response protocol for maximum conversion delta.
                  </p>
                </div>
                <Link href="/dashboard/chats">
                  <Button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                    Initiate Response
                  </Button>
                </Link>
              </motion.div>
            )}
            
            {summary.messagesCount > 0 && (
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/[0.02] border border-blue-500/20 rounded-[2rem] p-8 flex flex-col justify-between gap-8 group"
              >
                <div>
                  <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5" />
                     Synthesis Report
                  </div>
                  <h4 className="text-xl font-black text-white mb-2 leading-tight">
                    {summary.messagesCount} Transmissions Authenticated
                  </h4>
                  <p className="text-white/40 text-sm font-medium">
                    AI logic successfully converted {summary.wonLeads || 0} nodes to <span className="text-white font-bold">Qualified Lead</span> status.
                  </p>
                </div>
                <div className="w-full bg-blue-500/10 border border-blue-500/10 py-4 rounded-2xl flex items-center justify-center">
                   <div className="flex gap-2">
                      {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                   </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Nodes", value: summary.activeLeads || 0, icon: Users, trend: "+12%", color: "text-blue-400" },
          { label: "Logic Cycles", value: summary.messagesCount || 0, icon: MessageSquare, trend: "+24%", color: "text-purple-400" },
          { label: "Successful Synced", value: summary.wonLeads || 0, icon: Trophy, trend: "+8%", color: "text-amber-400" },
          { label: "Conversion Delta", value: `${summary.conversionRate || 0}%`, icon: Zap, trend: "+5%", color: "text-primary" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + (idx * 0.1) }}
          >
             <StatCard
               title={stat.label}
               value={stat.value}
               icon={stat.icon}
               trend={stat.trend}
               trendDirection="up"
               delay={0}
             />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          className="lg:col-span-2 glass-panel p-12 rounded-[3.5rem] border-white/5 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Growth Trajectory</h2>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Historical Neural Performance</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black text-white/60 uppercase">Nodes</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <span className="text-[10px] font-black text-white/60 uppercase">Cycles</span>
              </div>
            </div>
          </div>

          <AnalyticsCharts data={analytics?.daily || []} />
        </motion.div>

        <AIInsightsPanel />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Avg Latency", value: `${summary.responseTime || 0}ms`, icon: Clock, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Automated Replies", value: summary.aiRepliesCount || 0, icon: BrainCircuit, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
          { label: "Scheduled Follow-ups", value: summary.followUpsScheduled || 0, icon: Rocket, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            className="glass-panel p-10 rounded-[2.5rem] border-white/5 flex items-center gap-8 group hover:bg-white/[0.04] transition-all"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + (idx * 0.1) }}
            whileHover={{ y: -5 }}
          >
            <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 group-hover:rotate-6", item.bg, item.border)}>
              <item.icon className={cn("w-7 h-7", item.color)} />
            </div>
            <div>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
