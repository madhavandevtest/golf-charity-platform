import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2).max(80),
  charityId: z.string().uuid(),
  charityPercentage: z.coerce.number().min(10).max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
