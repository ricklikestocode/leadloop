"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  planId: string;
  amount: number;
  provider: "RAZORPAY" | "PAYPAL";
}

export function PaymentButton({ planId, amount: _amount, provider }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, provider }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (provider === "RAZORPAY") {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "LeadLoop AI",
          description: `Upgrade to ${planId} Plan`,
          order_id: data.order.id,
          handler: async (response: any) => {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push("/dashboard?upgrade=success");
              router.refresh();
            } else {
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#6366f1",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (provider === "PAYPAL") {
        // For PayPal, we usually redirect to their checkout page or use their buttons
        // Here we'll redirect to the approval URL returned by the API
        const approvalUrl = data.order.links.find((link: any) => link.rel === "approve").href;
        window.location.href = approvalUrl;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
      className={`w-full py-6 rounded-xl font-bold text-lg ${
        provider === "RAZORPAY" 
          ? "bg-indigo-600 hover:bg-indigo-700" 
          : "bg-[#0070ba] hover:bg-[#005ea6]"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <CreditCard className="w-5 h-5 mr-2" />
      )}
      Pay with {provider === "RAZORPAY" ? "Razorpay (India)" : "PayPal (Global)"}
    </Button>
  );
}
