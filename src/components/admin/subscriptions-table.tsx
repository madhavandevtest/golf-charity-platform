"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Subscription } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type FilterStatus = "all" | "active" | "inactive" | "canceled";

function normalizeStatus(status: Subscription["status"]): Exclude<FilterStatus, "all"> {
  if (status === "active" || status === "trialing") return "active";
  if (status === "canceled" || status === "expired") return "canceled";
  return "inactive";
}

export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const matchesQuery =
        !term ||
        [
          subscription.users?.email ?? "",
          subscription.users?.full_name ?? "",
          subscription.stripe_subscription_id ?? "",
          subscription.plan,
          subscription.status,
        ].some((value) => value.toLowerCase().includes(term));

      const normalizedStatus = normalizeStatus(subscription.status);
      const matchesStatus = status === "all" || normalizedStatus === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status, subscriptions]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          placeholder="Search by email, plan, or Stripe ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value as FilterStatus)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="canceled">Canceled</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white">
        <div className="hidden grid-cols-[1.3fr_0.8fr_0.9fr_0.8fr_1fr_1.2fr] gap-4 border-b border-[var(--color-line)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] lg:grid">
          <p>User email</p>
          <p>Plan</p>
          <p>Status</p>
          <p>Amount</p>
          <p>Period end</p>
          <p>Stripe subscription ID</p>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-sm text-[var(--color-muted)]">No subscriptions match the current filters.</div>
        ) : (
          filtered.map((subscription) => (
            <div
              key={subscription.id}
              className="grid gap-3 border-t border-[var(--color-line)] px-5 py-4 first:border-t-0 lg:grid-cols-[1.3fr_0.8fr_0.9fr_0.8fr_1fr_1.2fr] lg:items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">User email</p>
                <p className="font-medium">{subscription.users?.email ?? "Unknown user"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Plan</p>
                <Badge>{subscription.plan}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Status</p>
                <Badge className="capitalize">{subscription.status.replace("_", " ")}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Amount</p>
                <p>{formatCurrency(subscription.amount_cents)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Period end</p>
                <p>{subscription.current_period_end?.slice(0, 10) ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Stripe ID</p>
                <p className="break-all text-sm text-[var(--color-muted)]">
                  {subscription.stripe_subscription_id ?? "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
