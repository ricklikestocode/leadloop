/**
 * Simulation script for WhatsApp Webhook
 */

const WEBHOOK_URL = "http://localhost:3000/api/webhooks/whatsapp";

// Mock payload from Meta
const mockPayload = {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "880991808335041",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "16505551111",
              "phone_number_id": "your-phone-number-id"
            },
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                },
                "wa_id": "16505551234"
              }
            ],
            "messages": [
              {
                "from": "16505551234",
                "id": "wamid." + Math.random().toString(36).substring(7),
                "timestamp": Math.floor(Date.now() / 1000).toString(),
                "text": {
                  "body": "Hello! I am testing the AI auto-reply feature."
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
};

async function testWebhook() {
  console.log("--- Testing WhatsApp Webhook Simulation ---");
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mockPayload)
    });

    const result = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Body:", JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log("\n✅ Webhook call successful!");
    } else {
      console.log("\n❌ Webhook call failed.");
    }
  } catch (error) {
    console.error("\n❌ Error sending request:", error.message);
  }
}

testWebhook();
