import { WinnerReviewPanel } from "@/components/dashboard/winner-review-panel";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminWinnersPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Winner verification</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">Review proof uploads, approve winnings, and mark payouts as paid.</p>
      </Card>
      <WinnerReviewPanel winners={data.winners} />
    </div>
  );
}
