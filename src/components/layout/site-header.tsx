import Link from "next/link";

import { Button } from "@/components/ui/button";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/charities", label: "Charities" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,22,20,0.68)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] font-black shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            DG
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">DriveChange</p>
            <p className="font-semibold">Golf that gives back</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition hover:text-white after:absolute after:left-0 after:top-full after:mt-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-highlight)] after:transition after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="secondary"
            className="hidden border border-white/10 bg-white/8 text-white hover:bg-white/14 sm:inline-flex"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="cta-glow bg-[var(--color-highlight-strong)] text-[var(--color-panel-strong)] hover:bg-[#ffc56f]">
            <Link href="/signup">Subscribe Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
