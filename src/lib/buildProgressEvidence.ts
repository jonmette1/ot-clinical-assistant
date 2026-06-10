export type ProgressEvidenceItem = {
  label: string;
  explanation: string;
  sourceContext?: string;
  observedAt?: string;
  rawSource?: {
    sourceType: string;
    field?: string;
    value?: unknown;
  };
};

export type ProgressEvidence = {
  timeframe: string;
  improved: ProgressEvidenceItem[];
  milestones: ProgressEvidenceItem[];
  stillLimiting: ProgressEvidenceItem[];
  safetyConsiderations: ProgressEvidenceItem[];
};

type BuildProgressEvidenceInput = {
  progressionState?: unknown;
  longitudinalState?: unknown;
  visitHistory?: unknown;
  clinicalDecisionModel?: unknown;
  continuityInterpretation?: unknown;
};

type EvidenceCandidate = ProgressEvidenceItem & {
  priority: number;
  sourceKey: string;
};

type SourceSignal = {
  value: string;
  sourceType: string;
  field: string;
  sourceContext: string;
  observedAt?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readPath(source: unknown, path: string[]): unknown {
  let current = source;
  for (const segment of path) {
    if (!isRecord(current)) return undefined;
    current = current[segment];
  }
  return current;
}

function readFirst(source: unknown, paths: string[][]): unknown {
  for (const path of paths) {
    const value = readPath(source, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function asTextList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asText).filter((item): item is string => Boolean(item));
  }
  const text = asText(value);
  return text ? [text] : [];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceCase(value: string): string {
  const text = value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/[.]+$/, "");
  return text ? `${text[0].toUpperCase()}${text.slice(1)}.` : text;
}

function hasAny(value: string, expressions: RegExp[]): boolean {
  return expressions.some((expression) => expression.test(value));
}

function describesImprovement(value: string): boolean {
  return hasAny(normalize(value), [
    /\bimprov/, /\bprogress/, /\breduced? (?:assist|assistance|cue|cueing|support|burden)/,
    /\bless (?:assist|assistance|cue|cueing|support)/, /\bfewer (?:cue|cues|prompts)/,
    /\bmore independent/, /\bincreased independence/, /\bsafer/, /\bresolved/,
    /\b(?:caregiver|cueing|support|environment|barrier).*(?:improv|reduc|less|fewer)/,
  ]);
}

function describesSafetyConcern(value: string): boolean {
  return hasAny(normalize(value), [
    /\bfall/, /\bnear fall/, /\bregress/, /\bdeclin/, /\bunsafe/, /\bsafety/,
    /\bloss of balance/, /\bsetback/, /\bincreased (?:assist|assistance|support)/,
    /\bmore (?:assist|assistance|support)/, /\bworsen/, /\binjur/, /\bhospital/,
  ]);
}

function inferActivity(value: string): string {
  const text = normalize(value);
  if (text.includes("shower")) return "Shower transfer";
  if (text.includes("toilet")) return "Toilet transfer";
  if (text.includes("bed transfer")) return "Bed transfer";
  if (text.includes("transfer")) return "Transfer performance";
  if (text.includes("bathing")) return "Bathing performance";
  if (text.includes("dressing")) return "Dressing performance";
  if (text.includes("mobility")) return "Functional mobility";
  if (text.includes("caregiver")) return "Caregiver support";
  return "Functional performance";
}

function observedAt(record: Record<string, unknown>): string | undefined {
  return asText(
    readFirst(record, [
      ["eventDate"], ["event_date"], ["created_at"], ["lastUpdatedAt"], ["last_updated_at"],
    ])
  ) || undefined;
}

function visitRecords(visitHistory: unknown): Record<string, unknown>[] {
  if (Array.isArray(visitHistory)) return visitHistory.filter(isRecord);
  return isRecord(visitHistory) ? [visitHistory] : [];
}

function collectSignals(
  input: BuildProgressEvidenceInput,
  paths: string[][],
  field: string
): SourceSignal[] {
  const signals: SourceSignal[] = [];
  const longitudinalObservedAt = isRecord(input.longitudinalState)
    ? observedAt(input.longitudinalState)
    : undefined;

  for (const value of asTextList(readFirst(input.longitudinalState, paths))) {
    signals.push({
      value,
      sourceType: "longitudinal_state",
      field,
      sourceContext: "Current longitudinal update",
      observedAt: longitudinalObservedAt,
    });
  }

  for (const visit of visitRecords(input.visitHistory)) {
    const date = observedAt(visit);
    const sources = [visit.event_payload, visit.current_state_snapshot, visit];
    for (const source of sources) {
      for (const value of asTextList(readFirst(source, paths))) {
        signals.push({
          value,
          sourceType: "visit_history",
          field,
          sourceContext: "Documented visit update",
          observedAt: date,
        });
      }
    }
  }

  const seen = new Set<string>();
  return signals.filter((signal) => {
    const fingerprint = normalize(signal.value);
    if (!fingerprint || seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
}

function toRawSource(signal: SourceSignal): ProgressEvidenceItem["rawSource"] {
  return { sourceType: signal.sourceType, field: signal.field, value: signal.value };
}

function improvementCandidate(signal: SourceSignal): EvidenceCandidate {
  const normalized = normalize(signal.value);
  const activity = inferActivity(signal.value);

  if (/reduced? (?:assist|assistance)|less (?:assist|assistance)|from .* to .*assist/.test(normalized)) {
    return {
      label: `${activity} assistance`,
      explanation: `${activity} moved to a lower assistance level compared with earlier documented performance.`,
      sourceContext: signal.sourceContext,
      observedAt: signal.observedAt,
      rawSource: toRawSource(signal),
      priority: 100,
      sourceKey: `assist:${normalize(activity)}`,
    };
  }

  if (/fewer (?:cue|cues|prompts)|reduced? (?:cue|cueing)|less (?:cue|cueing)/.test(normalized)) {
    return {
      label: `${activity} cueing`,
      explanation: `${activity} required less cueing than previously documented.`,
      sourceContext: signal.sourceContext,
      observedAt: signal.observedAt,
      rawSource: toRawSource(signal),
      priority: activity === "Caregiver support" ? 88 : 94,
      sourceKey: `cueing:${normalize(activity)}`,
    };
  }

  if (/caregiver|support burden|cueing burden/.test(normalized)) {
    return {
      label: "Caregiver support burden",
      explanation: "Caregiver cueing or hands-on support burden appears reduced compared with earlier visits.",
      sourceContext: signal.sourceContext,
      observedAt: signal.observedAt,
      rawSource: toRawSource(signal),
      priority: 88,
      sourceKey: "caregiver-support-improvement",
    };
  }

  if (/environment|barrier|equipment|home setup|bathroom setup/.test(normalized)) {
    return {
      label: "Environmental access",
      explanation: "A documented environmental barrier appears less limiting than in earlier visits.",
      sourceContext: signal.sourceContext,
      observedAt: signal.observedAt,
      rawSource: toRawSource(signal),
      priority: 86,
      sourceKey: "environmental-improvement",
    };
  }

  return {
    label: activity,
    explanation: `${activity} shows documented improvement compared with earlier performance in the current visit sequence.`,
    sourceContext: signal.sourceContext,
    observedAt: signal.observedAt,
    rawSource: toRawSource(signal),
    priority: 92,
    sourceKey: `performance:${normalize(activity)}`,
  };
}

function limitingCandidate(
  value: string,
  field: string,
  priority: number,
  sourceType = "progression_state"
): EvidenceCandidate {
  const normalized = normalize(value);
  const activity = inferActivity(value);
  let label = `${activity} support need`;
  let explanation = `${activity} continues to require support and remains a documented limit on advancement.`;

  if (/caregiver|support system|training|carryover/.test(normalized)) {
    label = "Caregiver support";
    explanation = "Caregiver support, confidence, or carryover remains a limiting factor in the current progression picture.";
  } else if (/environment|bathroom|step|stairs|equipment|grab bar|home setup/.test(normalized)) {
    label = "Environmental constraint";
    explanation = "The current environment or equipment setup continues to limit reliable task performance.";
  } else if (/pain|endurance|fatigue/.test(normalized)) {
    label = "Performance tolerance";
    explanation = "Pain, fatigue, or endurance continues to limit consistent functional performance.";
  }

  return {
    label,
    explanation,
    sourceContext: "Current progression summary",
    rawSource: { sourceType, field, value },
    priority,
    sourceKey: `limiting:${normalize(label)}`,
  };
}

function safetyCandidate(signal: SourceSignal): EvidenceCandidate {
  const normalized = normalize(signal.value);
  const activity = inferActivity(signal.value);
  let label = "Safety risk";
  let explanation = "A current safety signal remains relevant when interpreting functional progress.";
  let priority = 82;

  if (/near fall/.test(normalized)) {
    label = "Near-fall risk";
    explanation = `A recent near-fall remains a safety consideration when interpreting ${activity.toLowerCase()} progress.`;
    priority = 96;
  } else if (/fall/.test(normalized)) {
    label = "Fall risk";
    explanation = `A recent fall remains a safety consideration when interpreting ${activity.toLowerCase()} progress.`;
    priority = 98;
  } else if (/regress|declin|worsen|setback|increased assist|more assist/.test(normalized)) {
    label = "Recent setback";
    explanation = "Recent regression or increased support needs temper the otherwise documented progression story.";
    priority = 92;
  }

  return {
    label,
    explanation,
    sourceContext: signal.sourceContext,
    observedAt: signal.observedAt,
    rawSource: toRawSource(signal),
    priority,
    sourceKey: `safety:${normalize(label)}:${normalize(activity)}`,
  };
}

function select(items: EvidenceCandidate[], limit = 2): ProgressEvidenceItem[] {
  const seen = new Set<string>();
  return items
    .sort((left, right) => right.priority - left.priority || left.sourceKey.localeCompare(right.sourceKey))
    .filter((item) => {
      const fingerprint = normalize(`${item.label}|${item.explanation}`);
      if (seen.has(fingerprint)) return false;
      seen.add(fingerprint);
      return true;
    })
    .slice(0, limit)
    .map((item) => ({
      label: item.label,
      explanation: item.explanation,
      sourceContext: item.sourceContext,
      observedAt: item.observedAt,
      rawSource: item.rawSource,
    }));
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function buildTimeframe(input: BuildProgressEvidenceInput): string {
  const dateValues: string[] = [];
  for (const visit of visitRecords(input.visitHistory)) {
    const value = observedAt(visit);
    if (value) dateValues.push(value);
  }
  if (isRecord(input.longitudinalState)) {
    const value = observedAt(input.longitudinalState);
    if (value) dateValues.push(value);
  }

  const dates = dateValues
    .map(parseDate)
    .filter((date): date is Date => Boolean(date))
    .sort((left, right) => left.getTime() - right.getTime());
  const uniqueDays = Array.from(new Map(dates.map((date) => [date.toISOString().slice(0, 10), date])).values());

  if (uniqueDays.length > 1) {
    return `Progress evidence reflects documented changes from ${formatDate(uniqueDays[0])} through ${formatDate(uniqueDays[uniqueDays.length - 1])}.`;
  }
  if (uniqueDays.length === 1) {
    return `Progress evidence reflects documented changes through ${formatDate(uniqueDays[0])}.`;
  }
  return "Progress evidence reflects the current documented visit sequence.";
}

export function buildProgressEvidence(input: BuildProgressEvidenceInput): ProgressEvidence {
  const functionalSignals = collectSignals(
    input,
    [["functionalChanges"], ["functional_changes"], ["patientStatusUpdates"], ["patient_status_updates"]],
    "functionalChanges"
  );
  const caregiverSignals = collectSignals(
    input,
    [["caregiverChange"], ["caregiver_change"]],
    "caregiverChange"
  );
  const environmentalSignals = collectSignals(
    input,
    [["environmentalChange"], ["environmental_change"]],
    "environmentalChange"
  );
  const milestoneSignals = collectSignals(
    input,
    [["milestoneAchieved"], ["milestone_achieved"]],
    "milestoneAchieved"
  );

  const improved = [...functionalSignals, ...caregiverSignals, ...environmentalSignals]
    .filter((signal) => describesImprovement(signal.value) && !describesSafetyConcern(signal.value))
    .map(improvementCandidate);

  const milestones: EvidenceCandidate[] = milestoneSignals
    .filter((signal) => !describesSafetyConcern(signal.value))
    .map((signal) => ({
      label: inferActivity(signal.value) === "Functional performance" ? "Documented milestone" : inferActivity(signal.value),
      explanation: sentenceCase(signal.value),
      sourceContext: signal.sourceContext,
      observedAt: signal.observedAt,
      rawSource: toRawSource(signal),
      priority: 90,
      sourceKey: `milestone:${normalize(signal.value)}`,
    }));


  const stillLimiting: EvidenceCandidate[] = [];
  const limitingSources: Array<{ values: string[]; field: string; priority: number; sourceType?: string }> = [
    {
      values: asTextList(readFirst(input.progressionState, [["activeBarriers"], ["active_barriers"]])),
      field: "activeBarriers",
      priority: 96,
    },
    {
      values: asTextList(readFirst(input.progressionState, [["caregiverDependencyState"], ["caregiver_dependency_state"]])),
      field: "caregiverDependencyState",
      priority: 88,
    },
    {
      values: asTextList(readFirst(input.progressionState, [["environmentalLimitationState"], ["environmental_limitation_state"]])),
      field: "environmentalLimitationState",
      priority: 86,
    },
    {
      values: asTextList(readFirst(input.longitudinalState, [["currentDominantBarrier"], ["current_dominant_barrier"]])),
      field: "currentDominantBarrier",
      priority: 92,
      sourceType: "longitudinal_state",
    },
  ];
  for (const source of limitingSources) {
    for (const value of source.values) {
      if (!describesSafetyConcern(value)) {
        stillLimiting.push(limitingCandidate(value, source.field, source.priority, source.sourceType));
      }
    }
  }

  const safetySignals: SourceSignal[] = [...functionalSignals];
  const safetySources: Array<{ source: unknown; paths: string[][]; field: string; sourceType: string; context: string }> = [
    { source: input.progressionState, paths: [["regressionRisks"], ["regression_risks"]], field: "regressionRisks", sourceType: "progression_state", context: "Current progression summary" },
    { source: input.progressionState, paths: [["reassessmentTriggers"], ["reassessment_triggers"]], field: "reassessmentTriggers", sourceType: "progression_state", context: "Current progression summary" },
    { source: input.continuityInterpretation, paths: [["continuityAlerts"], ["continuity_alerts"]], field: "continuityAlerts", sourceType: "continuity_interpretation", context: "Current clinical record" },
  ];
  for (const source of safetySources) {
    for (const value of asTextList(readFirst(source.source, source.paths))) {
      safetySignals.push({ value, sourceType: source.sourceType, field: source.field, sourceContext: source.context });
    }
  }

  const safetyConsiderations = safetySignals
    .filter((signal) => describesSafetyConcern(signal.value))
    .map(safetyCandidate);

  const safetyRiskLevel = asText(readFirst(input.clinicalDecisionModel, [["safetyRiskLevel"], ["safety_risk_level"]]));
  if (safetyRiskLevel && /medium|high/i.test(safetyRiskLevel) && safetyConsiderations.length === 0) {
    safetyConsiderations.push({
      label: "Current safety risk",
      explanation: "The current clinical record identifies an elevated safety risk that remains relevant to interpretation of progress.",
      sourceContext: "Current clinical decision model",
      rawSource: { sourceType: "clinical_decision_model", field: "safetyRiskLevel", value: safetyRiskLevel },
      priority: 70,
      sourceKey: "safety:clinical-risk-level",
    });
  }

  return {
    timeframe: buildTimeframe(input),
    improved: select(improved),
    milestones: select(milestones),
    stillLimiting: select(stillLimiting),
    safetyConsiderations: select(safetyConsiderations),
  };
}
