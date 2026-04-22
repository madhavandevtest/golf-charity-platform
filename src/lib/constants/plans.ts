import type { SubscriptionPlan } from "@/lib/types";

export const subscriptionPlans: Array<{
  id: SubscriptionPlan;
  name: string;
  billingLabel: string;
  description: string;
  amountCents: number;
  features: string[];
}> = [
  {
    id: "monthly",
    name: "Monthly Impact",
    billingLabel: "Charged monthly",
    description: "Flexible access with charity-first impact and monthly draw eligibility.",
    amountCents: 2900,
    features: [
      "Full subscriber dashboard access",
      "Automatic entry into the monthly draw",
      "Custom charity contribution percentage",
      "Winner verification and payout tracking",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Momentum",
    billingLabel: "Charged yearly",
    description: "Best value plan with uninterrupted access and stronger annual giving momentum.",
    amountCents: 29000,
    features: [
      "Everything in Monthly Impact",
      "Reduced effective monthly cost",
      "Priority supporter badge",
      "Annual giving summary for your chosen charity",
    ],
  },
];
