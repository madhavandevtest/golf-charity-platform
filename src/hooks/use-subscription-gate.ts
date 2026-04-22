"use client";

import { useMemo } from "react";

import type { Subscription } from "@/types";

export function useSubscriptionGate(subscription?: Subscription | null) {
  return useMemo(() => {
    const active =
      subscription?.status === "active" || subscription?.status === "trialing";

    return {
      active,
      label: active ? "Subscriber active" : "Subscription required",
    };
  }, [subscription]);
}
