import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCharities } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CharitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const charities = await getCharities(q);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-brand)]">Charities</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight">Choose the mission your membership advances.</h1>
          </div>
          <form className="w-full max-w-md">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search by name, category, or location"
              className="h-12 w-full rounded-full border border-[var(--color-line)] bg-white px-5 text-sm outline-none focus:border-[var(--color-brand)]"
            />
          </form>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {charities.map((charity) => (
            <Card key={charity.id}>
              <div className="flex items-center justify-between gap-4">
                <Badge>{charity.category}</Badge>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">{charity.location}</span>
              </div>
              <h2 className="mt-6 text-2xl font-semibold">{charity.name}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{charity.summary}</p>
              <p className="mt-6 rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm font-medium">{charity.impact_stat}</p>
              <Link href={`/charities/${charity.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[var(--color-brand)]">
                View charity profile
              </Link>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
