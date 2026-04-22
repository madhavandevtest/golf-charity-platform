"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";

const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === "true";

export function WinnerProofForm({ winnerId, userId }: { winnerId: string; userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Input
        type="file"
        accept="image/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        disabled={!file || isPending}
        onClick={() =>
          startTransition(async () => {
            if (!file) return;
            if (isMockMode) {
              toast.success("Mock proof submitted.");
              return;
            }
            const supabase = createClient();
            const filePath = `${userId}/${winnerId}-${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from("winner-proof")
              .upload(filePath, file, { upsert: true });

            if (uploadError) {
              toast.error(uploadError.message);
              return;
            }

            const response = await fetch("/api/winners/submit-proof", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ winnerId, filePath }),
            });

            const payload = await response.json();

            if (!response.ok) {
              toast.error(payload.error ?? "Unable to submit proof.");
              return;
            }

            toast.success("Proof submitted for review.");
            window.location.reload();
          })
        }
      >
        {isPending ? "Submitting..." : "Submit proof"}
      </Button>
    </div>
  );
}
