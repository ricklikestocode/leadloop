"use client"

import { motion } from "framer-motion"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { BarChart3, Zap } from "lucide-react"
import Link from "next/link"

interface AnalyticsChartsProps {
  data: any[]
}

// Format date field from WorkspaceAnalytics for display
function formatChartData(data: any[]) {
  return data.map((item) => ({
    name: item.date
      ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : item.name || "Today",
    leads: item.newLeads ?? item.leads ?? 0,
    messages: item.followUpsSent ?? item.messages ?? 0,
  }))
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const chartData = formatChartData(data)

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="w-full h-[300px] flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.01] gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-primary/60" />
        </div>
        <div className="text-center">
          <p className="text-white/60 font-bold text-base mb-1">No Analytics Data Yet</p>
          <p className="text-white/30 text-sm max-w-[240px] leading-relaxed">
            Simulate a lead or connect WhatsApp to start seeing performance metrics.
          </p>
        </div>
        <Link href="/dashboard/chats">
          <motion.button
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold hover:bg-primary/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-4 h-4" />
            Simulate First Lead
          </motion.button>
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ffffff20", fontSize: 12 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F1115",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#3B82F6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorLeads)"
            dot={false}
            activeDot={{ r: 5, fill: "#3B82F6" }}
          />
          <Area
            type="monotone"
            dataKey="messages"
            name="Follow-ups"
            stroke="#8B5CF6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorMessages)"
            dot={false}
            activeDot={{ r: 5, fill: "#8B5CF6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
