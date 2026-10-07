import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { proposalCompareSchema, proposalReviewSchema } from "./schemas";
import type { ProposalCompareResult, ProposalReview } from "./types";

const model = () =>
  gateway(process.env.AI_MODEL || "google/gemini-2.5-flash-lite");

export const reviewProposal = async (
  proposal: unknown,
): Promise<ProposalReview> => {
  const result = await generateText({
    model: model(),
    output: Output.object({
      schema: proposalReviewSchema,
    }),
    system:
      "You are a senior commercial proposal reviewer. Review an existing proposal before it is sent. Missing information lowers completeness. Never invent facts or claim a term exists. Give practical recommendations.",
    prompt: `Review this existing proposal record:

${JSON.stringify(proposal, null, 2)}`,
  });

  return result.output;
};

export const compareProposals = async (
  first: unknown,
  second: unknown,
): Promise<ProposalCompareResult> => {
  const result = await generateText({
    model: model(),
    output: Output.object({
      name: "ProposalComparison",
      description: "A side-by-side commercial comparison of two proposals.",
      schema: proposalCompareSchema,
    }),
    system:
      "Compare two existing commercial proposals objectively. Return a concise side-by-side comparison with the important commercial fields, including total, guests, duration, accommodation, catering, AV equipment and cancellation policy when available. Preserve exact values from the source. Do not invent missing values; use Not specified. Explain the main commercial differences and give a practical recommendation.",
    prompt: `Compare Proposal A and Proposal B.\n\nProposal A:\n${JSON.stringify(first, null, 2)}\n\nProposal B:\n${JSON.stringify(second, null, 2)}`,
  });
  return result.output;
};
