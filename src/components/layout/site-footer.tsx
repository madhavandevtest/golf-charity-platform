export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.58))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--color-muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-[var(--color-panel-strong)]">DriveChange</p>
          <p className="mt-1">Performance-led golf, transparent rewards, and measurable charity impact.</p>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.25em]">Next.js / Supabase / Stripe / Vercel</p>
      </div>
    </footer>
  );
}
