"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DrawControls({ drawMonth }: { drawMonth: string }) {
  const [isPending, startTransition] = useTransition();
  const [selectedMonth, setSelectedMonth] = useState(drawMonth);

  const runSimulation = () =>
    startTransition(async () => {
      if (!selectedMonth) {
        toast.error("Choose a draw month first.");
        return;
      }
      const response = await fetch("/api/draws/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawMonth: selectedMonth, mode: "random" }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Simulation failed.");
        return;
      }

      toast.success("Draw simulated.");
      window.location.reload();
    });

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        type="date"
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        className="sm:max-w-xs"
      />
      <Button type="button" disabled={isPending} onClick={runSimulation}>
        {isPending ? "Running..." : "Run draw simulation"}
      </Button>
    </div>
  );
}
