import assert from "node:assert/strict";
import test from "node:test";

import { buildConclusionEvidenceSet } from "../src/lib/buildConclusionEvidence.ts";
import { buildConstraintProgressionNarrative } from "../src/lib/buildConstraintProgressionNarrative.ts";

const conclusions = {
  current_focus: "Prioritize safe shower transfer performance.",
  attention_required: "Monitor transfer safety and caregiver carryover.",
  next_action: "Reassess shower transfer safety before advancing the plan.",
};

const narrativeInputs = {
  clinicalDecisionModel: {
    dominantBarrier: "Physical",
    safetyRiskLevel: "high",
    supportLevel: "Intermittent Support",
  },
  progressionState: {
    advancementReadiness: "partial",
    activeMilestones: ["Completed shower setup with fewer cues"],
    activeBarriers: ["shower transfer assistance"],
    regressionRisks: ["recent fall during shower transfer"],
    reassessmentTriggers: ["fall history requires safety review"],
    caregiverDependencyState: "caregiver training remains necessary",
    environmentalLimitationState: "bathroom setup partially limits performance",
  },
  continuityInterpretation: {
    reassessmentPressureLevel: "moderate",
  },
  longitudinalState: {
    currentDominantBarrier: "shower transfer assistance",
    progressionStatus: "Progressing As Expected",
    functionalChanges: [
      "Shower transfer improved from maximal to moderate assistance",
      "A newly reported fall occurred during shower transfer",
    ],
    treatmentDirectionChanged: false,
  },
  visitHistory: [],
  currentFocus: conclusions.current_focus,
  attentionRequired: conclusions.attention_required,
  nextAction: conclusions.next_action,
};

test("A: builder returns compact output within defined limits", () => {
  const result = buildConstraintProgressionNarrative(narrativeInputs);

  assert.ok(result.headline);
  assert.ok(result.summary);
  assert.ok(result.whyRecommendationRemainsAppropriate);
  assert.ok(result.whatImproved.length <= 2);
  assert.ok(result.whatStillBlocksProgression.length <= 2);
  assert.ok(!Array.isArray(result.unresolvedLimitation));
});

test("B: safety or regression signals are prioritized as blockers", () => {
  const result = buildConstraintProgressionNarrative(narrativeInputs);

  assert.equal(result.whatStillBlocksProgression[0].label, "Safety margin");
  assert.match(result.whatStillBlocksProgression[0].explanation, /fall-related signal/i);
  assert.match(result.whatStillBlocksProgression[0].clinicalImpact, /review before/i);
});

test("C: positive progression appears without automatically advancing the recommendation", () => {
  const result = buildConstraintProgressionNarrative(narrativeInputs);

  assert.ok(result.whatImproved.length > 0);
  assert.match(result.whatImproved[0].explanation, /positive change/i);
  assert.match(result.whyRecommendationRemainsAppropriate, /remains appropriate/i);
  assert.match(result.summary, /prevent automatic advancement/i);
});

test("D: unresolved limitation appears for functional, caregiver, environmental, or safety constraints", () => {
  const variants = [
    {
      progressionState: { activeBarriers: ["toilet transfer support need"] },
    },
    {
      clinicalDecisionModel: { supportLevel: "Unreliable Support" },
      progressionState: { caregiverDependencyState: "training remains necessary" },
    },
    {
      progressionState: { environmentalLimitationState: "entry steps limit access" },
    },
    {
      progressionState: { regressionRisks: ["new near fall"] },
    },
  ];

  for (const variant of variants) {
    const result = buildConstraintProgressionNarrative(variant);
    assert.ok(result.unresolvedLimitation);
    assert.ok(result.unresolvedLimitation.clinicalImpact);
  }
});

test("E: narrative interprets source information instead of repeating it verbatim", () => {
  const sourceEvidence = "Shower transfer improved from maximal to moderate assistance";
  const whyChanged = "A newly reported fall occurred during shower transfer";
  const result = buildConstraintProgressionNarrative({
    ...narrativeInputs,
    longitudinalState: {
      ...narrativeInputs.longitudinalState,
      functionalChanges: [sourceEvidence, whyChanged],
    },
  });
  const narrativeText = JSON.stringify(result);

  assert.doesNotMatch(narrativeText, new RegExp(sourceEvidence, "i"));
  assert.doesNotMatch(narrativeText, new RegExp(whyChanged, "i"));
});

test("F: maintained conclusions remain unchanged", () => {
  const before = structuredClone(conclusions);
  buildConstraintProgressionNarrative(narrativeInputs);
  assert.deepEqual(conclusions, before);
});

test("G: output is deterministic for the same inputs", () => {
  const first = buildConstraintProgressionNarrative(narrativeInputs);
  const second = buildConstraintProgressionNarrative(narrativeInputs);
  assert.deepEqual(first, second);
});

test("H: supporting evidence is compressed to no more than two items per conclusion", () => {
  const evidence = buildConclusionEvidenceSet({
    caseData: {
      target_activities: ["Bathing"],
      functional_status: {
        adl_assist_levels: { shower_transfer: "2", toilet_transfer: "3" },
        general_mobility_summary: { recent_falls: "yes" },
      },
      caregiver_info: { confidence: "low_confidence" },
      environment: { safety_hazards: ["No grab bars"] },
    },
    ...narrativeInputs,
    conclusions,
  });

  for (const conclusion of Object.values(evidence)) {
    assert.ok(conclusion.evidence.length <= 2);
  }
});
