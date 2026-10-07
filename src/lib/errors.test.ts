import { describe, expect, it } from "vitest";
import { AppError, toAppError } from "./errors";

describe("errors", () => {
  it("preserves structured app errors", () => {
    const error = new AppError("bad auth", "AUTH_ERROR", 502);
    expect(toAppError(error)).toBe(error);
  });

  it("maps network failures to a meaningful code", () => {
    const error = toAppError(new TypeError("fetch failed"));
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.status).toBe(503);
  });
});
