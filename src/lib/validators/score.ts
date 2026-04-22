import { z } from "zod";

export const scoreSchema = z.object({
  playedOn: z.string().min(1),
  stablefordPoints: z.coerce.number().min(1).max(45),
  courseName: z.string().max(120).optional().or(z.literal("")),
});

export const updateScoreSchema = scoreSchema.extend({
  id: z.string().uuid(),
});

export type ScoreInput = z.infer<typeof scoreSchema>;
