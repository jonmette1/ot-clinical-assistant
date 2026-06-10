import type { OrientationBrief } from "@/lib/buildOrientationBrief";

export function OrientationBriefSection({ brief }: { brief: OrientationBrief }) {
  return (
    <details className="group rounded-2xl border border-gray-800 bg-gray-950/45">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:content-none sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-100">Orientation Brief</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 group-open:hidden">
            20–30 second pre-visit orientation generated from maintained clinical understanding.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-gray-400 group-open:hidden">
          Show Brief
        </span>
        <span className="hidden shrink-0 text-xs font-semibold text-gray-400 group-open:inline">
          Hide Brief
        </span>
      </summary>

      <div className="border-t border-gray-800 px-4 pb-5 pt-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Estimated time: {brief.estimatedDurationSeconds} seconds
        </p>
        <h3 className="mt-2 max-w-4xl text-lg font-semibold leading-snug text-white">
          {brief.headline}
        </h3>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-300">
          {brief.briefText}
        </p>
      </div>
    </details>
  );
}
