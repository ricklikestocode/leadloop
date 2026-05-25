"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Zap, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#intelligence", label: "Intelligence" },
    { href: "#pricing", label: "Pricing" },
    { href: "/demo", label: "Demo" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && pathname === "/") {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      setIsOpen(false)
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/[0.05] py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#638de9] flex items-center justify-center shadow-lg shadow-[#638de9]/20 group-hover:scale-110 transition-transform">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Reply<span className="text-[#638de9]">Flow</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a 
                key={item.href} 
                href={item.href} 
                onClick={(e) => handleScroll(e, item.href)}
                className="text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-semibold text-white/70 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 h-10 text-xs font-bold" asChild>
            <Link href="/signup">
              Get Started
            </Link>
          </Button>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white ml-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/[0.05] p-6 space-y-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold uppercase tracking-widest text-white/50"
              >
                {item.label}
              </Link>
            ) : (
              <a 
                key={item.href} 
                href={item.href} 
                onClick={(e) => handleScroll(e, item.href)}
                className="block text-sm font-semibold uppercase tracking-widest text-white/50"
              >
                {item.label}
              </a>
            )
          ))}
          <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-4">
            <Link href="/sign-in" className="text-sm font-semibold text-white/70">Sign In</Link>
            <Button className="bg-white text-black w-full rounded-full h-12 font-bold" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
