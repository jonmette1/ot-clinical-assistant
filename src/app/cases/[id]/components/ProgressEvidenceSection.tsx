import type { ProgressEvidence } from "@/lib/buildProgressEvidence";

export function ProgressEvidenceSection({ evidence }: { evidence: ProgressEvidence }) {
  const hasEvidence =
    evidence.improved.length > 0 ||
    evidence.milestones.length > 0 ||
    evidence.stillLimiting.length > 0 ||
    evidence.safetyConsiderations.length > 0;

  if (!hasEvidence) return null;

  return (
    <details className="group rounded-2xl border border-gray-800 bg-gray-950/45 lg:col-span-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 marker:content-none sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
            6. Progress Evidence
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Objective changes supporting the current progression story
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-400 group-open:hidden">Show</span>
        <span className="hidden text-xs font-semibold text-gray-400 group-open:inline">Hide</span>
      </summary>

      <div className="border-t border-gray-800 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Timeframe
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-300">{evidence.timeframe}</p>
        </section>

        <div className="mt-4 grid gap-4 border-t border-gray-800 pt-4 md:grid-cols-2">
          <EvidenceList title="Improved" items={evidence.improved} />
          <EvidenceList title="Milestones" items={evidence.milestones} />
          <EvidenceList title="Still limiting" items={evidence.stillLimiting} />
          <EvidenceList title="Safety considerations" items={evidence.safetyConsiderations} />
        </div>
      </div>
    </details>
  );
}

function EvidenceList({
  title,
  items,
}: {
  title: string;
  items: ProgressEvidence["improved"];
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</h3>
      <ul className="mt-2 space-y-2.5">
        {items.map((item) => (
          <li key={`${item.label}-${item.explanation}`} className="flex gap-2.5 text-sm leading-relaxed">
            <span className="mt-1 text-gray-600">•</span>
            <span>
              <span className="font-medium text-gray-200">{item.label}:</span>{" "}
              <span className="text-gray-400">{item.explanation}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
