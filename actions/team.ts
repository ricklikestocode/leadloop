"use server";

import { db } from "@/lib/db";
import { getSession, canAccessWorkspace } from "@/lib/auth-utils";
import { inviteTeamMemberSchema, updateTeamMemberSchema } from "@/lib/validation";
import { logActivity } from "./activity";
import { ACTION_TYPES } from "@/lib/constants";
import { hash } from "bcryptjs";
import crypto from "crypto";

export async function inviteTeamMember(workspaceId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    // Check if user is owner or admin
    const workspaceUser = await db.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id as string,
          workspaceId,
        },
      },
    });

    if (!workspaceUser || !["OWNER", "ADMIN"].includes(workspaceUser.role)) {
      throw new Error("Only owners and admins can invite team members");
    }

    const validatedData = inviteTeamMemberSchema.parse(input);

    // Check if user already exists
    let user = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    // If user doesn't exist, create invited user
    if (!user) {
      const tempPassword = crypto.randomBytes(16).toString("hex");
      user = await db.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.email.split("@")[0],
          password: await hash(tempPassword, 10),
        },
      });
    }

    // Check if already a member
    const existing = await db.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "User is already a member of this workspace" };
    }

    // Add user to workspace
    const teamMember = await db.workspaceUser.create({
      data: {
        workspaceId,
        userId: user.id,
        role: validatedData.role,
        status: "ACTIVE",
      },
      include: {
        user: true,
      },
    });

    await logActivity({
      workspaceId,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.TEAM_MEMBER_ADDED,
      description: `${validatedData.email} added as ${validatedData.role}`,
    });

    return { success: true, teamMember };
  } catch (error: any) {
    console.error("Error inviting team member:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeamMember(workspaceId: string, userId: string, input: any) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    // Check if user is owner
    const workspaceUser = await db.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id as string,
          workspaceId,
        },
      },
    });

    if (!workspaceUser || workspaceUser.role !== "OWNER") {
      throw new Error("Only owners can change team member roles");
    }

    const validatedData = updateTeamMemberSchema.parse(input);

    const updatedMember = await db.workspaceUser.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role: validatedData.role,
      },
      include: {
        user: true,
      },
    });

    await logActivity({
      workspaceId,
      userId: session.user.id as string,
      actionType: ACTION_TYPES.ROLE_CHANGED,
      description: `${(updatedMember as any).user.email} role changed to ${validatedData.role}`,
    });

    return { success: true, member: updatedMember };
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return { success: false, error: error.message };
  }
}

export async function removeTeamMember(workspaceId: string, userId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    // Check if user is owner
    const workspaceUser = await db.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: session.user.id as string,
          workspaceId,
        },
      },
    });

    if (!workspaceUser || workspaceUser.role !== "OWNER") {
      throw new Error("Only owners can remove team members");
    }

    const member = await db.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      throw new Error("Team member not found");
    }

    await db.workspaceUser.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    await logActivity({
      workspaceId,
      userId: session.user.id,
      actionType: ACTION_TYPES.TEAM_MEMBER_REMOVED,
      description: `${(member as any).user.email} removed from workspace`,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error removing team member:", error);
    return { success: false, error: error.message };
  }
}

export async function getTeamMembers(workspaceId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const members = await db.workspaceUser.findMany({
      where: {
        workspaceId,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
      // Removed invalid orderBy
    });

    return { success: true, members };
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return { success: false, error: error.message };
  }
}
