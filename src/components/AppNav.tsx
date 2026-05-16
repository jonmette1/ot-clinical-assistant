"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();

return (
  <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 text-white backdrop-blur">
<div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <Link href="/" className="text-base font-semibold sm:text-lg">
        OT Clinical Reasoning Assistant
      </Link>

      <div className="flex items-center justify-center gap-2 overflow-x-auto w-full sm:w-auto">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
            pathname === "/"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Home
        </Link>

        <Link
          href="/new-case"
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
            pathname === "/new-case"
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          New Case
        </Link>

        <Link
          href="/cases"
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
            pathname.startsWith("/cases")
              ? "bg-gray-800 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Cases
        </Link>
      </div>
    </div>
  </nav>
);
}