import { access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const basePath = path.join(process.cwd(), "src", specifier.slice(2));
  for (const candidate of [`${basePath}.ts`, `${basePath}.tsx`, path.join(basePath, "index.ts")]) {
    try {
      await access(candidate);
      return { shortCircuit: true, url: pathToFileURL(candidate).href };
    } catch {
      // Try the next supported TypeScript path.
    }
  }

  return nextResolve(specifier, context);
}
