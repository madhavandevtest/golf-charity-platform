"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CharityPercentageForm({ currentPercentage }: { currentPercentage: number }) {
  const [value, setValue] = useState(String(currentPercentage));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Input
          type="number"
          min={10}
          max={100}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const response = await fetch("/api/user/charity-percentage", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ charityPercentage: Number(value) }),
              });
              const payload = await response.json();

              if (!response.ok) {
                toast.error(payload.error ?? "Unable to update charity percentage.");
                return;
              }

              toast.success("Charity percentage updated.");
              window.location.reload();
            })
          }
        >
          {isPending ? "Saving..." : "Update percentage"}
        </Button>
      </div>
      <p className="text-xs text-[var(--color-muted)]">Choose a value between 10% and 100%.</p>
    </div>
  );
}
