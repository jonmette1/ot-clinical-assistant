"use client";

import { useState } from "react";

type PotentialEnhancement = {
  label?: string;
  rationale?: string;
  monitorFor?: string;
};

type ClinicalChangeDirection = "Improving" | "Stable" | "Declining" | "Mixed";

type CurrentOperationalStatePanelProps = {
  currentOperationalEmphasis: string;
  clinicalStatus: "On Track" | "Monitor Closely" | "Needs Reassessment";
  clinicalStatusExplanation: string;
  clinicalChangeDirection: ClinicalChangeDirection;
  clinicalChangeBullets: string[];
  treatmentImplication: string;
  progressionOutlookLabel: string;
  remainingProgressionRequirements: string[];
  primaryDriver: string;
  whatChanged: string;
  whyItMatters: string;
  operationalContinuitySummary?: string;
  planSummary?: string;
  topPriorities: string[];
  immediateActions: string[];
  potentialEnhancements: PotentialEnhancement[];
  onShowClinicalSummary: () => void;
  onCopyRecommendedSummary: () => void;
};

const statusStyles = {
  "On Track": "border-emerald-700 bg-emerald-900/30 text-emerald-100",
  "Monitor Closely": "border-amber-700 bg-amber-900/30 text-amber-100",
  "Needs Reassessment": "border-red-700 bg-red-900/30 text-red-100",
};

const changeStyles = {
  Improving: "border-emerald-800/70 bg-emerald-950/30 text-emerald-100",
  Stable: "border-sky-800/70 bg-sky-950/30 text-sky-100",
  Declining: "border-red-800/70 bg-red-950/30 text-red-100",
  Mixed: "border-amber-800/70 bg-amber-950/30 text-amber-100",
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
  primaryDriver,
  whatChanged,
  whyItMatters,
  operationalContinuitySummary,
  planSummary,
  topPriorities,
  immediateActions,
  potentialEnhancements,
  onShowClinicalSummary,
  onCopyRecommendedSummary,
}: CurrentOperationalStatePanelProps) {
  const [showStatusReasoning, setShowStatusReasoning] = useState(false);
  const [showPotentialEnhancements, setShowPotentialEnhancements] = useState(false);

  return (
    <section className="rounded-2xl border border-emerald-600 bg-gradient-to-br from-emerald-950/60 via-gray-900 to-gray-950 p-6 shadow-2xl shadow-emerald-950/30">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Command Center
          </p>

          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            {currentOperationalEmphasis}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-emerald-50/85">
            {operationalContinuitySummary ||
              planSummary ||
              "This is the current operational focus for the visit."}
          </p>
        </div>

        <div className={`rounded-xl border px-4 py-3 ${statusStyles[clinicalStatus]}`}>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
            Clinical Status
          </p>
          <p className="mt-1 text-2xl font-bold">{clinicalStatus}</p>
          <p className="mt-2 max-w-xs text-sm opacity-90">
            {clinicalStatusExplanation}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className={`rounded-xl border p-4 ${changeStyles[clinicalChangeDirection]}`}>
          <h2 className="text-sm font-semibold uppercase tracking-wide opacity-90">
            Clinical Change Summary
          </h2>
          <p className="mt-2 text-2xl font-bold">{clinicalChangeDirection}</p>
          <div className="mt-3 space-y-2">
            {clinicalChangeBullets.length > 0 ? (
              clinicalChangeBullets.slice(0, 3).map((item, index) => (
                <p key={index} className="text-sm leading-relaxed opacity-90">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm leading-relaxed opacity-90">
                No major change is highlighted for this visit.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-violet-800/70 bg-violet-950/25 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-300">
            Treatment Implication
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-violet-50/90">
            {treatmentImplication}
          </p>
        </div>

        <div className="rounded-xl border border-cyan-800/70 bg-cyan-950/25 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Progression Outlook
          </h2>
          <p className="mt-2 text-lg font-semibold text-cyan-50">
            {progressionOutlookLabel}
          </p>
          <div className="mt-3 space-y-2">
            {remainingProgressionRequirements.length > 0 ? (
              remainingProgressionRequirements.slice(0, 3).map((item, index) => (
                <p key={index} className="text-sm leading-relaxed text-cyan-50/85">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm leading-relaxed text-cyan-50/85">
                No additional progression requirements are highlighted.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-emerald-800/70 bg-black/25 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Top Priorities
          </h2>
          <div className="mt-3 space-y-2">
            {topPriorities.length > 0 ? (
              topPriorities.slice(0, 3).map((item, index) => (
                <p
                  key={index}
                  className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-sm text-gray-100"
                >
                  {item}
                </p>
              ))
            ) : (
              <p className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-3 py-2 text-sm text-gray-300">
                No top priorities generated.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-blue-800/70 bg-black/25 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Immediate Actions
          </h2>
          <div className="mt-3 space-y-2">
            {immediateActions.length > 0 ? (
              immediateActions.slice(0, 4).map((item, index) => (
                <p
                  key={index}
                  className="rounded-lg border border-blue-900/60 bg-blue-950/30 px-3 py-2 text-sm text-gray-100"
                >
                  {item}
                </p>
              ))
            ) : (
              <p className="rounded-lg border border-blue-900/60 bg-blue-950/30 px-3 py-2 text-sm text-gray-300">
                No immediate actions generated.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onShowClinicalSummary}
          className="rounded-lg border border-emerald-600 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          View Clinical Summary
        </button>

        <button
          type="button"
          onClick={onCopyRecommendedSummary}
          className="rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
        >
          Copy Summary
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
          <button
            type="button"
            onClick={() => setShowStatusReasoning((prev) => !prev)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="block text-sm font-semibold text-gray-100">
                Why This Status?
              </span>
              <span className="block text-xs text-gray-500">
                Concise clinical rationale
              </span>
            </span>
            <span className="text-xs text-emerald-300">
              {showStatusReasoning ? "Hide" : "Show"}
            </span>
          </button>

          {showStatusReasoning && (
            <div className="mt-4 space-y-3 border-t border-gray-800 pt-4 text-sm text-gray-200">
              <p>
                <span className="font-semibold text-gray-100">Primary Driver:</span>{" "}
                {primaryDriver}
              </p>
              <p>
                <span className="font-semibold text-gray-100">What Changed:</span>{" "}
                {whatChanged}
              </p>
              <p>
                <span className="font-semibold text-gray-100">Why It Matters:</span>{" "}
                {whyItMatters}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
          <button
            type="button"
            onClick={() => setShowPotentialEnhancements((prev) => !prev)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="block text-sm font-semibold text-gray-100">
                Potential Enhancements
              </span>
              <span className="block text-xs text-gray-500">
                Optional areas to monitor after the primary plan is stable
              </span>
            </span>
            <span className="text-xs text-emerald-300">
              {showPotentialEnhancements ? "Hide" : "Show"}
            </span>
          </button>

          {showPotentialEnhancements && (
            <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
              {potentialEnhancements.length > 0 ? (
                potentialEnhancements.map((item, index) => (
                  <div key={`${item.label || "enhancement"}-${index}`}>
                    <p className="text-sm font-medium text-gray-100">
                      {item.label || "Potential enhancement"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.rationale || item.monitorFor || "No additional detail provided."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No potential enhancements generated.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
