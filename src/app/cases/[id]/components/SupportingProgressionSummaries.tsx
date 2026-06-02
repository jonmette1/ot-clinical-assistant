"use client";

type SummaryValue = string | string[] | boolean | number | null | undefined;

type SummaryRow = {
  label: string;
  value: SummaryValue;
};

type SupportingProgressionSummariesProps = {
  shouldRender: boolean;
  clinicalAttentionRows: SummaryRow[];
  currentLongitudinalRows: SummaryRow[];
  latestProgressionEventRows: SummaryRow[];
  operationalFocusRows: SummaryRow[];
};

const hasSummaryValue = (value: SummaryValue): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
};

const hasAnySummaryValue = (rows: SummaryRow[]): boolean =>
  rows.some((row) => hasSummaryValue(row.value));

const renderSummaryValue = (value: SummaryValue, fallback = "Not documented yet.") => {
  if (!hasSummaryValue(value)) {
    return <span className="text-gray-500">{fallback}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1">
        {value.map((item, index) => (
          <li key={`${item}-${index}`}>• {item}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

export function SupportingProgressionSummaries({
  shouldRender,
  clinicalAttentionRows,
  currentLongitudinalRows,
  latestProgressionEventRows,
  operationalFocusRows,
}: SupportingProgressionSummariesProps) {
  if (!shouldRender) return null;

  return (
    <details
      data-ownership="patient-reference-workspace"
      className="mt-5 rounded-xl border border-gray-800 bg-gray-950/60 p-4"
    >
      <summary className="cursor-pointer text-sm font-semibold text-gray-200">
        Supporting progression summaries
        <span className="ml-2 text-xs font-normal text-gray-500">Show current snapshots and event details</span>
      </summary>

      <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
        <p className="font-semibold text-gray-100">Current Clinical Attention</p>
        <p className="mt-1 text-xs text-gray-500">Clinician-facing status from the latest progression check.</p>
        <dl className="mt-4 space-y-3">
          {hasAnySummaryValue(clinicalAttentionRows) ? (
            clinicalAttentionRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd className="mt-1 text-gray-200">{renderSummaryValue(row.value)}</dd>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No clinical attention summary is available yet.</p>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
        <p className="font-semibold text-gray-100">Current Longitudinal State</p>
        <p className="mt-1 text-xs text-gray-500">Current treatment trajectory and recent longitudinal context.</p>
        <dl className="mt-4 space-y-3">
          {hasAnySummaryValue(currentLongitudinalRows) ? (
            currentLongitudinalRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd className="mt-1 text-gray-200">{renderSummaryValue(row.value)}</dd>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No longitudinal state has been documented yet.</p>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
        <p className="font-semibold text-gray-100">Latest Progression Event</p>
        <p className="mt-1 text-xs text-gray-500">Most recent saved progression event and summary snapshots.</p>
        <dl className="mt-4 space-y-3">
          {hasAnySummaryValue(latestProgressionEventRows) ? (
            latestProgressionEventRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd className="mt-1 text-gray-200">{renderSummaryValue(row.value)}</dd>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No progression event has been recorded yet.</p>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
        <p className="font-semibold text-gray-100">Operational Focus</p>
        <p className="mt-1 text-xs text-gray-500">What treatment should emphasize right now.</p>
        <dl className="mt-4 space-y-3">
          {hasAnySummaryValue(operationalFocusRows) ? (
            operationalFocusRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd className="mt-1 text-gray-200">{renderSummaryValue(row.value)}</dd>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No operational focus has been generated yet.</p>
          )}
        </dl>
      </div>

      </div>
    </details>
  );
}
