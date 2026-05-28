# Clinical Workflow Workspace Architecture v1

This document defines the UX orchestration architecture for the OT Clinical Reasoning Assistant workflow system.

The platform is transitioning from:
- generated treatment output workflows

toward:
- longitudinal operational reasoning workflows

The UX architecture must reflect this transition.

---

# Core Workflow Philosophy

The workflow should feel like:

```txt
an intelligent operational workspace
```

NOT:
- an AI report viewer
- a recommendation generator
- a treatment pathway selector
- a dashboard-heavy documentation system

The system should continuously answer:

> What operational condition is currently unstable, why is it unstable, and what pressures are sustaining that instability?

---

# Workflow System Model

The workflow is now one unified longitudinal system.

| Workflow Stage | Purpose |
|---|---|
| Intake | Build initial operational understanding |
| Operational Workspace | Interpret current instability state |
| Continuity Tracking | Understand evolution over time |
| Reassessment | Update operational condition |
| Detail Expansion | Add specificity when useful |
| Historical Review | Review continuity checkpoints |

The system should feel continuous across all stages.

---

# Workflow UX North Star

The workflow should optimize for:

```txt
minimal perceived effort
per meaningful operational insight gained
```

Not:
- maximum information density
- maximum AI richness
- maximum dashboard complexity

---

# Shared Workflow Philosophy

All workflow screens should feel like:
- the same intelligence
- the same operational language
- the same prioritization philosophy
- the same cognitive model
- the same continuity framework

The intake page, workspace page, and reassessment flows must feel like:

```txt
one coherent operational reasoning system
```

NOT:

```txt
multiple disconnected interfaces
```

---

# Core UX Reframe

The platform should NO LONGER frame itself as:

```txt
Here is your generated treatment plan.
```

The platform should instead frame itself as:

```txt
Here is the patient’s current operational condition.
```

---

# Primary Workspace Orientation

The workspace must immediately orient the clinician to:

1. What is unstable?
2. Why is it unstable?
3. How fragile is the current state?
4. What pressures dominate?
5. What changed?
6. What requires monitoring?
7. What may worsen without intervention?

The workspace should answer these questions within:

```txt
15–30 seconds
```

without requiring deep scrolling.

---

# Operational Workspace Hierarchy

## Tier 1 — Current Operational State

Most visually dominant.

Includes:
- current operational emphasis
- operational instability summary
- continuity condition
- reassessment pressure
- progression state
- dominant instability drivers
- immediate operational concerns

---

## Tier 2 — Operational Interpretation

Supporting operational understanding.

Includes:
- environmental pressures
- feasibility constraints
- caregiver limitations
- continuity risks
- operational drift signals

---

## Tier 3 — Actionable Operational Guidance

Supports clinical execution.

Includes:
- immediate actions
- session priorities
- caregiver guidance
- operational cautions
- transfer setup guidance

This layer should feel:

```txt
operational
```

NOT:

```txt
directive treatment planning
```

---

## Tier 4 — Detail Expansion

Optional refinement layer.

Includes:
- caregiver scripts
- ADL privacy modules
- transfer details
- equipment feasibility
- advanced environment interpretation
- transparency systems

This layer should be:
- collapsible
- optional
- refinement-oriented
- low visual dominance

---

## Tier 5 — System Transparency

Lowest hierarchy layer.

Includes:
- decision transparency
- reasoning internals
- selected strategies
- derived reasoning signals

Transparency is supportive, not primary.

---

# Longitudinal UX Philosophy

The workspace must become:

```txt
continuity-aware
```

NOT:

```txt
snapshot-oriented
```

The clinician should feel:
- this patient is evolving
- instability changes over time
- operational pressure changes over time
- continuity matters
- reassessment changes interpretation

---

# Progression State Visibility

Progression state must become visually elevated.

The clinician should immediately understand:
- stabilization status
- progression phase
- regression vulnerability
- caregiver dependency state
- environmental limitation severity
- advancement readiness
- reassessment pressure

This should become:

```txt
persistent operational orientation
```

NOT:

```txt
hidden generated metadata
```

---

# Reassessment UX Philosophy

Reassessment should NOT feel like:

```txt
generate another plan
```

Reassessment should feel like:

```txt
update the operational condition
```

The clinician should perceive:
- continuity
- operational evolution
- instability shifts
- environmental change
- caregiver adaptation
- changing feasibility

NOT:
- isolated regeneration events

---

# Continuity Checkpoint Philosophy

Historical generations should evolve toward:

```txt
continuity checkpoints
```

NOT:

```txt
versions
snapshots
generations
```

Historical review should communicate:
- operational evolution
- reassessment moments
- instability transitions
- continuity shifts

---

# Operational Compression Strategy

The workspace should prioritize:

```txt
high-signal operational compression
```

The clinician should never feel overwhelmed by:
- excessive narrative
- repeated recommendations
- duplicate interpretation
- AI verbosity
- ontology exposure

The UX should aggressively compress:
- repeated concepts
- overlapping interpretations
- redundant operational themes

while preserving:
- operational clarity
- continuity richness
- environmental realism
- caregiver realism

---

# Sticky Orientation Layer

The workspace should maintain persistent orientation.

The clinician should NEVER lose awareness of:
- patient identity
- operational state
- continuity condition
- reassessment pressure
- progression state

A sticky operational orientation region should persist during scroll.

---

# Information Elevation Rules

The workspace must strongly differentiate:
- primary operational state
- supporting interpretation
- refinement detail
- transparency systems

Failure to differentiate hierarchy creates:
- cognitive flattening
- scanning fatigue
- operational ambiguity
- clinician overwhelm

---

# Operational State Must Dominate

The following should become top-level visual anchors:
- operational instability
- continuity condition
- reassessment pressure
- progression phase
- dominant instability drivers
- environmental pressure
- caregiver feasibility
- immediate operational concerns

The following should become visually secondary:
- AI-generated narratives
- pathway remnants
- detail modules
- transparency systems
- reasoning internals

---

# Detail Module Philosophy

Detail modules should become:

```txt
targeted operational refinements
```

NOT:

```txt
parallel generated subsystems
```

They should:
- support execution
- reduce clinician translation burden
- improve environmental realism
- improve caregiver realism

They should NEVER dominate the workspace hierarchy.

---

# Workspace Interaction Philosophy

The workspace should feel:
- calm
- organized
- operational
- confidence-oriented
- progressively explorable
- cognitively compressed

NOT:
- hyper-dense
- AI-chaotic
- dashboard-heavy
- visually fragmented

---

# Completion Philosophy

The clinician should never feel:

```txt
I must complete everything perfectly.
```

The system should support:
- approximation
- progressive refinement
- later reassessment
- evolving environmental understanding
- evolving caregiver understanding

---

# Mobile UX Philosophy

Mobile workflows should preserve:
- operational orientation
- continuity visibility
- cognitive compression

NOT:
- replicate desktop density

Mobile should aggressively:
- collapse refinement layers
- preserve top-level operational state
- preserve reassessment pressure visibility

---

# Trust Architecture

Clinician trust should come from:
- clarity
- operational realism
- continuity coherence
- environmental realism
- caregiver realism
- prioritization consistency
- reassessment consistency

NOT:
- AI verbosity
- recommendation volume
- dashboard complexity

---

# Success Criteria

The clinician should be able to open a case and understand within:

```txt
15–30 seconds
```

- what is unstable
- what matters most
- why the case remains difficult
- how fragile the situation is
- what requires monitoring
- what changed recently
- what operational pressures dominate

without:
- excessive scrolling
- reading large narrative blocks
- opening multiple panels
- interpreting backend ontology

The workflow should feel like:

```txt
a longitudinal operational reasoning workspace
```

NOT:

```txt
an AI-generated treatment report
```
