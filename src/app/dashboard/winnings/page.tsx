import { WinnerProofForm } from "@/components/forms/winner-proof-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WinningsPage() {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);
  const totalWinnings = data.winners.reduce(
    (sum, winner) => sum + (winner.draw_results?.prize_amount_cents ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Your Winnings</h1>
      </Card>

      <Card>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Total winnings</p>
        <p className="mt-3 text-4xl font-semibold">{formatCurrency(totalWinnings)}</p>
      </Card>

      <div className="space-y-4">
        {data.winners.length === 0 ? (
          <Card>
            <p className="text-sm text-[var(--color-muted)]">No winnings recorded yet.</p>
          </Card>
        ) : (
          data.winners.map((winner) => (
            <Card key={winner.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {winner.draw_results?.draws?.title ?? "Draw result"}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Prize amount: {formatCurrency(winner.draw_results?.prize_amount_cents ?? 0)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="capitalize">{winner.verification_status.replace("_", " ")}</Badge>
                  <Badge className="capitalize">{winner.payment_status}</Badge>
                  {winner.verification_status === "approved" && winner.payment_status === "pending" ? (
                    <Badge>Awaiting payout</Badge>
                  ) : null}
                </div>
              </div>
              {winner.verification_status !== "approved" ? (
                <div className="mt-6">
                  <WinnerProofForm winnerId={winner.id} userId={user.id} />
                </div>
              ) : null}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
