import { AdminCharityManager } from "@/components/dashboard/admin-charity-manager";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function AdminCharitiesPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Charity management</h1>
        <p className="mt-3 text-sm text-[var(--color-muted)]">Create, update, feature, or deactivate partner charities.</p>
      </Card>
      <AdminCharityManager charities={data.charities} />
    </div>
  );
}
