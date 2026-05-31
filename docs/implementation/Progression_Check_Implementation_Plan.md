# Progression Check Implementation Plan

---

# Purpose

This document marks the transition from architecture and planning into implementation.

The objective is not to redesign the system.

The objective is to implement the smallest possible longitudinal workflow that validates the completed architecture.

This document should be used as the implementation authority for the first longitudinal development slice.

---

# Implementation Philosophy

Do not attempt to build the final workspace.

Do not attempt to build the final command center.

Do not attempt to build the final longitudinal experience.

Instead:

Build the smallest end-to-end workflow that proves the longitudinal architecture works.

Success is defined by validating the longitudinal lifecycle.

---

# First Vertical Slice

Implement:

Progression Check
↓
Create Longitudinal Event
↓
Update Current State
↓
Update Clinical Attention
↓
Update Operational Emphasis
↓
Render Updated Workspace

This is the first implementation target.

---

# Explicit Scope

The first implementation slice should validate:

- longitudinal event creation
- current state mutation
- clinical attention updates
- operational emphasis updates
- continuity preservation
- historical event retention

The first implementation slice should not attempt to validate:

- final UX
- advanced analytics
- dashboards
- predictive logic
- reporting systems
- timeline systems
- complex reassessment workflows

---

# Phase 1 — Longitudinal Event Creation

## Objective

Create a first-class longitudinal event.

Progression Checks should no longer exist solely as generated output.

A progression check should create a persistent longitudinal event.

---

## Minimum Event Fields

Capture:

- event date
- meaningful events since last visit
- functional domains changed
- limiting factor
- progression status
- milestone achievement
- treatment direction changed
- reassessment recommendation

Additional fields may be added later.

Do not expand scope.

---

# Phase 2 — Current State Mutation

## Objective

Progression events should update Current State.

Current State becomes the primary source of truth for the workspace.

---

## Mutation Rules

Progression Check:

- updates Current State
- preserves Original Baseline
- preserves Longitudinal History

Do not overwrite Original Baseline.

Do not rewrite prior events.

---

# Phase 3 — Clinical Attention Generation

## Objective

Generate Current Clinical Attention from Current State.

Use the Clinical Attention Model as authority.

---

## Success Criteria

The system can answer:

What requires attention today?

without reviewing intake data.

---

# Phase 4 — Operational Emphasis Update

## Objective

Update operational emphasis using:

- clinical attention
- progression status
- treatment direction confirmation

Operational emphasis should reflect current treatment focus.

---

# Phase 5 — Workspace Integration

## Objective

Expose the new longitudinal state inside the existing workspace.

Do not redesign the workspace.

Use the existing workspace as a validation environment.

The purpose is validation, not UX perfection.

---

# Required Validation Questions

After implementation, verify:

1. Can a Progression Check create a longitudinal event?

2. Can a longitudinal event update Current State?

3. Does Current State preserve Original Baseline?

4. Does Clinical Attention update appropriately?

5. Does Operational Emphasis update appropriately?

6. Is historical continuity preserved?

7. Can clinicians identify what changed?

8. Can clinicians identify what requires attention?

---

# Explicit Non-Goals

Do not:

- redesign workspace UX
- redesign command center UX
- redesign progression architecture
- redesign continuity architecture
- redesign reassessment architecture
- redesign operational prioritization

These systems are already considered established.

---

# Completion Criteria

This implementation phase is complete when:

A clinician can:

1. Open a case
2. Complete a Progression Check
3. Create a Longitudinal Event
4. Update Current State
5. See Updated Clinical Attention
6. See Updated Operational Emphasis

while preserving:

- Original Baseline
- Longitudinal History
- Continuity

Once this workflow functions end-to-end, the project should transition to:

Longitudinal Workspace Design and UX refinement.
