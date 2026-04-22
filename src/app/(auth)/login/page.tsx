import Link from "next/link";

import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-16">
      <Card className="w-full">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--color-brand)]">Welcome back</p>
        <h1 className="mt-4 text-4xl font-semibold">Log in to your member dashboard.</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          Manage your subscription, update your latest scores, and track draw outcomes in one place.
        </p>
        <div className="mt-8">
          <LoginForm redirectTo={redirectTo} />
        </div>
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-[var(--color-brand)]">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
