import { NextResponse } from "next/server";
import { isDevModeEnabled } from "@/helpers/isDevModeEnabled";
import { toAppError } from "@/lib/errors";
import { getProposal } from "@/lib/proposales";
import { getMockProposal } from "@/mocks/proposals";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ uuid: string }> },
) => {
  try {
    const { uuid } = await params;
    if (isDevModeEnabled(request))
      return NextResponse.json({ data: getMockProposal(uuid) });
    return NextResponse.json(await getProposal(uuid));
  } catch (error) {
    const appError = toAppError(error);
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.status },
    );
  }
};
