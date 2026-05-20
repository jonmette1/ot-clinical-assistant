# Longitudinal Progression Architecture

---

## Purpose

This document defines the Phase 3 architectural direction for longitudinal progression support.

The goal is to support visit-to-visit continuity, functional progression tracking, and progression-aware reasoning without increasing narrative density, workflow fragmentation, or unsupported AI behavior.

---

# Phase 3 Objective

Build a structured longitudinal progression framework that helps clinicians understand:

- where the client is in the functional progression process
- what criteria define advancement
- what barriers are preventing progression
- what regression risks are present
- when reassessment may be needed
- what operational priorities should shift next

The system should support:

- treatment continuity
- functional evolution tracking
- progression-aware reasoning
- continuity-aware recommendations
- concise longitudinal summaries
- visit-to-visit operational workflows

---

# Core Product Constraint

The progression system must NOT become:

- a generic AI care plan generator
- speculative recovery forecasting
- week-by-week rehabilitation planning
- autonomous clinical decision-making
- narrative-heavy longitudinal documentation
- open-ended treatment storytelling

The correct direction is:

## Criteria-Based Operational Progression Logic

NOT:

## AI-Generated Rehabilitation Journeys

---

# Authoritative State Model

The platform distinguishes between:

## 1. Live Operational Case State

Stored in:

```txt
cases
```

This represents the current editable operational state of the case.

It is the active source of truth for:

- current case data
- current selected pathway
- current clinical decision model
- current stale-state flags
- current generated output
- current progression state

---

## 2. Historical Continuity Snapshots

Stored in:

```txt
generations
```

Historical generations are:

- reviewable
- restorable
- continuity references
- immutable snapshots of prior reasoning/output states

Historical generations are NOT:

- active editing environments
- automatically evolving progression records
- living clinical states
- places where future progression should be retroactively applied

---

## 3. Rendered Display State

The UI may display either:

- the live operational case state
- a selected historical snapshot
- a restored version

Rendered display state must not be confused with the current authoritative operational state.

---

# Core Architectural Rule

```txt
cases = live operational state
generations = immutable historical snapshots
```

This distinction must be preserved throughout Phase 3.

---

# Progression State Ownership

The authoritative current progression state should live with the active case.

Initial storage target:

```ts
cases.generated_output.progression_state
```

When a generation is saved, the progression state should be copied into:

```ts
generations.output_payload.progression_state
```

This allows historical versions to preserve the progression state that existed at the time of generation without becoming editable or automatically updated.

---

# Initial Progression State Schema

The initial schema should remain intentionally small.

```ts
progression_state: {
  currentPhase: string;
  advancementReadiness: "low" | "partial" | "high";
  activeMilestones: string[];
  activeBarriers: string[];
  regressionRisks: string[];
  reassessmentTriggers: string[];
  caregiverDependencyState: string;
  environmentalLimitationState: string;
  continuitySummary: string;
}
```

---

# Progression State Definitions

## currentPhase

Represents the client’s current operational progression phase.

Examples:

- stabilization
- foundational participation
- supported functional execution
- reduced dependency
- environmental optimization
- maintenance readiness

---

## advancementReadiness

Represents whether the client appears ready to progress to a higher functional demand level.

Allowed values:

- low
- partial
- high

This should be based on structured clinical signals, not AI speculation.

---

## activeMilestones

Represents observable functional markers currently being targeted or emerging.

Examples:

- safe transfer setup
- reduced cueing need
- caregiver-assisted carryover
- improved standing tolerance
- safer bathroom access

---

## activeBarriers

Represents current factors blocking progression.

Examples:

- transfer instability
- environmental hazard
- caregiver availability limitation
- endurance limitation
- cognitive sequencing deficit
- pain limitation

---

## regressionRisks

Represents factors that may cause functional decline, safety deterioration, or increased assistance needs.

Examples:

- recent falls
- unsafe unsupervised access
- worsening fatigue
- caregiver mismatch
- unresolved environmental hazard

---

## reassessmentTriggers

Represents conditions that should prompt updated clinical review.

Examples:

- fall event
- worsening assistance level
- unresolved safety barrier
- caregiver status change
- environmental modification completed
- plateau across visits

---

## caregiverDependencyState

Represents how much the current plan depends on caregiver support.

Examples:

- independent carryover possible
- intermittent caregiver support required
- full caregiver support required
- caregiver support currently unreliable
- caregiver capacity mismatch present

---

## environmentalLimitationState

Represents how much the home environment limits progression.

Examples:

- environment supports progression
- environment partially limits progression
- environment significantly limits progression
- environmental hazard blocks progression

---

## continuitySummary

A short operational summary of the current progression state.

### Rules

- 1–2 sentences maximum
- operational language only
- no recovery prediction
- no motivational language
- no week-by-week planning
- no treatment storytelling

### Good Example

> "Transfer instability and bathroom hazards continue limiting safe ADL participation. Progression should remain focused on safety stabilization and caregiver-supported task setup."

### Bad Example

> "Over the next several weeks, the patient may gradually progress toward greater independence with continued treatment and adaptive strategies."

---

# Deterministic vs AI Responsibility

## Deterministic Logic Governs

Progression logic should be generated from structured case data and deterministic reasoning signals.

Deterministic logic should govern:

- current phase assignment
- advancement readiness
- milestone eligibility
- active barriers
- regression risks
- reassessment triggers
- caregiver dependency state
- environmental limitation state

---

## AI Synthesis Supports

AI may support:

- concise wording
- communication clarity
- clinical readability
- synthesis of deterministic progression state
- cognitive compression

AI must NOT:

- invent unsupported progression claims
- predict recovery
- generate future rehabilitation timelines
- override deterministic progression state
- create autonomous treatment progression
- write long-form longitudinal narratives

---

# Progression Phase Model

The initial phase model should be functional and operational, not time-based.

## Avoid

- Week 1
- Week 2
- Month 1
- expected recovery timelines

## Use

- current functional status
- safety stability
- caregiver feasibility
- environmental readiness
- task participation level

---

# Recommended Phase Labels

## Stabilization

Client requires immediate safety containment, environmental control, or high support to prevent harm.

---

## Foundational Participation

Client can participate in limited parts of the target task but requires significant setup, cueing, or assistance.

---

## Supported Functional Execution

Client can complete larger portions of the task with structured support, supervision, or environmental modification.

---

## Reduced Dependency

Client demonstrates improving consistency with reduced physical assistance, reduced cueing, or reduced caregiver demand.

---

## Environmental Optimization

Client function is improving, but progression depends on refining environmental setup, equipment access, or task efficiency.

---

## Maintenance Readiness

Client demonstrates stable function and the focus shifts toward carryover, safety maintenance, and discharge readiness.

---

# Advancement Readiness Rules

Progression should require multiple supporting signals.

Do NOT advance readiness based on one positive factor alone.

Readiness should consider:

- safety stability
- assistance level
- consistency
- caregiver feasibility
- environmental support
- task participation
- regression risk

---

# Regression Logic

Regression risks should increase visibility when current conditions suggest possible decline, unsafe carryover, or increased assistance needs.

Regression logic should consider:

- fall history
- worsening assistance level
- unsafe environment
- caregiver inability
- worsening endurance
- pain limitation
- cognitive sequencing risk
- inconsistent task performance

Regression logic should clarify risk.

It should not create fear-based narrative or overstate certainty.

---

# Reassessment Logic

Reassessment triggers should identify when the current operational plan may need review.

Triggers may include:

- fall event
- new medical change
- increased assistance needs
- persistent plateau
- new caregiver limitation
- equipment/environment change
- unresolved high-risk barrier
- stale reasoning state

Reassessment triggers should be concise and actionable.

---

# Caregiver Progression Logic

Caregiver dependency should be treated as a progression variable.

The system should track whether function is becoming:

- less caregiver dependent
- more caregiver dependent
- stable with caregiver support
- limited by caregiver availability
- limited by caregiver physical capacity
- limited by caregiver confidence or training

Caregiver progression is not about judging the caregiver.

It is about determining whether the care workflow is sustainable.

---

# Environmental Progression Logic

Environmental readiness should be treated as a progression variable.

The system should track whether the environment:

- supports progression
- partially limits progression
- significantly limits progression
- blocks safe task participation
- requires modification before advancement

Environmental progression should remain grounded in real home constraints.

---

# Workflow Integration Philosophy

Progression should integrate into the current workflow as lightweight operational signals.

Do NOT create a large progression dashboard in Phase 3A.

Initial UI integration should be limited to:

- progression state chip
- advancement readiness indicator
- active barrier list
- reassessment trigger notice
- short continuity summary

Progression should support rapid orientation, not create another documentation burden.

---

# UX Rules

Progression UI should be:

- compact
- scan-friendly
- operational
- easy to ignore when stable
- visually prominent only when risk or reassessment is present

## Avoid

- large timelines
- heavy history panels
- dense longitudinal narratives
- predictive graphics
- complex dashboards
- unnecessary scoring systems

---

# Persistence Rules

## When a case is regenerated

- current progression state may update
- stale-state flags should remain respected
- selected pathway authority should remain preserved
- live operational state should remain authoritative

---

## When a generation is saved

- progression state should be preserved inside the snapshot
- historical progression state should not automatically update later

---

## When a generation is restored

- restored progression state may become the active progression state only if the clinician intentionally restores that version

---

# Phase 3A Scope

Phase 3A should include:

- progression schema definition
- deterministic progression helper
- integration into current generated output
- preservation in generation snapshots
- minimal display support

## Explicitly Excluded

- separate progression table
- timeline system
- predictive modeling

---

# Deferred Concepts

The following are intentionally deferred:

- separate progression event table
- longitudinal dashboards
- predictive recovery forecasting
- automated discharge prediction
- week-by-week care plans
- adaptive AI learning
- outcome probability scoring
- cross-patient pattern intelligence
- autonomous progression recommendations
- large narrative visit histories

These may be reconsidered later only if they improve workflow clarity without increasing cognitive burden.

---

# Phase 3 Governance Rule

Before adding any progression feature, ask:

> Does this improve continuity, progression visibility, and clinician orientation without increasing cognitive burden?

If not:

- simplify it
- defer it
- or reject it