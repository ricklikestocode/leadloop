import { auth } from "./auth"
import { redirect } from "next/navigation"
import { db } from "./db"

export async function getSession() {
  return await auth()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }
  return user
}

export function hasPermission(role: string, permission: string) {
    // Basic implementation for now
    if (role === "OWNER") return true;
    if (role === "ADMIN" && permission !== "canManageSettings") return true;
    return false;
}

export async function getUserPrimaryWorkspace(userId: string) {
  let userWorkspace = await db.workspaceUser.findFirst({
    where: { userId },
    include: { workspace: true },
  })
  
  if (!userWorkspace) {
    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })
    
    if (user) {
      // Create a default workspace for this user
      const name = user.name || user.email?.split("@")[0] || "User"
      const workspace = await db.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          users: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      })
      
      // Fetch the created userWorkspace
      userWorkspace = await db.workspaceUser.findFirst({
        where: { userId, workspaceId: workspace.id },
        include: { workspace: true },
      })
    }
  }
  
  return userWorkspace
}

export async function getUserWorkspaceId(userId: string) {
  const userWorkspace = await getUserPrimaryWorkspace(userId)
  return userWorkspace?.workspaceId
}

export async function canAccessWorkspace(workspaceId: string) {
  const session = await auth()
  if (!session?.user?.id) return false
  
  const hasAccess = await db.workspaceUser.findFirst({
    where: {
      workspaceId,
      userId: session.user.id,
    },
  })
  
  return !!hasAccess
}
