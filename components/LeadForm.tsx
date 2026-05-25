"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createLead, updateLead } from "@/actions/leads";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface LeadFormProps {
  lead?: any;
  onSuccess?: (lead: any) => void;
  isLoading?: boolean;
}

export function LeadForm({ lead, onSuccess, isLoading = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    company: lead?.company || "",
    status: lead?.status || "NEW",
    source: lead?.source || "MANUAL",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      let result;

      if (lead?.id) {
        // Update existing lead
        result = await updateLead(lead.id, {
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          status: formData.status,
        });
      } else {
        // Create new lead
        result = await createLead({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          status: formData.status,
          source: formData.source,
        });
      }

      if (result.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          status: "NEW",
          source: "MANUAL",
        });

        if (onSuccess) {
          onSuccess(result.lead);
        }
      } else {
        setError(result.error || "Failed to save lead");
      }
    } catch (err: any) {
      console.error("Form error:", err);
      setError(err.message || "An error occurred while saving the lead");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {error && (
        <motion.div
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="name" className="text-foreground">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Lead name"
            required
            className="bg-background-secondary border-white/10"
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
            className="bg-background-secondary border-white/10"
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="phone" className="text-foreground">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className="bg-background-secondary border-white/10"
          />
        </motion.div>

        {/* Company Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Label htmlFor="company" className="text-foreground">
            Company
          </Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company name"
            className="bg-background-secondary border-white/10"
          />
        </motion.div>

        {/* Status Field */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="status" className="text-foreground">
            Status
          </Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e: any) => handleSelectChange("status", e.target.value)}
            className="bg-background-secondary border-white/10"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="INTERESTED">Interested</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </Select>
        </motion.div>

        {/* Source Field (only for new leads) */}
        {!lead?.id && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Label htmlFor="source" className="text-foreground">
              Source
            </Label>
            <Select
              id="source"
              name="source"
              value={formData.source}
              onChange={(e: any) => handleSelectChange("source", e.target.value)}
              className="bg-background-secondary border-white/10"
            >
              <option value="MANUAL">Manual</option>
              <option value="CHAT">Chat</option>
              <option value="EMAIL">Email</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="FORM">Form</option>
            </Select>
          </motion.div>
        )}
      </div>

      {/* Submit Button */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          disabled={isSaving || isLoading || !formData.name}
          className="bg-gradient-primary text-white hover:shadow-lg disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <span>{lead?.id ? "Update Lead" : "Create Lead"}</span>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
