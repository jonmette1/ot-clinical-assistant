"use client";

type ClinicalStatus = "On Track" | "Monitor Closely" | "Needs Reassessment";
type ClinicalChangeDirection = "Improving" | "Stable" | "Declining" | "Mixed";

type CurrentOperationalStatePanelProps = {
  currentOperationalEmphasis: string;
  clinicalStatus: ClinicalStatus;
  clinicalStatusExplanation: string;
  clinicalChangeDirection: ClinicalChangeDirection;
  clinicalChangeBullets: string[];
  treatmentImplication: string;
  progressionOutlookLabel: string;
  remainingProgressionRequirements: string[];
  operationalContinuitySummary?: string;
  planSummary?: string;
  topPriorities: string[];
  immediateActions: string[];
  onShowClinicalSummary: () => void;
  onCopyRecommendedSummary: () => void;
};

const statusStyles: Record<ClinicalStatus, string> = {
  "On Track": "border-emerald-700 bg-emerald-900/30 text-emerald-100",
  "Monitor Closely": "border-amber-700 bg-amber-900/30 text-amber-100",
  "Needs Reassessment": "border-red-700 bg-red-900/30 text-red-100",
};

const changeStyles: Record<ClinicalChangeDirection, string> = {
  Improving: "border-emerald-800/70 bg-emerald-950/25 text-emerald-100",
  Stable: "border-blue-800/70 bg-blue-950/25 text-blue-100",
  Declining: "border-red-800/70 bg-red-950/25 text-red-100",
  Mixed: "border-amber-800/70 bg-amber-950/25 text-amber-100",
};

export function CurrentOperationalStatePanel({
  currentOperationalEmphasis,
  clinicalStatus,
  clinicalStatusExplanation,
  clinicalChangeDirection,
  clinicalChangeBullets,
  treatmentImplication,
  progressionOutlookLabel,
  remainingProgressionRequirements,
  operationalContinuitySummary,
  planSummary,
  topPriorities,
  immediateActions,
  onShowClinicalSummary,
  onCopyRecommendedSummary,
}: CurrentOperationalStatePanelProps) {
  return (
    <section className="mt-6 rounded-xl border border-emerald-700 bg-emerald-950/20 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wide text-emerald-400">
            Current Operational State
          </div>

          <h2 className="text-2xl font-semibold text-white">
            {currentOperationalEmphasis}
          </h2>

          <p className="mt-2 max-w-3xl text-sm text-emerald-100/80">
            {operationalContinuitySummary ||
              planSummary ||
              "This emphasis represents what should dominate treatment attention right now."}
          </p>
        </div>

        <div className={`rounded-lg border px-3 py-2 text-sm ${statusStyles[clinicalStatus]}`}>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            Clinical Status
          </p>
          <p className="mt-1 font-semibold">{clinicalStatus}</p>
          <p className="mt-1 max-w-xs text-xs opacity-90">
            {clinicalStatusExplanation}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className={`rounded-lg border p-4 ${changeStyles[clinicalChangeDirection]}`}>
          <h3 className="text-sm font-semibold">Clinical Change Summary</h3>
          <p className="mt-1 text-lg font-semibold">{clinicalChangeDirection}</p>
          <div className="mt-2 space-y-1 text-sm opacity-90">
            {clinicalChangeBullets.length > 0 ? (
              clinicalChangeBullets.slice(0, 2).map((item, index) => (
                <p key={index}>{item}</p>
              ))
            ) : (
              <p>No change summary available.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-4 text-cyan-50">
          <h3 className="text-sm font-semibold text-cyan-300">
            Treatment Implication
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-cyan-50/90">
            {treatmentImplication}
          </p>
        </div>

        <div className="rounded-lg border border-violet-900/60 bg-violet-950/20 p-4 text-violet-50">
          <h3 className="text-sm font-semibold text-violet-300">
            Progression Outlook
          </h3>
          <p className="mt-1 font-semibold">{progressionOutlookLabel}</p>
          <div className="mt-2 space-y-1 text-sm text-violet-50/85">
            {remainingProgressionRequirements.length > 0 ? (
              remainingProgressionRequirements.slice(0, 2).map((item, index) => (
                <p key={index}>{item}</p>
              ))
            ) : (
              <p>No remaining requirements highlighted.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-emerald-300">
            Top Priorities
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            {topPriorities.length > 0 ? (
              topPriorities.slice(0, 3).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li>• No top priorities generated.</li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-emerald-900/60 bg-black/20 p-4">
          <h3 className="mb-3 text-sm font-semibold text-emerald-300">
            Immediate Actions
          </h3>

          <ul className="space-y-2 text-sm text-gray-200">
            {immediateActions.length > 0 ? (
              immediateActions.slice(0, 4).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li>• No immediate actions generated.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onShowClinicalSummary}
          className="rounded-lg border border-emerald-700 bg-emerald-900/30 px-3 py-2 text-xs text-emerald-200 transition hover:bg-emerald-800/40"
        >
          View Clinical Summary
        </button>

        <button
          type="button"
          onClick={onCopyRecommendedSummary}
          className="rounded-lg border border-gray-700 bg-gray-900/40 px-3 py-2 text-xs text-gray-300 transition hover:bg-gray-800/40"
        >
          Copy Summary
        </button>
      </div>
    </section>
  );
}
