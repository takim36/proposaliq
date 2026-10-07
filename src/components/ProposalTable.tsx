"use client";

import { useState } from "react";
import type {
  ProposalCompareResult,
  ProposalReview,
  ProposalSearchItem,
} from "@/lib/types";
import {
  useCompareProposals,
  useProposalReview,
  useProposals,
} from "@/hooks/useProposals";
import { formatDate } from "@/helpers/formatDate";
import { ReviewPanel } from "./ReviewPanel";
import { CompareResult } from "./ProposalsCompareResult";
import React from "react";

export const ProposalTable = () => {
  const { data, isPending, error } = useProposals();
  const reviewMutation = useProposalReview();
  const compareMutation = useCompareProposals();
  const [selected, setSelected] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<{
    uuid: string;
    review: ProposalReview;
  } | null>(null);

  const proposals = data?.data ?? [];

  const toggle = (uuid: string) =>
    setSelected((current) => {
      if (current.includes(uuid)) return current.filter((id) => id !== uuid);
      if (current.length === 2) return [current[1], uuid];
      return [...current, uuid];
    });

  const review = (proposal: ProposalSearchItem) => {
    setSelected([]);
    reviewMutation.mutate(proposal.uuid, {
      onSuccess: (result) =>
        setReviewed({ uuid: proposal.uuid, review: result }),
    });
  };

  const compare = () => {
    if (selected.length === 2) {
      setReviewed(null);
      compareMutation.mutate([selected[0], selected[1]]);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Proposal library</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review existing proposals or select exactly two to compare.
            </p>
          </div>
          <button
            disabled={selected.length !== 2 || compareMutation.isPending}
            onClick={compare}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {compareMutation.isPending ? "Comparing…" : "Compare proposals"}
          </button>
        </div>
      </div>

      {isPending ? (
        <div className="p-8 text-sm text-gray-500">Loading proposals…</div>
      ) : error ? (
        <div className="p-8">
          <p className="text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Unable to load proposals."}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Transient failures retry automatically with exponential backoff.
          </p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="p-8 text-sm text-gray-500">No proposals found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3">Compare</th>
                <th className="px-6 py-3">Proposal</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Version</th>
                <th className="px-6 py-3">Updated</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proposals.map((proposal) => (
                <React.Fragment key={proposal.uuid}>
                  <tr key={proposal.uuid} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(proposal.uuid)}
                        onChange={() => toggle(proposal.uuid)}
                        aria-label={`Compare ${proposal.title ?? proposal.uuid}`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {proposal.title || "Untitled proposal"}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {proposal.uuid}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize">
                        {proposal.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{proposal.version ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(proposal.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => review(proposal)}
                        disabled={reviewMutation.isPending}
                        className="font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                      >
                        {reviewed?.uuid === proposal.uuid &&
                        reviewMutation.isPending
                          ? "Reviewing…"
                          : "Pre-send review"}
                      </button>
                    </td>
                  </tr>
                  {reviewed?.uuid === proposal.uuid &&
                    reviewMutation.isError && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 pb-4 text-sm text-red-700"
                        >
                          {reviewMutation.error instanceof Error
                            ? reviewMutation.error.message
                            : "Review failed."}
                        </td>
                      </tr>
                    )}

                  {reviewed?.uuid === proposal.uuid && reviewed && (
                    <tr>
                      <td colSpan={6}>
                        <div className="border-t border-gray-100 p-6">
                          <ReviewPanel
                            review={reviewed.review}
                            loading={false}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {compareMutation.isError && (
        <div className="px-6 pb-4 text-sm text-red-700">
          {compareMutation.error instanceof Error
            ? compareMutation.error.message
            : "Comparison failed."}
        </div>
      )}
      {compareMutation.data && (
        <div className="border-t border-gray-100 p-6">
          <CompareResult result={compareMutation.data} />
        </div>
      )}
    </section>
  );
};
