# Continuity Authority Matrix

---

# Purpose

This document defines authoritative ownership, persistence behavior, mutation rules, and regeneration governance for continuity-sensitive clinical reasoning workflows.

The purpose of this document is to:
- prevent continuity authority drift
- stabilize reassessment workflows
- define deterministic vs AI responsibility boundaries
- protect longitudinal continuity integrity
- preserve immutable historical snapshots
- prevent hidden multi-authority systems
- establish safe regeneration semantics
- define stale-state governance

This document governs:
- progression state
- continuity interpretation
- operational prioritization
- stale-state handling
- reassessment workflows
- regeneration workflows
- historical snapshot restoration
- detail module behavior
- continuity-sensitive persistence semantics

---

# Core Governance Rule

Deterministic interpretation layers are authoritative for continuity state derivation.

AI synthesis layers are authoritative only for:
- communication compression
- wording
- presentation structure
- operational readability

UI layers are NEVER authoritative for:
- continuity interpretation construction
- progression derivation
- operational prioritization authority
- reassessment classification
- continuity mutation semantics

---

# Canonical Continuity Pipeline

The authoritative continuity pipeline is:

```txt
Structured Case State
→ Canonical Payload Builder
→ Deterministic Clinical Decision Engine
→ Deterministic Progression Derivation
→ Deterministic Continuity Interpretation
→ AI Operational Synthesis
→ Persisted Generated Output
→ UI Rendering
```

The UI may:
- collect edits
- submit mutation requests
- display continuity state

The UI must not:
- manually derive continuity interpretation
- independently assemble authoritative continuity state
- mutate continuity semantics outside deterministic governance

---

# Architectural Reality — Transitional State

The current implementation contains a temporary transitional split:

```txt
/api/generate-plan
```

currently:
- generates AI operational prioritization
- attaches deterministic continuity interpretation

while:

```txt
page.tsx
```

currently:
- attaches deterministic progression state
- persists final generated output

This split is acceptable temporarily.

The long-term target architecture should consolidate:
- progression derivation
- continuity interpretation
- operational continuity assembly

into a unified canonical continuity pipeline.

---

# Authoritative Source Hierarchy

## 1. Live Operational Case State

The active case record is the authoritative operational state.

Stored in:

```txt
cases
```

Authoritative ownership includes:
- current structured case data
- current generated output
- current progression state
- current continuity interpretation
- current operational prioritization
- stale-state flags
- clinician continuity edits
- detail module freshness state

---

## 2. Deterministic Reasoning Layer

The deterministic layer is authoritative for:
- progression derivation
- continuity interpretation
- reassessment pressure
- instability classification
- barrier weighting
- environmental limitation interpretation
- caregiver dependency interpretation
- stale-state interpretation
- reassessment trigger derivation

Deterministic interpretation must never be overridden by AI wording.

---

## 3. AI Synthesis Layer

AI is authoritative only for:
- wording
- synthesis
- communication
- cognitive compression
- operational readability

AI is NOT authoritative for:
- progression state
- reassessment pressure
- continuity classification
- operational validity
- stale-state determination
- longitudinal interpretation authority

---

## 4. Historical Generations

Historical generations are immutable continuity snapshots.

Stored in:

```txt
generations
```

Historical generations are:
- reviewable
- restorable
- continuity references
- immutable historical states

Historical generations are NOT:
- automatically evolving continuity records
- active operational states
- independently mutable continuity systems

---

# Continuity Authority Matrix

| System | Authority Type | Persistence Behavior | Recalculation Rule | Snapshot Rule | Editable |
|---|---|---|---|---|---|
| clinical_decision_input | deterministic structured input | persisted live state | recalculated from case edits | preserved historically | yes |
| clinical_decision_model | deterministic interpretation | persisted live state | recalculated from canonical payload | preserved historically | no |
| progression_state | deterministic continuity derivation | persisted in generated_output | regenerated deterministically | preserved historically | no |
| continuity_interpretation | deterministic continuity derivation | persisted in generated_output | regenerated deterministically | preserved historically | no |
| operational_prioritization | constrained AI synthesis | persisted in generated_output | regenerated from deterministic context | preserved historically | no |
| continuitySummary | AI synthesis artifact | regenerated presentation state | regenerated with plan | preserved historically | no |
| dominantBarriers | deterministic + constrained synthesis | regenerated with plan | regenerated deterministically | preserved historically | no |
| reassessmentPressureLevel | deterministic continuity interpretation | regenerated continuity state | regenerated deterministically | preserved historically | no |
| stale flags | workflow validity state | persisted live state | updated by mutation workflows | not historical authority | limited |
| detail_modules | downstream synthesis support | persisted separately | regenerated independently | partially preserved | yes |
| current_generation_id | workflow persistence state | persisted live state | updated during save/restore | not continuity authority | system only |

---

# Deterministic vs AI Responsibility

## Deterministic Responsibility

Deterministic systems govern:
- continuity interpretation
- progression derivation
- reassessment classification
- operational instability detection
- environmental limitation interpretation
- caregiver dependency interpretation
- stale-state interpretation
- regression risk interpretation

Deterministic systems are authoritative.

---

## AI Responsibility

AI may:
- synthesize deterministic reasoning
- compress operational meaning
- improve readability
- improve workflow communication

AI must NOT:
- invent progression claims
- predict recovery
- create longitudinal forecasts
- override reassessment pressure
- independently classify continuity state
- mutate operational validity
- determine stale-state freshness

---

# Persistence Rules

## Live Case Persistence

The live case owns:
- current operational continuity state
- current generated output
- current stale-state status
- current progression state
- current continuity interpretation

The live case is authoritative.

---

## Historical Snapshot Persistence

Historical generations preserve:
- prior generated output
- prior progression state
- prior continuity interpretation
- prior operational prioritization
- prior continuity summaries

Historical generations do not evolve automatically.

---

# Regeneration Governance

## Regeneration Purpose

Regeneration exists to:
- refresh operational reasoning
- refresh deterministic continuity interpretation
- refresh operational prioritization
- refresh progression interpretation
- refresh continuity-aware synthesis

Regeneration does NOT:
- merge continuity states
- preserve stale continuity interpretation
- partially mutate historical continuity snapshots

---

# Regeneration Freshness Rules

Successful regeneration must set:

```ts
reasoning_stale: false
plan_stale: false
```

Successful regeneration currently leaves:

```ts
modules_stale: true
```

This is intentional.

Detail modules are downstream support artifacts and may no longer reflect the refreshed operational continuity state.

---

# Detail Module Governance

Detail modules are:
- downstream support artifacts
- execution-support synthesis layers
- continuity-dependent workflow helpers

Detail modules include:
- caregiver scripts
- transfer details
- ADL privacy support
- equipment feasibility planning

Detail modules inherit authority from:
- live operational case state
- generated operational output
- deterministic continuity interpretation

Detail modules must NOT:
- define continuity authority
- override progression state
- independently mutate reassessment interpretation
- persist longitudinal continuity logic

---

# Detail Module Freshness Rules

When:
- structured case data changes
- progression state changes
- continuity interpretation changes
- operational prioritization changes

then:

```ts
modules_stale: true
```

Detail modules become fresh again only after:
- explicit module regeneration
- successful persistence of updated detail modules

which sets:

```ts
modules_stale: false
```

---

# Restore Governance

## Restore Rule

Restore is a full snapshot restoration.

Restore is NOT:
- a partial continuity merge
- a reassessment-aware merge operation
- a selective operational recovery system

When a generation is restored:
- historical input_payload becomes live operational input
- historical output_payload becomes live generated output
- historical continuity state becomes authoritative again

---

# Restore Mutation Rules

Restore may overwrite:
- progression_state
- continuity_interpretation
- operational_prioritization
- continuity summaries
- detail modules
- generated output

Restore should not:
- automatically recompute continuity interpretation
- silently merge reassessment state
- preserve incompatible live continuity state

---

# Stale-State Governance

## reasoning_stale

Represents:
- deterministic reasoning validity risk

Set TRUE when:
- structured inputs mutate
- reassessment changes occur
- continuity interpretation may no longer reflect current conditions

Set FALSE after:
- successful deterministic regeneration

---

## plan_stale

Represents:
- generated operational synthesis validity risk

Set TRUE when:
- operational continuity meaning may no longer reflect current conditions

Set FALSE after:
- successful regeneration

---

## modules_stale

Represents:
- detail module validity risk

Set TRUE when:
- continuity state changes
- operational prioritization changes
- progression state changes
- structured plan meaning changes

Set FALSE only after:
- explicit detail module regeneration

---

# Reassessment Governance

Reassessment interpretation is deterministic.

Inputs may include:
- follow_up_status
- progression reassessment triggers
- operational reassessment triggers
- stale-state flags
- caregiver instability
- environmental instability

Outputs may include:
- reassessment pressure
- continuity alerts
- operational drift signals
- instability classification

AI may communicate reassessment meaning.

AI may not determine reassessment authority.

---

# Prohibited Architectural Patterns

The platform must avoid:
- hidden continuity authority duplication
- AI-owned continuity interpretation
- UI-owned progression derivation
- partial continuity merges
- auto-mutating historical snapshots
- predictive recovery systems
- autonomous longitudinal planning
- continuity dashboards that increase cognitive burden
- timeline-heavy longitudinal architecture

---

# Future Architecture Direction

Future continuity architecture should converge toward:

```txt
buildCanonicalContinuityState()
```

This future layer should unify:
- progression derivation
- continuity interpretation
- reassessment interpretation
- stale-state interpretation
- operational continuity assembly

into a single authoritative continuity pipeline.

---

# Governance Rule

Before adding any continuity feature, ask:

Does this preserve deterministic continuity authority while improving clinician operational orientation without increasing cognitive burden?

If not:
- simplify it
- defer it
- or reject it
