import { Card } from "@/components/ui/card";
import { SubscriptionActions } from "@/components/forms/subscription-actions";
import { requireUser } from "@/lib/auth/session";
import { subscriptionPlans } from "@/lib/constants/plans";
import { getUserDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: "monthly" | "yearly" }>;
}) {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);
  const { plan = "monthly" } = await searchParams;
  const hasActiveSubscription =
    data.subscription?.status === "active" || data.subscription?.status === "trialing";

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Subscription management</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Current status: <span className="font-semibold capitalize text-[var(--color-ink)]">{data.subscription?.status ?? "inactive"}</span>
        </p>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {subscriptionPlans.map((item) => (
          <Card key={item.id} className={item.id === plan ? "ring-2 ring-[var(--color-brand)]" : undefined}>
            <h2 className="text-2xl font-semibold">{item.name}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{item.description}</p>
            <p className="mt-4 text-4xl font-semibold">{formatCurrency(item.amountCents)}</p>
            <div className="mt-6">
              <SubscriptionActions plan={item.id} hasActiveSubscription={hasActiveSubscription} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
