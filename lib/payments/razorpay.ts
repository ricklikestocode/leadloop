import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number, currency: string = "INR") {
  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return { success: false, error: error.message };
  }
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature === signature;
}
