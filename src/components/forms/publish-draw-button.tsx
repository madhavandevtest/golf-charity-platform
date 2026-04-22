"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function PublishDrawButton({ drawId }: { drawId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const response = await fetch("/api/draws/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ drawId }),
          });
          const payload = await response.json();

          if (!response.ok) {
            toast.error(payload.error ?? "Publish failed.");
            return;
          }

          toast.success("Draw published.");
          window.location.reload();
        })
      }
    >
      {isPending ? "Publishing..." : "Publish draw"}
    </Button>
  );
}
