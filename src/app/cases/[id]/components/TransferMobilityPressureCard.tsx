"use client";

type TransferScore = {
  label: string;
  value: number;
};

type TransferMobilityPressureCardProps = {
  worstTransfer: TransferScore | null;
  transferScores: TransferScore[];
  executionPressurePoints: string[];
};

export function TransferMobilityPressureCard({
  worstTransfer,
  transferScores,
  executionPressurePoints,
}: TransferMobilityPressureCardProps) {
  if (!worstTransfer && transferScores.length === 0 && executionPressurePoints.length === 0) {
    return null;
  }

  return (
    <article className="rounded-xl border border-blue-800/70 bg-gray-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
        Transfer / Mobility
      </p>
      <h3 className="mt-1 text-lg font-semibold text-white">
        Mobility Pressure
      </h3>

      {worstTransfer && (
        <p className="mt-3 rounded-lg border border-blue-900/50 bg-blue-950/20 px-3 py-2 text-sm text-blue-100">
          Highest transfer pressure: {worstTransfer.label} at level {worstTransfer.value}.
        </p>
      )}

      <div className="mt-3 space-y-2">
        {executionPressurePoints.length > 0 ? (
          executionPressurePoints.slice(0, 4).map((item, index) => (
            <p
              key={index}
              className="rounded-lg border border-blue-900/50 bg-blue-950/20 px-3 py-2 text-sm text-gray-200"
            >
              {item}
            </p>
          ))
        ) : (
          transferScores.map((score) => (
            <p
              key={score.label}
              className="rounded-lg border border-blue-900/50 bg-blue-950/20 px-3 py-2 text-sm text-gray-200"
            >
              {score.label}: level {score.value}
            </p>
          ))
        )}
      </div>
    </article>
  );
}
