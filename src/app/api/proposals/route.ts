import { NextResponse } from "next/server";
import { isDevModeEnabled } from "@/helpers/isDevModeEnabled";
import { toAppError } from "@/lib/errors";
import { searchProposals } from "@/lib/proposales";
import { mockProposals } from "@/mocks/proposals";

export const GET = async () => {
  try {
    if (isDevModeEnabled()) return NextResponse.json({ data: mockProposals });
    return NextResponse.json(await searchProposals());
  } catch (error) {
    const appError = toAppError(error);
    console.error({ code: appError.code, message: appError.message });
    return NextResponse.json(
      { error: appError.message, code: appError.code },
      { status: appError.status },
    );
  }
};
