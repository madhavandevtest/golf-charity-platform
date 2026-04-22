import { CreditCard, HeartHandshake, Trophy, Wallet } from "lucide-react";

import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { ScoreForm } from "@/components/forms/score-form";
import { WinnerProofForm } from "@/components/forms/winner-proof-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboardData } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);
  const activeSubscription =
    data.subscription?.status === "active" || data.subscription?.status === "trialing";
  const winnings = data.results.reduce((sum, item) => sum + item.prize_amount_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[30px] bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Overview</p>
          <h1 className="mt-2 text-4xl font-semibold">Your performance and impact dashboard</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: CreditCard, label: "Subscription", value: data.subscription?.status ?? "inactive" },
          { icon: Trophy, label: "Stored scores", value: `${data.scores.length} / 5` },
          { icon: HeartHandshake, label: "Charity split", value: `${data.profile?.charity_percentage ?? 10}%` },
          { icon: Wallet, label: "Total winnings", value: formatCurrency(winnings) },
        ].map((item) => (
          <Card key={item.label}>
            <item.icon className="size-5 text-[var(--color-brand)]" />
            <p className="mt-4 text-sm text-[var(--color-muted)]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold capitalize">{item.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Enter a new Stableford score</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Only the five latest scores are kept. Adding a sixth removes the oldest automatically.</p>
          </div>
          <Badge>{activeSubscription ? "Subscriber active" : "Subscription needed"}</Badge>
        </div>
        <div className="mt-6">
          <ScoreForm />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-2xl font-semibold">Latest scores</h2>
          <div className="mt-6 space-y-3">
            {data.scores.map((score) => (
              <div key={score.id} className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">{score.stableford_points} pts</p>
                  <p className="text-[var(--color-muted)]">{score.course_name ?? "Course not specified"}</p>
                </div>
                <p className="font-mono text-xs">{score.played_on}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Recent draw participation</h2>
          <div className="mt-6 space-y-3">
            {data.results.slice(0, 5).map((result) => (
              <div key={result.id} className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{result.match_count} matches</p>
                  <p>{formatCurrency(result.prize_amount_cents)}</p>
                </div>
                <p className="mt-2 text-[var(--color-muted)]">Entry: {result.entry_numbers.join(" • ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold">Winner verification</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {data.winners.map((winner) => (
            <div key={winner.id} className="rounded-[24px] border border-[var(--color-line)] bg-white p-5">
              <p className="text-sm font-semibold capitalize">{winner.verification_status.replace("_", " ")}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Payment: {winner.payment_status}</p>
              {winner.verification_status !== "approved" ? (
                <div className="mt-4">
                  <WinnerProofForm winnerId={winner.id} userId={user.id} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
