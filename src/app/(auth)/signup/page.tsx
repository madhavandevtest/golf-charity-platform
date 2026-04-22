import Link from "next/link";

import { SignupForm } from "@/components/forms/signup-form";
import { Card } from "@/components/ui/card";
import { getCharities } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ charity?: string; plan?: "monthly" | "yearly" }>;
}) {
  const charities = await getCharities();
  const { charity, plan } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-16">
      <Card className="w-full">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Join DriveChange</p>
        <h1 className="mt-4 text-4xl font-semibold">Create your subscriber account.</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Pick your charity, choose your contribution percentage, and unlock monthly draw eligibility.
        </p>
        <div className="mt-8">
          <SignupForm charities={charities} selectedCharityId={charity} selectedPlan={plan} />
        </div>
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-brand)]">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
