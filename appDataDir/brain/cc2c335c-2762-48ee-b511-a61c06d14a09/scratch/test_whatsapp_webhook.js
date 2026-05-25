/**
 * Simulation script for WhatsApp Webhook
 * 
 * This script sends a mock WhatsApp payload to the local webhook endpoint.
 * Useful for testing the end-to-end flow without a real WhatsApp setup.
 */

const WEBHOOK_URL = "http://localhost:3000/api/webhooks/whatsapp";
const VERIFY_TOKEN = "whatsapp-webhook-token"; // Should match env

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
              "phone_number_id": "your-phone-number-id" // This should match a workspace's whatsappBusinessPhoneId
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
                "id": "wamid.HBgLMTY1MDU1NTEyMzQVAgASGBAyRDM1QzQ1M0M0QjRCNUI0RTMA",
                "timestamp": "1603094671",
                "text": {
                  "body": "Hello! I am interested in your services. Can you tell me more?"
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
    console.log("Response Body:", result);
    
    if (response.ok) {
      console.log("\n✅ Webhook call successful!");
      console.log("Check your database for the new lead, conversation, and message.");
      console.log("If auto-reply was enabled, you should also see an AI message in the DB.");
    } else {
      console.log("\n❌ Webhook call failed.");
    }
  } catch (error) {
    console.error("\n❌ Error sending request:", error.message);
  }
}

testWebhook();
