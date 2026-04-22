import Link from "next/link";

import { PublishDrawButton } from "@/components/forms/publish-draw-button";
import { DrawControls } from "@/components/forms/draw-controls";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDrawsPage() {
  const data = await getAdminDashboardData();
  const totalPrizePool = data.draws.reduce((sum, draw) => sum + draw.prize_pool_cents, 0);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Draw Management</h1>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Total draws</p>
          <p className="mt-3 text-3xl font-semibold">{data.draws.length}</p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Total prize pool paid out</p>
          <p className="mt-3 text-3xl font-semibold">{formatCurrency(totalPrizePool)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold">Run simulation</h2>
        <div className="mt-6">
          <DrawControls drawMonth={`${new Date().toISOString().slice(0, 7)}-01`} />
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">All draws</h2>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white">
          <div className="hidden grid-cols-[0.8fr_0.8fr_1.2fr_0.8fr_0.8fr_0.9fr_0.9fr_1fr] gap-4 border-b border-[var(--color-line)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] xl:grid">
            <p>Month</p>
            <p>Status</p>
            <p>Winning numbers</p>
            <p>Prize pool</p>
            <p>Rollover</p>
            <p>Simulated at</p>
            <p>Published at</p>
            <p>Actions</p>
          </div>
          {data.draws.map((draw) => (
            <div
              key={draw.id}
              className="grid gap-3 border-t border-[var(--color-line)] px-5 py-4 first:border-t-0 xl:grid-cols-[0.8fr_0.8fr_1.2fr_0.8fr_0.8fr_0.9fr_0.9fr_1fr] xl:items-center"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Month</p>
                <p>{draw.draw_month}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Status</p>
                <Badge className="capitalize">{draw.status}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Winning numbers</p>
                <p>{draw.winning_numbers.length ? draw.winning_numbers.join(" • ") : "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Prize pool</p>
                <p>{formatCurrency(draw.prize_pool_cents)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Rollover</p>
                <p>{formatCurrency(draw.rollover_cents)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Simulated at</p>
                <p>{draw.simulated_at?.slice(0, 10) ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] xl:hidden">Published at</p>
                <p>{draw.published_at?.slice(0, 10) ?? "—"}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {draw.status === "simulated" ? <PublishDrawButton drawId={draw.id} /> : null}
                {draw.status === "published" ? (
                  <Link href="/admin/winners" className="text-sm font-semibold text-[var(--color-brand)]">
                    View Results
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
