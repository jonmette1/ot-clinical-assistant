import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-6">
        OT Clinical Reasoning Assistant
      </h1>

      <div className="flex flex-col items-center gap-4">
        <Link
          href="/new-case"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg"
        >
          Create New Case
        </Link>

        <Link
          href="/cases"
          className="text-blue-400 underline"
        >
          View Saved Cases
        </Link>
      </div>
    </main>
  );
}