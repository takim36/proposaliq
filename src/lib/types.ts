export type ProposalSearchItem = {
  created_at?: number;
  updated_at?: number;
  title?: string;
  uuid: string;
  series_uuid?: string;
  company_id?: number;
  version?: number;
  status?: string;
  data?: Record<string, unknown>;
  url?: string;
};

export type ProposalReview = {
  overallScore: number;
  checks: { name: string; passed: boolean; explanation: string }[];
  quality: { pricing: number; clarity: number; completeness: number };
  recommendations: string[];
};

export type ProposalComparisonRow = {
  label: string;
  first: string;
  second: string;
  same: boolean;
};

export type ProposalCompareResult = {
  firstTitle: string;
  secondTitle: string;
  rows: ProposalComparisonRow[];
  analysis: string;
  recommendation: string;
};
