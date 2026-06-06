"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageHeader } from "@/components/PageHeader"
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  AlertTriangle, 
  User, 
  Mail, 
  Phone, 
  ChevronRight, 
  ExternalLink,
  Loader2,
  ListTodo
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFollowUps, completeFollowUp } from "@/actions/follow-ups"
import { toast } from "sonner"
import Link from "next/link"

export default function FollowUpsPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "COMPLETED" | "TODAY" | "WEEK">("PENDING")

  const fetchTasks = async () => {
    setLoading(true)
    try {
      let daysFrom: number | undefined
      let daysTo: number | undefined
      let status: string | undefined

      if (filter === "PENDING") {
        status = "PENDING"
      } else if (filter === "COMPLETED") {
        status = "COMPLETED"
      } else if (filter === "TODAY") {
        status = "PENDING"
        daysFrom = 0
        daysTo = 0
      } else if (filter === "WEEK") {
        status = "PENDING"
        daysFrom = 0
        daysTo = 7
      }

      const res = await getFollowUps({ status, daysFrom, daysTo })
      if (res.success && res.followUps) {
        setTasks(res.followUps)
      } else {
        toast.error(res.error || "Failed to load follow-up tasks.")
      }
    } catch (err) {
      toast.error("Error loading tasks.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await completeFollowUp(id)
      if (res.success) {
        toast.success("Task completed!")
        // Remove completed task from list or update it
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "COMPLETED", completedAt: new Date() } : t))
      } else {
        toast.error(res.error || "Failed to complete task.")
      }
    } catch (err) {
      toast.error("Error updating task status.")
    }
  }

  const getDueLabel = (dateStr: string, status: string) => {
    if (status === "COMPLETED") return { label: "Completed", style: "text-green-400 bg-green-500/10 border-green-500/20" }
    
    const dueDate = new Date(dateStr)
    dueDate.setHours(0,0,0,0)
    const today = new Date()
    today.setHours(0,0,0,0)
    
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, style: "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse font-black" }
    } else if (diffDays === 0) {
      return { label: "Due Today", style: "text-amber-400 bg-amber-500/10 border-amber-500/20 font-black" }
    } else if (diffDays === 1) {
      return { label: "Due Tomorrow", style: "text-primary bg-primary/10 border-primary/20" }
    } else {
      return { label: `Due in ${diffDays} days`, style: "text-white/40 bg-white/5 border-white/10" }
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          title="Smart Tasks"
          subtitle="Real-time, AI-suggested lead follow-ups and scheduled outreach tasks."
        />
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4">
        {[
          { id: "PENDING", label: "Pending Tasks" },
          { id: "TODAY", label: "Due Today" },
          { id: "WEEK", label: "This Week" },
          { id: "COMPLETED", label: "Completed" },
          { id: "ALL", label: "All Tasks" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              filter === tab.id 
                ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                : "bg-white/5 border-white/5 text-white/50 hover:text-white/80 hover:bg-white/[0.08]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="min-h-[40vh] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Syncing Tasks...</span>
            </div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {tasks.map((task, idx) => {
                const due = getDueLabel(task.dueDate, task.status)
                return (
                  <motion.div
                    key={task.id}
                    className="glass-panel p-6 rounded-3xl border border-white/5 bg-primary/[0.01] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                  >
                    <div className="space-y-4">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-4">
                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${due.style}`}>
                          {due.label}
                        </span>
                        
                        {task.status !== "COMPLETED" && (
                          <motion.button
                            onClick={() => handleCompleteTask(task.id)}
                            className="p-1 rounded-lg text-white/20 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </motion.button>
                        )}
                      </div>

                      {/* Lead Details */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Lead Details</span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                            <User className="h-4 w-4 text-white/60" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">{task.lead?.name || "Unknown Lead"}</h4>
                            <p className="text-[10px] text-white/40 font-bold">{task.lead?.company || "No Company"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Info */}
                      <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/70 font-semibold flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-5 mt-5 border-t border-white/5 flex gap-2.5">
                      <Link href={`/dashboard/leads/${task.leadId}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-9 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[9px] font-black uppercase tracking-widest"
                        >
                          Details
                          <ExternalLink className="h-3 w-3 ml-1.5" />
                        </Button>
                      </Link>

                      {task.lead?.email && (
                        <a href={`mailto:${task.lead.email}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-white/5 border border-white/5 hover:border-primary/20 text-white/60 hover:text-primary"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-white/10 rounded-3xl bg-primary/[0.005]">
            <ListTodo className="h-10 w-10 text-white/20 mb-4" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">No follow-ups found</h3>
            <p className="text-xs text-white/40 max-w-sm leading-relaxed">
              {filter === "PENDING" 
                ? "Excellent! All follow-up tasks are completed. Run Lead Intelligence on new leads to schedule smart tasks automatically."
                : "No follow-up tasks match this filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
