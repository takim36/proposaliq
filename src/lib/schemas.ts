import { z } from "zod";

export const proposalReviewSchema = z.object({
  overallScore: z.number().min(0).max(100),
  checks: z.array(
    z.object({
      name: z.string(),
      passed: z.boolean(),
      explanation: z.string(),
    }),
  ),
  quality: z.object({
    pricing: z.number().min(0).max(100),
    clarity: z.number().min(0).max(100),
    completeness: z.number().min(0).max(100),
  }),
  recommendations: z.array(z.string()),
});

export const proposalCompareSchema = z.object({
  firstTitle: z.string(),
  secondTitle: z.string(),
  rows: z.array(
    z.object({
      label: z.string(),
      first: z.string(),
      second: z.string(),
      same: z.boolean(),
    }),
  ),
  analysis: z.string(),
  recommendation: z.string(),
});
