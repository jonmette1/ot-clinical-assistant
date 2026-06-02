# OT Clinical Assistant — Patient Card Information Hierarchy

## Purpose

This document defines the information hierarchy for future patient cards and patient-entry previews.

It establishes what information should be:

* immediately visible
* optionally previewed
* available only within Command Center
* available only within Reference Workspace

The goal is to support rapid clinician orientation while preserving progressive disclosure.

This document does not approve implementation.

This document defines information authority and visibility only.

---

# Design Principle

Patient cards are not mini Command Centers.

Patient cards are not mini Reference Workspaces.

Patient cards are orientation surfaces.

The clinician should be able to answer:

* Who is this patient?
* What is today's treatment frame?
* Is anything urgent?
* Has anything important changed?

without opening the patient.

Everything else should progressively reveal itself deeper in the workflow.

---

# Information Authority Model

Information should be displayed according to authority level.

## Level 1 — Current Clinical Reality

Highest authority.

Answers:

> What matters right now?

Examples:

* Current Focus
* Current Operational Emphasis
* Current Clinical Status

This information should always be visible.

---

## Level 2 — Meaningful Change

High authority.

Answers:

> What changed?

Examples:

* Since Last Visit
* Significant Progression Event
* Reassessment Trigger

This information should be visible when meaningful.

---

## Level 3 — Required Attention

High authority.

Answers:

> What requires attention?

Examples:

* Safety concerns
* Caregiver concerns
* Instability indicators
* Attention Required

This information should be surfaced prominently when present.

---

## Level 4 — Immediate Action

Medium authority.

Answers:

> What should happen next?

Examples:

* Next Action
* Reassessment recommendation
* Immediate treatment priority

This information supports treatment execution.

---

## Level 5 — Supporting Context

Lower authority.

Answers:

> Why?

Examples:

* Operational Focus rationale
* Latest Progression Event details
* Historical context
* Supporting reasoning

This information should be progressively disclosed.

---

# Patient Card Default State

The default patient card should optimize for scanning multiple patients.

It should remain compact.

---

## Always Visible

### Patient Identity

Purpose:

Confirm the correct patient.

Examples:

* Patient Name
* Case Title
* Primary Diagnosis

---

### Current Focus

Purpose:

Immediately communicate the treatment frame.

Example:

Transfer and mobility safety remain primary.

This is the most important clinical element on the card.

---

### Clinical Status

Purpose:

Communicate current trajectory.

Examples:

* Improving
* Stable
* Declining
* Monitor Closely
* Reassessment Needed

Status should remain concise.

---

### Recency

Purpose:

Communicate how current the information is.

Examples:

* Last Visit Yesterday
* Last Visit 3 Days Ago
* Updated Today

Prefer clinical recency over raw creation timestamps.

---

# Conditional Patient Card Elements

These should appear only when meaningful.

---

## Attention Required

Purpose:

Alert the clinician before entering the home.

Examples:

* Fall risk increased
* Caregiver support inconsistent
* Safety concern identified

This should be visually prominent but not alarming.

---

## Since Last Visit

Purpose:

Communicate meaningful change.

Examples:

* Increased transfer dependence
* Improved bathing participation
* New environmental barrier identified

Only display when change is meaningful.

---

## Next Action

Purpose:

Provide a concise treatment direction.

Examples:

* Reassess transfer safety
* Advance shower transfer training
* Monitor caregiver carryover

Keep short.

Avoid treatment-plan detail.

---

# Expanded Patient Preview

The expanded preview exists for clinicians who want additional orientation before opening the Command Center.

It should remain lightweight.

---

## Preview Purpose

Answer:

> What should I remember before entering this patient's home?

---

## Preview Candidates

### Current Focus

Expanded version.

---

### Attention Required

Expanded version.

---

### Since Last Visit

Expanded version.

---

### Next Action

Expanded version.

---

### Operational Focus Preview

Concise version only.

Structure:

#### Operational Focus

One-sentence operational emphasis.

#### Why

Maximum 3 bullets.

#### Watch For

Maximum 3 bullets.

The preview should not contain the full rationale block.

---

### Latest Progression Event

Only if clinically meaningful.

Examples:

* Progression milestone reached
* New regression concern
* Advancement readiness changed

Avoid exposing event metadata.

---

### Last Visit Summary

Short summary only.

Not a treatment note.

Not a chart review.

---

# Command Center Only

The following should remain exclusive to Command Center.

---

## Full Current Focus

Complete treatment orientation.

---

## Full Since Last Visit

Including:

* What Changed
* Why It Matters

---

## Attention Required Details

Full context.

---

## Next Action Details

Primary and supporting actions.

---

## Operational Pressures

Including:

* Caregiver feasibility
* Environmental pressures
* Mobility pressures

---

## Progression Check

Progression workflow belongs in Command Center.

---

# Reference Workspace Only

The following should remain exclusive to Reference Workspace.

---

## Full Operational Focus

Including:

* Current Operational Emphasis
* Emphasis Rationale
* Dominant Barriers
* Adjacent Priorities
* Monitoring Concerns
* Reassessment Triggers

---

## Current Longitudinal State

---

## Latest Progression Event Detail

---

## Structured Plan Details

---

## Detail Modules

---

## Historical Snapshots

---

## Case Details

---

# Operational Focus Visibility Strategy

Operational Focus should exist at multiple levels.

---

## Patient Entry

Purpose:

Rapid orientation.

Format:

Highly compressed.

---

## Command Center

Purpose:

Support treatment planning and execution.

Format:

Integrated with Current Focus and workflow orientation.

---

## Reference Workspace

Purpose:

Deep understanding and rationale review.

Format:

Complete version.

---

# What Should Never Appear On Patient Cards

Patient cards should not become miniature charts.

Avoid:

* Full Operational Focus rationale
* Historical Snapshot detail
* Structured Plan Details
* Longitudinal metadata
* Internal progression terminology
* Internal continuity terminology
* Generated-output provenance
* System diagnostics
* Confidence calculations
* Administrative workflow controls as primary content

---

# Success Criteria

A clinician viewing a patient card should be able to answer within 10 seconds:

* Is this the right patient?
* What matters today?
* Has anything important changed?
* Is there anything I need to watch for?
* Do I need to open this patient immediately?

The patient card should feel like:

Clinical Orientation

not:

Case Management

and not:

Chart Review.

---

# Current Recommendation

Proceed next to:

Patient Entry Experience Implementation Planning

using this hierarchy document and the Patient Entry Experience Specification as authoritative inputs.

Do not begin implementation until the patient card interaction model has been defined.
