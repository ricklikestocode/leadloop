import { NextRequest, NextResponse } from "next/server";
import { handleIncomingWhatsAppMessage } from "@/lib/whatsapp";

/**
 * WhatsApp Webhook Handler
 * 
 * GET: Verification for Meta
 * POST: Incoming message handling
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_WEBHOOK_TOKEN || "whatsapp-webhook-token";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp Webhook] Verification successful");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("[WhatsApp Webhook] Verification failed", { mode, token });
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    console.log("[WhatsApp Webhook] Received payload:", JSON.stringify(payload, null, 2));

    // Meta sends multiple changes in one payload
    // We handle them via our service
    const result = await handleIncomingWhatsAppMessage(payload);

    if (result.success) {
      return NextResponse.json({ status: "success" });
    } else {
      // We return 200 even on processing errors to avoid Meta retrying infinitely
      // unless it's a fatal error
      console.warn("[WhatsApp Webhook] Processing result:", result.error || result.message);
      return NextResponse.json({ status: "processed", details: result.message || result.error });
    }
  } catch (error: any) {
    console.error("[WhatsApp Webhook] Error:", error);
    // Always return 200 to WhatsApp unless we want them to retry
    return NextResponse.json({ status: "error", message: error.message }, { status: 200 });
  }
}
