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
    <article className="rounded-xl border border-purple-800/70 bg-gray-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
        Caregiver
      </p>
      <h3 className="mt-1 text-lg font-semibold text-white">
        Support Feasibility
      </h3>
      <div className="mt-4 space-y-2">
        {feasibilityItems.slice(0, 4).map((item, index) => (
          <p
            key={index}
            className="rounded-lg border border-purple-900/50 bg-purple-950/20 px-3 py-2 text-sm text-gray-200"
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
