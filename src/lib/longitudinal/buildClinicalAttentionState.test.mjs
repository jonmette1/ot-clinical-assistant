import assert from "node:assert/strict";
import test from "node:test";

import { buildClinicalAttentionState } from "./buildClinicalAttentionState.ts";

const baseEvent = {
  eventType: "progression_check",
  eventDate: "2026-06-10T12:00:00.000Z",
  caseId: "case-1",
  functionalChanges: [],
  currentDominantBarrier: "reduced activity tolerance",
  secondaryBarrier: null,
  progressionStatus: "Progressing As Expected",
  treatmentDirectionChanged: false,
  milestoneAchieved: null,
  caregiverChange: null,
  environmentalChange: null,
  medicalChange: null,
  reasonTreatmentChanged: null,
  reassessmentRecommended: false,
};

function build(eventOverrides = {}) {
  const event = { ...baseEvent, ...eventOverrides };
  const currentState = {
    lastUpdatedAt: event.eventDate,
    lastEventType: event.eventType,
    currentDominantBarrier: event.currentDominantBarrier,
    secondaryBarrier: event.secondaryBarrier,
    progressionStatus: event.progressionStatus,
    functionalChanges: event.functionalChanges,
    milestoneAchieved: event.milestoneAchieved,
    caregiverChange: event.caregiverChange,
    environmentalChange: event.environmentalChange,
    medicalChange: event.medicalChange,
    treatmentDirectionChanged: event.treatmentDirectionChanged,
    reasonTreatmentChanged: event.reasonTreatmentChanged,
    reassessmentRecommended: event.reassessmentRecommended,
    eventCount: 1,
    mostRecentEvent: event,
  };

  return buildClinicalAttentionState({ currentState, event });
}

test("milestones alone do not become Attention Required", () => {
  const result = build({ milestoneAchieved: "Completes shower transfer with supervision" });

  assert.equal(
    result.attentionStatement,
    "No active review need was identified from the latest progression check."
  );
  assert.deepEqual(result.attentionDrivers, []);
});

test("improvement without a verification need does not become Attention Required", () => {
  const result = build({ functionalChanges: ["Improved sequencing during bathing"] });

  assert.equal(
    result.attentionStatement,
    "No active review need was identified from the latest progression check."
  );
});

test("safety concerns take priority over other review signals", () => {
  const result = build({
    functionalChanges: ["Near fall during shower transfer"],
    caregiverChange: "Caregiver cueing decreased",
    environmentalChange: "Shower chair remains unavailable",
    progressionStatus: "Progressing Faster Than Expected",
  });

  assert.equal(result.category, "Safety");
  assert.match(result.attentionStatement, /should be verified/i);
  assert.match(result.attentionDrivers[0], /near fall/i);
});

test("regression produces safety-oriented reassessment guidance", () => {
  const result = build({ progressionStatus: "Regression Detected" });

  assert.equal(result.category, "Safety");
  assert.match(result.attentionStatement, /should be reassessed/i);
  assert.doesNotMatch(result.attentionStatement, /regression (observed|detected):/i);
});

test("uncertain advancement readiness prioritizes progression verification", () => {
  const result = build({
    progressionStatus: "Progressing Faster Than Expected",
    milestoneAchieved: "Completes shower transfer with supervision",
  });

  assert.match(result.attentionStatement, /^Advancement readiness should be verified/i);
  assert.doesNotMatch(result.attentionStatement, /milestone achieved/i);
});

test("progression verification takes priority over caregiver review", () => {
  const result = build({
    progressionStatus: "Progressing Faster Than Expected",
    caregiverChange: "Caregiver cueing decreased",
  });

  assert.equal(result.category, "Function");
  assert.match(result.attentionStatement, /^Advancement readiness should be verified/i);
});

test("caregiver changes produce caregiver review guidance", () => {
  const result = build({ caregiverChange: "Reduced caregiver cueing observed" });

  assert.equal(result.category, "Caregiver");
  assert.match(result.attentionStatement, /^Caregiver support requirements should be reassessed/i);
});

test("environmental changes produce environmental review guidance", () => {
  const result = build({ environmentalChange: "Bathroom grab bar is not yet installed" });

  assert.equal(result.category, "Environment");
  assert.match(result.attentionStatement, /^Environmental fit and equipment needs should be reviewed/i);
});

test("plateau and limited progress produce reassessment guidance", () => {
  const plateau = build({ progressionStatus: "Plateau Emerging" });
  const limited = build({ progressionStatus: "Minimal Progress" });

  assert.match(plateau.attentionStatement, /should be reassessed/i);
  assert.match(limited.attentionStatement, /should be reassessed/i);
});

test("attention generation is deterministic and concise", () => {
  const event = {
    environmentalChange: "Tub bench fit remains uncertain",
    functionalChanges: ["Improved bathing sequencing"],
  };

  const first = build(event);
  const second = build(event);

  assert.deepEqual(first, second);
  assert.ok(first.attentionDrivers.length <= 2);
  assert.match(first.attentionStatement, /\b(verify|verified|review|reviewed|reassess|reassessed|monitor)\b/i);
});
