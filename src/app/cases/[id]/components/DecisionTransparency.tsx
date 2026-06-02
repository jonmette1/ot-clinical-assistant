"use client";

import { ProgressionContinuityRow } from "./ProgressionContinuityRow";

type DecisionTransparencyProps = {
  currentContinuityCondition: string;
  reassessmentPressureLabel: string;
  dominantInstabilityDrivers: string[];
  operationalDriftSignals: string[];
  continuityAlerts: string[];
};

export function DecisionTransparency({
  currentContinuityCondition,
  reassessmentPressureLabel,
  dominantInstabilityDrivers,
  operationalDriftSignals,
  continuityAlerts,
}: DecisionTransparencyProps) {
  return (
    <details className="rounded-xl border border-blue-800 bg-gray-900 p-6">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Decision Transparency
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Detailed continuity and progression diagnostics for review.
          </p>
        </div>
        <span className="text-xs tracking-wide text-blue-300">Show</span>
      </summary>

      <div className="mt-6 space-y-6">
        <ProgressionContinuityRow
          currentContinuityCondition={currentContinuityCondition}
          reassessmentPressureLabel={reassessmentPressureLabel}
          dominantInstabilityDrivers={dominantInstabilityDrivers}
          operationalDriftSignals={operationalDriftSignals}
          continuityAlerts={continuityAlerts}
        />
      </div>
    </details>
  );
}
