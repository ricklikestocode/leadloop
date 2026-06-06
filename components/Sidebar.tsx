"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Clock, Settings, LogOut, Zap, PlayCircle, Share2, CreditCard, Cpu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [workspaceName, setWorkspaceName] = useState<string>("Your Workspace")
  const [workspacePlan, setWorkspacePlan] = useState<string>("FREE")
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    // Fetch real workspace info
    const fetchWorkspace = async () => {
      try {
        const res = await fetch("/api/workspace/info")
        if (res.ok) {
          const data = await res.json()
          if (data.name) setWorkspaceName(data.name)
          if (data.plan) setWorkspacePlan(data.plan)
        }
      } catch {
        // fail silently
      }
    }
    if (session?.user) fetchWorkspace()
  }, [session])

  const isActive = (path: string) => {
    return pathname === path || (path !== "/dashboard" && pathname.startsWith(path))
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: BarChart3, active: isActive("/dashboard") && pathname === "/dashboard" },
    { href: "/dashboard/chats", label: "Messages", icon: Zap, active: isActive("/dashboard/chats") },
    { href: "/dashboard/leads", label: "Lead Pipeline", icon: Users, active: isActive("/dashboard/leads") },
    { href: "/dashboard/automation", label: "Automation Center", icon: Cpu, active: isActive("/dashboard/automation") },
    { href: "/dashboard/follow-ups", label: "Smart Tasks", icon: Clock, active: isActive("/dashboard/follow-ups") },
    { href: "/dashboard/billing", label: "Billing & Plans", icon: CreditCard, active: isActive("/dashboard/billing") },
    { href: "/dashboard/settings", label: "Account Settings", icon: Settings, active: isActive("/dashboard/settings") },
  ]

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "??"

  const handleStartDemo = async () => {
    if (isSimulating) return
    setIsSimulating(true)
    try {
      router.push("/dashboard/chats")
      // Small delay then toast instruction
      setTimeout(() => {
        toast.info("Demo Mode — Click the 🧠 brain icon in any chat to activate demo controls.", {
          duration: 6000,
        })
        setIsSimulating(false)
      }, 800)
    } catch {
      setIsSimulating(false)
    }
  }

  const handleInvite = () => {
    const userId = session?.user?.email || "user"
    const referralId = btoa(userId).substring(0, 8)
    const inviteLink = `${window.location.origin}/signup?ref=${referralId}`
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied! Share it to earn rewards.", { duration: 3000 })
    }).catch(() => {
      toast.error("Could not copy to clipboard.")
    })
  }

  const planColor = workspacePlan === "PRO"
    ? "text-primary/80"
    : workspacePlan === "ENTERPRISE"
    ? "text-yellow-400/80"
    : "text-white/30"

  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen w-72 glass-panel border-r-0 rounded-r-[2.5rem] flex flex-col z-50 overflow-hidden shadow-2xl"
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-transparent to-primary/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 blur-[100px] -z-10" />
      
      {/* Logo */}
      <div className="p-10 pb-6">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <motion.div 
            className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20 group-hover:rotate-12 transition-all duration-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Zap className="w-7 h-7 fill-current" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white group-hover:tracking-tight transition-all duration-500">ReplyFlow</span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70">Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1.5 mt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3
              }
            }
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.href}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-500 group relative overflow-hidden",
                    item.active
                      ? "text-white shadow-xl shadow-primary/10"
                      : "text-white/30 hover:text-white/80 hover:bg-white/[0.03]"
                  )}
                >
                  {item.active && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-2 border-primary"
                      layoutId="active-pill"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-500 relative z-10",
                    item.active ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : "group-hover:scale-110 group-hover:text-white/60"
                  )} />
                  <span className="relative z-10 tracking-wide uppercase text-[10px] font-black">{item.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </nav>

      {/* Quick Actions Container */}
      <div className="px-6 space-y-3 mt-4 mb-4">
        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-6 mb-2">Simulations</div>
        <motion.button
          onClick={handleStartDemo}
          disabled={isSimulating}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-primary border border-primary/20 hover:bg-primary/10 transition-all group disabled:opacity-60 relative overflow-hidden animate-pulse-glow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Zap className={cn("w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10", isSimulating && "animate-spin")} />
          <span className="relative z-10">{isSimulating ? "Syncing Logic..." : "Initialize Neural SIM"}</span>
        </motion.button>
        
        <motion.button
          onClick={handleInvite}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-white/40 hover:text-white/80 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
           <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Share2 className="w-5 h-5 group-hover:scale-110 group-hover:-rotate-12 transition-transform relative z-10" />
          <span className="relative z-10">Network Expansion</span>
        </motion.button>
      </div>

      {/* Real User Info */}
      <div className="px-6 py-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
         <motion.div 
           className="glass-panel p-4 rounded-2xl border-white/10 bg-white/[0.03] relative group cursor-pointer hover:bg-white/[0.06] transition-all shadow-lg"
           whileHover={{ y: -2 }}
         >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/50 to-secondary flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
                 {userInitials}
               </div>
               <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-xs font-black text-white truncate group-hover:text-primary transition-colors">{workspaceName}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className={cn("text-[9px] font-black uppercase tracking-widest truncate", planColor)}>
                      {workspacePlan} Active
                    </span>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

      {/* Logout Area */}
      <div className="px-6 pb-10">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 group-hover:text-red-500 transition-all" />
          Logout
        </button>
      </div>
    </motion.div>
  )
}
