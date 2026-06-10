import type { ConclusionChangeExplanation } from "@/lib/buildConclusionChangeExplanation";

const TYPE_LABELS: Record<ConclusionChangeExplanation["explanationType"], string> = {
  changed: "Changed",
  stable: "Stable",
  progressing: "Progressing",
  deferred: "Progression deferred",
  monitoring: "Monitoring",
};

export function ConclusionChangeExplanationSection({
  explanation,
}: {
  explanation: ConclusionChangeExplanation;
}) {
  return (
    <details className="group mt-3 border-t border-gray-800/80 pt-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-300 marker:hidden transition hover:text-white">
        <span>
          Why This Changed
          <span className="ml-2 hidden font-normal text-gray-500 sm:inline">
            {TYPE_LABELS[explanation.explanationType]}
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
        <p className="text-sm leading-relaxed text-gray-300">{explanation.summary}</p>
        {explanation.factors.map((factor) => (
          <article
            key={`${factor.factorLabel}-${factor.changeType}`}
            className="border-l border-gray-700 pl-3"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-sm font-semibold text-gray-100">{factor.factorLabel}</h3>
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                {factor.changeType}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">
              {factor.explanation}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              <span className="font-medium text-gray-300">Clinical impact:</span>{" "}
              {factor.clinicalImpact}
            </p>
          </article>
        ))}
      </div>
    </details>
  );
}
