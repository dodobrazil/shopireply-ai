export const PLAN_LIMITS = {
  free: 10,
  starter: 500,
  pro: 2000,
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export function getRemainingGenerations(
  plan: Plan,
  usedCount: number
): number {
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return Math.max(0, limit - usedCount);
}

export function hasGenerationsLeft(
  plan: Plan,
  usedCount: number
): boolean {
  return getRemainingGenerations(plan, usedCount) > 0;
}

export function getUsagePercentage(
  plan: Plan,
  usedCount: number
): number {
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return Math.min(100, Math.round((usedCount / limit) * 100));
}

export function getPlanDisplayName(plan: Plan): string {
  const names = {
    free: "Free",
    starter: "Starter",
    pro: "Pro",
  };
  return names[plan] || "Free";
}

export function getPlanPriceUSD(plan: Plan): number | null {
  const prices = {
    free: null,
    starter: 9.99,
    pro: 19.99,
  };
  return prices[plan];
}

export function getPlanPriceTRY(plan: Plan): number | null {
  const prices = {
    free: null,
    starter: 299,
    pro: 599,
  };
  return prices[plan];
}

export function formatUsageMessage(
  plan: Plan,
  usedCount: number,
  lang: "en" | "tr" = "en"
): string {
  const remaining = getRemainingGenerations(plan, usedCount);
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  if (lang === "tr") {
    return `Bu ay ${usedCount}/${limit} üretim kullandınız. ${remaining} adet kaldı.`;
  }
  return `${usedCount}/${limit} generations used this month. ${remaining} remaining.`;
}
