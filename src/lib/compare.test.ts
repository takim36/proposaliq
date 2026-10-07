import { describe, expect, it } from "vitest";
import type { ProposalCompareResult } from "./types";
import { mockProposalComparison } from "@/mocks/proposals";

describe("proposal comparison shape", () => {
  it("represents the requested side-by-side fields", () => {
    const result: ProposalCompareResult = mockProposalComparison;

    expect(result.rows).toHaveLength(7);
    expect(result.rows[0]).toMatchObject({
      label: "Total",
      first: "€42,500",
      second: "€47,200",
    });
    expect(result.rows.filter((row) => !row.same)).toHaveLength(3);
  });
});
