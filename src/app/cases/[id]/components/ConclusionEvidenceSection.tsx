import type { ClinicalEvidence } from "@/lib/buildConclusionEvidence";

export function ConclusionEvidenceSection({
  evidence,
  conclusionLabel,
}: {
  evidence: ClinicalEvidence[];
  conclusionLabel: string;
}) {
  if (evidence.length === 0) return null;

  return (
    <details className="group mt-3 rounded-xl border border-gray-800 bg-gray-950/35 px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-300 marker:hidden transition hover:text-white">
        <span>
          Supporting Evidence
          <span className="ml-2 hidden font-normal text-gray-500 sm:inline">
            {conclusionLabel} context
          </span>
        </span>
        <span
          aria-hidden="true"
          className="text-gray-500 transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="mt-3 space-y-3">
        {evidence.map((item) => (
          <article
            key={`${item.evidenceLabel}-${item.sourceContext}`}
            className="border-l border-gray-700 pl-3"
          >
            <h3 className="text-sm font-semibold text-gray-100">{item.evidenceLabel}</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {item.sourceContext}
              {item.observedAt ? ` · ${formatObservedAt(item.observedAt)}` : ""}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              {item.observedMeaning}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              <span className="font-medium text-gray-300">Why it matters:</span>{" "}
              {item.clinicalRelevance}
            </p>
            {item.reasoningBasis ? (
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                <span className="font-medium text-gray-400">Clinical reasoning:</span>{" "}
                {item.reasoningBasis}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </details>
  );
}

function formatObservedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
