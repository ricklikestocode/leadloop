import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getUserPrimaryWorkspace } from "@/lib/auth-utils"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 })
    }

    const workspaceUser = await getUserPrimaryWorkspace(session.user.id)

    if (!workspaceUser) {
      return NextResponse.json({ count: 0 })
    }

    const count = await db.notification.count({
      where: {
        userId: session.user.id,
        workspaceId: workspaceUser.workspaceId,
        read: false,
      },
    })

    return NextResponse.json({ count })
  } catch (error: any) {
    console.error("Error fetching notification count:", error)
    return NextResponse.json({ count: 0 })
  }
}
