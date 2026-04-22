import Stripe from "stripe";

import { env } from "@/lib/env";
import { subscriptionPlans } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/types";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });
  }

  return stripeClient;
}

export function getPriceId(plan: SubscriptionPlan) {
  if (plan === "monthly") {
    return env.STRIPE_MONTHLY_PRICE_ID;
  }

  return env.STRIPE_YEARLY_PRICE_ID;
}

export function getPlanById(plan: SubscriptionPlan) {
  return subscriptionPlans.find((item) => item.id === plan);
}
