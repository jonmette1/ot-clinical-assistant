# Case Workspace Blueprint v1

---

# Purpose

This document defines the implementation-facing UX blueprint for the Case Workspace experience within the OT Clinical Reasoning Assistant.

This blueprint operationalizes the principles established in:
- intake_workflow_architecture_v2.md
- clinical_workflow_workspace_architecture_v1.md

This document defines:
- screen hierarchy
- information elevation
- operational orientation
- continuity visibility
- progression surfacing
- interaction sequencing
- collapse behavior
- narrative compression
- reassessment visibility
- workspace pacing

The Case Workspace is no longer treated as:

```txt
a generated report viewer
```

It is now treated as:

```txt
a longitudinal operational reasoning workspace
```

---

# Core Workspace Philosophy

The workspace should feel:
- calm
- operational
- clinically grounded
- continuity-aware
- cognitively compressed
- progressively explorable

NOT:
- AI-generated
- dashboard-heavy
- report-centric
- narratively dense
- visually fragmented
- recommendation-dominant

The clinician should feel:

> I understand the patient’s current operational condition.

within:

```txt
15–30 seconds
```

---

# Primary UX Reframe

The workspace is NOT answering:

```txt
What did the AI generate?
```

The workspace IS answering:

```txt
What operational condition currently exists?
```

This distinction governs:
- hierarchy
- layout
- visual dominance
- collapse behavior
- continuity rendering
- narrative strategy
- reassessment UX
- detail module placement

---

# Top-Level Workspace Structure

The workspace should contain 5 major zones:

| Zone | Purpose |
|---|---|
| 1. Sticky Operational Header | Persistent orientation |
| 2. Current Operational State | Highest-priority interpretation |
| 3. Operational Guidance | Immediate execution support |
| 4. Refinement + Expansion | Optional deeper interpretation |
| 5. Continuity History | Longitudinal operational evolution |

The page should feel vertically progressive.

NOT:
- panel-chaotic
- dashboard-scattered
- equally weighted everywhere

---

# Zone 1 — Sticky Operational Header

## Purpose

Maintain continuous clinician orientation during scroll.

The clinician should NEVER lose awareness of:
- who the patient is
- what is unstable
- how fragile the condition is
- whether reassessment pressure exists

---

## Sticky Header Contents

Always visible:
- patient name
- primary diagnosis
- target activity
- operational state label
- continuity condition
- reassessment pressure
- progression phase

Optional compact indicators:
- caregiver dependence
- environmental severity
- safety risk level

---

## Sticky Header Design Philosophy

The header should feel:
- lightweight
- stable
- low-noise
- operationally calm

NOT:
- data-dense
- badge-heavy
- analytics-oriented
- alert-chaotic

---

## Sticky Header Behavior

Desktop:
- persistent top orientation bar
- compact during scroll
- expands on hover/click if needed

Mobile:
- condensed orientation strip
- collapsible expansion
- preserve continuity visibility

---

# Zone 2 — Current Operational State

## Purpose

This becomes the dominant workspace layer.

This zone answers:
- what is unstable?
- why is it unstable?
- what pressures dominate?
- how fragile is the condition?
- what changed operationally?

This should become the first meaningful visual interaction after the sticky header.

---

## Visual Hierarchy

This zone should visually dominate:
- spacing
- typography
- placement
- information clarity

It should NOT visually resemble:
- AI-generated prose
- treatment report sections
- generic recommendation cards

---

## Primary Components

### Operational State Summary

Compressed operational overview.

Should include:
- current operational condition
- dominant instability driver
- primary environmental pressure
- caregiver feasibility summary
- primary operational risk

This should be:
- highly scannable
- low narrative density
- operationally direct

---

### Progression State Card

High-visibility progression orientation.

Should communicate:
- stabilization phase
- progression trajectory
- regression vulnerability
- readiness indicators
- operational momentum

This should become:
```txt
persistent clinical orientation
```

NOT:
```txt
hidden metadata
```

---

### Continuity Condition Card

Should surface:
- continuity condition
- operational drift
- reassessment pressure
- fragility indicators
- instability persistence

This card should help clinicians understand:
```txt
how stable or unstable the current operational condition is
```

---

# Zone 3 — Operational Guidance

## Purpose

Provide immediately actionable operational support.

This section supports:
- treatment execution
- session prioritization
- caregiver interaction
- environmental planning
- transfer execution
- operational monitoring

---

## Information Strategy

This section should prioritize:
- operational clarity
- execution simplicity
- high-signal guidance
- minimal verbosity

Avoid:
- large recommendation narratives
- repeated intervention explanations
- verbose AI prose
- generalized treatment philosophy

---

## Primary Components

### Session Priorities

Should answer:
- what requires attention first?
- what creates highest operational risk?
- what most limits participation?

Should remain:
- compressed
- prioritized
- scannable

---

### Caregiver Guidance

Should communicate:
- realistic caregiver role
- supervision needs
- transfer support expectations
- training priorities
- safety concerns

Should feel:
```txt
real-world
```

NOT:
```txt
idealized treatment planning
```

---

### Environmental Risk Guidance

Should highlight:
- highest-risk environmental barriers
- unsafe transitions
- setup limitations
- environmental bottlenecks

This should focus on:
```txt
operational consequences
```

NOT:
```txt
environmental descriptions alone
```

---

# Zone 4 — Refinement + Expansion

## Purpose

Allow deeper interpretation without overwhelming the clinician.

This zone should remain:
- collapsed by default
- progressively explorable
- optional for quick orientation

---

## Included Components

- transfer details
- ADL privacy
- equipment feasibility
- caregiver scripts
- advanced environmental interpretation
- advanced continuity interpretation
- operational nuance
- transparency systems

---

## Expansion Philosophy

The clinician should feel:
```txt
I can explore deeper if needed.
```

NOT:
```txt
I must read all of this to understand the case.
```

---

## Collapse Rules

Default:
- collapsed

Auto-expand only if:
- high reassessment pressure
- severe instability
- high caregiver dependence
- severe environmental risk
- transfer fragility
- safety escalation

---

# Zone 5 — Continuity History

## Purpose

Render longitudinal operational evolution.

This section reframes:
- versions
- generations
- snapshots

into:
```txt
continuity checkpoints
```

---

## Historical Rendering Philosophy

History should communicate:
- what changed
- why reassessment occurred
- operational evolution
- instability shifts
- environmental changes
- caregiver adaptation

NOT:
- technical generations
- AI versioning
- prompt iteration history

---

## Historical Layout

Each checkpoint should surface:
- operational state summary
- reassessment trigger
- continuity condition
- progression phase
- major operational change
- timestamp

This should feel like:
```txt
clinical operational evolution
```

NOT:
```txt
software history
```

---

# Narrative Compression Strategy

The workspace should aggressively reduce:
- repeated interpretation
- duplicated recommendations
- AI verbosity
- overlapping concepts
- narrative density

The system should prioritize:
```txt
high-signal operational interpretation
```

---

# Information Elevation Rules

The following should always remain visually dominant:
- operational instability
- continuity condition
- progression phase
- reassessment pressure
- environmental pressure
- caregiver feasibility
- operational fragility

The following should remain secondary:
- detail modules
- transparency systems
- AI reasoning internals
- pathway remnants
- verbose narrative sections

---

# Reassessment Visibility

Reassessment should feel:
```txt
continuous
```

NOT:
```txt
separate generation events
```

The workspace should communicate:
- evolving operational state
- continuity mutation
- instability evolution
- progression shifts
- changing caregiver feasibility
- changing environmental pressure

---

# Workspace Pacing

The workspace should progressively deepen:

1. Immediate orientation
2. Current instability
3. Operational meaning
4. Actionable execution
5. Optional refinement
6. Longitudinal evolution

The clinician should never feel:
```txt
overloaded immediately
```

---

# Mobile Strategy

Mobile should preserve:
- operational orientation
- continuity visibility
- progression visibility
- reassessment pressure
- operational instability summary

Mobile should aggressively collapse:
- refinement layers
- transparency systems
- advanced detail interpretation

---

# Success Criteria

The clinician should be able to understand within:

```txt
15–30 seconds
```

- what is operationally unstable
- what matters most
- what requires monitoring
- what changed recently
- how fragile the condition is
- what pressures dominate

without:
- deep scrolling
- reading large narratives
- opening multiple dense panels
- interpreting backend ontology

The workspace should feel like:

```txt
a continuity-aware operational workspace
```

NOT:

```txt
an AI-generated treatment report
```
