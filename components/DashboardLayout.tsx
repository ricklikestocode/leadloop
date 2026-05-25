"use client"

import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content */}
        <motion.main
          className="flex-1 overflow-y-auto scrollable"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  )
}
