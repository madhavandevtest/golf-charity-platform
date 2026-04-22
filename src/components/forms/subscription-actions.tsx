"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/lib/types";

export function SubscriptionActions({
  plan,
  hasActiveSubscription,
}: {
  plan: SubscriptionPlan;
  hasActiveSubscription: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const launchCheckout = () =>
    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        toast.error(payload.error ?? "Unable to start checkout.");
        return;
      }
      window.location.href = payload.url;
    });

  const openPortal = () =>
    startTransition(async () => {
      const response = await fetch("/api/billing-portal", {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        toast.error(payload.error ?? "Unable to open billing portal.");
        return;
      }

      window.location.href = payload.url;
    });

  return hasActiveSubscription ? (
    <Button type="button" variant="ghost" disabled={isPending} onClick={openPortal}>
      {isPending ? "Opening..." : "Manage billing"}
    </Button>
  ) : (
    <Button type="button" disabled={isPending} onClick={launchCheckout}>
      {isPending ? "Starting..." : `Subscribe to ${plan}`}
    </Button>
  );
}
