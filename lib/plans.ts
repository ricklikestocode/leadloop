export const PLANS = {
  FREE: {
    name: "Free",
    leadLimit: 50,
    messageLimit: 200,
    aiCallLimit: 50,
  },
  PRO: {
    name: "Pro",
    leadLimit: 1000,
    messageLimit: 5000,
    aiCallLimit: 1000,
  },
  ENTERPRISE: {
    name: "Enterprise",
    leadLimit: Infinity,
    messageLimit: Infinity,
    aiCallLimit: Infinity,
  },
};

export function checkPlanLimit(
  currentCount: number,
  plan: keyof typeof PLANS,
  type: "leadLimit" | "messageLimit" | "aiCallLimit"
) {
  const limit = PLANS[plan][type];
  return currentCount < limit;
}
