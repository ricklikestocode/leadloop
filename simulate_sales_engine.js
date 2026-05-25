/**
 * Test script for Sales Engine AI behavior
 * This script simulates a WhatsApp conversation and verifies intent detection.
 */

const { generateAIReply } = require("./lib/ai");

async function testSalesEngine() {
  console.log("🚀 Starting Sales Engine Simulation...");

  const businessContext = {
    businessType: "Premium SaaS for Marketing Agencies",
    businessTone: "PROFESSIONAL",
    pricingInfo: "Starter: $99/mo, Pro: $299/mo, Enterprise: Custom",
    servicesInfo: "AI-powered lead generation, automated follow-ups, and CRM integration.",
    conversionGoal: "BOOK_CALL",
  };

  const tests = [
    {
      name: "WARM Intent Detection",
      message: "How does your pricing work?",
      expectedIntent: "WARM",
    },
    {
      name: "HOT Intent Detection",
      message: "I love this! How can I sign up and pay right now?",
      expectedIntent: "HOT",
    },
    {
      name: "COLD Intent Detection",
      message: "I'm just looking around, not sure if we need this yet.",
      expectedIntent: "COLD",
    },
    {
      name: "DEAD Intent Detection",
      message: "Stop messaging me, I'm not interested.",
      expectedIntent: "DEAD",
    }
  ];

  for (const test of tests) {
    console.log(`\n-------------------`);
    console.log(`🧪 Test: ${test.name}`);
    console.log(`User: "${test.message}"`);

    try {
      const response = await generateAIReply(test.message, {
        context: {
          ...businessContext,
          leadName: "Test User",
        }
      });

      if (response.success) {
        console.log(`AI Intent: ${response.intent}`);
        console.log(`AI Reply: "${response.message}"`);
        console.log(`Suggested Action: ${response.suggestedAction}`);

        if (response.intent === test.expectedIntent) {
          console.log(`✅ Success: Intent matches expected ${test.expectedIntent}`);
        } else {
          console.log(`⚠️ Warning: Intent mismatch. Expected ${test.expectedIntent}, got ${response.intent}`);
        }
      } else {
        console.log(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      console.log(`❌ Critical Error: ${error.message}`);
    }
  }

  console.log(`\n-------------------`);
  console.log("🏁 Simulation Complete.");
}

// Since lib/ai.ts uses ES modules and fetch, we might need a wrapper or use ts-node
// For now, I'll just create the script. The user can run it or I can try running it with ts-node if available.
testSalesEngine();
