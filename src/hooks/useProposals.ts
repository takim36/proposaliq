"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiClientError, fetchJson } from "@/lib/client-api";
import type {
  ProposalCompareResult,
  ProposalReview,
  ProposalSearchItem,
} from "@/lib/types";

const retry = (failureCount: number, error: unknown): boolean => {
  const status = error instanceof ApiClientError ? error.status : 0;
  return (
    failureCount < 2 &&
    status !== 400 &&
    status !== 401 &&
    status !== 403 &&
    status !== 404
  );
};

const retryDelay = (attempt: number): number =>
  Math.min(1000 * 2 ** attempt, 4000);

export const useProposals = () =>
  useQuery({
    queryKey: ["proposals"],
    queryFn: () => fetchJson<{ data: ProposalSearchItem[] }>("/api/proposals"),
    staleTime: 30_000,
    retry,
    retryDelay,
  });

export const useProposalReview = () =>
  useMutation({
    mutationFn: (uuid: string) =>
      fetchJson<ProposalReview>(
        `/api/proposals/${encodeURIComponent(uuid)}/review`,
        { method: "POST" },
      ),
    retry,
    retryDelay,
  });

export const useCompareProposals = () =>
  useMutation({
    mutationFn: (uuids: [string, string]) =>
      fetchJson<ProposalCompareResult>("/api/proposals/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuids }),
      }),
    retry,
    retryDelay,
  });
