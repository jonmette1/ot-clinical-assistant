import Link from "next/link";

export default function Home() {
return (
  <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6">
    <section className="w-full max-w-4xl rounded-3xl border border-gray-800 bg-gray-900/60 p-8 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
        Clinical Assistant
      </p>

      <h1 className="mb-3 text-4xl font-bold">
        Select Discipline
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-gray-400">
        Choose the clinical lens for intake, case orientation, and treatment planning support.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/new-case"
          className="rounded-2xl border border-sky-500/40 bg-sky-950/20 p-6 text-left transition hover:border-sky-400"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Occupational Therapy
          </p>

          <h2 className="text-xl font-semibold">
            OT
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            ADL performance, home safety, caregiver support, and functional participation.
          </p>
        </Link>

        <Link
          href="/new-case?discipline=pt"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 text-left transition hover:border-emerald-400"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Physical Therapy
          </p>

          <h2 className="text-xl font-semibold">
            PT
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Mobility, transfers, falls, endurance, gait, and home navigation.
          </p>
        </Link>

        <div className="rounded-2xl border border-gray-800 bg-gray-950/40 p-6 text-left opacity-60">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Speech Language Pathology
          </p>

          <h2 className="text-xl font-semibold text-gray-400">
            SLP
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Coming Soon
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/cases"
          className="text-blue-400 underline"
        >
          View Saved Cases
        </Link>
      </div>
    </section>
  </main>
);
}