"use client";

type ProgressionContinuityRowProps = {
  progressionPhase?: string | null;
  currentContinuityCondition: string;
  reassessmentPressureLabel: string;
  operationalChangeClassification: string[];
  dominantInstabilityDrivers: string[];
  operationalDriftSignals?: string[];
  continuityAlerts?: string[];
};

export function ProgressionContinuityRow({
  progressionPhase,
  currentContinuityCondition,
  reassessmentPressureLabel,
  operationalChangeClassification,
  dominantInstabilityDrivers,
  operationalDriftSignals = [],
  continuityAlerts = [],
}: ProgressionContinuityRowProps) {
  const driftAndAlerts = [...operationalDriftSignals, ...continuityAlerts];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Continuity Status
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Operational continuity and reassessment pressure
          </p>
        </div>

        <span className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-300">
          Reassessment Pressure: {reassessmentPressureLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4 md:col-span-2">
          <p className="mb-1 text-xs text-gray-500">
            Current Continuity Condition
          </p>

          <p className="text-sm font-medium text-white">
            {currentContinuityCondition}
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <p className="mb-2 text-xs text-gray-500">
            Progression Phase
          </p>

          <p className="text-sm font-medium text-white">
            {progressionPhase || "No progression phase available."}
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <p className="mb-2 text-xs text-gray-500">
            Operational Change Classification
          </p>

          <div className="flex flex-wrap gap-2">
            {operationalChangeClassification.length > 0 ? (
              operationalChangeClassification.map((item, index) => (
                <span
                  key={index}
                  className="rounded-md border border-blue-900/60 bg-blue-950/30 px-2 py-1 text-xs text-blue-100"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">
                No continuity classification available.
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <p className="mb-2 text-xs text-gray-500">
            Dominant Instability Drivers
          </p>

          <ul className="space-y-1 text-sm text-gray-300">
            {dominantInstabilityDrivers.length > 0 ? (
              dominantInstabilityDrivers.slice(0, 4).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li className="text-xs text-gray-500">
                No instability drivers identified.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950/40 p-4">
          <p className="mb-2 text-xs text-gray-500">
            Operational Drift / Alerts
          </p>

          <ul className="space-y-1 text-sm text-gray-300">
            {driftAndAlerts.length > 0 ? (
              driftAndAlerts.slice(0, 4).map((item, index) => (
                <li key={index}>• {item}</li>
              ))
            ) : (
              <li className="text-xs text-gray-500">
                No operational drift or continuity alerts identified.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="rounded-lg border border-blue-700 bg-blue-950/40 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-900/40"
        >
          Start Follow-Up Update
        </button>
      </div>
    </div>
  );
}
