import { z } from "zod";

export const charitySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  location: z.string().min(2),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  summary: z.string().min(10),
  description: z.string().min(20),
  impactStat: z.string().min(4),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});
