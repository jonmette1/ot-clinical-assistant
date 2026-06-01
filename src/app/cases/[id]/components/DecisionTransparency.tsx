"use client";

import { ProgressionContinuityRow } from "./ProgressionContinuityRow";

type ProgressionState = {
  currentPhase?: string;
  advancementReadiness?: string;
  activeMilestones: string[];
  activeBarriers: string[];
  regressionRisks: string[];
  reassessmentTriggers: string[];
  caregiverDependencyState?: string;
  environmentalLimitationState?: string;
  continuitySummary?: string;
};

type DecisionTransparencyProps = {
  currentContinuityCondition: string;
  reassessmentPressureLabel: string;
  operationalChangeClassification: string[];
  dominantInstabilityDrivers: string[];
  operationalDriftSignals: string[];
  continuityAlerts: string[];
  progressionState?: ProgressionState | null;
};

export function DecisionTransparency({
  currentContinuityCondition,
  reassessmentPressureLabel,
  operationalChangeClassification,
  dominantInstabilityDrivers,
  operationalDriftSignals,
  continuityAlerts,
  progressionState,
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
          operationalChangeClassification={operationalChangeClassification}
          dominantInstabilityDrivers={dominantInstabilityDrivers}
          operationalDriftSignals={operationalDriftSignals}
          continuityAlerts={continuityAlerts}
        />

        {progressionState && (
          <section className="mt-6 rounded-lg border border-dashed border-purple-300 bg-purple-50 p-4">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                Dev Only — Progression State
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Temporary validation display for Phase 3 progression testing.
              </p>
            </div>

            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-800">Current Phase</p>
                <p className="text-gray-700">
                  {progressionState.currentPhase || "—"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Advancement Readiness
                </p>
                <p className="text-gray-700">
                  {progressionState.advancementReadiness || "—"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Caregiver State</p>
                <p className="text-gray-700">
                  {progressionState.caregiverDependencyState || "—"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Environment State</p>
                <p className="text-gray-700">
                  {progressionState.environmentalLimitationState || "—"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-gray-800">Continuity Summary</p>
              <p className="mt-1 text-sm text-gray-700">
                {progressionState.continuitySummary || "—"}
              </p>
            </div>

            <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-800">Active Barriers</p>
                <ul className="mt-1 list-disc pl-5 text-gray-700">
                  {(progressionState.activeBarriers || []).length ? (
                    progressionState.activeBarriers.map(
                      (item: string, index: number) => (
                        <li key={`progression-barrier-${index}`}>{item}</li>
                      ),
                    )
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Active Milestones</p>
                <ul className="mt-1 list-disc pl-5 text-gray-700">
                  {(progressionState.activeMilestones || []).length ? (
                    progressionState.activeMilestones.map(
                      (item: string, index: number) => (
                        <li key={`progression-milestone-${index}`}>{item}</li>
                      ),
                    )
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800">Regression Risks</p>
                <ul className="mt-1 list-disc pl-5 text-gray-700">
                  {(progressionState.regressionRisks || []).length ? (
                    progressionState.regressionRisks.map(
                      (item: string, index: number) => (
                        <li key={`progression-risk-${index}`}>{item}</li>
                      ),
                    )
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  Reassessment Triggers
                </p>
                <ul className="mt-1 list-disc pl-5 text-gray-700">
                  {(progressionState.reassessmentTriggers || []).length ? (
                    progressionState.reassessmentTriggers.map(
                      (item: string, index: number) => (
                        <li key={`progression-trigger-${index}`}>{item}</li>
                      ),
                    )
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </details>
  );
}
