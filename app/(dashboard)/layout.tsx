"use client"

import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { OnboardingModal } from "@/components/dashboard/OnboardingModal"
import { FloatingAIChat } from "@/components/FloatingAIChat"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="flex h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-72 relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[100px] -z-10 pointer-events-none" />
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <motion.main
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </motion.main>
      </div>

      {/* Floating AI Assistant */}
      <FloatingAIChat />

      {/* Onboarding Flow */}
      <OnboardingModal />

    </motion.div>
  )
}
