# Longitudinal State Model

---

# Purpose

This document defines the authoritative longitudinal state model for the OT Clinical Assistant.

The purpose of this model is to establish:

- what state exists
- who owns each state
- what may mutate
- what must remain immutable
- how progression checks affect state
- how reassessment affects state

This document serves as the bridge between:

- Clinical Progression Model
- Progression Check Data Model
- Clinical Attention Model
- Progression Check UX Architecture
- Backend Implementation

---

# Core Principle

The platform is a continuity system.

The system must preserve historical truth while maintaining an accurate representation of current reality.

To achieve this, longitudinal state is separated into distinct layers.

---

# State Hierarchy

Original Baseline
↓
Current State
↓
Clinical Attention
↓
Operational Emphasis
↓
Treatment Execution

Longitudinal Events continuously update Current State.

Original Baseline remains unchanged.

---

# State Layer 1 — Original Baseline

## Purpose

Represents the earliest authoritative evaluation state available.

## Created By

- Evaluation
- Intake Workflow
- Imported Existing Patient Baseline

## Characteristics

- immutable
- historical reference
- never overwritten
- never replaced

## Used To Answer

- Where did the patient start?
- How far has the patient progressed?
- What was true at baseline?

---

# State Layer 2 — Current State

## Purpose

Represents current clinical reality.

## Created By

Evaluation establishes initial Current State.

## Updated By

- Progression Checks
- Reassessments

## Characteristics

- mutable
- clinician-facing
- represents today's reality

## May Include

- current functional status
- current limiting factor
- current progression status
- current caregiver status
- current environmental status
- current safety status
- current reassessment status

## Used To Answer

- What is true today?

---

# State Layer 3 — Longitudinal History

## Purpose

Preserves progression over time.

## Created By

Every Progression Check creates a Longitudinal Event.

Every Reassessment creates a Longitudinal Event.

## Characteristics

- immutable
- chronological
- historical record

## Used To Answer

- What changed?
- When did it change?
- How has the case evolved?

---

# State Layer 4 — Clinical Attention

## Purpose

Represents what currently requires clinician attention.

## Derived From

- Current State
- Barrier Evolution
- Functional Change
- Milestone Achievement
- Reassessment Signals

## Characteristics

- current-focused
- clinician-facing
- actionable

## Used To Answer

- What requires attention today?

---

# State Layer 5 — Operational Emphasis

## Purpose

Represents current treatment focus.

## Derived From

- Clinical Attention
- Operational Prioritization Logic
- Clinician Confirmation

## Used To Answer

- What should treatment focus on?

---

# Longitudinal Event Model

Every Progression Check creates a Longitudinal Event.

A Longitudinal Event may contain:

- meaningful events since last visit
- functional change
- limiting factor
- milestone achievement
- progression status
- treatment direction status
- clinical attention snapshot
- operational emphasis snapshot
- reassessment recommendation

Longitudinal Events should be immutable.

---

# Progression Check Mutation Rules

Progression Checks:

- create longitudinal events
- update current state
- update clinical attention
- update operational emphasis when appropriate

Progression Checks do not:

- overwrite original baseline
- delete historical events
- rewrite prior progression history

---

# Reassessment Mutation Rules

Reassessment may:

- rebuild current state
- update progression assumptions
- update caregiver/environment profile
- update treatment direction

Reassessment does not:

- overwrite original baseline
- delete longitudinal history

---

# Reference Baseline Concept

The system may maintain a Reference Baseline.

Purpose:

Provide a comparison point after major reassessment events.

Examples:

- post hospitalization
- major decline
- major functional gain
- recertification period

Reference Baseline does not replace Original Baseline.

---

# State Ownership

Original Baseline
Owner: Evaluation

Current State
Owner: Progression + Reassessment

Longitudinal History
Owner: Longitudinal Event System

Clinical Attention
Owner: Clinical Attention Model

Operational Emphasis
Owner: Operational Prioritization + Clinician Confirmation

---

# Workspace Consumption Rules

The command center should primarily consume:

1. Clinical Attention
2. Operational Emphasis
3. Current State
4. Most Recent Longitudinal Event

The workspace should not primarily consume:

- original baseline
- intake structure
- historical documentation

except through progressive disclosure.

---

# Success Criteria

The longitudinal state model is successful when the system can simultaneously answer:

- Where did the patient start?
- What is true today?
- What changed recently?
- What requires attention today?
- What should treatment focus on next?

without sacrificing historical continuity.
