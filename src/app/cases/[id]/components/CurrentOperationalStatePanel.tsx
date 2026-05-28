"use client";

type CurrentOperationalStatePanelProps = {
  currentOperationalEmphasis: string;
  operationalContinuitySummary?: string;
  planSummary?: string;
  emphasisRationale: string[];
  dominantBarriers: string[];
  operationalReassessmentTriggers: string[];
  immediateActions: string[];
  onShowClinicalSummary: () => void;
  onCopyRecommendedSummary: () => void;
};

export function CurrentOperationalStatePanel({
  currentOperationalEmphasis,
  operationalContinuitySummary,
  planSummary,
  emphasisRationale,
  dominantBarriers,
  operationalReassessmentTriggers,
  immediateActions,
  onShowClinicalSummary,
  onCopyRecommendedSummary,
}: CurrentOperationalStatePanelProps) {
  return (
    <div className="mt-6 rounded-xl border border-emerald-700 bg-emerald-950/20 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
            Current Operational Emphasis
          </div>

          <h2 className="text-2xl font-semibold text-white">
            {currentOperationalEmphasis}
          </h2>

          <p className="mt-2 text-sm text-emerald-100/80 max-w-3xl">
            {operationalContinuitySummary ||
              planSummary ||
              "This emphasis represents what should dominate treatment attention right now."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onShowClinicalSummary}
              className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-3 py-2 text-xs text-emerald-200 hover:bg-emerald-800/40 transition"
            >
              View Clinical Summary
            </button>

            <button
              type="button"
              onClick={onCopyRecommendedSummary}
              className="rounded-lg border border-gray-700 bg-gray-900/40 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800/40 transition"
            >
              Copy Summary
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-900/40 px-3 py-2 text-sm text-emerald-200 border border-emerald-700">
          Active Focus
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-emerald-300 mb-3">
            Why This Matters Now
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            {emphasisRationale.length > 0 ? (
              emphasisRationale.slice(0, 3).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li>• No emphasis rationale generated.</li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-emerald-300 mb-3">
            Dominant Barriers
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            {dominantBarriers.length > 0 ? (
              dominantBarriers.slice(0, 3).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li>• No dominant barriers generated.</li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-emerald-300 mb-3">
            Reassessment Triggers
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            {operationalReassessmentTriggers.length > 0 ? (
              operationalReassessmentTriggers.slice(0, 3).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li>• No reassessment triggers generated.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-emerald-300 mb-3">
          Immediate Operational Actions
        </h3>

        <ul className="grid gap-2 md:grid-cols-2 text-sm text-gray-200">
          {immediateActions.length > 0 ? (
            immediateActions.map((item, index) => (
              <li
                key={index}
                className="rounded-lg border border-emerald-900/60 bg-black/20 px-3 py-2"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="rounded-lg border border-emerald-900/60 bg-black/20 px-3 py-2">
              No immediate actions generated.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
