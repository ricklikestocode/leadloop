"use server";

import { db } from "@/lib/db";
import { getSession, canAccessWorkspace } from "@/lib/auth-utils";
import { createFollowUpRuleSchema, updateFollowUpRuleSchema } from "@/lib/validation";

export async function createFollowUpRule(workspaceId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const validatedData = createFollowUpRuleSchema.parse(input);

    const rule = await db.followUpRule.create({
      data: {
        workspaceId,
        ...validatedData,
      },
    });

    return { success: true, rule };
  } catch (error: any) {
    console.error("Error creating follow-up rule:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFollowUpRule(ruleId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const rule = await db.followUpRule.findUnique({ where: { id: ruleId } });
    if (!rule) throw new Error("Rule not found");

    const canAccess = await canAccessWorkspace(rule.workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const validatedData = updateFollowUpRuleSchema.parse(input);

    const updated = await db.followUpRule.update({
      where: { id: ruleId },
      data: validatedData,
    });

    return { success: true, rule: updated };
  } catch (error: any) {
    console.error("Error updating follow-up rule:", error);
    return { success: false, error: error.message };
  }
}

export async function getFollowUpRules(workspaceId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const rules = await db.followUpRule.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, rules };
  } catch (error: any) {
    console.error("Error fetching follow-up rules:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleFollowUpRule(ruleId: string, isActive: boolean) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const rule = await db.followUpRule.findUnique({ where: { id: ruleId } });
    if (!rule) throw new Error("Rule not found");

    const canAccess = await canAccessWorkspace(rule.workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const updated = await db.followUpRule.update({
      where: { id: ruleId },
      data: { 
        actionType: isActive ? "NOTIFICATION" : "NONE"
      },
    });

    return { success: true, rule: updated };
  } catch (error: any) {
    console.error("Error toggling follow-up rule:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFollowUpRule(ruleId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const rule = await db.followUpRule.findUnique({ where: { id: ruleId } });
    if (!rule) throw new Error("Rule not found");

    const canAccess = await canAccessWorkspace(rule.workspaceId);
    if (!canAccess) throw new Error("Access denied");

    await db.followUpRule.delete({ where: { id: ruleId } });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting follow-up rule:", error);
    return { success: false, error: error.message };
  }
}
