import { describe, expect, it } from "vitest";
import { ApiClientError } from "./client-api";

describe("ApiClientError", () => {
  it("keeps meaningful API error codes and status", () => {
    const error = new ApiClientError("Rate limited", "RATE_LIMITED", 429);
    expect(error.code).toBe("RATE_LIMITED");
    expect(error.status).toBe(429);
  });
});
