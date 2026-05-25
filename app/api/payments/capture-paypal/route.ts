import { NextResponse } from "next/server";
import { capturePaypalOrder } from "@/lib/payments/paypal";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    const result = await capturePaypalOrder(orderId);
    if (!result.success) {
      return NextResponse.json({ error: "Failed to capture PayPal order" }, { status: 400 });
    }

    // Update payment record
    const payment = await db.payment.update({
      where: { transactionId: orderId },
      data: {
        status: "SUCCESS",
        updatedAt: new Date(),
      },
    });

    // Upgrade workspace plan
    if (payment.workspaceId) {
      await db.workspace.update({
        where: { id: payment.workspaceId },
        data: { plan: "PRO" },
      });
    }

    return NextResponse.json({ success: true, capture: result.capture });
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
