import { NextResponse } from "next/server";
import { isDevModeEnabled } from "@/helpers/isDevModeEnabled";
import { toAIError } from "@/lib/errors";
import { getProposal } from "@/lib/proposales";
import { reviewProposal } from "@/lib/ai";
import { getMockProposalData, getMockProposalReview } from "@/mocks/proposals";

export const POST = async (
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  try {
    const { uuid } = await params;
    const devModeEnabled = isDevModeEnabled();
    const proposal = devModeEnabled
      ? getMockProposalData(uuid)
      : (await getProposal(uuid)).data;
    if (devModeEnabled) return NextResponse.json(getMockProposalReview(uuid));
    return NextResponse.json(await reviewProposal(proposal));
  } catch (error) {
    const appError = toAIError(error);
    console.error({ code: appError.code, error });
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.status },
    );
  }
};
