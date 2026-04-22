import { z } from "zod";

export const drawSimulationSchema = z.object({
  drawMonth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: z.enum(["random", "algorithm"]).default("random"),
});

export const publishDrawSchema = z.object({
  drawId: z.string().uuid(),
});
