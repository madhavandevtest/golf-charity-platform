"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === "true";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          if (isMockMode) {
            document.cookie = "mock_auth_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
            router.push("/");
            router.refresh();
            return;
          }
          const supabase = createClient();
          await supabase.auth.signOut();
          router.push("/");
          router.refresh();
        })
      }
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
