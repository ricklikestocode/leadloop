"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  User,
  Bot,
  Send,
  Loader,
  AlertCircle,
  TrendingUp,
  Users,
  Zap,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: "Analyze my leads", prompt: "Analyze my current leads pipeline and tell me which ones need attention most urgently." },
  { icon: Users, label: "Write a follow-up", prompt: "Help me write a persuasive follow-up message for a warm lead who hasn't responded in 3 days." },
  { icon: Zap, label: "Improve conversions", prompt: "What are the top 3 things I should do this week to improve my lead conversion rate?" },
  { icon: BrainCircuit, label: "Sales coaching", prompt: "Give me a brief sales coaching tip for handling price objections effectively." },
];

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      text: "👋 Hi! I'm your ReplyFlow Founder Copilot. I have full context on your business, leads, and pipeline.\n\nAsk me anything — lead strategy, sales copy, pipeline analysis, or growth tips.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setShowQuickPrompts(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: messageText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();

      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.message || "I'm having trouble thinking right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || "Connection lost. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleClearChat = () => {
    setMessages([{
      id: "welcome",
      text: "👋 Hi! I'm your ReplyFlow Founder Copilot. Ask me anything about your leads, pipeline, or sales strategy.",
      sender: "ai",
      timestamp: new Date(),
    }]);
    setShowQuickPrompts(true);
    setError(null);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center text-white z-[100] border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? {} : {
          boxShadow: [
            "0 0 20px rgba(99,102,241,0.4)",
            "0 0 35px rgba(99,102,241,0.6)",
            "0 0 20px rgba(99,102,241,0.4)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
            className="fixed bottom-28 right-8 w-[420px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-140px)] flex flex-col z-[100] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl bg-slate-900/90"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Founder Copilot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Workspace-Aware AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  className="text-[10px] text-white/30 hover:text-white/60 transition-colors font-medium uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  Clear
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white hover:bg-white/5 rounded-full w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full gap-3",
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border mt-0.5",
                    msg.sender === "user"
                      ? "bg-primary/20 border-primary/30"
                      : "bg-white/5 border-white/10"
                  )}>
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-white/60" />
                    )}
                  </div>

                  <div className={cn(
                    "max-w-[82%] space-y-1",
                    msg.sender === "user" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                        : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-white/20 font-medium px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Quick Prompts — shown when no user messages yet */}
              {showQuickPrompts && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest px-1">Quick Actions</p>
                  {QUICK_PROMPTS.map((qp) => {
                    const Icon = qp.icon;
                    return (
                      <button
                        key={qp.label}
                        onClick={() => handleQuickPrompt(qp.prompt)}
                        disabled={isLoading}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group disabled:opacity-50"
                      >
                        <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                        <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors font-medium">{qp.label}</span>
                        <ChevronRight className="w-3 h-3 text-white/20 ml-auto group-hover:text-white/40 transition-colors" />
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mt-0.5">
                    <Loader className="w-3.5 h-3.5 text-primary animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/30">Thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 bg-white/[0.02] border-t border-white/5 shrink-0">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about leads, strategy, or sales..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-center text-white/15 mt-3 font-medium uppercase tracking-widest">
                Powered by your workspace data
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
