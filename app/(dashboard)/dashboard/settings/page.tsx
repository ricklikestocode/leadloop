"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Save, Zap, BrainCircuit, Users, ChevronRight, Sparkles, Target, TrendingUp } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getWorkspaceSettings, updateWorkspaceSettings, analyzeBusinessAction, refineBusinessIntelligenceAction } from "@/actions/settings"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = useState(false)
  const [_settings, setSettings] = useState<any>(null)
  const [autoReply, setAutoReply] = useState(false)
  const [phoneId, setPhoneId] = useState("")
  const [token, setToken] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [businessTone, setBusinessTone] = useState("PROFESSIONAL")
  const [pricingInfo, setPricingInfo] = useState("")
  const [servicesInfo, setServicesInfo] = useState("")
  const [conversionGoal, setConversionGoal] = useState("BOOK_CALL")
  const [businessDescription, setBusinessDescription] = useState("")
  const [tonePreference, setTonePreference] = useState("")
  const [businessAnalysis, setBusinessAnalysis] = useState<any>(null)
  const [isRefining, setIsRefining] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getWorkspaceSettings()
      if (result.success && result.settings) {
        setSettings(result.settings)
        setAutoReply(result.settings.autoReplyEnabled)
        setPhoneId(result.settings.whatsappBusinessPhoneId || "")
        setToken(result.settings.whatsappAccessToken || "")
        setBusinessName(result.settings.businessName || "")
        setBusinessType(result.settings.businessType || "")
        setTargetAudience(result.settings.targetAudience || "")
        setBusinessTone(result.settings.businessTone || "PROFESSIONAL")
        setPricingInfo(result.settings.pricingInfo || "")
        setServicesInfo(result.settings.servicesInfo || "")
        setConversionGoal(result.settings.conversionGoal || "BOOK_CALL")
        setBusinessDescription(result.settings.businessDescription || "")
        setTonePreference(result.settings.tonePreference || "")
        setBusinessAnalysis(result.settings.businessAnalysis ? JSON.parse(result.settings.businessAnalysis) : null)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateWorkspaceSettings({
        autoReplyEnabled: autoReply,
        whatsappBusinessPhoneId: phoneId,
        whatsappAccessToken: token,
        businessName,
        businessType,
        targetAudience,
        businessTone,
        pricingInfo,
        servicesInfo,
        conversionGoal,
        businessDescription,
        tonePreference,
      })
      if (result.success) {
        toast.success("Neural Calibration Saved", {
          description: "Internal communication protocols have been synchronized."
        })
      } else {
        toast.error("Calibration Failure", {
          description: result.error
        })
      }
    } catch (err: any) {
      toast.error("Bridge Connection Fault")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-12 max-w-6xl pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
          Neural <span className="text-primary">Calibration</span>
        </h1>
        <p className="text-white/30 font-black uppercase tracking-[0.4em] text-[10px]">Configure Logic Engines & Integration Protocols</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Account Settings */}
        <motion.div
          className="glass-panel p-10 rounded-[3rem] border-white/5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-10">
             <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/5 flex items-center justify-center group-hover:border-primary/40 transition-colors">
               <Users className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
             </div>
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Identity Profile</h3>
               <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Account & Personal Node Details</p>
             </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Entity Name</label>
              <Input 
                placeholder="Full Name" 
                defaultValue={session?.user?.name || ""} 
                className="h-14 rounded-2xl bg-black/40 border-white/5 text-white font-medium focus:border-primary/40 focus:ring-primary/20 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Protocol Address</label>
              <Input 
                placeholder="email@example.com" 
                defaultValue={session?.user?.email || ""} 
                disabled 
                className="h-14 rounded-2xl bg-black/20 border-white/5 text-white/20 font-medium" 
              />
            </div>
          </div>
        </motion.div>

        {/* WhatsApp & AI Automation */}
        <motion.div
          className="glass-panel p-10 rounded-[3rem] border-white/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-10">
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
               <Zap className="w-5 h-5 text-primary animate-pulse" />
             </div>
             <div>
               <h3 className="text-xl font-black text-white uppercase tracking-tight">Automation Bridge</h3>
               <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">External Communication Protocols</p>
             </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/5">
              <div>
                <p className="text-white font-black text-xs uppercase tracking-widest mb-1">Auto-Response Protocol</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">AI will synchronize transmissions</p>
              </div>
              <button 
                onClick={() => setAutoReply(!autoReply)}
                className={cn(
                  "w-14 h-7 rounded-full p-1 transition-all duration-500",
                  autoReply ? 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10'
                )}
              >
                <motion.div 
                  className="w-5 h-5 bg-white rounded-full shadow-2xl"
                  animate={{ x: autoReply ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Business Node ID</label>
              <Input 
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                placeholder="Meta Business Phone ID" 
                className="h-14 rounded-2xl bg-black/40 border-white/5 text-white font-medium focus:border-primary/40 focus:ring-primary/20 transition-all" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Authentication Key</label>
              <Input 
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Meta System User Token" 
                className="h-14 rounded-2xl bg-black/40 border-white/5 text-white font-medium focus:border-primary/40 focus:ring-primary/20 transition-all" 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sales Personalization */}
      <motion.div
        className="glass-panel p-12 rounded-[3.5rem] border-white/5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
             <BrainCircuit className="w-6 h-6 text-primary" />
           </div>
            <div>
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Intelligence Parameters</h3>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Refining Your AI Brand Persona</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Brand Name / Identity</label>
              <Input 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corp" 
                className="h-14 rounded-2xl bg-black/40 border-white/5 text-white font-medium focus:border-primary/40 transition-all" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Industry Sector</label>
              <Input 
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Real Estate Agency, SaaS, Law Firm" 
                className="h-14 rounded-2xl bg-black/40 border-white/5 text-white font-medium" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Communication Tone</label>
              <div className="relative">
                <select 
                  value={businessTone}
                  onChange={(e) => setBusinessTone(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-black/40 border border-white/5 text-white px-6 appearance-none focus:outline-none focus:border-primary/40 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  <option value="PROFESSIONAL">Professional / Systematic</option>
                  <option value="CASUAL">Casual / Relatable</option>
                  <option value="FRIENDLY">Friendly / Empathetic</option>
                  <option value="AGRESSIVE">Aggressive / High Velocity</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 rotate-90 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Primary Objective</label>
              <div className="relative">
                <select 
                  value={conversionGoal}
                  onChange={(e) => setConversionGoal(e.target.value)}
                  className="w-full h-14 rounded-2xl bg-black/40 border border-white/5 text-white px-6 appearance-none focus:outline-none focus:border-primary/40 focus:ring-primary/20 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                >
                  <option value="BOOK_CALL">Schedule Consultations</option>
                  <option value="SIGNUP">New User Signups</option>
                  <option value="PURCHASE">Direct Product Sales</option>
                  <option value="INFO">General Information Request</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Target Network Profile</label>
              <textarea 
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Identify your primary market nodes..." 
                className="w-full h-28 rounded-2xl bg-black/40 border border-white/5 text-white p-6 focus:outline-none focus:border-primary/40 focus:ring-primary/20 transition-all resize-none font-medium text-sm" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Offer Inventory</label>
              <textarea 
                value={servicesInfo}
                onChange={(e) => setServicesInfo(e.target.value)}
                placeholder="Specify your value transmission channels..." 
                className="w-full h-28 rounded-2xl bg-black/40 border border-white/5 text-white p-6 focus:outline-none focus:border-primary/40 focus:ring-primary/20 transition-all resize-none font-medium text-sm" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Business Vision & Context</label>
              <textarea 
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your business mission and core value..." 
                className="w-full h-28 rounded-2xl bg-black/40 border border-white/5 text-white p-6 focus:outline-none focus:border-primary/40 focus:ring-primary/20 transition-all resize-none font-medium text-sm" 
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Business Intelligence Visualizer */}
      <motion.div
        className="glass-panel p-12 rounded-[3.5rem] border border-primary/20 bg-black/40 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center">
               <Zap className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tight">Structured Synthesis</h3>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">AI-Derived Strategic Intelligence</p>
             </div>
          </div>
          <motion.button
            onClick={async () => {
              setIsRefining(true)
              const res = await refineBusinessIntelligenceAction()
              if (res.success) {
                setBusinessAnalysis(res.analysis)
                toast.success("Intelligence Refined", {
                  description: "Derived insights from latest conversation cycles."
                })
              }
              setIsRefining(false)
            }}
            disabled={isRefining || !businessAnalysis}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRefining ? "Synthesizing..." : "Refine Logic"}
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>

        {businessAnalysis ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all"
            >
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Value Prop
              </p>
              <p className="text-white/60 text-sm leading-relaxed font-medium">{businessAnalysis.key_value_proposition}</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all"
            >
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Audience Link
              </p>
              <p className="text-white/60 text-sm leading-relaxed font-medium">{businessAnalysis.target_audience}</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all"
            >
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Strategic Flow
              </p>
              <p className="text-white/60 text-sm leading-relaxed font-medium">{businessAnalysis.sales_strategy}</p>
            </motion.div>
            
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-6">Identified Query Nodes</p>
                <ul className="space-y-4">
                  {businessAnalysis.common_customer_questions?.map((q: string, i: number) => (
                    <li key={i} className="text-white/50 text-xs font-medium flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.02]">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em] mb-6">Resistance Handling</p>
                <ul className="space-y-4">
                  {businessAnalysis.objections?.map((o: string, i: number) => (
                    <li key={i} className="text-white/50 text-xs font-medium flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.02]">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10">
            <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] flex items-center justify-center mx-auto mb-8">
              <BrainCircuit className="w-8 h-8 text-white/10" />
            </div>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8">No Synthesis Data Available</p>
            <Button 
              onClick={async () => {
                setIsRefining(true)
                const res = await analyzeBusinessAction()
                if (res.success) setBusinessAnalysis(res.analysis)
                setIsRefining(false)
              }}
              className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]"
            >
              Initiate Initial Analysis
            </Button>
          </div>
        )}
      </motion.div>

      {/* Footer Actions */}
      <motion.div 
        className="flex items-center justify-between pt-10 border-t border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className="h-14 px-10 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase tracking-[0.3em] transition-all"
          onClick={() => signOut({ callbackUrl: "/" })}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-4">
             <LogOut className="w-4 h-4" />
             Deactivate Node
          </div>
        </motion.button>

        <motion.button 
          type="submit"
          disabled={isSaving}
          className="h-14 px-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-4"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSaving ? (
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Synchronizing...
             </div>
          ) : (
            <div className="flex items-center gap-4">
              <Save className="w-4 h-4" />
              Commit Calibration
            </div>
          )}
        </motion.button>
      </motion.div>
    </form>
  )
}

