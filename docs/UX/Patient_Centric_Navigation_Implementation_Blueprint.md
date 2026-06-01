# Patient-Centric Navigation Implementation Blueprint

## Status

APPROVED FOR IMPLEMENTATION PLANNING

---

# Purpose

Define the safest implementation sequence for transitioning the OT Clinical Assistant from:

Case-Centric Navigation

to:

Patient-Centric Navigation

without modifying:

* deterministic reasoning architecture
* continuity architecture
* progression architecture
* reassessment architecture
* clinical attention architecture
* operational prioritization architecture
* longitudinal event architecture

This document defines implementation order only.

It does not redesign the product.

It does not introduce new workflows.

It does not alter approved navigation ownership.

---

# Approved Navigation Model

Patient

├── Command Center
└── Reference Workspace

---

# Current State Assessment

The current application already contains the majority of the approved navigation model.

Current findings:

* Command Center content already exists.
* Reference Workspace content already exists.
* Longitudinal infrastructure already exists.
* Progression Check workflow already exists.
* Longitudinal event infrastructure already exists.
* Saved Cases page can evolve into the future Patients page.
* Migration complexity is Low–Medium.
* No architectural redesign is required.

The migration is primarily:

* ownership clarification
* page decomposition
* content relocation
* navigation alignment

---

# Phase 1 — Establish Ownership Boundaries

## Objective

Create explicit ownership separation between:

* Command Center content
* Reference Workspace content

without introducing new routes.

This phase establishes the foundation for all later migration work.

---

## Routes Affected

### Existing

* `/cases/[id]`

---

## Sections Retained In Command Center

### Current Clinical Reality

* Clinical Status
* Overall Trajectory
* Current Focus
* Reassessment Status

### Since Last Visit

* Most Recent Longitudinal Event
* Functional Change
* Barrier Change
* Milestone Achievement

### Attention Required

* Clinical Attention Category
* Clinical Attention Rationale

### Current Focus

* Current Operational Emphasis
* Supporting Rationale

### Next Action

* Immediate Priorities
* Recommended Actions

### Progression Update

* Existing Progression Check Workflow

---

## Sections Identified As Reference Workspace Content

### Clinical Context

* Evaluation Data
* Goals
* Diagnoses
* Functional Profiles
* Clinical Considerations

### Caregiver Context

* Caregiver Information
* Caregiver Guidance
* Caregiver Feasibility

### Environmental Context

* Environment
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
* Longitudinal Review
* Reassessment History

### Generated Outputs

* Structured Plan Details
* Detail Modules
* Generated Clinical Content

---

## Success Criteria

Every section on the current patient page has a clearly defined owner:

* Command Center
  or
* Reference Workspace

---

## Risk

LOW

Reason:

* No routing changes
* No data changes
* No workflow changes
* No architectural changes

---

## Codex Readiness

YES

Reason:

Ownership rules are fully defined by approved documentation.

---

# Phase 2 — Extract Reference Workspace

## Objective

Move reference-oriented content out of the primary clinician workflow surface.

---

## Routes Affected

### Existing

* `/cases/[id]`

### Future Target

* `/patients/[id]/reference`

or transitional equivalent.

---

## Content To Move

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

Primary workflow surface contains only information required for:

* visit preparation
* treatment orientation
* clinical decision-making

Reference material remains accessible but no longer competes for attention.

---

## Risk

MEDIUM

Reason:

* Largest rendering refactor
* Multiple section extractions
* Potential component dependency cleanup

No reasoning risk.

No database risk.

---

## Codex Readiness

YES

Reason:

Reference Workspace ownership is already fully defined.

---

# Phase 3 — Stabilize Command Center

## Objective

Convert the primary patient page into a true Command Center.

---

## Routes Affected

* `/cases/[id]`

Future:

* `/patients/[id]`

---

## Command Center Sections

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

* Existing Progression Check Workflow

---

## Success Criteria

Clinician can answer:

1. Is the patient improving, stable, or declining?
2. What changed?
3. Why does it matter?
4. What requires attention?
5. What should I do next?

within approximately 5 seconds.

---

## Risk

LOW

Reason:

* Existing data already available
* Existing workflow already available
* Primarily hierarchy and presentation work

---

## Codex Readiness

YES

Reason:

Required data already exists within current page state.

---

# Phase 4 — Promote Recent Visit History

## Objective

Support continuity without requiring historical reconstruction.

---

## Routes Affected

* `/cases/[id]`

Future:

* `/patients/[id]`

---

## Content To Promote

Using existing longitudinal event infrastructure:

### Recent Visit History

Display:

* Last Visit
* Previous Visit
* Previous Visit

---

## Surface Only High-Signal Changes

Examples:

* Barrier shifts
* Functional changes
* Milestones
* Safety events
* Treatment direction changes

---

## Explicit Non-Goal

Do not expose:

* full longitudinal history
* complete version review
* historical reconstruction workflows

Those remain within Reference Workspace.

---

## Success Criteria

Clinician can answer:

"What has been happening recently?"

without leaving the Command Center.

---

## Risk

LOW

Reason:

Longitudinal event infrastructure already exists.

No persistence changes required.

---

## Codex Readiness

YES

Reason:

Recent longitudinal events are already loaded by the current page.

---

# Dependency Analysis

| Item                           | Depends On                               | Blocking? |
| ------------------------------ | ---------------------------------------- | --------- |
| Ownership Classification       | None                                     | YES       |
| Reference Workspace Extraction | Phase 1                                  | YES       |
| Command Center Stabilization   | Phase 1                                  | YES       |
| Recent Visit History Promotion | Existing Longitudinal Events             | NO        |
| Future Patient Routing         | Phase 1                                  | YES       |
| Patient List Evolution         | Command Center Terminology Stabilization | NO        |
| Legacy Terminology Cleanup     | Phase 2 + Phase 3                        | YES       |

---

# Migration Risk Assessment

| Phase   | Risk   | Reason                                                 |
| ------- | ------ | ------------------------------------------------------ |
| Phase 1 | Low    | Ownership only                                         |
| Phase 2 | Medium | Largest rendering refactor                             |
| Phase 3 | Low    | Existing data already available                        |
| Phase 4 | Low    | Existing longitudinal infrastructure already available |

---

# Codex Readiness Summary

| Phase   | Ready For Codex |
| ------- | --------------- |
| Phase 1 | YES             |
| Phase 2 | YES             |
| Phase 3 | YES             |
| Phase 4 | YES             |

No additional architectural discovery is required before implementation.

---

# Recommended Execution Order

## Step 1

Phase 1 — Ownership Separation

Purpose:

Define Command Center vs Reference Workspace ownership.

---

## Step 2

Phase 2 — Reference Workspace Extraction

Purpose:

Remove context-heavy review content from the primary workflow surface.

---

## Step 3

Phase 3 — Command Center Stabilization

Purpose:

Establish the primary clinician-facing workspace.

---

## Step 4

Phase 4 — Recent Visit History Promotion

Purpose:

Expose continuity-relevant change summaries without requiring historical review.

---

# Expected End State

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
│   - Evaluation
│   - Goals
│   - Diagnoses
│   - Functional Profiles
│   - Caregiver Context
│   - Environmental Context
│   - Decision Transparency
│   - Clinical Reasoning Context
│   - Historical Snapshots
│   - Version History
│   - Longitudinal History
│   - Generated Outputs

The application will function as a patient-centric navigation model even before route names are formally migrated from:

`/cases`

to

`/patients`.

Route migration should occur only after ownership migration is complete.
