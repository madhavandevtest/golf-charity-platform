import Link from "next/link";
import { LayoutDashboard, HeartHandshake, Trophy, CreditCard, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/scores", label: "Scores", icon: Trophy },
  { href: "/dashboard/draws", label: "Draws", icon: Trophy },
  { href: "/dashboard/winnings", label: "Winnings", icon: CreditCard },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/settings", label: "Impact Settings", icon: HeartHandshake },
];

const adminItems = [
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/admin/draws", label: "Draw Engine", icon: Trophy },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/charities", label: "Charities", icon: HeartHandshake },
  { href: "/admin/winners", label: "Winners", icon: ShieldCheck },
];

export function DashboardShell({
  children,
  pathname,
  isAdmin = false,
}: {
  children: React.ReactNode;
  pathname: string;
  isAdmin?: boolean;
}) {
  const navigation = isAdmin ? adminItems : items;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="rounded-[30px] bg-[var(--color-panel-strong)] p-5 text-white shadow-[0_25px_60px_rgba(8,22,20,0.18)]">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">DriveChange</p>
            <h2 className="mt-2 text-2xl font-semibold">Member space</h2>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    pathname === item.href ? "bg-white text-[var(--color-panel-strong)]" : "text-white/72 hover:bg-white/10",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
