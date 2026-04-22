import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscriptionPlans } from "@/lib/constants/plans";
import { formatCurrency } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-brand)]">Pricing</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Subscriber plans built around impact.</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">
            Both plans unlock the same product experience. The difference is your billing cadence and long-term momentum.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">{plan.billingLabel}</p>
                <p className="mt-4 text-5xl font-semibold">{formatCurrency(plan.amountCents)}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{plan.description}</p>
                <div className="mt-6 space-y-3 text-sm text-[var(--color-ink)]">
                  {plan.features.map((feature) => (
                    <p key={feature}>{feature}</p>
                  ))}
                </div>
              </div>
              <Button asChild className="mt-8 w-full">
                <Link href={`/signup?plan=${plan.id}`}>Choose {plan.name}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
