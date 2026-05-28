# Continuity Mutation Lifecycle

---

# Purpose

This document defines the authoritative lifecycle rules governing continuity mutation, reassessment evolution, stale-state transitions, regeneration behavior, and longitudinal operational continuity handling.

This document exists to:
- preserve deterministic continuity authority
- prevent continuity drift
- govern continuity mutation behavior
- define regeneration consequences
- stabilize reassessment workflows
- protect immutable historical snapshots
- maintain longitudinal continuity integrity
- preserve operational readability without introducing dashboard-oriented architecture

This document operates downstream from:
- `continuity_authority_matrix.md`
- `system_architecture.md`
- `decision_log.md`

---

# Core Principle

The platform is not managing:
- treatment plans
- recommendation versions
- competing intervention pathways

The platform is managing:
- continuity-sensitive operational state

The purpose of continuity mutation governance is to ensure that operational continuity remains:
- deterministic
- explainable
- longitudinally coherent
- reassessment-aware
- operationally readable

---

# Canonical Mutation Lifecycle

The authoritative continuity lifecycle is:

```txt
Structured Case Mutation
→ Mutation Classification
→ Stale-State Evaluation
→ Deterministic Continuity Recalculation
→ AI Operational Re-Synthesis
→ Detail Module Invalidation
→ Persisted Operational State Update
→ Historical Snapshot Preservation
```

---

# Mutation Categories

## Category 1 — Continuity-Neutral Mutation

### Definition

Changes that do not materially affect operational continuity interpretation.

### Examples

- spelling corrections
- formatting edits
- non-operational metadata edits
- cosmetic note changes

### Behavior

- no regeneration required
- no stale-state transition required
- no continuity recalculation required

---

## Category 2 — Operational Mutation

### Definition

Changes that may affect operational interpretation but do not fundamentally alter continuity stability.

### Examples

- caregiver scheduling adjustments
- environmental clarification
- equipment updates
- minor transfer detail changes
- minor support-level updates

### Behavior

- `modules_stale = true`
- operational review may be required
- continuity recalculation may be recommended
- regeneration optional depending on operational impact

---

## Category 3 — Continuity-Significant Mutation

### Definition

Changes that materially affect continuity interpretation, operational prioritization, progression state, reassessment pressure, or operational instability.

### Examples

- decline in transfer status
- worsening caregiver reliability
- fall events
- major environmental barrier changes
- safety-risk escalation
- major support-level shifts
- new instability drivers
- reassessment-triggering events

### Behavior

Must trigger:

```ts
reasoning_stale = true
plan_stale = true
modules_stale = true
```

Requires:
- deterministic continuity recalculation
- operational prioritization regeneration
- progression regeneration
- continuity interpretation regeneration

---

# Stale-State Lifecycle

## reasoning_stale

### Meaning

Deterministic reasoning may no longer reflect current operational reality.

### Triggered By

- continuity-significant mutation
- reassessment-trigger events
- caregiver instability changes
- environmental instability changes
- progression-sensitive operational changes

### Cleared By

- successful deterministic regeneration

---

## plan_stale

### Meaning

Generated operational synthesis may no longer accurately reflect operational continuity.

### Triggered By

- continuity-significant mutation
- operational prioritization changes
- continuity interpretation changes
- progression changes

### Cleared By

- successful regeneration

---

## modules_stale

### Meaning

Downstream detail modules may no longer reflect the current operational continuity state.

### Triggered By

- continuity interpretation changes
- operational prioritization changes
- progression changes
- caregiver feasibility changes
- environmental feasibility changes
- plan regeneration

### Cleared By

- successful detail module regeneration

---

# Regeneration Lifecycle

## Regeneration Purpose

Regeneration exists to:
- refresh deterministic continuity interpretation
- refresh operational prioritization
- refresh progression interpretation
- refresh operational synthesis
- refresh reassessment-sensitive continuity meaning

Regeneration is not:
- pathway selection
- recommendation competition
- historical continuity mutation
- predictive modeling

---

## Regeneration Sequence

```txt
Current Live Case State
→ Canonical Payload Construction
→ Deterministic Clinical Decision Engine
→ Deterministic Progression Derivation
→ Deterministic Continuity Interpretation
→ AI Operational Synthesis
→ Generated Output Persistence
→ Historical Snapshot Creation
```

---

## Regeneration Freshness Rules

Successful regeneration must set:

```ts
reasoning_stale = false
plan_stale = false
```

Regeneration intentionally leaves:

```ts
modules_stale = true
```

until downstream detail modules are explicitly regenerated.

---

# Detail Module Lifecycle

## Role

Detail modules are downstream execution-support synthesis artifacts.

They are not continuity authorities.

---

## Detail Module Dependencies

Detail modules depend on:
- progression state
- continuity interpretation
- operational prioritization
- caregiver feasibility
- environmental feasibility
- current operational instability

---

## Detail Module Invalidity Rule

If core continuity meaning changes:
- detail modules are considered invalid

This protects against:
- stale caregiver guidance
- stale environmental recommendations
- stale execution-support interpretation
- continuity drift between modules and core operational state

---

# Reassessment Lifecycle

## Reassessment Purpose

Reassessment exists to:
- determine operational continuity changes
- surface instability evolution
- identify operational drift
- determine whether continuity state remains valid

Reassessment does not exist to:
- generate alternative treatment philosophies
- create competing plans
- predict recovery trajectory

---

## Reassessment Inputs

Continuity reassessment may consider:
- follow_up_status
- progression reassessment triggers
- operational reassessment triggers
- caregiver instability
- environmental instability
- stale-state signals
- safety escalation
- operational drift signals

---

## Reassessment Outputs

Deterministic reassessment interpretation may generate:
- reassessment pressure
- continuity alerts
- operational drift signals
- instability classifications
- continuity condition updates

AI may synthesize these outputs for readability.

AI may not determine them independently.

---

# Restore Lifecycle

## Restore Definition

Restore is a full historical continuity restoration.

Restore is not:
- continuity merging
- partial operational rollback
- selective continuity recombination

---

## Restore Consequences

Restore may overwrite:
- progression state
- continuity interpretation
- operational prioritization
- continuity summaries
- generated output
- detail modules

Restore intentionally makes the selected historical continuity state authoritative again.

---

## Restore Protection Rule

Historical generations remain immutable.

Restore creates:
- a live operational adoption of a historical state

It does not:
- mutate historical records
- merge historical and live continuity
- recompute historical continuity automatically

---

# Historical Snapshot Governance

Historical generations are:
- immutable continuity snapshots
- operational continuity references
- historical reasoning states

Historical generations must not:
- auto-update
- auto-recalculate
- inherit live continuity mutations
- evolve longitudinally after persistence

---

# Continuity Drift Protection

The platform must prevent:
- hidden multi-authority systems
- AI-owned continuity interpretation
- stale operational synthesis pretending to be current
- detail modules drifting from continuity interpretation
- historical continuity corruption
- silent reassessment conflicts
- fragmented continuity state ownership

---

# Future Architecture Direction

Future architecture should converge toward:

```txt
buildCanonicalContinuityState()
```

This future layer should unify:
- progression derivation
- continuity interpretation
- reassessment interpretation
- stale-state interpretation
- operational continuity assembly

into a single deterministic continuity authority pipeline.

---

# Governance Rule

Before implementing any continuity workflow, ask:

Does this preserve deterministic continuity authority while improving operational continuity readability without increasing cognitive burden?

If not:
- simplify it
- redesign it
- or reject it
