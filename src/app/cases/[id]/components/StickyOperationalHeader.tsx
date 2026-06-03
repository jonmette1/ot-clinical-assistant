"use client";

type StickyOperationalHeaderProps = {
  title?: string | null;
  isViewingHistoricalVersion: boolean;
  snapshotSavedAtLabel?: string | null;
  onReturnToLiveCase?: () => void;
};

export function StickyOperationalHeader({
  title,
  isViewingHistoricalVersion,
  snapshotSavedAtLabel,
  onReturnToLiveCase,
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

        <div className="flex shrink-0 items-center gap-2">
          <div
            className={`rounded-full border px-3 py-1 text-right text-[11px] font-medium ${
              isViewingHistoricalVersion
                ? "border-amber-500/70 bg-amber-950/50 text-amber-100"
                : "border-gray-700 bg-gray-900 text-gray-300"
            }`}
          >
            <p>{isViewingHistoricalVersion ? "Historical Snapshot" : "Live Case"}</p>
            {isViewingHistoricalVersion && snapshotSavedAtLabel ? (
              <p className="mt-0.5 text-[10px] font-normal text-amber-200/80">
                Saved {snapshotSavedAtLabel}
              </p>
            ) : null}
          </div>

          {isViewingHistoricalVersion && onReturnToLiveCase ? (
            <button
              type="button"
              onClick={onReturnToLiveCase}
              className="hidden rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-100 transition hover:border-blue-500 hover:bg-gray-900 sm:inline-flex"
            >
              Return to Live Case
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
