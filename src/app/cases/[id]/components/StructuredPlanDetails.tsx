"use client";

type StructuredPlanDetailsProps = {
  patientSnapshot?: string | null;
  instabilityDrivers: string[];
};

export function StructuredPlanDetails({
  patientSnapshot,
  instabilityDrivers,
}: StructuredPlanDetailsProps) {
  if (!patientSnapshot) return null;

  return (
    <details className="rounded-xl border border-green-800 bg-gray-900 p-6">
      <summary className="flex cursor-pointer items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Structured Plan Details</h2>
          <p className="mt-1 text-sm text-gray-400">
            Implementation details anchored to the current operational emphasis.
          </p>
        </div>

        <span className="text-xs tracking-wide text-green-400">
          Show
        </span>
      </summary>

      <div className="mt-6 border-t border-gray-800 pt-4">
        <h3 className="text-lg font-semibold mb-2">Patient Snapshot</h3>
        <p className="text-gray-300">{patientSnapshot}</p>
      </div>

      {instabilityDrivers.length ? (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <h3 className="text-lg font-semibold mb-2">Instability Drivers</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {instabilityDrivers.map(
              (item: string, index: number) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>
        </div>
      ) : null}

    </details>
  );
}
