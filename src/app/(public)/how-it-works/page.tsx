import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-brand)]">How it works</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Subscribe, submit scores, fund impact, and enter the monthly draw.
          </h1>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card>
            <h2 className="text-2xl font-semibold">1. Subscribe with purpose</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Choose monthly or yearly access, pick a charity, and commit at least 10% of your fee to impact.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold">2. Keep your five latest scores</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Your newest five Stableford rounds become your active score snapshot for draw matching.
            </p>
          </Card>
          <Card>
            <h2 className="text-2xl font-semibold">3. Watch the draw and prize flow</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Each month the admin team simulates, reviews, and publishes the draw. Winners upload proof before payout.
            </p>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
