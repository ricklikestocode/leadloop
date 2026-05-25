"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, AlertCircle } from "lucide-react"
import { login } from "@/actions/auth"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await login({ email, password }, callbackUrl)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true)
    signIn(provider, { callbackUrl })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md glass-panel p-10 rounded-[2.5rem] relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Zap className="w-7 h-7 fill-current" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white">ReplyFlow</span>
          </Link>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-white">Welcome Back</h1>
          <p className="text-white/40 font-medium">Continue your journey to sales excellence.</p>
        </div>

        {(error || urlError) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error || urlError}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Email Address</label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-1">Password</label>
              <Link href="#" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all"
              required
            />
          </div>

          <div className="flex items-center gap-3 ml-1">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-5 h-5 rounded-lg border-white/10 bg-white/5 checked:bg-primary transition-all cursor-pointer" 
            />
            <label htmlFor="remember" className="text-sm font-medium text-white/40 cursor-pointer select-none">
              Keep me signed in
            </label>
          </div>

          <Button 
            type="submit"
            className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-bold shadow-xl shadow-white/5 transition-all button-shine mt-4" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
            <span className="px-4 bg-[#0a0a0a] text-white/20">Or Securely Login With</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white font-bold transition-all" 
            disabled={isLoading}
            onClick={() => handleSocialLogin("google")}
          >
            Google
          </Button>
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/60 hover:text-white font-bold transition-all" 
            disabled={isLoading}
            onClick={() => handleSocialLogin("github")}
          >
            GitHub
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm font-medium text-white/40 mt-10">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Create Free Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
