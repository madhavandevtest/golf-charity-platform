import { headers } from "next/headers";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/admin";

  return (
    <DashboardShell pathname={pathname} isAdmin>
      {children}
    </DashboardShell>
  );
}
