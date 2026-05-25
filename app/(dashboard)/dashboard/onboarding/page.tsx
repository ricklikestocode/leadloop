"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Rocket, Target, DollarSign, ArrowRight, Loader2, Globe, ShoppingBag, Briefcase, BarChart3, Phone, PlayCircle, ShieldCheck, ClipboardCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { getWorkspaceSettings, updateWorkspaceSettings, analyzeBusinessAction } from "@/actions/settings"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function OnboardingPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [step, setStep] = useState(1)
  
  // Form fields
  const [businessType, setBusinessType] = useState("SAAS")
  const [businessName, setBusinessName] = useState("")
  const [businessDescription, setBusinessDescription] = useState("")
  const [servicesInfo, setServicesInfo] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [dealSize, setDealSize] = useState("5000-50000")
  const [teamSize, setTeamSize] = useState("1-5")
  const [businessTone, setBusinessTone] = useState("PROFESSIONAL")
  const [conversionGoal, setConversionGoal] = useState("BOOK_CALL")
  const [pricingInfo, setPricingInfo] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getWorkspaceSettings()
      if (result.success && result.settings) {
        setBusinessName(result.settings.workspace.name || "")
        setBusinessDescription(result.settings.businessDescription || "")
        setServicesInfo(result.settings.servicesInfo || "")
        setBusinessTone(result.settings.businessTone || "PROFESSIONAL")
        setConversionGoal(result.settings.conversionGoal || "BOOK_CALL")
      }
    }
    fetchSettings()
  }, [])

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!businessDescription) {
      alert("Business Description is required")
      return
    }

    setIsSaving(true)
    try {
      const updateResult = await updateWorkspaceSettings({
        businessDescription,
        servicesInfo,
        businessTone,
        conversionGoal,
        pricingInfo,
        businessType,
        tonePreference: `${teamSize} team. Targeting ${targetAudience}. Deal size: $${dealSize}. Tone: ${businessTone}.`
      })

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Failed to update settings")
      }

      const analysisResult = await analyzeBusinessAction()
      
      if (analysisResult.success) {
        router.push("/dashboard?onboarded=true")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const businessTypes = [
    { id: "SAAS", label: "SaaS Product", icon: Rocket },
    { id: "SERVICES", label: "Services/Agency", icon: Target },
    { id: "CONSULTING", label: "Consulting", icon: BarChart3 },
    { id: "ECOMMERCE", label: "E-commerce", icon: ShoppingBag },
    { id: "OTHER", label: "Other", icon: Briefcase },
  ]

  const dealSizes = [
    { id: "1000-5000", label: "$1K - $5K", desc: "SMB/Starter" },
    { id: "5000-50000", label: "$5K - $50K", desc: "Mid-market" },
    { id: "50000-500000", label: "$50K - $500K", desc: "Enterprise" },
    { id: "500000+", label: "$500K+", desc: "Strategic" },
  ]

  const teamSizes = [
    { id: "1-5", label: "Solopreneur/Small", desc: "1-5 people" },
    { id: "5-25", label: "Growing Team", desc: "5-25 people" },
    { id: "25-100", label: "Medium", desc: "25-100 people" },
    { id: "100+", label: "Enterprise", desc: "100+ people" },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                {step === 1 && "What do you sell?"}
                {step === 2 && "Who's your ideal customer?"}
                {step === 3 && "How big are your deals?"}
                {step === 4 && "Describe your business"}
                {step === 5 && "What's your sales style?"}
                {step === 6 && "Deployment Ready"}
              </h1>
              <p className="text-white/60 text-sm mt-2">
                {step === 1 && "We'll personalize your AI sales engine for your business model."}
                {step === 2 && "Help us understand your target market."}
                {step === 3 && "This affects how we score and prioritize leads."}
                {step === 4 && "Give your AI context about what you do."}
                {step === 5 && "Let's fine-tune AI response strategy."}
                {step === 6 && "Your AI is ready to start closing deals."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-primary">{step}</div>
              <div className="text-white/40 text-xs font-bold">of 6</div>
            </div>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 6) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* STEP 1: Business Type */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessTypes.map(type => (
                <motion.button
                  key={type.id}
                  onClick={() => setBusinessType(type.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    businessType === type.id 
                      ? "border-primary bg-primary/10" 
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="mb-4">
                    <type.icon className={cn("w-8 h-8 transition-colors", businessType === type.id ? "text-primary" : "text-white/40")} />
                  </div>
                  <div className="font-bold text-white text-sm uppercase tracking-widest">{type.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: Target Audience */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Who are you selling to?
              </label>
              <Input
                placeholder="e.g., B2B SaaS founders, Marketing agencies, E-commerce stores"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="h-12 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-primary"
              />
              <p className="text-white/40 text-xs mt-2">
                This helps AI tailor messages for your specific audience.
              </p>
            </div>

            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Team size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {teamSizes.map(size => (
                  <motion.button
                    key={size.id}
                    onClick={() => setTeamSize(size.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      teamSize === size.id 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="font-bold text-white text-sm">{size.label}</div>
                    <div className="text-white/40 text-xs">{size.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Deal Size */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
              Typical deal value
            </label>
            <div className="grid grid-cols-2 gap-3">
              {dealSizes.map(size => (
                <motion.button
                  key={size.id}
                  onClick={() => setDealSize(size.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    dealSize === size.id 
                      ? "border-primary bg-primary/10" 
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="font-bold text-white">{size.label}</div>
                  <div className="text-white/40 text-xs mt-1">{size.desc}</div>
                </motion.button>
              ))}
            </div>
            <p className="text-white/40 text-xs">
              This helps AI prioritize high-value opportunities for you.
            </p>
          </motion.div>
        )}

        {/* STEP 4: Business Description */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Business name
              </label>
              <Input
                placeholder="e.g., Acme SaaS"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-12 rounded-xl border border-white/20 bg-white/5 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                What do you do? (Be specific)
              </label>
              <textarea
                placeholder="e.g., We help B2B SaaS companies automate their sales outreach using AI. Our tool integrates with WhatsApp and handles lead qualification automatically, saving sales teams 10+ hours per week while improving conversion rates by 40%."
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="w-full h-32 rounded-xl border border-white/20 bg-white/5 text-white placeholder:text-white/40 p-4 focus:border-primary"
              />
              <p className="text-white/40 text-xs mt-2">
                Your AI uses this to generate highly relevant responses. More detail = better replies.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 5: Sales Style */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Your communication style
              </label>
              <div className="space-y-3">
                {[
                  { id: "PROFESSIONAL", label: "Professional & Formal", desc: "Enterprise-focused, consultative approach" },
                  { id: "CASUAL", label: "Casual & Friendly", desc: "Approachable, conversational tone" },
                  { id: "AGGRESSIVE", label: "Direct & Sales-Focused", desc: "Get to the point, close quickly" },
                ].map(tone => (
                  <motion.button
                    key={tone.id}
                    onClick={() => setBusinessTone(tone.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      businessTone === tone.id 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="font-bold text-white">{tone.label}</div>
                    <div className="text-white/40 text-xs mt-1">{tone.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wide">
                Primary conversion goal
              </label>
              <div className="space-y-2">
                {[
                  { id: "BOOK_CALL", label: "Establish Call", icon: Phone },
                  { id: "DEMO_REQUEST", label: "Product Simulation", icon: PlayCircle },
                  { id: "DIRECT_SALE", label: "Revenue Acquisition", icon: DollarSign },
                  { id: "QUALIFICATION", label: "Lead Synthesis", icon: ClipboardCheck },
                ].map(goal => (
                  <motion.button
                    key={goal.id}
                    onClick={() => setConversionGoal(goal.id)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      conversionGoal === goal.id 
                        ? "border-primary bg-primary/10" 
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <goal.icon className={cn("w-5 h-5", conversionGoal === goal.id ? "text-primary" : "text-white/40")} />
                    <div className="font-bold text-white text-sm uppercase tracking-widest">{goal.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 6: Confirmation */}
        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 mb-8 mx-auto"
            >
              <Rocket className="w-12 h-12 text-primary" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mb-4">Ready to go live!</h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
              Your AI engine is configured and ready to start qualifying leads and closing deals. 
              Your first demo is waiting.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 mb-8">
              <div className="text-left space-y-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>✓ AI context configured</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>✓ Sales style optimized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>✓ Lead scoring activated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>✓ Analytics ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12">
          {step > 1 && (
            <Button
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="flex-1 h-12 text-white border-white/20 hover:bg-white/10"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isSaving || (step === 1 && !businessType)}
            className="flex-1 h-12 bg-primary text-white font-bold text-base rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : step === 6 ? (
              <>
                Complete Setup <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Link */}
        {step < 6 && (
          <motion.button
            onClick={() => setStep(6)}
            className="w-full mt-6 text-white/40 hover:text-white/60 text-sm font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Skip to finish
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
