"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scoreSchema } from "@/lib/validators/score";

export function ScoreForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.input<typeof scoreSchema>, unknown, z.output<typeof scoreSchema>>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      playedOn: "",
      stablefordPoints: 18,
      courseName: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Unable to save score.");
        return;
      }

      toast.success("Score saved.");
      form.reset({ playedOn: "", stablefordPoints: 18, courseName: "" });
      window.location.reload();
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
      <Input type="date" {...form.register("playedOn")} />
      <Input type="number" min={1} max={45} {...form.register("stablefordPoints")} />
      <Input placeholder="Course name" {...form.register("courseName")} />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save score"}
      </Button>
    </form>
  );
}
