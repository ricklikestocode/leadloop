"use server";

import { db } from "@/lib/db";
import { createLeadSchema, updateLeadSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { getUserWorkspaceId } from "@/lib/auth-utils";
import { ACTION_TYPES } from "@/lib/constants";
import { logActivity } from "./activity";
import { trackUsage, runLeadAutomation } from "./automation";

export async function createLead(input: any) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const validatedData = createLeadSchema.parse(input);

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { plan: true, leadCount: true },
    });

    if (workspace && workspace.plan === "FREE" && workspace.leadCount >= 50) {
      throw new Error("Lead limit reached for FREE plan. Please upgrade to Pro.");
    }

    const lead = await db.lead.create({
      data: {
        ...validatedData,
        workspaceId,
      },
    });

    // Track usage
    await trackUsage(workspaceId, 'lead');

    await logActivity({
      workspaceId,
      leadId: lead.id,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.LEAD_CREATED,
      description: `Lead "${lead.name}" created from ${validatedData.source}`,
    });

    // Run AI Lead Intelligence and Automation Engine
    try {
      await runLeadAutomation(lead.id);
    } catch (autoErr) {
      console.error("Automation error during lead creation:", autoErr);
    }

    // Refetch the lead with its newly generated intelligence fields
    const enrichedLead = await db.lead.findUnique({
      where: { id: lead.id }
    });

    return { success: true, lead: enrichedLead || lead };
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLead(id: string, input: any) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Verify lead belongs to user's workspace
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    const validatedData = updateLeadSchema.parse(input);

    const oldStatus = lead.status;
    const updatedLead = await db.lead.update({
      where: { id },
      data: validatedData,
    });

    let actionType = ACTION_TYPES.LEAD_UPDATED;
    let description = `Lead "${updatedLead.name}" updated`;

    if (oldStatus !== updatedLead.status) {
      actionType = ACTION_TYPES.STATUS_CHANGED;
      description = `Lead status changed from ${oldStatus} to ${updatedLead.status}`;
    }

    await logActivity({
      workspaceId,
      leadId: id,
      userId: session.user.id as string,
      actionType,
      description,
    });

    return { success: true, lead: updatedLead };
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLead(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Verify lead belongs to user's workspace
    const lead = await db.lead.findUnique({ where: { id } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    await db.lead.delete({ where: { id } });

    await logActivity({
      workspaceId,
      leadId: id,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.LEAD_DELETED,
      description: `Lead "${lead.name}" deleted`,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { success: false, error: error.message };
  }
}

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  search?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const where: any = {
      workspaceId,
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.source) {
      where.source = filters.source;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
        { company: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return { success: true, leads };
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return { success: false, error: error.message };
  }
}

export async function getLead(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        leadNotes: true,
        followUps: true,
        conversations: true,
      },
    });

    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    return { success: true, lead };
  } catch (error: any) {
    console.error("Error fetching lead:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Convert a conversation to a lead
 * Extracts name, email, phone from conversation if not provided
 */
export async function convertConversationToLead(
  conversationId: string,
  input?: { name?: string; email?: string; phone?: string; value?: number }
) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Get the conversation
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        lead: true,
        messages: { orderBy: { createdAt: "asc" }, take: 10 },
      },
    });

    if (!conversation || conversation.workspaceId !== workspaceId) {
      throw new Error("Conversation not found");
    }

    // If already has a lead, return it
    if (conversation.leadId) {
      return {
        success: true,
        message: "Conversation already linked to a lead",
        lead: conversation.lead,
      };
    }

    // Extract information from messages if not provided in input
    let extractedEmail = input?.email;
    let extractedPhone = input?.phone;
    let extractedName = input?.name || conversation.lead?.name;

    if (!extractedEmail || !extractedPhone) {
      // Look through messages for email and phone patterns
      const allContent = conversation.messages.map(m => m.content).join(" ");
      
      if (!extractedEmail) {
        const emailMatch = allContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) extractedEmail = emailMatch[0];
      }
      
      if (!extractedPhone) {
        const phoneMatch = allContent.match(/(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
        if (phoneMatch) extractedPhone = phoneMatch[0];
      }
    }

    const name = extractedName || "Lead from Conversation";
    const email = extractedEmail || undefined;
    const phone = extractedPhone || undefined;
    const value = input?.value || 0;

    // Create new lead
    const lead = await db.lead.create({
      data: {
        name,
        email: email || undefined,
        phone: phone || undefined,
        status: "CONTACTED",
        source: "CHAT",
        value,
        workspaceId,
      },
    });

    // Track usage
    await trackUsage(workspaceId, 'lead');

    // Link conversation to new lead
    await db.conversation.update({
      where: { id: conversationId },
      data: { leadId: lead.id },
    });

    await logActivity({
      workspaceId,
      leadId: lead.id,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.LEAD_CREATED,
      description: `Lead "${lead.name}" created from conversation`,
    });

    return { success: true, lead };
  } catch (error: any) {
    console.error("Error converting conversation to lead:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Add a note to a lead
 */
export async function addLeadNote(leadId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id);
    if (!workspaceId) throw new Error("No workspace found");

    // Verify lead exists and belongs to workspace
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    const note = await db.leadNote.create({
      data: {
        content,
        leadId,
        userId: session.user.id as string,
      },
    });

    await logActivity({
      workspaceId,
      leadId,
      userId: session.user.id,
      actionType: ACTION_TYPES.NOTE_ADDED,
      description: `Note added to lead "${lead.name}"`,
    });

    return { success: true, note };
  } catch (error: any) {
    console.error("Error adding lead note:", error);
    return { success: false, error: error.message };
  }
}
