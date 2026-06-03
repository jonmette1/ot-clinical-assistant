import type { ClinicalImpactSummary } from "@/lib/clinicalDelta/buildClinicalImpactSummary";

type ClinicalImpactSummaryPanelProps = {
  summary: ClinicalImpactSummary;
  onDismiss: () => void;
};

const formatEventDate = (value: string | undefined): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export function ClinicalImpactSummaryPanel({
  summary,
  onDismiss,
}: ClinicalImpactSummaryPanelProps) {
  const eventDate = formatEventDate(summary.eventCreatedAt);

  return (
    <aside className="lg:col-span-2 rounded-2xl border border-blue-900/40 bg-blue-950/10 p-4 shadow-sm shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200/80">
            Clinical Impact
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Based on your update
          </h2>
          {eventDate ? (
            <p className="mt-1 text-xs text-gray-500">Saved {eventDate}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-gray-700 px-3 py-1 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          aria-label="Dismiss clinical impact summary"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-4 grid gap-4 text-sm leading-relaxed text-gray-200 md:grid-cols-2">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Reported
          </p>
          {summary.reportedChanges.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {summary.reportedChanges.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <span className="text-blue-200/70">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-400">Progression check saved.</p>
          )}
        </section>

        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Next
          </p>
          <p className="mt-2 text-gray-100">{summary.nextAction}</p>
        </section>
      </div>

      <div className="mt-4 grid gap-4 border-t border-gray-800 pt-4 text-sm leading-relaxed md:grid-cols-2">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Changed
          </p>
          {summary.changedConclusions.length > 0 ? (
            <ul className="mt-2 space-y-3 text-gray-200">
              {summary.changedConclusions.map((change) => (
                <li key={change.key}>
                  <span className="font-medium text-white">{change.label}: </span>
                  <span className="text-gray-400">{change.previous}</span>
                  <span className="px-2 text-gray-500">→</span>
                  <span className="text-gray-100">{change.current}</span>
                  {change.reason ? (
                    <span className="mt-1 block text-xs text-gray-500">{change.reason}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-400">
              No major Command Center conclusions changed.
            </p>
          )}
        </section>

        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Confirmed
          </p>
          {summary.confirmedConclusions.length > 0 ? (
            <ul className="mt-2 space-y-3 text-gray-200">
              {summary.confirmedConclusions.map((confirmation) => (
                <li key={confirmation.key}>
                  <span className="font-medium text-white">{confirmation.label} remains: </span>
                  <span className="text-gray-100">{confirmation.current}</span>
                  {confirmation.reason ? (
                    <span className="mt-1 block text-xs text-gray-500">{confirmation.reason}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-400">
              Stable conclusions will appear here when applicable.
            </p>
          )}
        </section>
      </div>

      {summary.whyItMatters ? (
        <section className="mt-4 border-t border-gray-800 pt-4 text-sm leading-relaxed text-gray-300">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
            Why this matters
          </p>
          <p className="mt-2">{summary.whyItMatters}</p>
        </section>
      ) : null}
    </aside>
  );
}
