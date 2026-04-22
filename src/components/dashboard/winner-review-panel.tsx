"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Winner } from "@/lib/types";

export function WinnerReviewPanel({ winners }: { winners: Winner[] }) {
  const [isPending, startTransition] = useTransition();

  const updateWinner = (winnerId: string, verificationStatus: "approved" | "rejected", paymentStatus?: "pending" | "paid") =>
    startTransition(async () => {
      const response = await fetch(`/api/admin/winners/${winnerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus, paymentStatus }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Unable to update winner.");
        return;
      }

      toast.success("Winner updated.");
      window.location.reload();
    });

  return (
    <div className="grid gap-4">
      {winners.map((winner) => (
        <div key={winner.id} className="rounded-[28px] border border-[var(--color-line)] bg-white p-6">
          <p className="text-lg font-semibold capitalize">{winner.verification_status.replace("_", " ")}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Payment status: {winner.payment_status}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Proof path: {winner.proof_url ?? "Not uploaded"}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="button" disabled={isPending} onClick={() => updateWinner(winner.id, "approved", "pending")}>
              Approve
            </Button>
            <Button type="button" variant="ghost" disabled={isPending} onClick={() => updateWinner(winner.id, "approved", "paid")}>
              Mark paid
            </Button>
            <Button type="button" variant="ghost" disabled={isPending} onClick={() => updateWinner(winner.id, "rejected", "pending")}>
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
