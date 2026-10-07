export type ErrorCode =
  | "CONFIG_ERROR"
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "NETWORK_ERROR"
  | "AI_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly status: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "AppError";
  }
}

export const toAIError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  const message =
    error instanceof Error ? error.message : "AI service request failed.";
  return new AppError(message, "AI_ERROR", 502, { cause: error });
};

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (error instanceof TypeError) {
    return new AppError(
      "The Proposales service could not be reached.",
      "NETWORK_ERROR",
      503,
      { cause: error },
    );
  }
  if (error instanceof Error) {
    return new AppError(error.message, "INTERNAL_ERROR", 500, { cause: error });
  }
  return new AppError("Unexpected error.", "INTERNAL_ERROR", 500);
};
