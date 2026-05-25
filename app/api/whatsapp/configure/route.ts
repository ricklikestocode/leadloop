import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import {
  configureWhatsAppWebhook,
  setAutoReplySettings,
} from "@/lib/whatsapp";

/**
 * POST /api/whatsapp/configure
 * Configure WhatsApp integration for a workspace
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
    const {
      workspaceId,
      phoneNumberId,
      businessAccountId,
      accessToken,
      webhookToken,
    } = body;

    if (
      !workspaceId ||
      !phoneNumberId ||
      !businessAccountId ||
      !accessToken ||
      !webhookToken
    ) {
      return NextResponse.json(
        { error: "Missing required configuration fields" },
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

    // Configure webhook
    const result = await configureWhatsAppWebhook(
      workspaceId,
      phoneNumberId,
      businessAccountId,
      accessToken,
      webhookToken
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "WhatsApp integration configured successfully",
    });
  } catch (error: any) {
    console.error("[/api/whatsapp/configure] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to configure WhatsApp" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/whatsapp/configure
 * Get current WhatsApp configuration
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
      settings: {
        whatsappPhoneNumberId: settings?.whatsappBusinessPhoneId,
        whatsappBusinessAccountId: settings?.whatsappBusinessAccountId,
        whatsappPhoneNumber: settings?.whatsappPhoneNumber,
        autoReplyEnabled: settings?.autoReplyEnabled,
        defaultAutoReplyText: settings?.defaultAutoReplyText,
        isConfigured: !!settings?.whatsappAccessToken,
      },
    });
  } catch (error: any) {
    console.error("[/api/whatsapp/configure] GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}
