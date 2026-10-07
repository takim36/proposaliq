import { AppError } from "./errors";
import type { ProposalSearchItem } from "./types";

const BASE_URL = "https://api.proposales.com/v3";
const MAX_RETRIES = 3;

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const getConfig = (): { apiKey: string; companyId: number } => {
  const apiKey = process.env.PROPOSALES_API_KEY?.trim();
  const companyId = Number(process.env.PROPOSALES_COMPANY_ID);

  if (!apiKey || !Number.isInteger(companyId) || companyId <= 0) {
    throw new AppError(
      "Proposales API key and a valid PROPOSALES_COMPANY_ID are required.",
      "CONFIG_ERROR",
      500,
    );
  }

  return { apiKey, companyId };
};

const getResponseError = (status: number, body: string): AppError => {
  if (status === 401 || status === 403) {
    return new AppError("Proposales authentication failed. Check the API key.", "AUTH_ERROR", 502);
  }
  if (status === 404) {
    return new AppError("The requested proposal was not found.", "NOT_FOUND", 404);
  }
  if (status === 429) {
    return new AppError("Proposales rate limit reached. Please try again shortly.", "RATE_LIMITED", 429);
  }
  if (status >= 500) {
    return new AppError("Proposales is temporarily unavailable.", "UPSTREAM_ERROR", 502);
  }
  return new AppError(body || `Proposales rejected the request (${status}).`, "UPSTREAM_ERROR", 502);
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const { apiKey } = getConfig();
  const method = init.method ?? "GET";
  const retryable = method === "GET";

  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        signal: init.signal ?? AbortSignal.timeout(10_000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(init.headers ?? {}),
        },
        cache: "no-store",
      });

      if (response.ok) return (await response.json()) as T;

      const body = await response.text();
      const error = getResponseError(response.status, body);
      const canRetry = retryable && attempt < MAX_RETRIES && [429, 502, 503].includes(response.status);
      if (!canRetry) throw error;
      await sleep(250 * 2 ** attempt);
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError("The Proposales service could not be reached.", "NETWORK_ERROR", 503, { cause: error });
      const canRetry = retryable && attempt < MAX_RETRIES && ["NETWORK_ERROR", "RATE_LIMITED", "UPSTREAM_ERROR"].includes(appError.code);
      if (!canRetry) throw appError;
      await sleep(250 * 2 ** attempt);
    }
  }
};

export const getCompanyId = (): number => getConfig().companyId;

export const searchProposals = async (): Promise<{ data: ProposalSearchItem[] }> =>
  request(`/proposal-search?company_id=${getCompanyId()}&limit=25`);

export const getProposal = async (uuid: string): Promise<{ data: Record<string, unknown> }> =>
  request(`/proposals/${encodeURIComponent(uuid)}`);
