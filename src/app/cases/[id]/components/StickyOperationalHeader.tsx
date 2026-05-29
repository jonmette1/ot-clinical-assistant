"use client";

type StickyOperationalHeaderProps = {
  title?: string | null;
  isViewingHistoricalVersion: boolean;
};

export function StickyOperationalHeader({
  title,
  isViewingHistoricalVersion,
}: StickyOperationalHeaderProps) {
  return (
    <div className="fixed left-0 right-0 top-[72px] z-[999] border-b border-gray-800 bg-gray-950/95 px-4 py-3 backdrop-blur sm:top-[56px] sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {title || "Untitled Case"}
          </p>

          <p className="truncate text-xs text-gray-400">
            Clinician command center
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-gray-700 bg-gray-900 px-2 py-1 text-[11px] font-medium text-gray-300">
          {isViewingHistoricalVersion ? "Historical Snapshot" : "Live Case"}
        </span>
      </div>
    </div>
  );
}
