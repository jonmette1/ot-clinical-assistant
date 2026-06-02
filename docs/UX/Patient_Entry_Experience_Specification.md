# OT Clinical Assistant — Patient Entry Experience Specification

## Purpose

This specification defines the intended role of the patient entry experience.

The goal is to evolve `/cases` from a saved-case management list into a lightweight patient-entry orientation surface.

This document does not approve architecture changes, database changes, routing changes, or new workflow systems.

It defines information hierarchy and UX intent only.

---

# Product Context

The product now has three primary workflow layers:

## Patient Entry

Helps the clinician choose and orient around a patient before opening the full workflow.

Primary question:

> What should I know before I open this patient?

## Command Center

Primary clinical workflow surface.

Answers:

* What matters?
* What changed?
* What requires attention?
* What should I do next?

## Reference Workspace

Secondary review surface.

Answers:

* Why does this matter?
* What supporting context exists?
* What progression information exists?
* What historical information exists?
* What details support the current plan?

---

# Core Principle

Opening a patient and opening the Command Center are related, but not identical.

## Opening a Patient

An orientation action.

The clinician is asking:

* Is this the right patient?
* What is the current situation?
* Is anything urgent?
* What should I remember before entering the home?

## Opening the Command Center

A workflow action.

The clinician is asking:

* What matters most?
* What changed?
* What requires attention?
* What should I do next?

The patient-entry layer should support rapid orientation without duplicating the full Command Center.

---

# Target Clinician Scenario

The primary scenario is a home health occupational therapist preparing for the next visit.

Assume:

* The clinician is parked outside the patient’s home.
* The clinician has 30–60 seconds.
* The clinician needs rapid orientation.
* The clinician is preparing for treatment, not conducting deep chart review.

The patient-entry experience should reduce the time required to re-enter the case mentally.

---

# Patient Entry Information Hierarchy

Patient entry should prioritize the minimum information needed to support pre-visit orientation.

## Level 1 — Patient Identity

Purpose:

Confirm the clinician is selecting the correct patient.

Examples:

* Patient name or case title
* Diagnosis or broad clinical context
* Target activity, if clinically meaningful

## Level 2 — Current Treatment Frame

Purpose:

Answer what the visit is about.

Preferred signal:

* Current Focus / current operational emphasis

This should be the strongest clinical orientation cue on the patient card.

## Level 3 — Required Attention

Purpose:

Surface safety, reassessment, decline, instability, or caregiver/environment concerns before the clinician enters the home.

Preferred signal:

* Attention Required

This should appear only when meaningful.

It should not create false urgency.

## Level 4 — Meaningful Change

Purpose:

Carry continuity forward.

Preferred signal:

* Since Last Visit

This should summarize what changed and why it matters when meaningful update data exists.

## Level 5 — Immediate Treatment Direction

Purpose:

Bridge orientation into action.

Preferred signal:

* Next Action

This should be concise.

It should not become a full treatment plan.

## Level 6 — Supporting Orientation

Purpose:

Provide optional context without cluttering the patient card.

Potential signals:

* Clinical Status / trajectory
* Last Visit
* Latest Progression Event
* Concise Operational Focus preview

---

# Patient Card Default State

The default patient card should remain lightweight.

It should support quick scanning across multiple patients.

## Always Visible

The card should include:

* Patient / case title
* Diagnosis or primary clinical context
* Current Focus or current operational emphasis when available
* Clinical Status or trajectory when available
* Last updated or last visit timing

## Conditionally Visible

The card may include:

* Attention Required if meaningful
* Since Last Visit if a meaningful change exists
* Next Action if concise and available

## Should Not Dominate

The card should not be dominated by:

* full Operational Focus rationale
* full historical snapshots
* raw progression metadata
* internal continuity terminology
* generated-output provenance
* administrative controls
* pathway alternatives
* detailed environmental/caregiver/equipment content

---

# Expandable Patient Preview

Patient cards may support an expandable preview.

The preview exists for quick orientation before opening the Command Center.

It should not become a mini Reference Workspace.

## Preview Purpose

Answer:

> What should I be ready to focus on or watch for before I open this patient?

## Preview Content Candidates

The preview may include:

1. Current Focus
2. Attention Required
3. Since Last Visit
4. Next Action
5. Concise Operational Focus
6. Latest Progression Event signal
7. Last Visit summary

## Preview Content Rules

The preview should:

* stay concise
* avoid dense rationale blocks
* avoid internal system terminology
* avoid historical snapshot detail
* avoid duplicating the full Command Center

## Preview Not Approved Yet

This specification defines intent only.

Expandable patient previews require implementation planning before development.

---

# Operational Focus Placement

Operational Focus is both orientation information and reference information.

It should exist at different levels of detail depending on workflow context.

## Patient Entry

Use:

Concise Operational Focus preview.

Purpose:

Help the clinician understand the real-world treatment frame before opening the patient.

Example structure:

### Operational Focus

Transfer and mobility safety remain fragile.

### Why

* Bathroom hazards remain present
* Physical assistance still required
* Caregiver support remains inconsistent

### Watch For

* Additional falls
* Transfer breakdown
* Reduced caregiver availability

## Command Center

Use:

Current Focus / current operational emphasis.

Purpose:

Provide the primary treatment frame and immediate workflow orientation.

The Command Center should not become crowded with the full Operational Focus rationale unless separately approved.

## Reference Workspace

Use:

Full Operational Focus rationale.

Purpose:

Support deeper review and explanation.

May include:

* current operational emphasis
* emphasis rationale
* dominant barriers
* adjacent priorities
* monitoring concerns
* reassessment triggers
* continuity summary

---

# Access Model

The patient-entry layer should provide clear access to:

## Command Center

Primary action.

Label direction:

* Open Command Center
* Open Patient

Preferred behavior may be determined during implementation planning.

## Reference Workspace

Secondary action.

Should be available, but not primary for routine visits.

## Expanded Preview

Optional orientation action.

Should allow the clinician to inspect key pre-visit information without leaving the patient list.

---

# Patient Entry vs Administrative Management

The current `/cases` page includes administrative list-management behaviors.

These are useful but should not dominate the patient-entry experience.

## Administrative Actions

Examples:

* bulk selection
* delete
* sort by oldest
* test-data cleanup behavior

These should remain visually subordinate to clinical entry behavior.

The patient-entry experience should prioritize orientation over record maintenance.

---

# Information That Remains Deeper In Workflow

The following should remain in Command Center or Reference Workspace, not primary patient-card content:

* full Operational Focus rationale
* Adjacent Operational Priorities
* Structured Plan Details
* Detail Modules
* Case Details
* Historical Snapshots
* detailed progression event rows
* current longitudinal state metadata
* clinical attention metadata
* internal continuity terminology
* future confidence diagnostics unless separately approved

---

# Explicitly Out Of Scope

This specification does not approve:

* new database tables
* patient/case data model changes
* route changes
* new clinical reasoning systems
* new AI generation logic
* confidence scoring
* historical snapshot redesign
* Reference Workspace redesign
* Command Center redesign

This is an information architecture and UX specification only.

---

# Success Criteria

A successful patient-entry experience should allow a clinician to answer within 30–60 seconds:

* Am I opening the right patient?
* What is the current treatment frame?
* Is anything urgent or changed?
* What should I be ready to focus on?
* Do I need deeper review before entering?

The experience should feel like:

Patient orientation

not:

saved case management.

---

# Future Implementation Planning Questions

Before implementation, define:

1. What exact fields are available on `/cases`.
2. Whether current generated output is available without opening the patient.
3. Whether Operational Focus can be safely summarized from existing data.
4. Whether previews should be expandable per card.
5. How administrative actions should remain available but visually subordinate.
6. Whether the main click opens Command Center directly or expands orientation first.
7. Whether Reference Workspace access should appear on cards or only after opening the patient.

---

# Current Recommendation

Proceed next to implementation planning.

Do not implement directly from this specification without a focused implementation plan.

The safest first implementation should likely be a low-risk patient-card orientation enhancement using data already available on the current `/cases` page.
