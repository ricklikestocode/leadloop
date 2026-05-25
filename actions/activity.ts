"use server";

import { db } from "@/lib/db";

export async function logActivity({
  workspaceId,
  leadId,
  userId,
  actionType,
  description,
}: {
  workspaceId: string;
  leadId?: string;
  userId: string;
  actionType: string;
  description: string;
}) {
  try {
    await db.activityLog.create({
      data: {
        workspaceId,
        leadId,
        userId,
        actionType,
        description,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

export async function getActivities(workspaceId: string, limit: number = 20) {
  try {
    const activities = await db.activityLog.findMany({
      where: { workspaceId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return { success: true, activities };
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return { success: false, error: error.message };
  }
}
