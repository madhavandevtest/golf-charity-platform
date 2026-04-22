import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DrawsPage() {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Draw Participation</h1>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Upcoming draw</p>
          <p className="mt-3 text-2xl font-semibold">
            {data.upcomingDraw?.draw_month ?? "Next month to be scheduled"}
          </p>
        </Card>
        <Card>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Subscribers entered</p>
          <p className="mt-3 text-2xl font-semibold">{data.subscriberCount}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold">Participation history</h2>
        <div className="mt-6 overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white">
          <div className="hidden grid-cols-[1fr_1.1fr_1fr_0.8fr_0.9fr_0.8fr] gap-4 border-b border-[var(--color-line)] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)] lg:grid">
            <p>Draw month</p>
            <p>Your numbers</p>
            <p>Matched numbers</p>
            <p>Match count</p>
            <p>Prize amount</p>
            <p>Status</p>
          </div>
          {data.results.length === 0 ? (
            <div className="px-5 py-8 text-sm text-[var(--color-muted)]">No draw participation yet.</div>
          ) : (
            data.results.map((result) => (
              <div
                key={result.id}
                className="grid gap-3 border-t border-[var(--color-line)] px-5 py-4 first:border-t-0 lg:grid-cols-[1fr_1.1fr_1fr_0.8fr_0.9fr_0.8fr] lg:items-center"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Draw month</p>
                  <p>{result.draws?.draw_month ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Your numbers</p>
                  <p>{result.entry_numbers.join(" • ")}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Matched numbers</p>
                  <p>{result.matched_numbers.length ? result.matched_numbers.join(" • ") : "None"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Match count</p>
                  <p>{result.match_count}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Prize amount</p>
                  <p>{formatCurrency(result.prize_amount_cents)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] lg:hidden">Status</p>
                  <p>{result.draws?.status ?? "draft"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
