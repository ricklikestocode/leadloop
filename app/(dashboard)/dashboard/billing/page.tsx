import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserWorkspaceId } from "@/lib/auth-utils";
import { PaymentButton } from "@/components/billing/PaymentButton";
import { Check, Shield, Zap, Globe } from "lucide-react";
import Script from "next/script";

export default async function BillingPage() {
  const session = await auth();
  const workspaceId = session?.user?.id ? await getUserWorkspaceId(session.user.id) : null;
  
  let currentPlan = "FREE";
  if (workspaceId) {
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { plan: true }
    });
    currentPlan = workspace?.plan || "FREE";
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Pricing Plans</h1>
        <p className="text-white/60 text-xl max-w-2xl mx-auto">
          Scale your business with AI-powered sales automation. Choose the plan that's right for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-white/50">/month</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            {[
              "50 Leads / month",
              "200 Messages / month",
              "50 AI Calls / month",
              "Standard AI Support",
              "Basic Analytics"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white/50" />
                </div>
                <span className="text-white/70">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            disabled 
            className="w-full py-4 rounded-xl bg-white/5 text-white/30 font-bold border border-white/10"
          >
            {currentPlan === "FREE" ? "Current Plan" : "Downgrade Unavailable"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 border-2 border-primary rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-primary/10">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
            MOST POPULAR
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-white/50">/month</span>
            </div>
            <p className="text-primary text-sm font-medium mt-2">~ ₹3,999 INR</p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            {[
              "1000 Leads / month",
              "5000 Messages / month",
              "1000 AI Calls / month",
              "High-Conversion Sales Engine",
              "Detailed Business Personalization",
              "Priority Support",
              "Advanced Analytics"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {currentPlan === "PRO" ? (
            <button 
              disabled 
              className="w-full py-4 rounded-xl bg-green-500/20 text-green-500 font-bold border border-green-500/20"
            >
              Active Plan
            </button>
          ) : (
            <div className="space-y-4">
              <PaymentButton planId="PRO" amount={3999} provider="RAZORPAY" />
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs font-bold uppercase">OR GLOBAL</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <PaymentButton planId="PRO" amount={49} provider="PAYPAL" />
            </div>
          )}
          
          <div className="mt-6 flex items-center justify-center gap-6 text-white/30 text-xs font-bold">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> SECURE
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> INSTANT
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> GLOBAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
