"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          OT Clinical Reasoning Assistant
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm ${
              pathname === "/"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Home
          </Link>

          <Link
            href="/new-case"
            className={`px-3 py-2 rounded-lg text-sm ${
              pathname === "/new-case"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            New Case
          </Link>

          <Link
            href="/cases"
            className={`px-3 py-2 rounded-lg text-sm ${
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