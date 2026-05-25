import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { createPaypalOrder } from "@/lib/payments/paypal";
import { db } from "@/lib/db";
import { getUserWorkspaceId } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, provider, currency = "INR" } = await req.json();

    const workspaceId = await getUserWorkspaceId(session.user.id as string);
    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Define amounts (in real app, get from plans.ts)
    let amount = 0;
    if (planId === "PRO") {
      amount = provider === "RAZORPAY" ? 3999 : 49;
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (provider === "RAZORPAY") {
      const result = await createRazorpayOrder(amount, "INR");
      if (!result.success) throw new Error(result.error);

      // Create a pending payment record
      await db.payment.create({
        data: {
          userId: session.user.id as string,
          workspaceId,
          amount,
          provider: "RAZORPAY",
          status: "PENDING",
          transactionId: result.order?.id,
        },
      });

      return NextResponse.json({ order: result.order });
    } else if (provider === "PAYPAL") {
      const result = await createPaypalOrder(amount);
      if (!result.success) throw new Error(result.error);

      // Create a pending payment record
      await db.payment.create({
        data: {
          userId: session.user.id as string,
          workspaceId,
          amount,
          provider: "PAYPAL",
          status: "PENDING",
          transactionId: result.order?.id,
        },
      });

      return NextResponse.json({ order: result.order });
    }

    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
