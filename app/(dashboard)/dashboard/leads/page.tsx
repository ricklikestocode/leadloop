"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getLeads } from "@/actions/leads"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Lead {
  id: string
  name: string
  email?: string | null
  company?: string | null
  status: string
  lastContactedAt?: Date | null
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        const filters = searchQuery ? { search: searchQuery } : undefined
        const result = await getLeads(filters)
        
        if (result.success && result.leads) {
          setLeads(result.leads)
          setError(null)
        } else {
          setError(result.error || "Failed to load leads")
          setLeads([])
        }
      } catch (err) {
        console.error("Neural Pipeline Error:", err)
        setError("Synchronization failure in lead pipeline.")
        setLeads([])
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchLeads()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleAddLead = () => {
    router.push("/dashboard/leads/new")
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "NEW":
        return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]" }
      case "IN_PROGRESS":
        return { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "shadow-[0_0_15px_rgba(249,115,22,0.1)]" }
      case "CLOSED":
        return { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "shadow-[0_0_15px_rgba(34,197,94,0.1)]" }
      case "LOST":
        return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "" }
      default:
        return { color: "text-white/40", bg: "bg-white/5", border: "border-white/10", glow: "" }
    }
  }

  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A"
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "Transmitting Today"
    if (days === 1) return "Cycle: Yesterday"
    if (days < 7) return `${days} Cycles Ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="space-y-12 pb-24 relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2"
      >
        <div>
           <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
             Neural <span className="text-primary">Pipeline</span>
           </h1>
           <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Active Node Management & Strategic Ingestion</p>
        </div>
        <div className="flex gap-4">
          <motion.button 
            onClick={handleAddLead}
            className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 flex items-center gap-4"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Ingest Node
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search neural nodes..." 
            className="h-14 pl-12 rounded-2xl bg-black/40 border-white/5 text-sm focus:border-primary/40 focus:ring-primary/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest flex items-center gap-4"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-6">
           <motion.div
             animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center"
           >
             <Users className="w-8 h-8 text-primary" />
           </motion.div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Pipeline Data</p>
        </div>
      ) : leads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 glass-panel rounded-[3rem] border-white/5"
        >
          <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-8 rotate-6">
            <Users className="w-10 h-10 text-white/10" />
          </div>
          <h3 className="text-white font-black text-xl uppercase tracking-widest mb-4">No Active Nodes</h3>
          <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em] mb-10">The communication pipeline is currently silent.</p>
          <Button 
            onClick={handleAddLead}
            className="bg-primary text-white px-10 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:shadow-2xl shadow-primary/20"
          >
            Initialize First Ingestion
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="glass-panel rounded-[3rem] overflow-hidden border-white/10 shadow-2xl bg-black/40"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 h-20 pl-12">Identification</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 h-20">Network / Entity</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 h-20">Sync Status</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 h-20">Telemetry</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 h-20 text-right pr-12">Protocols</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, idx) => {
                const status = getStatusConfig(lead.status)
                const formatDate = (date?: Date | string | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
                  <TableRow 
                    key={lead.id} 
                    className="border-white/5 hover:bg-white/[0.03] transition-all group cursor-pointer"
                    onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                  >
                    <TableCell className="pl-12 h-24">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/5 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:text-primary transition-all duration-500">
                          {lead.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tight group-hover:text-primary transition-colors">{lead.name}</span>
                          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{lead.email || "No Protocol Link"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-black text-white/40 uppercase tracking-widest">{lead.company || "Independent Node"}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] border-0",
                        status.bg, status.color, status.glow
                      )}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{formatDate(lead.lastContactedAt)}</TableCell>
                    <TableCell className="text-right pr-12" onClick={(e) => e.stopPropagation()}>
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </motion.button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  )
}
