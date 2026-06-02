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
    <article className="rounded-xl border border-gray-800 bg-gray-950/45 p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-300/60" aria-hidden="true" />
        Transfer / Mobility
      </p>
      <h3 className="mt-2 text-base font-semibold text-gray-100">
        Mobility Pressure
      </h3>

      {worstTransfer && (
        <p className="mt-3 rounded-lg border border-gray-800/80 bg-gray-950/55 px-3 py-2 text-sm leading-relaxed text-gray-300">
          Highest transfer pressure: {worstTransfer.label} at level {worstTransfer.value}.
        </p>
      )}

      <div className="mt-3 space-y-2">
        {executionPressurePoints.length > 0 ? (
          executionPressurePoints.slice(0, 4).map((item, index) => (
            <p
              key={index}
              className="rounded-lg border border-gray-800/80 bg-gray-950/55 px-3 py-2 text-sm leading-relaxed text-gray-300"
            >
              {item}
            </p>
          ))
        ) : (
          transferScores.map((score) => (
            <p
              key={score.label}
              className="rounded-lg border border-gray-800/80 bg-gray-950/55 px-3 py-2 text-sm leading-relaxed text-gray-300"
            >
              {score.label}: level {score.value}
            </p>
          ))
        )}
      </div>
    </article>
  );
}
