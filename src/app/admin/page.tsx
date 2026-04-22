import { DrawControls } from "@/components/forms/draw-controls";
import { PublishDrawButton } from "@/components/forms/publish-draw-button";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  const latestDraw = data.draws[0];
  const totalDonations = data.contributions.reduce((sum, row) => sum + row.charity_amount_cents, 0);
  const totalPrizePool = data.draws.reduce((sum, row) => sum + row.prize_pool_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[30px] bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Admin analytics</p>
          <h1 className="mt-3 text-4xl font-semibold">Operational control center</h1>
        </div>
        <SignOutButton />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-[var(--color-muted)]">Users</p><p className="mt-2 text-3xl font-semibold">{data.userCount}</p></Card>
        <Card><p className="text-sm text-[var(--color-muted)]">Prize pool</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(totalPrizePool)}</p></Card>
        <Card><p className="text-sm text-[var(--color-muted)]">Donations</p><p className="mt-2 text-3xl font-semibold">{formatCurrency(totalDonations)}</p></Card>
        <Card><p className="text-sm text-[var(--color-muted)]">Draws</p><p className="mt-2 text-3xl font-semibold">{data.draws.length}</p></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-2xl font-semibold">Run this month&apos;s draw</h2>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Simulation recalculates winning numbers, prize pool, and subscriber match results.</p>
          <div className="mt-6">
            <DrawControls drawMonth={`${new Date().toISOString().slice(0, 7)}-01`} />
          </div>
          {latestDraw ? (
            <div className="mt-4">
              <PublishDrawButton drawId={latestDraw.id} />
            </div>
          ) : null}
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Recent winner queue</h2>
          <div className="mt-6 space-y-3">
            {data.winners.slice(0, 6).map((winner) => (
              <div key={winner.id} className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm">
                <p className="font-semibold capitalize">{winner.verification_status.replace("_", " ")}</p>
                <p className="text-[var(--color-muted)]">{winner.payment_status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
