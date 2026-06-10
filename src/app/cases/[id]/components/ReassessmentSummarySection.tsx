import type { ReassessmentSummary } from "@/lib/buildReassessmentSummary";

const DETAIL_SECTIONS: Array<[
  keyof ReassessmentSummary["sections"],
  string,
]> = [
  ["progressObserved", "Progress observed"],
  ["remainingLimitations", "Remaining limitations"],
  ["rationaleForContinuedFocus", "Rationale for continued focus"],
];

export function ReassessmentSummarySection({
  reassessment,
}: {
  reassessment: ReassessmentSummary;
}) {
  return (
    <section className="rounded-2xl border border-gray-700 bg-gray-950/75 p-4 shadow-sm shadow-black/10 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        1. Reassessment Summary
      </p>
      <h2 className="mt-2 max-w-4xl text-lg font-semibold leading-relaxed text-white sm:text-xl">
        {reassessment.sections.currentStatus}
      </h2>

      <div className="mt-4 border-l-2 border-blue-400/60 pl-3 sm:pl-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Recommendation
        </p>
        <p className="mt-1.5 max-w-4xl text-sm font-medium leading-relaxed text-blue-50 sm:text-base">
          {reassessment.sections.recommendation}
        </p>
      </div>

      <details className="group mt-4 border-t border-gray-800 pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-400 marker:hidden transition hover:text-white">
          <span>Review reassessment detail</span>
          <span className="group-open:hidden">Show</span>
          <span className="hidden group-open:inline">Hide</span>
        </summary>
        <div className="mt-4 space-y-4">
          {DETAIL_SECTIONS.map(([key, label]) => (
            <section key={key}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                {label}
              </h3>
              <p className="mt-1.5 max-w-4xl text-sm leading-relaxed text-gray-300">
                {reassessment.sections[key]}
              </p>
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
