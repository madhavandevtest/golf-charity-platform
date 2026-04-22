import { headers } from "next/headers";

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/dashboard";

  return <DashboardShell pathname={pathname}>{children}</DashboardShell>;
}
