"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function NewLeadPage() {
  const router = useRouter();

  const handleSuccess = (lead: any) => {
    router.push(`/dashboard/leads/${lead.id}`);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <PageHeader
          title="Create New Lead"
          subtitle="Add a new lead to your CRM system"
        />
      </motion.div>

      {/* Form */}
      <motion.div
        className="max-w-2xl glass rounded-2xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <LeadForm onSuccess={handleSuccess} />
      </motion.div>
    </div>
  );
}
