import { SubscriptionsTable } from "@/components/admin/subscriptions-table";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const data = await getAdminDashboardData();
  const activeSubscriptions = data.subscriptions.filter(
    (subscription) => subscription.status === "active" || subscription.status === "trialing",
  );
  const monthlyRevenue = activeSubscriptions.reduce((sum, subscription) => {
    if (subscription.plan === "monthly") return sum + subscription.amount_cents;
    return sum + Math.round(subscription.amount_cents / 12);
  }, 0);
  const yearlyRevenue = activeSubscriptions.reduce((sum, subscription) => {
    if (subscription.plan === "yearly") return sum + subscription.amount_cents;
    return sum + subscription.amount_cents * 12;
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Subscription Management</h1>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Total active</p>
          <p className="mt-3 text-3xl font-semibold">{activeSubscriptions.length}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Estimated monthly revenue</p>
          <p className="mt-3 text-3xl font-semibold">{formatCurrency(monthlyRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Estimated yearly revenue</p>
          <p className="mt-3 text-3xl font-semibold">{formatCurrency(yearlyRevenue)}</p>
        </Card>
      </div>

      <Card>
        <SubscriptionsTable subscriptions={data.subscriptions} />
      </Card>
    </div>
  );
}
