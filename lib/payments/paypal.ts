import {
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logBody: true },
  },
});

const ordersController = new OrdersController(client);

export async function createPaypalOrder(amount: number) {
  try {
    const { body } = await (ordersController as any).ordersCreate({
      body: {
        intent: "CAPTURE",
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: amount.toString(),
            },
          },
        ],
        paymentSource: {
          paypal: {
            experienceContext: {
              returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/paypal/capture`,
              cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing`,
            }
          }
        }
      },
    });

    // body is a string, we need to parse it
    const data = JSON.parse(body);
    return { success: true, order: data };
  } catch (error: any) {
    console.error("PayPal order creation error:", error);
    return { success: false, error: error.message };
  }
}

export async function capturePaypalOrder(orderId: string) {
  try {
    const { body } = await (ordersController as any).ordersCapture({
      id: orderId,
    });

    const data = JSON.parse(body);
    return { success: true, capture: data };
  } catch (error: any) {
    console.error("PayPal order capture error:", error);
    return { success: false, error: error.message };
  }
}
