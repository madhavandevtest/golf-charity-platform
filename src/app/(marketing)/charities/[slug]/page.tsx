import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCharityBySlug } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function CharityProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug).catch(() => null);

  if (!charity) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-[var(--color-panel-strong)] text-white">
          <p className="text-sm uppercase tracking-[0.18em] text-white/55">{charity.category}</p>
          <h1 className="mt-4 text-5xl font-semibold">{charity.name}</h1>
          <p className="mt-4 text-lg leading-8 text-white/75">{charity.summary}</p>
          <p className="mt-6 rounded-2xl bg-white/10 px-5 py-4 text-sm font-medium">{charity.impact_stat}</p>
        </Card>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <h2 className="text-2xl font-semibold">Why members choose this cause</h2>
            <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">{charity.description}</p>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Details</p>
            <div className="mt-4 space-y-4 text-sm">
              <p>{charity.location}</p>
              {charity.website_url ? (
                <Link href={charity.website_url} target="_blank" className="font-semibold text-[var(--color-brand)]">
                  Visit website
                </Link>
              ) : null}
            </div>
            <Button asChild className="mt-8 w-full">
              <Link href={`/signup?charity=${charity.id}`}>Support this charity</Link>
            </Button>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
