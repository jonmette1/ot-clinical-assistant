import assert from "node:assert/strict";
import test from "node:test";

import { buildConclusionEvidence } from "../src/lib/buildConclusionEvidence.ts";

const baseInput = {
  conclusionType: "attention_required",
  conclusion: "Monitor transfer safety and caregiver carryover.",
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
    activeBarriers: ["shower transfer limitation"],
    reassessmentTriggers: ["fall history requires safety review"],
  },
  longitudinalState: {},
  visitHistory: [],
};

test("returns no more than three unique evidence items with traceable raw sources", () => {
  const result = buildConclusionEvidence(baseInput);

  assert.ok(result.evidence.length <= 3);
  assert.ok(result.evidence.length > 0);
  assert.ok(result.evidence.every((item) => item.rawSource));
  assert.equal(
    new Set(result.evidence.map((item) => `${item.evidenceLabel}|${item.observedMeaning}`)).size,
    result.evidence.length
  );
});

test("rawSource is traceability metadata and is not needed to render clinician-facing evidence", () => {
  const [item] = buildConclusionEvidence(baseInput).evidence;
  const displayFields = { ...item };
  delete displayFields.rawSource;

  assert.ok(displayFields.evidenceLabel);
  assert.ok(displayFields.sourceContext);
  assert.ok(displayFields.observedMeaning);
  assert.ok(displayFields.clinicalRelevance);
});

test("low caregiver confidence uses clinician-facing wording", () => {
  const result = buildConclusionEvidence({
    ...baseInput,
    conclusionType: "next_action",
    conclusion: "Provide caregiver-supported transfer practice.",
    caseData: {
      caregiver_info: { confidence: "low_confidence" },
    },
    progressionState: {},
  });
  const caregiverEvidence = result.evidence.find(
    (item) => item.evidenceLabel === "Caregiver confidence"
  );

  assert.ok(caregiverEvidence);
  assert.match(caregiverEvidence.observedMeaning, /Caregiver confidence remains low/i);
  assert.doesNotMatch(caregiverEvidence.observedMeaning, /low_confidence/);
});

test("a recent safety event is prioritized when present", () => {
  const result = buildConclusionEvidence({
    ...baseInput,
    visitHistory: [
      {
        created_at: "2026-06-09T12:00:00.000Z",
        event_payload: {
          functionalChanges: ["New near fall occurred during the shower transfer"],
        },
      },
    ],
  });

  assert.equal(result.evidence[0]?.evidenceLabel, "Recent safety change");
  assert.match(result.evidence[0]?.observedMeaning || "", /near fall/i);
});

test("progression readiness evidence requires a milestone, progression, or readiness signal", () => {
  const withoutSignal = buildConclusionEvidence({
    ...baseInput,
    conclusionType: "next_action",
    progressionState: { activeBarriers: ["shower transfer limitation"] },
  });
  assert.equal(
    withoutSignal.evidence.some((item) => item.evidenceLabel.startsWith("Progression")),
    false
  );

  const withSignal = buildConclusionEvidence({
    ...baseInput,
    conclusionType: "next_action",
    progressionState: {
      activeBarriers: ["shower transfer limitation"],
      advancementReadiness: "partial",
    },
  });
  assert.equal(
    withSignal.evidence.some((item) => item.evidenceLabel === "Progression readiness"),
    true
  );
});

test("evidence does not simply repeat the conclusion text", () => {
  const result = buildConclusionEvidence({
    conclusionType: "current_focus",
    conclusion: "Bathing is the current target activity.",
    caseData: { target_activities: ["Bathing"] },
  });

  assert.equal(
    result.evidence.some(
      (item) => item.observedMeaning === "Bathing is the current target activity."
    ),
    false
  );
});
