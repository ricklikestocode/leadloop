"use server";

import { db } from "@/lib/db";
import { getSession, getUserWorkspaceId } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function getWorkspaceSettings() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
      include: { workspace: true },
    });

    if (!settings) {
      // Create default settings if not exists
      const newSettings = await db.workspaceSettings.create({
        data: {
          workspaceId,
          autoReplyEnabled: false,
        },
        include: { workspace: true },
      });
      return { success: true, settings: newSettings };
    }

    return { success: true, settings };
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWorkspaceSettings(data: {
  autoReplyEnabled?: boolean;
  defaultAutoReplyText?: string;
  whatsappBusinessPhoneId?: string;
  whatsappAccessToken?: string;
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  businessTone?: string;
  businessDescription?: string;
  tonePreference?: string;
  pricingInfo?: string;
  servicesInfo?: string;
  conversionGoal?: string;
  businessAnalysis?: string;
}) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const updated = await db.workspaceSettings.update({
      where: { workspaceId },
      data: {
        autoReplyEnabled: data.autoReplyEnabled,
        defaultAutoReplyText: data.defaultAutoReplyText,
        whatsappBusinessPhoneId: data.whatsappBusinessPhoneId,
        whatsappAccessToken: data.whatsappAccessToken,
        businessName: data.businessName,
        businessType: data.businessType,
        targetAudience: data.targetAudience,
        businessTone: data.businessTone,
        businessDescription: data.businessDescription,
        tonePreference: data.tonePreference,
        pricingInfo: data.pricingInfo,
        servicesInfo: data.servicesInfo,
        conversionGoal: data.conversionGoal,
        businessAnalysis: data.businessAnalysis,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, settings: updated };
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message };
  }
}

export async function analyzeBusinessAction() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
    });

    if (!settings || !settings.businessDescription) {
      throw new Error("No business description found to analyze");
    }

    const { analyzeBusinessStructure } = await import("@/lib/ai");
    const analysis = await analyzeBusinessStructure(settings.businessDescription);

    if (analysis) {
      await db.workspaceSettings.update({
        where: { workspaceId },
        data: {
          businessAnalysis: JSON.stringify(analysis),
          // Also update individual fields if they were empty
          businessType: settings.businessType || analysis.business_type,
        },
      });
      revalidatePath("/dashboard/settings");
      return { success: true, analysis };
    }

    return { success: false, error: "AI failed to analyze business" };
  } catch (error: any) {
    console.error("Error analyzing business:", error);
    return { success: false, error: error.message };
  }
}

export async function refineBusinessIntelligenceAction() {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error("Unauthorized");

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) throw new Error("No workspace found");

    const settings = await db.workspaceSettings.findUnique({
      where: { workspaceId },
    });

    if (!settings || !settings.businessAnalysis) {
      throw new Error("No business analysis found to refine");
    }

    // Fetch recent conversation snippets
    const recentMessages = await db.conversationMessage.findMany({
      where: {
        conversation: { workspaceId },
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    const conversationSnippets = recentMessages.map(m => `${m.senderType}: ${m.content}`);

    const { refineBusinessAnalysis } = await import("@/lib/ai");
    const updatedAnalysis = await refineBusinessAnalysis(
      JSON.parse(settings.businessAnalysis),
      conversationSnippets
    );

    if (updatedAnalysis) {
      await db.workspaceSettings.update({
        where: { workspaceId },
        data: {
          businessAnalysis: JSON.stringify(updatedAnalysis),
        },
      });
      revalidatePath("/dashboard/settings");
      return { success: true, analysis: updatedAnalysis };
    }

    return { success: false, error: "Refinement failed" };
  } catch (error: any) {
    console.error("Error refining intelligence:", error);
    return { success: false, error: error.message };
  }
}
