"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { LeadForm } from "@/components/LeadForm";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { getLead, deleteLead, addLeadNote } from "@/actions/leads";
import { useRouter } from "next/navigation";
import { MessageSquare, ChevronLeft, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { LeadIntelligence } from "@/components/LeadIntelligence";

interface LeadDetailPageProps {
  params: {
    id: string;
  };
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const [lead, setLead] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setIsLoading(true);
        const result = await getLead(params.id);

        if (result.success && result.lead) {
          setLead(result.lead);
          setNotes(result.lead.leadNotes || []);
        } else {
          setError(result.error || "Lead not found");
        }
      } catch (err: any) {
        console.error("Error loading lead:", err);
        setError(err.message || "Failed to load lead");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const result = await deleteLead(params.id);
      if (result.success) {
        router.push("/dashboard/leads");
      } else {
        setError(result.error || "Failed to delete lead");
      }
    } catch (err: any) {
      console.error("Error deleting lead:", err);
      setError(err.message || "Failed to delete lead");
    }
  };

  const handleAddNote = async (e: React.ChangeEvent<HTMLTextAreaElement> | React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const result = await addLeadNote(params.id, noteContent);
      if (result.success) {
        setNotes([...notes, result.note]);
        setNoteContent("");
      } else {
        setError(result.error || "Failed to add note");
      }
    } catch (err: any) {
      console.error("Error adding note:", err);
      setError(err.message || "Failed to add note");
    } finally {
      setIsAddingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="space-y-4">
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <PageHeader
            title={lead?.name || "Lead"}
            subtitle={lead?.company ? `from ${lead.company}` : ""}
          />
        </div>
        <motion.button
          onClick={handleDelete}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {error && (
        <motion.div
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Form - Main Column */}
        <motion.div
          className="lg:col-span-2 glass rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Lead Information
          </h2>
          {lead && (
            <LeadForm
              lead={lead}
              onSuccess={(updated) => {
                setLead(updated);
                setError(null);
              }}
            />
          )}
        </motion.div>

        {/* Sidebar Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Lead Intelligence Card */}
          <LeadIntelligence 
            lead={lead} 
            onUpdate={(data) => {
              setLead({
                ...lead,
                summary: data.summary,
                nextAction: data.nextAction,
                leadScore: data.score
              });
            }} 
          />

          {/* Status Card */}
          <motion.div
            className="glass rounded-2xl p-6 space-y-4"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-semibold text-foreground">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground-muted">Status</p>
                <p className="text-foreground font-medium">{lead?.status}</p>
              </div>
              <div>
                <p className="text-foreground-muted">Source</p>
                <p className="text-foreground font-medium">{lead?.source}</p>
              </div>
              <div>
                <p className="text-foreground-muted">Created</p>
                <p className="text-foreground font-medium">
                  {new Date(lead?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-foreground-muted">Last Updated</p>
                <p className="text-foreground font-medium">
                  {new Date(lead?.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Conversations Card */}
          {lead?.conversations && lead.conversations.length > 0 && (
            <motion.div
              className="glass rounded-2xl p-6 space-y-4"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversations
              </h3>
              <div className="space-y-2">
                {lead.conversations.map((conv: any) => (
                  <Button
                    key={conv.id}
                    onClick={() =>
                      router.push(
                        `/dashboard/chats?conversation=${conv.id}`
                      )
                    }
                    variant="outline"
                    className="w-full justify-start text-sm"
                  >
                    {conv.title || `Chat on ${new Date(conv.createdAt).toLocaleDateString()}`}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Notes Section */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Notes & Activity
        </h2>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="mb-6 space-y-3">
          <Textarea
            value={noteContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteContent(e.target.value)}
            placeholder="Add a note about this lead..."
            className="bg-background-secondary border-white/10 min-h-[100px]"
          />
          <Button
            type="submit"
            disabled={isAddingNote || !noteContent.trim()}
            className="bg-gradient-primary text-white hover:shadow-lg"
          >
            {isAddingNote ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Adding...</span>
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </form>

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((note: any) => (
              <motion.div
                key={note.id}
                className="p-4 bg-background-secondary/50 rounded-lg space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-foreground text-sm">{note.content}</p>
                <p className="text-foreground-muted text-xs">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-foreground-muted text-sm text-center py-8">
              No notes yet. Add one to get started!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
