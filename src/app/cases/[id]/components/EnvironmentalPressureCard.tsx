"use client";

type EnvironmentalPressureCardProps = {
  environmentalPressures: string[];
};

export function EnvironmentalPressureCard({
  environmentalPressures,
}: EnvironmentalPressureCardProps) {
  if (environmentalPressures.length === 0) return null;

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-950/45 p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-300/60" aria-hidden="true" />
        Environment
      </p>
      <h3 className="mt-2 text-base font-semibold text-gray-100">
        Environmental Pressures
      </h3>
      <div className="mt-4 space-y-2">
        {environmentalPressures.slice(0, 4).map((item, index) => (
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
