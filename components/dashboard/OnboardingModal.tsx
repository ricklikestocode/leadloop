"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Target, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  Zap,
  Sparkles,
  Building2,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkspaceSettings } from "@/actions/settings";
import { useRouter } from "next/navigation";

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessType: "",
    whatTheySell: "",
    businessDescription: "",
    pricingRange: "",
    goal: "BOOK_CALL",
    tone: "PROFESSIONAL"
  });

  useEffect(() => {
    // Check if onboarding is needed
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateWorkspaceSettings({
        businessType: formData.businessType,
        servicesInfo: formData.whatTheySell,
        businessDescription: formData.businessDescription,
        pricingInfo: formData.pricingRange,
        conversionGoal: formData.goal,
        businessTone: formData.tone,
        autoReplyEnabled: true // Enable by default after onboarding
      });
      
      localStorage.setItem("onboarding_completed", "true");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Rocket className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome to ReplyFlow AI</h2>
                <p className="text-white/60 text-lg">
                  Let's set up your sales engine in 30 seconds.
                </p>
                <Button 
                  onClick={handleNext}
                  className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90"
                >
                  Start Setup <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">About Your Business</h3>
                    <p className="text-white/50 text-sm">Tell us what you do.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Business Type</label>
                    <Input 
                      placeholder="e.g. Real Estate Agency, SaaS, Dental Clinic"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Describe your business</label>
                    <textarea 
                      placeholder="e.g. We are a luxury real estate agency in Dubai helping HNIs find their dream homes. We focus on villas and penthouses."
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">Pricing Range</label>
                      <Input 
                        placeholder="e.g. $1M - $10M"
                        value={formData.pricingRange}
                        onChange={(e) => setFormData({ ...formData, pricingRange: e.target.value })}
                        className="bg-white/5 border-white/10 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">What are you selling?</label>
                      <Input 
                        placeholder="e.g. Luxury Villas"
                        value={formData.whatTheySell}
                        onChange={(e) => setFormData({ ...formData, whatTheySell: e.target.value })}
                        className="bg-white/5 border-white/10 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white/50">Back</Button>
                  <Button onClick={handleNext} disabled={!formData.businessType} className="flex-1 h-12 rounded-xl bg-primary">Next</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Goal</h3>
                    <p className="text-white/50 text-sm">What's the primary objective?</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "BOOK_CALL", label: "Book Calls", icon: MessageSquare },
                    { id: "SIGNUP", label: "User Signups", icon: UserPlus },
                    { id: "PURCHASE", label: "Direct Sales", icon: TrendingUp },
                    { id: "INFO", label: "Lead Info", icon: Sparkles },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({ ...formData, goal: goal.id })}
                      className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
                        formData.goal === goal.id 
                          ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/10" 
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      <goal.icon className={`w-6 h-6 ${formData.goal === goal.id ? "text-primary" : "text-white/30"}`} />
                      <p className="font-bold">{goal.label}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white/50">Back</Button>
                  <Button onClick={handleNext} className="flex-1 h-12 rounded-xl bg-primary">Next</Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Ready to Scale!</h2>
                <p className="text-white/60 text-lg">
                  We've configured your AI Sales Engine. You're ready to start converting leads automatically.
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/80 font-medium">Auto-reply enabled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-white/80 font-medium">Sales Strategy: {formData.goal.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={handleBack} className="flex-1 h-12 rounded-xl text-white/50">Back</Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-primary font-bold"
                  >
                    {isLoading ? "Saving..." : "Go to Dashboard"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function UserPlus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}
