import { ScoreManager } from "@/components/dashboard/score-manager";
import { ScoreForm } from "@/components/forms/score-form";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboardData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function ScoresPage() {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Your Stableford Scores</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          You can store up to 5 scores. The oldest is removed when a 6th is added.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">Add a new score</h2>
        <div className="mt-6">
          <ScoreForm />
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">Stored scores</h2>
        <div className="mt-6">
          <ScoreManager initialScores={data.scores} />
        </div>
      </Card>
    </div>
  );
}
