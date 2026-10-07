import { NextResponse } from "next/server";
import { z } from "zod";
import { isDevModeEnabled } from "@/helpers/isDevModeEnabled";
import { toAIError, toAppError } from "@/lib/errors";
import { getProposal } from "@/lib/proposales";
import { compareProposals } from "@/lib/ai";
import { mockProposalComparison } from "@/mocks/proposals";

const inputSchema = z.object({ uuids: z.array(z.string().min(1)).length(2) });

export const POST = async (request: Request) => {
  try {
    const { uuids } = inputSchema.parse(await request.json());
    if (isDevModeEnabled()) {
      return NextResponse.json(mockProposalComparison);
    }

    const [first, second] = await Promise.all([
      getProposal(uuids[0]),
      getProposal(uuids[1]),
    ]);
    return NextResponse.json(await compareProposals(first.data, second.data));
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        {
          error: "Select exactly two proposals to compare.",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const appError =
      error instanceof Error && "code" in error
        ? toAppError(error)
        : toAIError(error);
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.status },
    );
  }
};
