import type {
  ProposalCompareResult,
  ProposalReview,
  ProposalSearchItem,
} from "@/lib/types";

export const mockProposals: ProposalSearchItem[] = [
  {
    uuid: "demo-001",
    title: "Proposal A — Stockholm Conference",
    status: "draft",
    version: 1,
    company_id: 1001,
    updated_at: Math.floor(Date.now() / 1000) - 3600,
    data: {
      total: 42500,
      currency: "EUR",
      guests: 120,
      duration: "3 days",
      accommodation: true,
      catering: true,
      avEquipment: true,
      cancellationPolicy: "Free cancellation up to 14 days",
    },
  },
  {
    uuid: "demo-002",
    title: "Proposal B — Stockholm Conference",
    status: "draft",
    version: 2,
    company_id: 1001,
    updated_at: Math.floor(Date.now() / 1000) - 7200,
    data: {
      total: 47200,
      currency: "EUR",
      guests: 120,
      duration: "3 days",
      accommodation: true,
      catering: true,
      avEquipment: false,
      cancellationPolicy: null,
    },
  },
];

export const getMockProposalData = (uuid: string) =>
  mockProposals[uuid === "demo-001" ? 0 : 1].data ?? {};

export const getMockProposal = (uuid: string) => ({
  uuid,
  title:
    uuid === "demo-001"
      ? "Proposal A — Stockholm Conference"
      : "Proposal B — Stockholm Conference",
  status: "draft",
  data: getMockProposalData(uuid),
});

export const getMockProposalReview = (uuid: string): ProposalReview => {
  const proposal = getMockProposalData(uuid);
  const hasCancellationPolicy = Boolean(proposal.cancellationPolicy);

  return {
    overallScore: uuid === "demo-001" ? 91 : 72,
    checks: [
      {
        name: "Pricing",
        passed: true,
        explanation: "A total price is available.",
      },
      {
        name: "Guests",
        passed: true,
        explanation: "Guest count is specified.",
      },
      {
        name: "Duration",
        passed: true,
        explanation: "Duration is specified.",
      },
      {
        name: "Cancellation policy",
        passed: hasCancellationPolicy,
        explanation: hasCancellationPolicy
          ? "A cancellation policy is present."
          : "No cancellation policy is provided.",
      },
    ],
    quality: {
      pricing: 90,
      clarity: 88,
      completeness: uuid === "demo-001" ? 95 : 68,
    },
    recommendations:
      uuid === "demo-001"
        ? ["Confirm final taxes and fees before sending."]
        : [
            "Add a cancellation policy.",
            "Confirm whether AV equipment is required.",
            "Clarify any missing package inclusions.",
          ],
  };
};

export const mockProposalComparison: ProposalCompareResult = {
  firstTitle: "Proposal A",
  secondTitle: "Proposal B",
  rows: [
    { label: "Total", first: "€42,500", second: "€47,200", same: false },
    { label: "Guests", first: "120", second: "120", same: true },
    { label: "Duration", first: "3 days", second: "3 days", same: true },
    { label: "Accommodation", first: "✓", second: "✓", same: true },
    { label: "Catering", first: "✓", second: "✓", same: true },
    { label: "AV equipment", first: "✓", second: "✗", same: false },
    {
      label: "Cancellation policy",
      first: "✓",
      second: "✗",
      same: false,
    },
  ],
  analysis:
    "Proposal B is €4,700 more expensive. The primary differences are that Proposal A includes AV equipment and a cancellation policy, while Proposal B does not.",
  recommendation:
    "Proposal A offers the stronger commercial package at the lower price, unless Proposal B has an important benefit not captured in the proposal data.",
};
