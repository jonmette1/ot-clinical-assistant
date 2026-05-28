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
    <div className="mt-6 border-t border-gray-800 pt-4">
      <h3 className="text-lg font-semibold mb-2">Feasibility Constraints</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-300">
        {feasibilityItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
