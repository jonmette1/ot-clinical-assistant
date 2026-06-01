"use client";

type AdjacentOperationalPriority = {
  label?: string;
  rationale?: string;
  monitorFor?: string;
};

type AdjacentOperationalPrioritiesReferenceProps = {
  adjacentOperationalPriorities: AdjacentOperationalPriority[];
  isExpanded: boolean;
  onToggle: () => void;
};

export function AdjacentOperationalPrioritiesReference({
  adjacentOperationalPriorities,
  isExpanded,
  onToggle,
}: AdjacentOperationalPrioritiesReferenceProps) {
  if (adjacentOperationalPriorities.length === 0) return null;

  return (
    <details className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Potential Enhancements Reference</h2>
          <p className="mt-1 text-sm text-gray-400">Additional monitoring priorities retained from the generated plan.</p>
        </div>
        <span className="text-xs tracking-wide text-blue-300">Show</span>
      </summary>
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-300">
            Adjacent Operational Priorities
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Secondary priorities to monitor without treating them as competing plans.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          {isExpanded ? "Hide" : "Show"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {adjacentOperationalPriorities.map(
            (
              priority,
              index: number
            ) => (
              <div
                key={`${priority.label || "priority"}-${index}`}
                className="rounded-lg border border-gray-800/60 p-4 bg-gray-950/60 opacity-90"
              >
                <p className="text-xs uppercase tracking-wide text-blue-400 mb-1">
                  Adjacent Priority
                </p>

                <h4 className="text-sm font-semibold mb-2">
                  {priority.label || "Unnamed priority"}
                </h4>

                <p className="text-sm text-gray-300 mb-3">
                  {priority.rationale || "No rationale provided."}
                </p>

                <p className="text-xs text-gray-400">
                  <strong>Monitor for:</strong>{" "}
                  {priority.monitorFor || "No monitoring cue provided."}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
    </details>
  );
}
