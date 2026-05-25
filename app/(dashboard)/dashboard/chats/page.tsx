"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/PageHeader"
import { ChatUI } from "@/components/ChatUI"
import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { getUserConversations } from "@/actions/conversations"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Zap, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { simulateIncomingLead } from "@/actions/demo"
import { toast } from "sonner"

function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: any
  isSelected: boolean
  onClick: () => void
}) {
  const intentConfig = {
    HOT: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]"
    },
    WARM: {
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]"
    },
    COLD: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]"
    },
    DEAD: {
      color: "text-white/20",
      bg: "bg-white/5",
      border: "border-white/10",
      glow: ""
    },
  }[conversation.intent as string] || { color: "text-white/20", bg: "bg-white/5", border: "border-white/10", glow: "" }

  const name = conversation.lead?.name || conversation.title || "Anonymous Lead"
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-3xl transition-all group relative overflow-hidden mb-2 border",
        isSelected
          ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/10"
          : "hover:bg-white/[0.04] border-transparent hover:border-white/10"
      )}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 transition-all duration-500 relative overflow-hidden shadow-lg",
          isSelected 
            ? "bg-gradient-to-br from-primary to-primary/60 text-white rotate-3" 
            : "bg-white/[0.05] text-white/40 group-hover:text-white/60 group-hover:rotate-3"
        )}>
           {isSelected && <motion.div className="absolute inset-0 bg-white/20 blur-xl" animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />}
           <span className="relative z-10">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className={cn(
              "text-sm font-black truncate tracking-tight transition-colors",
              isSelected ? "text-white" : "text-white/60 group-hover:text-white/90"
            )}>
              {name}
            </p>
            {conversation.intent && (
              <Badge className={cn("text-[8px] px-2 py-0.5 h-4 border-0 font-black tracking-[0.1em] uppercase rounded-full shadow-sm", intentConfig.bg, intentConfig.color, intentConfig.glow)}>
                {conversation.intent}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
             <p className="text-[10px] font-bold text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-widest">
               {conversation.messageCount || 0} Interactions
             </p>
          </div>
        </div>
      </div>
      {isSelected && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]"
          layoutId="conv-indicator-premium"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

function ChatsContent() {
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"

  const fetchConversations = useCallback(async () => {
    try {
      const result = await getUserConversations()
      if (result.success && result.conversations) {
        setConversations(result.conversations)
        setWorkspaceId(result.workspaceId || null)
        if (result.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(result.conversations[0])
        }
      }
    } catch (err: any) {
      console.error("Error loading conversations:", err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedConversation])

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 5000)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSimulateNewLead = async () => {
    if (!workspaceId) {
      toast.error("Security: No workspace hash detected. Complete onboarding first.")
      return
    }
    setIsSimulating(true)
    try {
      const result = await simulateIncomingLead(workspaceId)
      if (result.success) {
        toast.success("Neural Engine: Incoming Lead Processed", {
          description: "AI is synchronizing communication protocols...",
          icon: <Zap className="w-4 h-4 text-primary" />,
        })
        setTimeout(async () => {
          const res = await getUserConversations()
          if (res.success && res.conversations) {
            setConversations(res.conversations)
            if (res.conversations[0]) {
              setSelectedConversation(res.conversations[0])
            }
          }
          setIsSimulating(false)
        }, 2500)
      } else {
        toast.error(result.error || "Neural Sync Failed")
        setIsSimulating(false)
      }
    } catch (e) {
      toast.error("Internal Engine Error")
      setIsSimulating(false)
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between px-2"
      >
        <PageHeader
          title="Neural Conversations"
          subtitle="Manage your hyper-intelligent lead communication pipeline."
        />
        <div className="flex gap-4 pb-2">
          <motion.button
            onClick={handleSimulateNewLead}
            disabled={isSimulating}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-primary/40 transition-all text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-50 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={cn("w-2 h-2 rounded-full bg-primary", isSimulating && "animate-ping")} />
            {isSimulating ? "Syncing Logic..." : "Simulate Lead"}
          </motion.button>
          
          <Link href="/dashboard/leads">
            <motion.button
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary text-white hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.4)] transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              Ingest Lead
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-[3rem] border-white/5 relative overflow-hidden bg-white/[0.01]">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />
          <motion.div
             animate={{ 
               scale: [1, 1.1, 1],
               opacity: [0.3, 0.6, 0.3]
             }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center mb-6"
          >
             <Zap className="w-10 h-10 text-primary" />
          </motion.div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Initializing Neural Net</p>
        </div>
      ) : (
        <motion.div
          className="flex-1 flex gap-8 overflow-hidden"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Conversation List */}
          <div className="w-[340px] shrink-0 glass-panel rounded-[3rem] flex flex-col overflow-hidden border-white/10 bg-black/40 shadow-2xl">
            <div className="p-8 pb-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.25em] mb-1">Intelligence Feed</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Channels</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <span className="text-[10px] font-black text-primary">{conversations.length}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2 scrollbar-hide">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-6 px-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center rotate-6">
                    <MessageSquare className="w-8 h-8 text-white/10" />
                  </div>
                  <div>
                    <p className="text-white/40 text-[11px] font-black uppercase tracking-widest">No active transmissions</p>
                    <p className="text-white/10 text-[9px] uppercase tracking-widest mt-2 leading-relaxed">Simulate a lead to initialize the neural communication bridge.</p>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                >
                  {conversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <ConversationListItem
                        conversation={conv}
                        isSelected={selectedConversation?.id === conv.id}
                        onClick={() => setSelectedConversation(conv)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Simulation trigger at bottom */}
            {workspaceId && (
              <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <button
                  onClick={handleSimulateNewLead}
                  disabled={isSimulating}
                  className="w-full text-[9px] text-white/20 hover:text-primary transition-all font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 py-3 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-primary/5 disabled:opacity-50 group"
                >
                  <Zap className={cn("w-3 h-3 group-hover:fill-primary transition-all", isSimulating && "animate-pulse")} />
                  {isSimulating ? "Neural Syncing..." : "Simulate Incoming lead"}
                </button>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 glass-panel rounded-[3rem] overflow-hidden border-white/10 bg-black/20 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] pointer-events-none" />
            
            {isDemoMode && !selectedConversation ? (
              <ChatUI
                contactName="Neural Prototype"
                contactStatus="online"
                workspaceId={workspaceId || undefined}
              />
            ) : selectedConversation ? (
              <ChatUI
                contactName={selectedConversation.lead?.name || "Neural Contact"}
                contactStatus="online"
                conversationId={selectedConversation.id}
                workspaceId={workspaceId || undefined}
                intent={selectedConversation.intent}
                onMessageSent={fetchConversations}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-8 relative z-10 px-10">
                <motion.div 
                  className="w-24 h-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center border border-primary/20 shadow-2xl relative group"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Users className="w-10 h-10 text-primary/60 relative z-10" />
                </motion.div>
                <div className="text-center max-w-sm">
                  <h3 className="text-white font-black text-xl uppercase tracking-widest mb-3">Bridge Standby</h3>
                  <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                    Select a neural node from the feed or initialize a new lead simulation to start the AI reasoning pipeline.
                  </p>
                </div>
                <motion.button
                  onClick={handleSimulateNewLead}
                  disabled={isSimulating}
                  className="flex items-center gap-3 px-8 py-4 rounded-3xl bg-primary text-white font-black uppercase tracking-[0.25em] text-[10px] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className={cn("w-4 h-4", isSimulating && "animate-spin")} />
                  {isSimulating ? "Syncing..." : "Initialize Transmission"}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoadingSpinner /></div>}>
      <ChatsContent />
    </Suspense>
  )
}
