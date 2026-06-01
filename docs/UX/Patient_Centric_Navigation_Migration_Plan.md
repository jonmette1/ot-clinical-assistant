# Patient-Centric Navigation Migration Plan

## Status

APPROVED

---

# Purpose

Define the implementation sequence for transitioning the OT Clinical Assistant from:

Case-Centric Navigation

to:

Patient-Centric Navigation

without changing clinical reasoning, progression, continuity, reassessment, operational prioritization, or longitudinal architecture.

This document focuses only on workspace ownership and navigation migration.

---

# Approved Navigation Model

Patient

├── Command Center
└── Reference Workspace

---

# Migration Principles

1. Preserve existing functionality.
2. Move information ownership before redesigning UI.
3. Avoid architecture changes.
4. Avoid workflow changes.
5. Avoid introducing additional workspaces.
6. Maintain clinician orientation as the primary objective.
7. The software should carry the continuity burden.

---

# Phase 1 — Establish Patient Ownership

## Goal

Transition mentally and structurally from:

Case

to:

Patient

without changing workflow.

---

## Actions

### Audit Existing Routes

Current:

/cases
/cases/[id]

Future:

/patients
/patients/[id]
/patients/[id]/reference

Determine route dependencies.

---

### Define Ownership

Patient becomes primary navigation object.

Command Center and Reference Workspace become patient artifacts.

---

## Success Criteria

Clinician workflow can be described as:

Open Patient
→ Command Center
→ Progression Update

instead of:

Open Case
→ Review Generated Output

---

# Phase 2 — Extract Reference Workspace

## Goal

Remove reference-oriented content from the primary workflow surface.

---

## Move to Reference Workspace

### Clinical Context

* Evaluation
* Goals
* Diagnoses
* Functional Profiles
* Clinical Considerations

### Caregiver Context

* Caregiver Information
* Caregiver Guidance
* Caregiver Feasibility

### Environmental Context

* Environmental Pressures
* Home Configuration
* Bathroom Configuration
* Transfer Surfaces
* Equipment Context

### Clinical Reasoning Context

* Decision Transparency
* Clinical Decision Model
* Continuity Interpretation

### Historical Context

* Historical Snapshots
* Version History
* Longitudinal History
* Reassessment History

### Generated Outputs

* Structured Plan Details
* Detail Modules
* Generated Clinical Outputs

---

## Success Criteria

Primary workflow surface contains only information required for visit preparation and decision-making.

---

# Phase 3 — Stabilize Command Center

## Goal

Make Command Center the primary clinician workspace.

---

## Retain

### Current Clinical Reality

* Overall Trajectory
* Clinical Status
* Current Focus
* Reassessment Status

### Since Last Visit

* Functional Change
* Barrier Change
* Milestone Achievement

### Attention Required

* Attention Category
* Attention Rationale

### Current Focus

* Operational Emphasis
* Supporting Rationale

### Next Action

* Immediate Visit Priorities
* Recommended Actions

### Progression Update

* Progression Check Workflow

---

## Success Criteria

Clinician can answer:

1. Improving, stable, or declining?
2. What changed?
3. Why does it matter?
4. What requires attention?
5. What should I do next?

within approximately 5 seconds.

---

# Phase 4 — Promote Recent Visit History

## Goal

Support continuity without requiring historical reconstruction.

---

## Add To Command Center

Recent Visit History

Examples:

* Last Visit
* Previous Visit
* Previous Visit

Display only high-signal changes:

* Barrier shifts
* Functional changes
* Milestones
* Safety events
* Treatment direction changes

---

## Explicit Non-Goal

Do not expose full longitudinal history.

Full history belongs in Reference Workspace.

---

## Success Criteria

Clinician can answer:

"What has been happening recently?"

without leaving the Command Center.

---

# Phase 5 — Patient List Evolution

## Goal

Transition:

Saved Cases

to:

Patients

---

## Current State

Saved Case Repository

---

## Future State

Patient Entry Point

Supports:

* patient selection
* status awareness
* reassessment visibility
* recent change visibility
* clinical attention visibility

---

## Patient List Priorities

Each patient entry should eventually surface:

* Patient Name
* Diagnosis
* Current Status
* Attention Status
* Reassessment Status
* Most Recent Update

---

## Success Criteria

Clinician can determine:

"Who requires attention first?"

before opening a patient.

---

# Phase 6 — Remove Legacy Ownership

## Goal

Retire case-centric concepts that no longer align with the approved navigation model.

---

## Remove

* Alternative Approaches
* Selected Pathway Artifacts
* Pathway-Era Terminology
* Internal Continuity Terminology
* Validation-Oriented Progression Diagnostics

---

## Success Criteria

Navigation reflects only the approved patient-centric model.

---

# Final State

Patient

├── Command Center
│
│   - Current Clinical Reality
│   - Since Last Visit
│   - Attention Required
│   - Current Focus
│   - Next Action
│   - Progression Update
│   - Recent Visit History
│
└── Reference Workspace
│
- Evaluation
- Goals
- Caregiver Context
- Environmental Context
- Clinical Reasoning Context
- Historical Context
- Version History
- Generated Outputs

---

# MVP Navigation Objective

A clinician should be able to:

Open Patient
→ Orient
→ Understand Recent Change
→ Understand Attention Needs
→ Determine Next Action
→ Record Progression Update

without reconstructing prior visits from memory.
