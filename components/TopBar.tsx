"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Settings, User, LogOut, Zap } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function TopBar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { data: session } = useSession()

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "U"

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count || 0)
        }
      } catch {
        // fail silently
      }
    }
    if (session?.user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  return (
    <motion.div
      className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-10 sticky top-0 z-40 shadow-xl"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Left: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-2xl -z-10" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-all duration-300" />
          <Input
            type="text"
            placeholder="Neural Search... (Cmd + K)"
            className="h-12 pl-12 bg-white/[0.02] border-white/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 rounded-2xl text-sm placeholder:text-white/20 transition-all duration-500 w-full font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
             <kbd className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-white/40 shadow-sm">⌘</kbd>
             <kbd className="px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-white/40 shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 ml-10">
        {/* Quick Action */}
        <Button className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white border-0 shadow-lg shadow-primary/20 rounded-xl h-10 px-5 text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-[0.98]" asChild>
          <Link href="/dashboard/leads">
             <Zap className="w-3 h-3 fill-current" />
             Acquire Lead
          </Link>
        </Button>

        <div className="h-6 w-px bg-white/10 mx-2" />

        {/* Notifications */}
        <Link href="/dashboard/settings">
          <motion.button
            className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center relative group hover:bg-white/[0.08] hover:border-white/20 transition-all shadow-sm"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-primary border-2 border-black flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                >
                  <span className="text-[9px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </Link>

        {/* Profile Menu */}
        <div className="relative">
          <motion.button
            className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all shadow-sm group"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center text-white text-xs font-black shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] border border-white/10 group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
            <div className="flex flex-col items-start min-w-0">
               <span className="text-xs font-black text-white leading-none mb-1 truncate max-w-[100px]">{session?.user?.name || "Member"}</span>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Verified</span>
               </div>
            </div>
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" 
                  onClick={() => setShowProfileMenu(false)} 
                />
                <motion.div
                  className="absolute right-0 mt-4 w-72 glass-panel rounded-[2rem] p-5 z-50 overflow-hidden shadow-2xl border-white/10 bg-black/60 backdrop-blur-3xl"
                  initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "top right" }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <div className="mb-4 pb-4 border-b border-white/5">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Workspace Account</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                           <User className="w-5 h-5 text-white/40" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-white truncate">{session?.user?.name}</p>
                           <p className="text-[10px] text-white/30 truncate">{session?.user?.email}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { icon: User, label: "My Profile", href: "/dashboard/settings" },
                      { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
                    ].map((item) => (
                      <Link key={item.label} href={item.href} onClick={() => setShowProfileMenu(false)}>
                        <motion.button 
                          className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/[0.04] rounded-xl flex items-center gap-3 transition-all group"
                          whileHover={{ x: 4 }}
                        >
                          <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                          {item.label}
                        </motion.button>
                      </Link>
                    ))}
                    
                    <div className="h-px bg-white/5 my-3" />
                    
                    <motion.button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all group"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
