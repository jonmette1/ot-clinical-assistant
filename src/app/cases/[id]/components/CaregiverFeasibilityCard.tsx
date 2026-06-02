"use client";

type CaregiverFeasibilityCardProps = {
  caregiverGuidance: string[];
  fallbackFeasibilityItems: string[];
};

export function CaregiverFeasibilityCard({
  caregiverGuidance,
  fallbackFeasibilityItems,
}: CaregiverFeasibilityCardProps) {
  const feasibilityItems = caregiverGuidance.length > 0
    ? caregiverGuidance
    : fallbackFeasibilityItems;

  if (feasibilityItems.length === 0) return null;

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-950/45 p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-300/60" aria-hidden="true" />
        Caregiver
      </p>
      <h3 className="mt-2 text-base font-semibold text-gray-100">
        Support Feasibility
      </h3>
      <div className="mt-4 space-y-2">
        {feasibilityItems.slice(0, 4).map((item, index) => (
          <p
            key={index}
            className="rounded-lg border border-gray-800/80 bg-gray-950/55 px-3 py-2 text-sm leading-relaxed text-gray-300"
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
