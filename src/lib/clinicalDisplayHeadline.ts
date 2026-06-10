const MAX_HEADLINE_WORDS = 20;
const MIN_PREFERRED_SENTENCE_WORDS = 12;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function wordCount(value: string): number {
  return normalizeWhitespace(value).split(" ").filter(Boolean).length;
}

/**
 * Creates a scan-friendly Current Focus headline without changing the maintained
 * conclusion. The complete conclusion remains available as supporting detail in
 * the Visit Briefing.
 */
export function buildCurrentFocusHeadline(value: string): string {
  const normalized = normalizeWhitespace(value);
  if (!normalized || wordCount(normalized) <= MAX_HEADLINE_WORDS) return normalized;

  const firstSentence = normalized.match(/^.*?[.!?](?=\s|$)/)?.[0]?.trim();
  if (
    firstSentence &&
    wordCount(firstSentence) >= MIN_PREFERRED_SENTENCE_WORDS &&
    wordCount(firstSentence) <= MAX_HEADLINE_WORDS
  ) {
    return firstSentence;
  }

  const words = normalized.split(" ");
  const compact = words
    .slice(0, MAX_HEADLINE_WORDS)
    .join(" ")
    .replace(/[,:;.!?]+$/g, "");

  return `${compact}…`;
}
