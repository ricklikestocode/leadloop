"use server";

import { db } from "@/lib/db";
import { createFollowUpSchema, updateFollowUpSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { ACTION_TYPES } from "@/lib/constants";
import { logActivity } from "./activity";
import { getUserWorkspaceId } from "@/lib/auth-utils";

export async function createFollowUp(leadId: string, input: any) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    // Verify lead belongs to user's workspace
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Lead not found");
    }

    const validatedData = createFollowUpSchema.parse(input);

    const followUp = await db.followUp.create({
      data: {
        ...validatedData,
        leadId,
        userId: session.user.id as string,
      },
    });

    // Update lead's followUpDate
    await db.lead.update({
      where: { id: leadId },
      data: { followUpDate: validatedData.dueDate },
    });

    await logActivity({
      workspaceId,
      leadId,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.FOLLOW_UP_SCHEDULED,
      description: `Follow-up scheduled for ${new Date(validatedData.dueDate).toLocaleDateString()}`,
    });

    return { success: true, followUp };
  } catch (error: any) {
    console.error("Error creating follow-up:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFollowUp(id: string, input: any) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const followUp = await db.followUp.findUnique({ where: { id } });
    if (!followUp) throw new Error("Follow-up not found");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const lead = await db.lead.findUnique({ where: { id: followUp.leadId } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Unauthorized");
    }

    const validatedData = updateFollowUpSchema.parse(input);

    const updatedFollowUp = await db.followUp.update({
      where: { id },
      data: validatedData,
    });

    const actionType = validatedData.status === "COMPLETED"
      ? ACTION_TYPES.FOLLOW_UP_COMPLETED
      : ACTION_TYPES.FOLLOW_UP_RESCHEDULED;

    await logActivity({
      workspaceId,
      leadId: followUp.leadId,
      userId: session.user.id as string,
      actionType,
      description: validatedData.status === "COMPLETED" 
        ? "Follow-up marked as completed"
        : "Follow-up rescheduled",
    });

    return { success: true, followUp: updatedFollowUp };
  } catch (error: any) {
    console.error("Error updating follow-up:", error);
    return { success: false, error: error.message };
  }
}

export async function completeFollowUp(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const followUp = await db.followUp.findUnique({ where: { id } });
    if (!followUp) throw new Error("Follow-up not found");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const lead = await db.lead.findUnique({ where: { id: followUp.leadId } });
    if (!lead || lead.workspaceId !== workspaceId) {
      throw new Error("Unauthorized");
    }

    const updatedFollowUp = await db.followUp.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Update lead's lastContactedAt
    await db.lead.update({
      where: { id: followUp.leadId },
      data: { lastContactedAt: new Date() },
    });

    await logActivity({
      workspaceId,
      leadId: followUp.leadId,
      userId: session.user.id,
      actionType: ACTION_TYPES.FOLLOW_UP_COMPLETED,
      description: "Follow-up marked as completed",
    });

    return { success: true, followUp: updatedFollowUp };
  } catch (error: any) {
    console.error("Error completing follow-up:", error);
    return { success: false, error: error.message };
  }
}

export async function getFollowUps(filters?: {
  status?: string;
  daysFrom?: number;
  daysTo?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id);
    if (!workspaceId) throw new Error("No workspace found");

    const where: any = {
      lead: {
        workspaceId,
      },
    };

    if (filters?.status) {
      where.status = filters.status;
    }

    // Get follow-ups within date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filters?.daysFrom !== undefined && filters?.daysTo !== undefined) {
      const from = new Date(today);
      from.setDate(from.getDate() + filters.daysFrom);

      const to = new Date(today);
      to.setDate(to.getDate() + filters.daysTo);
      to.setHours(23, 59, 59, 999);

      where.dueDate = {
        gte: from,
        lte: to,
      };
    }

    const followUps = await db.followUp.findMany({
      where,
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            company: true,
            phone: true,
            email: true,
            status: true,
          },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    return { success: true, followUps };
  } catch (error: any) {
    console.error("Error fetching follow-ups:", error);
    return { success: false, error: error.message };
  }
}
