import type { ProposalCompareResult } from "@/lib/types";

export const CompareResult = ({
  result,
}: {
  result: ProposalCompareResult;
}) => (
  <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
    <div className="mb-6 text-center">
      <h3 className="text-xl font-semibold">Compare proposals</h3>
      <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold">
        <span className="rounded-lg bg-gray-100 px-4 py-2">
          {result.firstTitle}
        </span>
        <span className="text-gray-400">vs</span>
        <span className="rounded-lg bg-gray-100 px-4 py-2">
          {result.secondTitle}
        </span>
      </div>
    </div>
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold"> </th>
            <th className="px-4 py-3 font-semibold">{result.firstTitle}</th>
            <th className="px-4 py-3 font-semibold">{result.secondTitle}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {result.rows.map((row) => (
            <tr key={row.label} className={!row.same ? "bg-amber-50/50" : ""}>
              <th className="px-4 py-3 font-medium text-gray-700">
                {row.label}
              </th>
              <td className="px-4 py-3">{row.first}</td>
              <td className="px-4 py-3">{row.second}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-6 rounded-xl bg-gray-50 p-5">
      <h4 className="font-semibold">AI analysis</h4>
      <p className="mt-2 text-sm leading-6 text-gray-700">{result.analysis}</p>
      <p className="mt-4 text-sm font-semibold">{result.recommendation}</p>
    </div>
  </div>
);
