"use server";

import { db } from "@/lib/db";
import { createNoteSchema } from "@/lib/validation";
import { auth } from "@/lib/auth";
import { ACTION_TYPES } from "@/lib/constants";
import { logActivity } from "./activity";

export async function createNote(leadId: string, input: any) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify lead belongs to user's workspace
    const lead = await db.lead.findUnique({ where: { id: leadId } });
    if (!lead || lead.workspaceId !== (session.user as any).workspaceId) {
      throw new Error("Lead not found");
    }

    const validatedData = createNoteSchema.parse(input);

    const note = await db.leadNote.create({
      data: {
        ...validatedData,
        leadId,
        userId: session.user.id as string,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    await logActivity({
      workspaceId: (session.user as any).workspaceId,
      leadId,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.NOTE_ADDED,
      description: "Note added to lead",
    });

    return { success: true, note };
  } catch (error: any) {
    console.error("Error creating note:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteNote(id: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const note = await db.leadNote.findUnique({ where: { id } });
    if (!note) throw new Error("Note not found");

    // Verify note's lead belongs to user's workspace
    const lead = await db.lead.findUnique({ where: { id: note.leadId } });
    if (!lead || lead.workspaceId !== (session.user as any).workspaceId) {
      throw new Error("Unauthorized");
    }

    await db.leadNote.delete({ where: { id } });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return { success: false, error: error.message };
  }
}
