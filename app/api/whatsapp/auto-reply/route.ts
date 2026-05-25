import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { setAutoReplySettings } from "@/lib/whatsapp";

/**
 * POST /api/whatsapp/auto-reply
 * Configure auto-reply settings
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { workspaceId, enabled, defaultText } = body;

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing workspaceId" },
        { status: 400 }
      );
    }

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Update auto-reply settings
    const result = await setAutoReplySettings(
      workspaceId,
      enabled,
      defaultText
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Auto-reply settings updated",
    });
  } catch (error: any) {
    console.error("[/api/whatsapp/auto-reply] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update auto-reply" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/whatsapp/auto-reply
 * Get auto-reply settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing workspaceId" },
        { status: 400 }
      );
    }

    // Verify user has access to workspace
    const hasAccess = await db.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get settings
    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
    });

    return NextResponse.json({
      success: true,
      autoReplyEnabled: settings?.autoReplyEnabled || false,
      defaultAutoReplyText:
        settings?.defaultAutoReplyText ||
        "Thanks for your message. We'll get back to you soon!",
    });
  } catch (error: any) {
    console.error("[/api/whatsapp/auto-reply] GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch auto-reply settings" },
      { status: 500 }
    );
  }
}
