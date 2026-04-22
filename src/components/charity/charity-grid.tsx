import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Charity } from "@/types";

export function CharityGrid({ charities }: { charities: Charity[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {charities.map((charity) => (
        <Card key={charity.id}>
          <div className="flex items-center justify-between gap-4">
            <Badge>{charity.category}</Badge>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {charity.location}
            </span>
          </div>
          <h2 className="mt-6 text-2xl font-semibold">{charity.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{charity.summary}</p>
          <p className="mt-6 rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm font-medium">
            {charity.impact_stat}
          </p>
          <Link href={`/charities/${charity.slug}`} className="mt-6 inline-flex text-sm font-semibold text-[var(--color-brand)]">
            View charity profile
          </Link>
        </Card>
      ))}
    </div>
  );
}
