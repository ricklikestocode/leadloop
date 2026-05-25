"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, Smile, Paperclip, MoreVertical, CheckCheck, Zap, AlertCircle, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/PremiumComponents"
import { useState, useEffect } from "react"
import { sendMessage, getConversationMessages, saveAIReply, getSuggestedReply, discardSuggestedReply } from "@/actions/conversations"
import { convertConversationToLead } from "@/actions/leads"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { useRouter } from "next/navigation"
import { simulateIncomingLead, runDemoJourney } from "@/actions/demo"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Brain, BrainCircuit, Play, FastForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "other"
  timestamp: string
  read?: boolean
  avatar?: string
  name?: string
  reasoning?: string
  detectedIntent?: string
}

interface ChatUIProps {
  messages?: Message[]
  contactName?: string
  contactStatus?: "online" | "offline"
  conversationId?: string
  workspaceId?: string
  intent?: "HOT" | "WARM" | "COLD" | "DEAD"
  onMessageSent?: () => void
}

const defaultMessages: Message[] = []

export function ChatUI({ 
  messages: initialMessages = defaultMessages, 
  contactName = "Neural Node", 
  contactStatus = "online",
  conversationId,
  workspaceId,
  intent,
  onMessageSent
}: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiReply, setAiReply] = useState<string | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [isConvertingToLead, setIsConvertingToLead] = useState(false)
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(null)
  const [showDemoControls, setShowDemoControls] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isSendingAsLead, setIsSendingAsLead] = useState(false)
  const [aiReasoning, setAiReasoning] = useState<string | null>(null)
  const [aiIntent, setAiIntent] = useState<string | null>(null)
  const [suggestedReplyId, setSuggestedReplyId] = useState<string | null>(null)
  const router = useRouter()

  // Fetch real messages from database + poll for real-time updates
  const fetchMessages = async () => {
    if (!conversationId) return
    try {
      const result = await getConversationMessages(conversationId)
      if (result.success && result.messages) {
        const visibleMessages = result.messages.filter((msg: any) => msg.status !== "SUGGESTED")
        const formattedMessages = visibleMessages.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderType === "USER" ? "user" : "other",
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          name: msg.senderType !== "USER" ? contactName.split(" ")[0] : undefined,
          avatar: msg.senderType !== "USER" ? contactName.split(" ").map((n: string) => n[0]).join("") : undefined,
          reasoning: msg.reasoning,
          detectedIntent: msg.detectedIntent,
        }))
        setMessages(formattedMessages as Message[])

        const suggestionResult = await getSuggestedReply(conversationId)
        if (suggestionResult.success && suggestionResult.suggestion) {
          setAiReply(suggestionResult.suggestion.content)
          setSuggestedReplyId(suggestionResult.suggestion.id)
          setAiReasoning(suggestionResult.suggestion.reasoning)
          setAiIntent(suggestionResult.suggestion.detectedIntent)
        } else if (!suggestionResult.suggestion) {
          setAiReply(prev => suggestedReplyId ? null : prev)
        }
      }
    } catch (error) {
      console.error("Neural Fetch Error:", error)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 4000)
    return () => clearInterval(interval)
  }, [conversationId])

  const handleSend = async () => {
    if (inputValue.trim() && conversationId) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      }
      
      setMessages([...messages, newMessage])
      setInputValue("")
      setIsLoading(true)

      try {
        if (isSendingAsLead && workspaceId) {
          setIsTyping(true)
          const result = await simulateIncomingLead(
            workspaceId, 
            inputValue, 
            "1234567890", 
            contactName
          )
          
          if (!result.success) {
            setMessages(prev => prev.filter(m => m.id !== newMessage.id))
            toast.error("Neural Error: Simulation Failed")
          } else {
            setTimeout(() => {
              if (onMessageSent) onMessageSent()
              router.refresh()
              setIsTyping(false)
            }, 3000)
          }
        } else {
          const result = await sendMessage(conversationId, inputValue)
          
          if (!result.success) {
            setMessages(prev => prev.filter(m => m.id !== newMessage.id))
            toast.error("Bridge Error: Transmission Interrupted")
          } else {
            if (onMessageSent) onMessageSent()
            router.refresh()
          }
        }
      } catch (error) {
        setMessages(prev => prev.filter(m => m.id !== newMessage.id))
        toast.error("Fatal: Neural Bridge Collapse")
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.info("Protocols: Select active node to transmit.");
    }
  }

  const handleSimulateLead = async () => {
    if (!workspaceId) return
    setIsSimulating(true)
    try {
      const result = await simulateIncomingLead(workspaceId, "Hello, I am interested in your services.", "1234567890", "John Doe")
      if (result.success) {
        toast.success("Simulation Pulse Sent")
        router.refresh()
      } else {
        toast.error("Simulation Pulse Failed")
      }
    } catch (err) {
      toast.error("Transmission Error")
    } finally {
      setIsSimulating(false)
    }
  }

  const handleSimulateAction = async (msg: string, name: string) => {
    if (!workspaceId) return
    setIsSimulating(true)
    try {
      const result = await simulateIncomingLead(workspaceId, msg, "1234567890", name)
      if (result.success) {
        toast.success(`Protocol Triggered: ${name}`)
        router.refresh()
      }
    } catch (err) {
      toast.error("Action Failed")
    } finally {
      setIsSimulating(false)
    }
  }

  const handleDiscardSuggestion = async () => {
    if (!suggestedReplyId) return
    try {
      const res = await discardSuggestedReply(suggestedReplyId)
      if (res.success) {
        setAiReply(null)
        setSuggestedReplyId(null)
      }
    } catch (e) {
      toast.error("Protocol Reset Failed")
    }
  }

  const handleGenerateAIReply = async () => {
    if (!messages.length || !conversationId) return
    setIsGeneratingAI(true)
    setAiError(null)

    try {
      const response = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          userMessage: messages[messages.length-1].text,
          tone: "professional",
        }),
      })

      if (!response.ok) throw new Error("AI Engine Overload")
      const data = await response.json()
      if (data.success && data.reply) {
        setAiReply(data.reply)
        toast.success("AI Synthesis Complete", { icon: <Zap className="w-4 h-4" /> })
      } else {
        throw new Error(data.error || "Synthesis Failed")
      }
    } catch (error: any) {
      setAiError(error.message)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSendAIReply = async () => {
    if (!aiReply || !conversationId) return
    setIsLoading(true)
    try {
      const result = await saveAIReply(conversationId, aiReply, true)
      if (result.success) {
        setAiReply(null)
        setAiReasoning(null)
        if (onMessageSent) onMessageSent()
        toast.success("AI Transmission Authorized")
      } else {
        toast.error("Auth Error: " + result.error)
      }
    } catch (error) {
      toast.error("Internal Logic Error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvertToLead = async () => {
    if (!conversationId) return
    setIsConvertingToLead(true)
    try {
      const result = await convertConversationToLead(conversationId, { name: contactName })
      if (result.success && result.lead) {
        setConversionSuccess(`Lead "${result.lead.name}" ingested.`)
        toast.success("Lead Synchronization Successful")
        setTimeout(() => setConversionSuccess(null), 3000)
        router.refresh()
      } else {
        toast.error("Ingestion Failed: " + result.error)
      }
    } catch (error) {
      toast.error("System Fault: Lead Logic Error")
    } finally {
      setIsConvertingToLead(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Header */}
      <motion.div
        className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 bg-white/[0.02] z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/50 to-secondary flex items-center justify-center text-white font-black text-sm shadow-lg border border-white/10 group-hover:rotate-6 transition-transform">
              {contactName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center border border-white/10">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-black text-white text-base tracking-tight uppercase">{contactName}</h3>
              {intent && (
                <Badge className={cn(
                  "text-[8px] px-2 py-0.5 border-0 font-black tracking-widest uppercase rounded-full shadow-sm",
                  intent === 'HOT' ? 'bg-red-500/10 text-red-400' : 
                  intent === 'WARM' ? 'bg-orange-500/10 text-orange-400' : 
                  intent === 'COLD' ? 'bg-blue-500/10 text-blue-400' : 
                  'bg-white/5 text-white/20'
                )}>
                  {intent} Channel
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Sync Active</span>
               <div className="w-1 h-1 rounded-full bg-white/10" />
               <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em]">{contactStatus}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {conversationId && (
            <motion.button
              onClick={handleConvertToLead}
              disabled={isConvertingToLead}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-primary/40 rounded-xl transition-all text-[10px] font-black uppercase tracking-[0.15em] disabled:opacity-50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isConvertingToLead ? <LoadingSpinner /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>{isConvertingToLead ? "Ingesting..." : "Ingest Lead"}</span>
            </motion.button>
          )}
          <motion.button
            onClick={() => setShowDemoControls(!showDemoControls)}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all border",
              showDemoControls ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/[0.03] border-white/5 text-white/20 hover:text-white/60 hover:border-white/10'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <BrainCircuit className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-white/20 hover:text-white/60 hover:border-white/10 transition-all"
            whileHover={{ y: -2 }}
          >
            <MoreVertical className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Demo Controls */}
      <AnimatePresence>
        {showDemoControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/[0.02] border-b border-primary/10 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Neural Debug Console</p>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                    <input 
                      type="checkbox" 
                      id="sendAsLead"
                      checked={isSendingAsLead}
                      onChange={(e) => setIsSendingAsLead(e.target.checked)}
                      className="w-3.5 h-3.5 cursor-pointer accent-primary"
                    />
                    <label htmlFor="sendAsLead" className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black cursor-pointer select-none hover:text-white/60 transition-colors">Internal Mode: Spoof Lead Identity</label>
                  </div>
               </div>
               <div className="flex gap-3">
                  {[
                    { label: "Trigger Lead", icon: Play, action: handleSimulateLead },
                    { label: "Pricing Scenario", icon: Zap, action: () => handleSimulateAction("What are your plans?", "Inquirer") },
                    { label: "Hot Lead Scenario", icon: FastForward, action: () => handleSimulateAction("I want to start today!", "Closer") },
                  ].map((btn) => (
                    <motion.button
                      key={btn.label}
                      onClick={btn.action}
                      disabled={isSimulating}
                      className="flex-1 flex items-center justify-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all disabled:opacity-30"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <btn.icon className="w-3 h-3" />
                      {btn.label}
                    </motion.button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-6 flex flex-col">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: index === messages.length - 1 ? 0 : 0 }}
            >
              <div className={cn(
                "max-w-[80%] flex gap-4",
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {message.sender === "other" && (
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 text-[10px] font-black text-white/40 shadow-sm">
                    {message.avatar}
                  </div>
                )}
                <div className={cn(
                  "flex flex-col gap-2",
                  message.sender === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-lg relative overflow-hidden border",
                    message.sender === "user" 
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white border-primary shadow-primary/10 rounded-tr-none" 
                      : "bg-white/[0.03] border-white/10 text-white/80 backdrop-blur-xl rounded-tl-none"
                  )}>
                    {message.id.startsWith('demo') && <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Spoof transmission</p>}
                    <p className="font-medium tracking-tight">{message.text}</p>
                    
                    {message.reasoning && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                           <BrainCircuit className="w-3 h-3" />
                           Neural Strategy
                        </p>
                        <p className="text-[11px] text-white/30 italic leading-relaxed">{message.reasoning}</p>
                      </div>
                    )}
                    
                    <div className={cn("flex items-center gap-3 mt-3", message.sender === "user" ? "justify-end" : "justify-start")}>
                       <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{message.timestamp}</span>
                       {message.detectedIntent && (
                         <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 uppercase tracking-widest">
                           {message.detectedIntent}
                         </span>
                       )}
                       {message.read && message.sender === "user" && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {(isTyping || isSimulating) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 items-center pl-2"
            >
               <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <div className="flex gap-1">
                     {[0, 1, 2].map(i => (
                       <motion.div 
                         key={i} 
                         className="w-1 h-1 rounded-full bg-primary/40" 
                         animate={{ opacity: [0.2, 1, 0.2] }} 
                         transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                       />
                     ))}
                  </div>
               </div>
               <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">AI Reasoning...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        className="p-8 pt-0 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-panel p-2 rounded-[2.5rem] bg-black/40 border-white/10 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.03] to-transparent pointer-events-none" />
           
           {/* AI Suggestions Panel */}
           <AnimatePresence>
             {aiReply && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="px-6 py-6 mb-2 border-b border-white/5 bg-primary/[0.01]"
               >
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                       <Zap className="w-4 h-4 text-primary fill-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Draft Proposal</span>
                       {aiIntent && (
                         <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-widest border border-primary/20 ml-2">
                           Target: {aiIntent}
                         </span>
                       )}
                    </div>
                    <button onClick={handleDiscardSuggestion} className="text-[9px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors">Discard</button>
                 </div>
                 
                 {aiReasoning && (
                   <div className="mb-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-primary/80 font-black uppercase tracking-[0.1em] mb-2 flex items-center gap-2">
                        <Brain className="w-3 h-3" />
                        AI Strategic Logic
                      </p>
                      <p className="text-[11px] text-white/30 italic leading-relaxed">{aiReasoning}</p>
                   </div>
                 )}

                 <textarea
                   value={aiReply}
                   onChange={(e) => setAiReply(e.target.value)}
                   className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm text-white/80 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all resize-none font-medium mb-4 shadow-inner"
                   rows={3}
                 />
                 
                 <motion.button
                   onClick={handleSendAIReply}
                   disabled={isLoading}
                   className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                   whileHover={{ scale: 1.01, y: -2 }}
                   whileTap={{ scale: 0.99 }}
                 >
                   {isLoading ? "Transmitting..." : "Authorize Transmission"}
                 </motion.button>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex items-center gap-4 px-4 py-2">
              <motion.button 
                className="w-10 h-10 flex items-center justify-center rounded-xl text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
                whileHover={{ rotate: 15 }}
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>

              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Neural Input Bridge..."
                className="flex-1 bg-transparent border-0 text-white placeholder:text-white/10 text-sm font-medium focus:ring-0 focus:outline-none py-4"
              />

              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {inputValue === "" && !aiReply && conversationId && (
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      onClick={handleGenerateAIReply}
                      disabled={isGeneratingAI}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-lg transition-all",
                        isGeneratingAI && "animate-pulse"
                      )}
                      whileHover={{ scale: 1.1, rotate: 15 }}
                    >
                      {isGeneratingAI ? <LoadingSpinner /> : <Zap className="w-5 h-5 fill-current" />}
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-xl",
                    inputValue.trim() ? "bg-primary text-white shadow-primary/20" : "bg-white/[0.02] text-white/10"
                  )}
                  whileHover={inputValue.trim() ? { scale: 1.1, x: 2 } : {}}
                  whileTap={inputValue.trim() ? { scale: 0.9 } : {}}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
           </div>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-6">
           {["Explain pricing", "Suggest next step", "Confirm demo"].map((chip) => (
             <motion.button
               key={chip}
               onClick={() => setInputValue(chip)}
               className="text-[9px] font-black uppercase tracking-[0.25em] text-white/20 hover:text-primary transition-colors flex items-center gap-2 group"
               whileHover={{ y: -1 }}
             >
               <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
               {chip}
             </motion.button>
           ))}
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 blur-[150px] pointer-events-none -z-10" />
    </div>
  )
}

// Example Chat Page
export function ExampleChatPage() {
  return (
    <div className="h-full flex flex-col">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <GlassCard className="h-full">
          <ChatUI />
        </GlassCard>
      </motion.div>
    </div>
  )
}
