const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testRazorpay() {
  console.log("Testing Razorpay with Key ID:", process.env.RAZORPAY_KEY_ID);
  try {
    const order = await razorpay.orders.create({
      amount: 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "receipt_test_1",
    });
    console.log("Order created successfully!");
    console.log("Order ID:", order.id);
  } catch (error) {
    console.error("Razorpay Error:", error.message);
    if (error.error) {
      console.error("Details:", error.error);
    }
  }
}

testRazorpay();
