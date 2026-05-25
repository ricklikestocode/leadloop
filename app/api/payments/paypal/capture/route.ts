import { NextResponse } from "next/server";
import { capturePaypalOrder } from "@/lib/payments/paypal";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token"); // This is the PayPal Order ID

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/billing?error=missing_token", req.url));
    }

    const result = await capturePaypalOrder(token);

    if (!result.success) {
      console.error("PayPal capture failed:", result.error);
      return NextResponse.redirect(new URL("/dashboard/billing?error=capture_failed", req.url));
    }

    // Update payment record
    const payment = await db.payment.update({
      where: { transactionId: token },
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

    return NextResponse.redirect(new URL("/dashboard?upgrade=success", req.url));
  } catch (error: any) {
    console.error("PayPal callback error:", error);
    return NextResponse.redirect(new URL("/dashboard/billing?error=server_error", req.url));
  }
}
