import type { ReassessmentSummary } from "@/lib/buildReassessmentSummary";

const SECTION_LABELS: Array<[
  keyof ReassessmentSummary["sections"],
  string,
]> = [
  ["currentStatus", "Current status"],
  ["progressObserved", "Progress observed"],
  ["remainingLimitations", "Remaining limitations"],
  ["rationaleForContinuedFocus", "Rationale for continued focus"],
  ["recommendation", "Recommendation"],
];

export function ReassessmentSummarySection({
  reassessment,
}: {
  reassessment: ReassessmentSummary;
}) {
  return (
    <details className="group rounded-2xl border border-gray-800 bg-gray-950/55 lg:col-span-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:content-none sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-100">Reassessment Summary</h2>
            <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
              Experimental
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Runtime summary composed from maintained clinical understanding for clinician verification.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-gray-400 group-open:hidden">
          Review
        </span>
        <span className="hidden shrink-0 text-xs font-semibold text-gray-400 group-open:inline">
          Close
        </span>
      </summary>

      <div className="border-t border-gray-800 px-4 pb-5 pt-4 sm:px-5">
        <div className="space-y-4">
          {SECTION_LABELS.map(([key, label]) => (
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
      </div>
    </details>
  );
}
