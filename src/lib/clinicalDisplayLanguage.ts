const TERMINAL_PUNCTUATION = /[.!?]+$/;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function stripTerminalPunctuation(text: string): string {
  return text.replace(TERMINAL_PUNCTUATION, "").trim();
}

function lowerFirst(text: string): string {
  if (!text) return text;
  return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

function ensurePeriod(text: string): string {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return "";
  return TERMINAL_PUNCTUATION.test(normalized) ? normalized : `${normalized}.`;
}

function cleanClinicalFragment(text: string): string {
  return stripTerminalPunctuation(normalizeWhitespace(text))
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/^progression described as\s+/i, "")
    .trim();
}

function sentenceFromFragment(text: string): string {
  const fragment = cleanClinicalFragment(text);
  if (!fragment) return "";

  if (/^(a\s+)?fall$/i.test(fragment)) {
    return "Fall reported.";
  }

  const reducedMatch = fragment.match(/^reduced\s+(.+)$/i);
  if (reducedMatch?.[1]) {
    return ensurePeriod(`${capitalizeFirst(reducedMatch[1])} reduced`);
  }

  const improvedMatch = fragment.match(/^improved\s+(.+)$/i);
  if (improvedMatch?.[1]) {
    return ensurePeriod(`${capitalizeFirst(improvedMatch[1])} improved`);
  }

  const elevatedMatch = fragment.match(/^elevated\s+(.+)$/i);
  if (elevatedMatch?.[1]) {
    return ensurePeriod(`${capitalizeFirst(elevatedMatch[1])} elevated`);
  }

  return ensurePeriod(capitalizeFirst(fragment));
}

function compressFragmentSet(text: string): string {
  const normalized = cleanClinicalFragment(text);
  if (!normalized) return "";

  const clinicianShorthandReady = normalized.replace(
    /\s+and\s+(reduced|improved|elevated)\s+/i,
    " resulting in $1 "
  );

  const splitByResult = clinicianShorthandReady
    .split(/\s+(?:resulting in|leading to|with)\s+/i)
    .map(sentenceFromFragment)
    .filter(Boolean);

  if (splitByResult.length > 1) return splitByResult.join(" ");

  return sentenceFromFragment(normalized);
}

function compressAttentionSentence(text: string): string | null {
  const normalized = normalizeWhitespace(text);
  const lower = normalized.toLowerCase();

  const regressionMatch = normalized.match(
    /^functional performance requires attention due to regression with (.+?) as the current dominant barrier\.?$/i
  );
  if (regressionMatch?.[1]) {
    return `Regression: ${cleanClinicalFragment(regressionMatch[1]).toLowerCase()} now primary.`;
  }

  const plateauMatch = normalized.match(
    /^progression requires attention because (.+?) continues to limit participation\.?$/i
  );
  if (plateauMatch?.[1]) {
    return `Plateau risk: ${cleanClinicalFragment(plateauMatch[1]).toLowerCase()} still limiting participation.`;
  }

  const shiftMatch = normalized.match(/^treatment attention should shift because (.+)\.?$/i);
  if (shiftMatch?.[1]) {
    return `Shift attention: ${lowerFirst(compressFragmentSet(shiftMatch[1]))}`;
  }

  const contextMatch = normalized.match(/^(caregiver|environmental|medical) context requires attention:\s*(.+)\.?$/i);
  if (contextMatch?.[1] && contextMatch?.[2]) {
    return `${capitalizeFirst(contextMatch[1].toLowerCase())}: ${lowerFirst(compressFragmentSet(contextMatch[2]))}`;
  }

  const currentFunctionMatch = normalized.match(/^current function requires attention around (.+)\.?$/i);
  if (currentFunctionMatch?.[1]) {
    return `Attention: ${cleanClinicalFragment(currentFunctionMatch[1]).toLowerCase()}.`;
  }

  if (lower.startsWith("functional performance requires attention due to ")) {
    return compressFragmentSet(normalized.replace(/^functional performance requires attention due to\s+/i, ""));
  }

  return null;
}

function compressActionSentence(text: string): string | null {
  const normalized = normalizeWhitespace(text);

  const reassessMatch = normalized.match(/^reassess if (.+?)(?: requires clinical review)?\.?$/i);
  if (reassessMatch?.[1]) {
    return `Reassess: ${cleanClinicalFragment(reassessMatch[1]).toLowerCase()}.`;
  }

  const progressionMatch = normalized.match(/^check progression if (.+)\.?$/i);
  if (progressionMatch?.[1]) {
    return `Check progression: ${cleanClinicalFragment(progressionMatch[1]).toLowerCase()}.`;
  }

  if (/^review the current treatment direction\.?$/i.test(normalized)) {
    return "Review treatment direction.";
  }

  if (/^reassess before advancing the plan\.?$/i.test(normalized)) {
    return "Reassess before advancing.";
  }

  return null;
}

function compressSinceLastVisitSentence(text: string): string | null {
  const normalized = normalizeWhitespace(text);

  const recentVisitMatch = normalized.match(/^recent visit notes indicate (.+)\.?$/i);
  if (recentVisitMatch?.[1]) {
    return compressFragmentSet(recentVisitMatch[1]);
  }

  const milestoneMatch = normalized.match(/^a milestone was noted:\s*(.+)\.?$/i);
  if (milestoneMatch?.[1]) {
    return `Milestone: ${lowerFirst(compressFragmentSet(milestoneMatch[1]))}`;
  }

  const directionChangedMatch = normalized.match(/^treatment direction changed(?: because (.+))?\.?$/i);
  if (directionChangedMatch) {
    return directionChangedMatch[1]
      ? `Treatment direction changed: ${lowerFirst(compressFragmentSet(directionChangedMatch[1]))}`
      : "Treatment direction changed.";
  }

  if (/^treatment direction remains consistent with the prior visit\.?$/i.test(normalized)) {
    return "Treatment direction unchanged.";
  }

  const contextMatch = normalized.match(/^current visit context centers on (.+)\.?$/i);
  if (contextMatch?.[1]) {
    return compressFragmentSet(contextMatch[1].replace(/\s+with\s+progression described as\s+/i, "; "));
  }

  return null;
}

export function compressCommandCenterSentence(text: string | null | undefined): string {
  if (typeof text !== "string") return "";

  const normalized = normalizeWhitespace(text);
  if (!normalized) return "";

  return (
    compressActionSentence(normalized) ||
    compressAttentionSentence(normalized) ||
    compressSinceLastVisitSentence(normalized) ||
    normalized
  );
}

export function compressCommandCenterList(
  items: Array<string | null | undefined>,
  limit?: number
): string[] {
  const compressed = items
    .map((item) => compressCommandCenterSentence(item))
    .filter((item): item is string => item.length > 0);

  return typeof limit === "number" ? compressed.slice(0, limit) : compressed;
}
