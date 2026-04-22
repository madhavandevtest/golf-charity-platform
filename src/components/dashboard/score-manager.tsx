"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Score } from "@/lib/types";

export function ScoreManager({ initialScores }: { initialScores: Score[] }) {
  const [scores, setScores] = useState(initialScores);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    playedOn: "",
    stablefordPoints: "",
    courseName: "",
  });
  const [isPending, startTransition] = useTransition();

  const orderedScores = useMemo(
    () =>
      [...scores].sort(
        (a, b) =>
          new Date(b.played_on).getTime() - new Date(a.played_on).getTime() ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [scores],
  );

  const beginEdit = (score: Score) => {
    setEditingId(score.id);
    setDraft({
      playedOn: score.played_on,
      stablefordPoints: String(score.stableford_points),
      courseName: score.course_name ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ playedOn: "", stablefordPoints: "", courseName: "" });
  };

  const saveEdit = (id: string) =>
    startTransition(async () => {
      const response = await fetch("/api/scores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          playedOn: draft.playedOn,
          stablefordPoints: Number(draft.stablefordPoints),
          courseName: draft.courseName,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Unable to update score.");
        return;
      }

      setScores((current) =>
        current.map((score) =>
          score.id === id
            ? {
                ...score,
                played_on: payload.data.played_on,
                stableford_points: payload.data.stableford_points,
                course_name: payload.data.course_name,
              }
            : score,
        ),
      );
      toast.success("Score updated.");
      cancelEdit();
    });

  const deleteScore = (id: string) =>
    startTransition(async () => {
      const response = await fetch("/api/scores", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Unable to delete score.");
        return;
      }

      setScores((current) => current.filter((score) => score.id !== id));
      if (editingId === id) {
        cancelEdit();
      }
      toast.success("Score deleted.");
    });

  if (orderedScores.length === 0) {
    return (
      <div className="rounded-[24px] bg-[var(--color-surface)] px-4 py-6 text-sm text-[var(--color-muted)]">
        No scores stored yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orderedScores.map((score) => {
        const isEditing = editingId === score.id;

        return (
          <div
            key={score.id}
            className="rounded-[24px] border border-[var(--color-line)] bg-white p-4 shadow-[0_10px_30px_rgba(16,34,29,0.04)]"
          >
            {isEditing ? (
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-center">
                <Input
                  type="date"
                  value={draft.playedOn}
                  onChange={(event) => setDraft((current) => ({ ...current, playedOn: event.target.value }))}
                />
                <Input
                  type="number"
                  min={1}
                  max={45}
                  value={draft.stablefordPoints}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, stablefordPoints: event.target.value }))
                  }
                />
                <Input
                  value={draft.courseName}
                  placeholder="Course name"
                  onChange={(event) => setDraft((current) => ({ ...current, courseName: event.target.value }))}
                />
                <Button type="button" disabled={isPending} onClick={() => saveEdit(score.id)}>
                  Save
                </Button>
                <Button type="button" variant="ghost" disabled={isPending} onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid gap-1">
                  <p className="text-lg font-semibold">{score.stableford_points} pts</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {score.played_on} · {score.course_name ?? "Course not specified"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" disabled={isPending} onClick={() => beginEdit(score)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" disabled={isPending} onClick={() => deleteScore(score.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
