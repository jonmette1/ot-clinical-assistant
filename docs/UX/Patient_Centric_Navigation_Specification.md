# Patient-Centric Navigation Specification

## Status

APPROVED

---

# Purpose

Define the approved navigation structure for the OT Clinical Assistant as the platform transitions from a case-centric workflow to a patient-centric workflow.

This document defines:

* primary navigation ownership
* workspace responsibilities
* content placement rules
* Command Center scope
* Reference Workspace scope

This document does not define:

* implementation details
* routing implementation
* component structure
* database design
* longitudinal architecture

---

# Navigation Philosophy

Clinicians think about patients.

They do not think about cases, generated plans, continuity systems, or progression engines.

The navigation model should therefore support:

Patient
→ Current Clinical Reality
→ Clinical Action

rather than:

Case
→ Generated Output
→ Historical Review

---

# Approved Navigation Model

Patient

├── Command Center
└── Reference Workspace

---

# Command Center

## Purpose

Current Clinical Reality

The Command Center is the primary workflow surface used before, during, and immediately after a patient visit.

Its purpose is rapid orientation and clinical action.

The Command Center should allow a clinician to answer within approximately 5 seconds:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

without reconstructing prior visits from memory.

The software should carry the continuity burden.

The clinician should not.

---

## Command Center Content

### Current Clinical Reality

Includes:

* Overall Trajectory
* Clinical Status
* Current Focus
* Most Recent Reassessment Status

Purpose:

Answer:

What is happening now?

---

### Since Last Visit

Includes:

* Most Recent Longitudinal Event
* Functional Change
* Barrier Change
* Milestone Achievement

Purpose:

Answer:

What changed?

Why does it matter?

---

### Attention Required

Includes:

* Current Attention Category
* Attention Rationale
* Consequences of Inaction

Purpose:

Answer:

What requires attention today?

---

### Current Focus

Includes:

* Current Operational Emphasis
* Supporting Rationale

Purpose:

Answer:

What should treatment focus on?

---

### Next Action

Includes:

* Immediate Visit Priorities
* Recommended Next Steps

Purpose:

Answer:

What should I do next?

---

### Progression Update

Includes:

* Progression Check Workflow
* Longitudinal Update Submission

Purpose:

Capture today's changes.

---

### Recent Visit History

Includes:

* Most Recent Visits
* Key Changes
* Significant Milestones

Purpose:

Support rapid visit preparation.

Recent visit history is considered orientation content.

It is not considered historical reference content.

---

# Reference Workspace

## Purpose

Historical Context

Clinical Context

Deep Review

The Reference Workspace exists to support understanding, review, investigation, and historical context.

It is not intended to support rapid visit preparation.

---

## Clinical Context

Includes:

* Evaluation
* Goals
* Diagnoses
* Functional Profiles
* Clinical Considerations
* Generated Outputs

---

## Caregiver Context

Includes:

* Caregiver Information
* Caregiver Guidance
* Caregiver Feasibility

---

## Environmental Context

Includes:

* Home Environment
* Environmental Pressures
* Bathroom Configuration
* Transfer Surfaces
* Equipment Context

---

## Clinical Reasoning Context

Includes:

* Decision Transparency
* Clinical Decision Models
* Continuity Interpretation
* Supporting Clinical Reasoning

---

## Historical Context

Includes:

* Historical Snapshots
* Longitudinal History
* Version History
* Reassessment History
* Full Longitudinal Review

---

# Placement Rule

When determining content ownership:

If a clinician would need the information while preparing for a patient visit within the next 15 minutes:

Place it in the Command Center.

If the information primarily supports review, explanation, investigation, historical understanding, or context:

Place it in the Reference Workspace.

---

# Explicit Non-Goals

Do not create:

* separate timeline workspaces
* separate analytics workspaces
* separate progression workspaces
* separate caregiver workspaces
* separate history workspaces

The approved navigation model remains:

Patient

├── Command Center
└── Reference Workspace

Additional navigation destinations should only be introduced when a clearly distinct workflow cannot be effectively supported by either workspace.

---

# Success Metric

The navigation model succeeds when clinicians can:

* rapidly orient to current clinical reality
* understand recent change
* understand attention requirements
* identify next actions

without reviewing historical documentation or reconstructing prior visits from memory.
