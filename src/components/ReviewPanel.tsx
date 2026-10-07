import type { ProposalReview } from "@/lib/types";

const Bar = ({ value }: { value: number }) => (
  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
    <div
      className="h-full rounded-full bg-indigo-600"
      style={{ width: `${value}%` }}
    />
  </div>
);

export const ReviewPanel = ({
  review,
  loading,
}: {
  review: ProposalReview | null;
  loading: boolean;
}) => {
  if (loading)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
        AI is reviewing the proposal…
      </div>
    );
  if (!review) return null;

  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pre-send proposal review</h3>
          <p className="mt-1 text-sm text-gray-500">
            AI-assisted quality check.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {review.overallScore}/100
        </span>
      </div>
      <div className="space-y-2">
        {review.checks.map((check) => (
          <div
            key={check.name}
            className="flex gap-3 rounded-lg bg-gray-50 p-3"
          >
            <span
              className={check.passed ? "text-emerald-600" : "text-amber-600"}
            >
              {check.passed ? "✓" : "⚠"}
            </span>
            <div>
              <div className="text-sm font-medium">{check.name}</div>
              <div className="text-xs text-gray-500">{check.explanation}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h4 className="mb-3 font-semibold">Commercial quality</h4>
        <div className="space-y-4">
          {Object.entries(review.quality).map(([name, value]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize">{name}</span>
                <span>{value}%</span>
              </div>
              <Bar value={value} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-semibold">Recommendations</h4>
        <ul className="space-y-2 text-sm">
          {review.recommendations.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
