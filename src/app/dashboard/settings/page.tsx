import Link from "next/link";

import { CharityPercentageForm } from "@/components/dashboard/charity-percentage-form";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserDashboardData } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const data = await getUserDashboardData(user.id);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-4xl font-semibold">Account Settings</h1>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">Charity selection</h2>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          {data.profile?.charities?.name ?? "No charity selected"} · Current percentage:{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            {data.profile?.charity_percentage ?? 10}%
          </span>
        </p>
        <div className="mt-6">
          <CharityPercentageForm currentPercentage={Number(data.profile?.charity_percentage ?? 10)} />
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">Subscription status</h2>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Status: <span className="font-semibold capitalize text-[var(--color-ink)]">{data.subscription?.status ?? "inactive"}</span>
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Renewal date: <span className="font-semibold text-[var(--color-ink)]">{data.subscription?.current_period_end?.slice(0, 10) ?? "Not available"}</span>
        </p>
        <Link href="/dashboard/subscription" className="mt-6 inline-flex text-sm font-semibold text-[var(--color-brand)]">
          Manage your plan
        </Link>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold">Session</h2>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>
    </div>
  );
}
