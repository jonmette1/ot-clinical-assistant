import assert from "node:assert/strict";
import test from "node:test";

import {
  buildConclusionEvidence,
  buildConclusionEvidenceSet,
} from "../src/lib/buildConclusionEvidence.ts";

const conclusions = {
  current_focus: "Prioritize safe shower transfer performance.",
  attention_required: "Monitor transfer safety and caregiver carryover.",
  next_action: "Reassess shower transfer safety before advancing the plan.",
};

const evidenceInputs = {
  caseData: {
    target_activities: ["Bathing"],
    functional_status: {
      current_assistance_level: "3",
      adl_assist_levels: {
        bed_transfer: "4",
        toilet_transfer: "3",
        shower_transfer: "2",
      },
      general_mobility_summary: { recent_falls: "yes" },
    },
    caregiver_info: { confidence: "low_confidence" },
    environment: { safety_hazards: ["No grab bars", "High tub wall"] },
  },
  clinicalDecisionModel: { dominantBarrier: "Physical" },
  progressionState: {
    advancementReadiness: "partial",
    activeMilestones: ["safer shower transfer participation"],
    activeBarriers: ["shower transfer limitation"],
    reassessmentTriggers: ["fall history requires safety review"],
  },
  longitudinalState: {},
  visitHistory: [
    {
      created_at: "2026-06-09T12:00:00.000Z",
      event_payload: {
        functionalChanges: ["New near fall occurred during the shower transfer"],
        milestoneAchieved: "Completed shower setup with fewer cues",
      },
    },
  ],
};

function buildSet(overrides = {}) {
  return buildConclusionEvidenceSet({
    ...evidenceInputs,
    ...overrides,
    conclusions,
  });
}

test("returns no more than two unique evidence items per conclusion with traceable raw sources", () => {
  const result = buildSet();

  for (const conclusionType of Object.keys(conclusions)) {
    const evidence = result[conclusionType].evidence;
    assert.ok(evidence.length <= 2);
    assert.ok(evidence.length > 0);
    assert.ok(evidence.every((item) => item.rawSource));
    assert.equal(
      new Set(evidence.map((item) => `${item.evidenceLabel}|${item.observedMeaning}`)).size,
      evidence.length
    );
  }
});

test("rawSource remains optional display metadata", () => {
  const [item] = buildSet().current_focus.evidence;
  const displayFields = { ...item };
  delete displayFields.rawSource;

  assert.ok(displayFields.evidenceLabel);
  assert.ok(displayFields.sourceContext);
  assert.ok(displayFields.observedMeaning);
  assert.ok(displayFields.clinicalRelevance);
});

test("each conclusion receives evidence framed for its distinct clinical purpose", () => {
  const result = buildSet();
  const focusText = result.current_focus.evidence.map((item) => item.clinicalRelevance).join(" ");
  const attentionText = result.attention_required.evidence.map((item) => item.clinicalRelevance).join(" ");
  const actionText = result.next_action.evidence.map((item) => item.clinicalRelevance).join(" ");

  assert.match(focusText, /treatment anchor|dominant focus|treatment effort/i);
  assert.match(attentionText, /monitor|attention|caution|review/i);
  assert.match(actionText, /next step|appropriate next step|safest next step/i);
});

test("duplicate evidence is not repeated verbatim across all three conclusions", () => {
  const result = buildSet();
  const fingerprints = Object.values(result).flatMap(({ evidence }) =>
    evidence.map((item) =>
      `${item.evidenceLabel}|${item.sourceContext}|${item.clinicalRelevance}`.toLowerCase()
    )
  );

  assert.equal(new Set(fingerprints).size, fingerprints.length);
});

test("the same underlying source is reused only with different clinical relevance", () => {
  const result = buildSet();
  const bySource = new Map();

  for (const { evidence } of Object.values(result)) {
    for (const item of evidence) {
      const source = `${item.rawSource?.sourceType}|${item.rawSource?.field}|${JSON.stringify(item.rawSource?.value)}`;
      const relevance = item.clinicalRelevance.toLowerCase();
      const prior = bySource.get(source) || [];
      prior.push(relevance);
      bySource.set(source, prior);
    }
  }

  const reusedSources = [...bySource.values()].filter((relevance) => relevance.length > 1);
  assert.ok(reusedSources.length > 0);
  assert.ok(reusedSources.every((relevance) => new Set(relevance).size === relevance.length));
});

test("low caregiver confidence is interpreted rather than mirrored", () => {
  const result = buildSet({
    caseData: { caregiver_info: { confidence: "low_confidence" } },
    progressionState: {},
    visitHistory: [],
  });
  const caregiverEvidence = Object.values(result)
    .flatMap(({ evidence }) => evidence)
    .find((item) => item.rawSource?.field === "caregiver_info.confidence");

  assert.ok(caregiverEvidence);
  assert.doesNotMatch(caregiverEvidence.observedMeaning, /low_confidence/);
  assert.match(caregiverEvidence.observedMeaning, /carryover|support|confidence/i);
});

test("transfer evidence explains clinical meaning instead of simply mirroring the assist value", () => {
  const result = buildConclusionEvidence({
    conclusionType: "current_focus",
    conclusion: conclusions.current_focus,
    caseData: evidenceInputs.caseData,
  });
  const transferEvidence = result.evidence.find((item) =>
    item.rawSource?.field?.includes("shower_transfer")
  );

  assert.ok(transferEvidence);
  assert.notEqual(
    transferEvidence.observedMeaning,
    "Shower transfer currently requires maximal assistance."
  );
  assert.match(transferEvidence.observedMeaning, /most documented support/i);
  assert.match(transferEvidence.clinicalRelevance, /treatment anchor/i);
});

test("recent safety evidence is prioritized and includes deterministic weighting rationale", () => {
  const result = buildSet();
  const attentionEvidence = result.attention_required.evidence[0];
  const actionSafetyEvidence = result.next_action.evidence.find((item) =>
    item.rawSource?.field === "functionalChanges"
  );

  assert.equal(attentionEvidence.evidenceLabel, "Recent safety change");
  assert.ok(attentionEvidence.reasoningBasis);
  assert.ok(actionSafetyEvidence?.reasoningBasis);
  assert.match(actionSafetyEvidence.reasoningBasis, /weighted above progression signals/i);
});

test("progression evidence appears only when milestone, progression, or readiness signals exist", () => {
  const withoutSignal = buildConclusionEvidence({
    conclusionType: "next_action",
    conclusion: conclusions.next_action,
    caseData: {},
    progressionState: {},
  });
  assert.equal(
    withoutSignal.evidence.some((item) => item.evidenceLabel.includes("Progression")),
    false
  );

  const withSignal = buildConclusionEvidence({
    conclusionType: "next_action",
    conclusion: conclusions.next_action,
    progressionState: { advancementReadiness: "partial" },
  });
  assert.equal(
    withSignal.evidence.some((item) => item.evidenceLabel.includes("Progression")),
    true
  );
});

test("evidence does not simply repeat conclusion text", () => {
  const result = buildConclusionEvidence({
    conclusionType: "current_focus",
    conclusion: "Bathing is the activity the current plan is intended to improve.",
    caseData: { target_activities: ["Bathing"] },
  });

  assert.equal(
    result.evidence.some(
      (item) => item.observedMeaning === "Bathing is the activity the current plan is intended to improve."
    ),
    false
  );
});

test("evidence building preserves every maintained conclusion verbatim", () => {
  const result = buildSet();

  assert.equal(result.current_focus.conclusion, conclusions.current_focus);
  assert.equal(result.attention_required.conclusion, conclusions.attention_required);
  assert.equal(result.next_action.conclusion, conclusions.next_action);
});
