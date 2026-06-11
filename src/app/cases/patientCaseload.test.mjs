import assert from "node:assert/strict";
import test from "node:test";

import {
  CASELOAD_SYSTEM_VIEWS,
  derivePatientCaseloadSummary,
  filterAndSortCaseload,
} from "./patientCaseload.ts";

function buildCase(id, overrides = {}) {
  return {
    id,
    title: `${id} record`,
    created_at: "2026-01-01T00:00:00.000Z",
    patient_profile: { primary_diagnosis: "Deconditioning" },
    client_info: { client_name: id },
    case_classification: { case_type: "geriatric" },
    functional_status: {},
    goals_preferences: {},
    environment: {},
    target_activities: ["Household transfers"],
    generated_output: {
      operational_prioritization: {
        currentOperationalEmphasis: "Improve safe transfer consistency with reduced assistance",
      },
      progression_state: {},
    },
    current_longitudinal_state: null,
    clinical_attention_state: null,
    reasoning_stale: false,
    plan_stale: false,
    modules_stale: false,
    ...overrides,
  };
}

function buildEvent(caseId, payload = {}, createdAt = "2026-06-10T12:00:00.000Z") {
  return {
    id: `${caseId}-event`,
    case_id: caseId,
    created_at: createdAt,
    event_payload: payload,
    current_state_snapshot: payload,
    clinical_attention_snapshot: null,
  };
}

function summary(caseRow, latestEvent = null) {
  return derivePatientCaseloadSummary({ caseRow, latestEvent });
}

test("system views expose all clinically meaningful caseload views", () => {
  assert.deepEqual(
    CASELOAD_SYSTEM_VIEWS.map((view) => view.label),
    [
      "All Patients",
      "Needs Attention",
      "Recent Change",
      "Monitor Closely",
      "Reassessment Due",
      "Safety Concern",
    ]
  );
});

test("All Patients includes every patient", () => {
  const patients = [summary(buildCase("Alex")), summary(buildCase("Blair"))];

  assert.equal(
    filterAndSortCaseload({
      patients,
      view: "all",
      searchTerm: "",
      caseType: "all",
      sort: "clinical-priority",
    }).length,
    2
  );
});

test("Needs Attention filters active review needs", () => {
  const attention = summary(
    buildCase("Attention", {
      clinical_attention_state: {
        attentionStatement: "Treatment direction requires review.",
        requiresOperationalReview: true,
      },
    })
  );
  const stable = summary(buildCase("Stable"));

  assert.deepEqual(
    filterAndSortCaseload({
      patients: [stable, attention],
      view: "needs-attention",
      searchTerm: "",
      caseType: "all",
      sort: "clinical-priority",
    }).map((patient) => patient.patientName),
    ["Attention"]
  );
});

test("Recent Change filters meaningful longitudinal change", () => {
  const changed = summary(
    buildCase("Changed"),
    buildEvent("Changed", { functionalChanges: ["Transfer consistency improved"] })
  );
  const unchanged = summary(buildCase("Unchanged"));

  assert.equal(changed.recentChange, "Transfer consistency improved.");
  assert.deepEqual(
    filterAndSortCaseload({
      patients: [unchanged, changed],
      view: "recent-change",
      searchTerm: "",
      caseType: "all",
      sort: "clinical-priority",
    }).map((patient) => patient.patientName),
    ["Changed"]
  );
});

test("Reassessment Due filters existing reassessment signals", () => {
  const reassessment = summary(
    buildCase("Reassess", {
      clinical_attention_state: {
        attentionStatement: "Limited progress should be reassessed before continuing the current recommendation.",
        requiresOperationalReview: true,
        reassessmentRecommended: true,
      },
    })
  );
  const stable = summary(buildCase("Stable"));

  assert.equal(reassessment.status, "Needs Attention");
  assert.equal(reassessment.hasReassessmentSignal, true);
  assert.deepEqual(
    filterAndSortCaseload({
      patients: [stable, reassessment],
      view: "reassessment-due",
      searchTerm: "",
      caseType: "all",
      sort: "clinical-priority",
    }).map((patient) => patient.patientName),
    ["Reassess"]
  );
});

test("Safety Concern recognizes and prioritizes fall and near-fall signals", () => {
  const fall = summary(
    buildCase("Fall"),
    buildEvent("Fall", { functionalChanges: ["Recent fall reported"] })
  );
  const nearFall = summary(
    buildCase("Near Fall"),
    buildEvent("Near Fall", { functionalChanges: ["Near-fall during shower transfer"] })
  );
  const stable = summary(buildCase("Stable"));

  assert.equal(fall.status, "Safety Concern");
  assert.equal(nearFall.status, "Safety Concern");
  assert.deepEqual(
    filterAndSortCaseload({
      patients: [stable, nearFall, fall],
      view: "safety-concern",
      searchTerm: "",
      caseType: "all",
      sort: "clinical-priority",
    }).map((patient) => patient.patientName),
    ["Fall", "Near Fall"]
  );
});

test("patient card display model contains only caseload orientation fields", () => {
  const patient = summary(
    buildCase("Jordan", {
      patient_profile: { primary_diagnosis: "CVA with right hemiparesis" },
    }),
    buildEvent("Jordan", { caregiverChange: "Caregiver assistance decreased" })
  );

  const cardDisplay = {
    patientName: patient.patientName,
    clinicalContext: patient.clinicalContext,
    status: patient.status,
    currentFocus: patient.currentFocus,
    recentChange: patient.recentChange,
  };

  assert.deepEqual(Object.keys(cardDisplay), [
    "patientName",
    "clinicalContext",
    "status",
    "currentFocus",
    "recentChange",
  ]);
  assert.equal(cardDisplay.patientName, "Jordan");
  assert.match(cardDisplay.clinicalContext, /CVA/);
  assert.match(cardDisplay.currentFocus, /transfer consistency/i);
  assert.equal(cardDisplay.recentChange, "Caregiver assistance decreased.");

  for (const forbiddenField of [
    "sessionFocus",
    "nextAction",
    "progressionConstraint",
    "progressEvidence",
    "whyThisChanged",
    "supportingEvidence",
  ]) {
    assert.equal(forbiddenField in cardDisplay, false);
  }
});

test("clinical priority sort outranks created-date record order", () => {
  const oldSafetyCase = buildCase("Old Safety", {
    created_at: "2024-01-01T00:00:00.000Z",
    functional_status: { general_mobility_summary: { recent_falls: "yes" } },
  });
  const newStableCase = buildCase("New Stable", {
    created_at: "2026-06-10T00:00:00.000Z",
  });

  const sorted = filterAndSortCaseload({
    patients: [summary(newStableCase), summary(oldSafetyCase)],
    view: "all",
    searchTerm: "",
    caseType: "all",
    sort: "clinical-priority",
  });

  assert.deepEqual(
    sorted.map((patient) => patient.patientName),
    ["Old Safety", "New Stable"]
  );
});

test("search works within the selected system view across name, diagnosis, and context", () => {
  const safety = summary(
    buildCase("Morgan", {
      patient_profile: { primary_diagnosis: "Parkinson disease" },
      case_classification: { case_type: "neurological" },
      functional_status: { general_mobility_summary: { recent_falls: "yes" } },
    })
  );
  const other = summary(buildCase("Taylor"));

  for (const searchTerm of ["Morgan", "Parkinson", "Neurological"]) {
    assert.deepEqual(
      filterAndSortCaseload({
        patients: [other, safety],
        view: "safety-concern",
        searchTerm,
        caseType: "all",
        sort: "clinical-priority",
      }).map((patient) => patient.patientName),
      ["Morgan"]
    );
  }
});
