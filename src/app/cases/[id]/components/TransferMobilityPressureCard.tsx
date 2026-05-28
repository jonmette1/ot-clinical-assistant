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
    <div className="mt-6 border-t border-gray-800 pt-4">
      <h3 className="text-lg font-semibold mb-2">Execution Pressure Points</h3>

      {worstTransfer && (
        <p className="mb-3 text-sm text-gray-300">
          Highest transfer pressure: {worstTransfer.label} at level {worstTransfer.value}.
        </p>
      )}

      {executionPressurePoints.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
          {executionPressurePoints.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc pl-5 space-y-1 text-gray-300">
          {transferScores.map((score) => (
            <li key={score.label}>
              {score.label}: level {score.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
