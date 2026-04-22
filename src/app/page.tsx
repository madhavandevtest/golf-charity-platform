import Link from "next/link";
import { ArrowRight, HeartHandshake, MoveRight, Sparkles, Target, Trophy } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscriptionPlans } from "@/lib/constants/plans";
import { getFeaturedCharity, getLatestPublishedDraw, getPublicStats } from "@/lib/data/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, featuredCharity, latestDraw] = await Promise.all([
    getPublicStats(),
    getFeaturedCharity(),
    getLatestPublishedDraw(),
  ]);

  const highlights = [
    {
      icon: HeartHandshake,
      eyebrow: "Charity first",
      title: "Every subscription creates visible help, not vague goodwill.",
      copy: "Members choose a verified charity and keep giving attached to something they care about each month.",
    },
    {
      icon: Target,
      eyebrow: "Fresh performance",
      title: "Recent rounds shape your chances in a way that feels fair.",
      copy: "Only your latest Stableford form counts, so the experience stays active, current, and easy to trust.",
    },
    {
      icon: Trophy,
      eyebrow: "Transparent rewards",
      title: "The draw is exciting because it is clearly explained and openly published.",
      copy: "Winning numbers, prize splits, and results are easy to follow instead of hidden behind admin-only logic.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="hero-mesh grain overflow-hidden bg-[radial-gradient(circle_at_top,#226f61_0%,#12352d_40%,#081614_100%)] text-white">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="max-w-3xl">
                <Badge className="animate-fade-up bg-white/10 text-white ring-1 ring-white/12">
                  Modern giving, powered by golf
                </Badge>
                <h1 className="animate-fade-up stagger-1 mt-6 text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
                  Make every round feel bigger than the scorecard.
                </h1>
                <p className="animate-fade-up stagger-2 mt-6 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">
                  DriveChange turns your golf routine into something emotional and tangible: monthly charity impact,
                  transparent reward moments, and a subscription people feel proud to keep.
                </p>

                <div className="animate-fade-up stagger-3 mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="cta-glow cta-pulse h-13 bg-[var(--color-highlight-strong)] px-7 text-base text-[var(--color-panel-strong)] hover:bg-[#ffc56f]"
                  >
                    <Link href="/signup">
                      Subscribe & Start Giving
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="border border-white/10 bg-white/8 text-white hover:bg-white/14"
                  >
                    <Link href="/charities">Explore charities</Link>
                  </Button>
                </div>

                <div className="animate-fade-up stagger-4 mt-12 grid gap-4 sm:grid-cols-3">
                  <Card className="glass-panel rounded-[30px] p-5 text-white shadow-none">
                    <p className="text-sm text-white/62">Total donated</p>
                    <p className="mt-3 text-3xl font-semibold">{formatCurrency(stats.totalDonations)}</p>
                  </Card>
                  <Card className="glass-panel rounded-[30px] p-5 text-white shadow-none">
                    <p className="text-sm text-white/62">Subscribers</p>
                    <p className="mt-3 text-3xl font-semibold">{stats.subscribers}</p>
                  </Card>
                  <Card className="glass-panel rounded-[30px] p-5 text-white shadow-none">
                    <p className="text-sm text-white/62">Prize pool paid</p>
                    <p className="mt-3 text-3xl font-semibold">{formatCurrency(stats.totalPrizePool)}</p>
                  </Card>
                </div>
              </div>

              <div className="animate-slide-in lg:pl-6">
                <div className="glass-panel relative rounded-[36px] p-4 sm:p-6">
                  <div className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                    <Sparkles className="size-5 text-[var(--color-highlight)]" />
                  </div>

                  <div className="impact-card rounded-[28px] p-6 text-[var(--color-panel-strong)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
                      Featured charity impact
                    </p>
                    <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight">
                      {featuredCharity?.name ?? "Choose the cause your subscription supports"}
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-muted)]">
                      {featuredCharity?.summary ??
                        "Every subscription directs a meaningful portion of revenue into a verified charity selected by the member."}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[24px] bg-[var(--color-surface)]/85 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-brand)]">Impact signal</p>
                        <p className="mt-3 text-base font-medium text-[var(--color-panel-strong)]">
                          {featuredCharity?.impact_stat ??
                            "At least 10% of each subscription is directed to the charity the member chooses."}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-[var(--color-brand-deep)] p-4 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/52">Why it matters</p>
                        <p className="mt-3 text-base font-medium text-white/88">
                          The product feels good to use because the outcome matters off the course too.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-[28px] border border-white/10 bg-[rgba(3,12,10,0.48)] p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Latest draw</p>
                      <p className="mt-3 text-2xl font-semibold">{latestDraw?.title ?? "Coming soon"}</p>
                      <p className="mt-4 text-sm leading-7 text-white/68">
                        Winning numbers: {latestDraw?.winning_numbers?.join(" • ") ?? "Awaiting first publication"}
                      </p>
                    </div>
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-5 text-white">
                      <div className="animate-orbit absolute left-1/2 top-1/2 -ml-11 -mt-11 flex size-22 items-center justify-center rounded-full border border-white/10">
                        <div className="size-3 rounded-full bg-[var(--color-highlight)]" />
                      </div>
                      <div className="animate-drift relative z-10">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/45">Member feeling</p>
                        <p className="mt-10 max-w-[11rem] text-lg font-semibold leading-snug">
                          Subscribe once. Help monthly. Win occasionally.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="section-shell rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="max-w-xl">
                <Badge className="bg-[var(--color-surface)] text-[var(--color-panel-strong)]">Why it stands out</Badge>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  It feels more like a meaningful product than a typical golf website.
                </h2>
                <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
                  The story starts with impact, then shows the member experience, then reveals the draw. That keeps the
                  design emotional, clean, and easier to remember.
                </p>
                <Link
                  href="/how-it-works"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] transition hover:gap-3"
                >
                  See the full member journey
                  <MoveRight className="size-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {highlights.map((item, index) => (
                  <Card
                    key={item.title}
                    className={`animate-fade-up rounded-[30px] bg-[rgba(255,255,255,0.68)] ${
                      index === 1 ? "stagger-1" : index === 2 ? "stagger-2" : ""
                    }`}
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
                      <item.icon className="size-6 text-[var(--color-brand)]" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{item.copy}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="animate-fade-up overflow-hidden rounded-[34px] bg-[linear-gradient(160deg,#10221d_0%,#16332c_55%,#21493f_100%)] p-0 text-white">
              <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">How it works</p>
                <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight">
                  Simple enough to trust, polished enough to feel special.
                </h2>
              </div>
              <div className="grid gap-0">
                {[
                  "Subscribe once and choose the charity you want your membership to support.",
                  "Keep your latest Stableford form up to date so your active performance stays current.",
                  "Follow the monthly draw and published results with clear prize splits and visible outcomes.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-4 border-t border-white/10 px-6 py-6 sm:px-8">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      0{index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-white/75">{step}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="animate-fade-up stagger-2 rounded-[34px] bg-[rgba(255,255,255,0.72)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-brand)]">Membership</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    A strong subscribe moment with visible value.
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-6 text-[var(--color-muted)]">
                  The pricing story stays simple: meaningful giving, a clean product, and monthly excitement.
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                {subscriptionPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`rounded-[26px] border border-[var(--color-line)] bg-white/88 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] ${
                      index === 1 ? "sm:translate-x-2" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-md">
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{plan.description}</p>
                      </div>
                      <p className="text-2xl font-semibold text-[var(--color-panel-strong)]">
                        {formatCurrency(plan.amountCents)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[30px] bg-[linear-gradient(135deg,#0d5f52_0%,#113c35_100%)] p-6 text-white shadow-[var(--shadow-soft)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/55">Ready to join</p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-md text-lg font-semibold leading-8">
                    Subscribe now and turn the next month of golf into help someone can actually feel.
                  </p>
                  <Button
                    asChild
                    className="cta-glow h-13 bg-[var(--color-highlight-strong)] px-7 text-base text-[var(--color-panel-strong)] hover:bg-[#ffc56f]"
                  >
                    <Link href="/signup">
                      Subscribe Now
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
