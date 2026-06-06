import { NextResponse } from "next/server"
import { getSession, getUserPrimaryWorkspace } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workspaceUser = await getUserPrimaryWorkspace(session.user.id as string)

    if (!workspaceUser) {
      return NextResponse.json({ name: "My Workspace", plan: "FREE" })
    }

    return NextResponse.json({
      id: workspaceUser.workspace.id,
      name: workspaceUser.workspace.name,
      plan: workspaceUser.workspace.plan,
      role: workspaceUser.role,
    })
  } catch (error: any) {
    console.error("Error fetching workspace info:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
