"use client";

type EnvironmentalPressureCardProps = {
  environmentalPressures: string[];
};

export function EnvironmentalPressureCard({
  environmentalPressures,
}: EnvironmentalPressureCardProps) {
  if (environmentalPressures.length === 0) return null;

  return (
    <div className="mt-6 border-t border-gray-800 pt-4">
      <h3 className="text-lg font-semibold mb-2">Environmental Pressures</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-300">
        {environmentalPressures.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
