"use server";

import { db } from "@/lib/db";
import { getSession, canAccessWorkspace } from "@/lib/auth-utils";

export async function createNotification(
  workspaceId: string,
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    const notification = await db.notification.create({
      data: {
        workspaceId,
        userId,
        type,
        title,
        message,
        actionUrl,
      },
    });

    return { success: true, notification };
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return { success: false, error: error.message };
  }
}

export async function getNotifications(workspaceId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const notifications = await db.notification.findMany({
      where: {
        workspaceId,
        userId: session.user.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return { success: true, notifications, unreadCount };
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: error.message };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new Error("Notification not found");

    if (notification.userId !== (session.user as any).id) {
      throw new Error("Not authorized to update this notification");
    }

    const updated = await db.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return { success: true, notification: updated };
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }
}

export async function markAllNotificationsAsRead(workspaceId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    await db.notification.updateMany({
      where: {
        workspaceId,
        userId: session.user.id as string,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) throw new Error("Notification not found");

    if (notification.userId !== (session.user as any).id) {
      throw new Error("Not authorized to delete this notification");
    }

    await db.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return { success: false, error: error.message };
  }
}

export async function getUnreadCount(workspaceId: string) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const canAccess = await canAccessWorkspace(workspaceId);
    if (!canAccess) throw new Error("Access denied");

    const count = await db.notification.count({
      where: {
        workspaceId,
        userId: session.user.id as string,
        read: false,
      },
    });

    return { success: true, count };
  } catch (error: any) {
    console.error("Error fetching unread count:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to notify team members about important events
export async function notifyTeamMembers(
  workspaceId: string,
  excludeUserId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string
) {
  try {
    const teamMembers = await db.workspaceUser.findMany({
      where: {
        workspaceId,
        status: "ACTIVE",
        userId: { not: excludeUserId },
      },
      select: { userId: true },
    });

    const notifications = await Promise.all(
      teamMembers.map((member) =>
        createNotification(workspaceId, member.userId, type, title, message, actionUrl)
      )
    );

    return { success: true, notified: notifications.length };
  } catch (error: any) {
    console.error("Error notifying team members:", error);
    return { success: false, error: error.message };
  }
}
