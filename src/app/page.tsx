import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 text-white">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-3xl border border-gray-800 bg-gray-900/60 p-8 sm:p-12">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            Clinical Continuity Platform
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Clinical Continuity Platform
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Preserves clinical meaning across time so clinicians don&apos;t have
            to repeatedly reconstruct it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cases"
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              View Patients
            </Link>
            <Link
              href="/new-case"
              className="rounded-xl border border-gray-700 bg-gray-950/40 px-5 py-3 text-center text-sm font-semibold text-gray-200 transition hover:border-gray-600 hover:text-white"
            >
              Add Patient
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Discipline configuration
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Start an intake with the appropriate clinical lens.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              href="/new-case"
              className="rounded-xl border border-gray-800 bg-gray-950/30 p-4 transition hover:border-gray-700"
            >
              <p className="text-sm font-semibold text-gray-200">
                Occupational Therapy
              </p>
              <p className="mt-1 text-xs text-gray-500">OT intake</p>
            </Link>

            <Link
              href="/new-case?discipline=pt"
              className="rounded-xl border border-gray-800 bg-gray-950/30 p-4 transition hover:border-gray-700"
            >
              <p className="text-sm font-semibold text-gray-200">
                Physical Therapy
              </p>
              <p className="mt-1 text-xs text-gray-500">PT intake</p>
            </Link>

            <div className="rounded-xl border border-gray-800 bg-gray-950/20 p-4 opacity-60">
              <p className="text-sm font-semibold text-gray-400">
                Speech Language Pathology
              </p>
              <p className="mt-1 text-xs text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
