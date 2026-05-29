"use client";

type EnvironmentalPressureCardProps = {
  environmentalPressures: string[];
};

export function EnvironmentalPressureCard({
  environmentalPressures,
}: EnvironmentalPressureCardProps) {
  if (environmentalPressures.length === 0) return null;

  return (
    <article className="rounded-xl border border-orange-800/70 bg-gray-900 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-300">
        Environment
      </p>
      <h3 className="mt-1 text-lg font-semibold text-white">
        Environmental Pressures
      </h3>
      <div className="mt-4 space-y-2">
        {environmentalPressures.slice(0, 4).map((item, index) => (
          <p
            key={index}
            className="rounded-lg border border-orange-900/50 bg-orange-950/20 px-3 py-2 text-sm text-gray-200"
          >
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}
