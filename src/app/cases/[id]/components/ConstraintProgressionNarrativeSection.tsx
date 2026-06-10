import type { ConstraintProgressionNarrative } from "@/lib/buildConstraintProgressionNarrative";

export function ConstraintProgressionNarrativeSection({
  narrative,
}: {
  narrative: ConstraintProgressionNarrative;
}) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-950/55 p-4 lg:col-span-2 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        Progression Constraint
      </p>
      <h2 className="mt-1.5 max-w-4xl text-lg font-semibold leading-snug text-gray-100 sm:text-xl">
        {narrative.headline}
      </h2>
      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-400">
        {narrative.summary}
      </p>

      {(narrative.whatImproved.length > 0 || narrative.whatStillBlocksProgression.length > 0) ? (
        <div className="mt-4 grid gap-4 border-t border-gray-800 pt-4 md:grid-cols-2">
          {narrative.whatImproved.length > 0 ? (
            <NarrativeList title="What improved" items={narrative.whatImproved} />
          ) : null}
          {narrative.whatStillBlocksProgression.length > 0 ? (
            <NarrativeList
              title="What still blocks progression"
              items={narrative.whatStillBlocksProgression}
            />
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 border-t border-gray-800 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Why the recommendation still fits
        </p>
        <p className="mt-1.5 max-w-4xl text-sm leading-relaxed text-gray-300">
          {narrative.whyRecommendationRemainsAppropriate}
        </p>
      </div>
    </section>
  );
}

function NarrativeList({
  title,
  items,
}: {
  title: string;
  items: ConstraintProgressionNarrative["whatImproved"];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        {title}
      </h3>
      <ul className="mt-2 space-y-2.5">
        {items.map((item) => (
          <li key={`${item.label}-${item.explanation}`} className="flex gap-2.5 text-sm leading-relaxed">
            <span className="mt-1 text-gray-500">•</span>
            <span>
              <span className="font-medium text-gray-200">{item.label}:</span>{" "}
              <span className="text-gray-400">{item.explanation}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
