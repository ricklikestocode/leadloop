"use client"

import { PageHeader } from "@/components/PageHeader"
import { StatCard } from "@/components/StatCard"
import { GlassCard, PremiumSection, AnimatedList } from "@/components/PremiumComponents"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Example Dashboard Page
import { Users, TrendingUp, Clock, MessageSquare, Plus, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

// Example Dashboard Page
export default function DashboardExample() {
  const recentLeads = [
    { id: 1, name: "Acme Corp", status: "INTERESTED", lastActivity: "2 hours ago" },
    { id: 2, name: "Tech Startup", status: "WON", lastActivity: "1 day ago" },
    { id: 3, name: "Global Industries", status: "NEGOTIATION", lastActivity: "3 hours ago" },
    { id: 4, name: "Small Business", status: "NEW", lastActivity: "Just now" },
  ]

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your performance overview"
        action={
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              New Lead
            </Button>
          </motion.div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Leads"
          value="1,247"
          icon={Users}
          trend="+12% from last week"
          delay={0}
        />
        <StatCard
          title="Conversion Rate"
          value="34.2%"
          icon={TrendingUp}
          trend="+2.3% from last week"
          delay={0.1}
        />
        <StatCard
          title="Avg Response Time"
          value="2.4h"
          icon={Clock}
          trend="-15% faster"
          trendDirection="down"
          delay={0.2}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Leads */}
        <div className="lg:col-span-2">
          <PremiumSection title="Recent Leads" accent>
            <GlassCard gloss className="divide-y divide-white/10">
              <AnimatedList
                items={recentLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {lead.name}
                      </p>
                      <p className="text-xs text-foreground-muted">{lead.lastActivity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{lead.status}</Badge>
                      <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors" />
                    </div>
                  </motion.div>
                ))}
              />
            </GlassCard>
          </PremiumSection>
        </div>

        {/* Quick Actions */}
        <div>
          <PremiumSection title="Quick Actions">
            <div className="space-y-3">
              {[
                { icon: Users, label: "Import Leads" },
                { icon: MessageSquare, label: "Send Bulk Message" },
                { icon: TrendingUp, label: "View Reports" },
              ].map((action, index) => {
                const Icon = action.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </PremiumSection>
        </div>
      </div>

      {/* Activity Timeline */}
      <PremiumSection title="Activity Timeline" accent>
        <GlassCard gloss>
          <div className="p-6 space-y-4">
            {[
              { title: "New Lead Added", description: "Acme Corp was added to your pipeline", time: "2h ago" },
              { title: "Message Sent", description: "Follow-up message sent to Tech Startup", time: "4h ago" },
              { title: "Deal Closed", description: "Contract signed with Global Industries", time: "1d ago" },
            ].map((event, index) => (
              <motion.div
                key={index}
                className="flex gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-foreground-muted">{event.description}</p>
                  <p className="text-xs text-foreground-muted mt-1">{event.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </PremiumSection>
    </>
  )
}
