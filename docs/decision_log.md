# OT Clinical Reasoning Assistant — Decision Log

---

# Purpose
This document records finalized architectural, workflow, UX, and product decisions.

The goal is to:
- prevent repeated re-litigation
- maintain architectural consistency
- stabilize product direction
- reduce decision drift

Only finalized decisions belong here.

---

# Decision Format
Each decision should include:
- decision
- rationale
- tradeoff
- status

---

# DECISION 001

## Decision
The deterministic reasoning engine is the authoritative clinical reasoning layer.

AI is constrained to synthesis and workflow interpretation.

---

## Rationale
Improves:
- explainability
- clinician trust
- reasoning consistency
- operational defensibility

Reduces:
- AI hallucination risk
- unstable recommendations
- unsupported reasoning generation

---

## Tradeoff
Reduces generative flexibility and autonomous AI behavior.

---

## Status
ACTIVE

---

# DECISION 002

## Decision
The platform prioritizes cognitive compression and workflow clarity over narrative richness.

---

## Rationale
Primary user workflows occur under:
- time pressure
- documentation fatigue
- cognitive overload

Operational usability is prioritized over detailed narrative generation.

---

## Tradeoff
Some clinically interesting narrative detail may be intentionally omitted.

---

## Status
ACTIVE

---

# DECISION 003

## Decision
Environmental realism and caregiver feasibility are core reasoning priorities.

---

## Rationale
Most clinical systems fail to adequately represent:
- real residential environments
- caregiver limitations
- practical workflow feasibility

The platform differentiates itself through operational realism.

---

## Tradeoff
Requires more structured environmental and caregiver input complexity.

---

## Status
ACTIVE

---

# DECISION 004

## Decision
The product will transition from a multi-pathway recommendation architecture to a continuity-aware operational prioritization architecture.

---

## Rationale
The current generated “pathways” are no longer functioning as true competing treatment plans.

They are functioning as:
- operational emphasis states
- continuity-sensitive intervention priorities
- progression-adjacent weighting states

Continuing to frame them as alternative treatment approaches creates:
- authority conflicts
- false clinician choice architecture
- duplicated semantics
- progression phase vs recommended pathway mismatches
- incorrect longitudinal implications

---

## Tradeoff
This reduces the apparent breadth of AI-generated options, but improves clinical coherence, workflow clarity, and architectural honesty.

---

## Status
ACTIVE

---

# DECISION 005

## Decision
The live operational case state is the authoritative source of current truth.

Historical generations remain immutable continuity snapshots.

---

## Rationale
The platform needs a clear source of authority as reassessment and follow-up workflows mature.

The live case owns:
- current structured data
- current generated output
- current progression state
- current operational emphasis
- stale-state flags
- clinician-edited operational updates

Historical generations are:
- reviewable
- restorable
- continuity references

They are not:
- automatically evolving states
- active editing environments
- independent current clinical authorities

---

## Tradeoff
Requires careful handling of restore workflows and historical display so users understand when they are viewing a snapshot versus the current operational state.

---

## Status
ACTIVE

---

# DECISION 006

## Decision
Current operational emphasis will replace selected pathway semantics as the primary treatment direction authority.

---

## Rationale
Selected pathway semantics imply that the clinician is choosing among competing AI-generated plans.

The system’s actual behavior is closer to deterministic operational prioritization.

The appropriate primary question is:

What should dominate treatment attention right now?

Not:

Which competing treatment pathway should the clinician select?

---

## Tradeoff
Existing implementation may temporarily need to preserve `selectedPathwayIndex` for backward compatibility while the new operational emphasis model is introduced.

---

## Status
APPROVED FOR MIGRATION

---

# DECISION 007

## Decision
`selectedPathwayIndex` should be deprecated eventually, but not removed immediately.

---

## Rationale
Existing case rendering, historical generations, copy/export workflows, and caregiver guidance may still depend on pathway-indexed structures.

Immediate removal could break stored cases or destabilize continuity workflows.

The migration should introduce explicit operational prioritization fields first, then reduce dependency on pathway index semantics.

---

## Tradeoff
The codebase will temporarily carry transitional semantic debt.

This is acceptable if the migration path is explicit and bounded.

---

## Status
APPROVED FOR PHASED DEPRECATION

---

# DECISION 008

## Decision
“Alternative Treatment Approaches” should be replaced by “Adjacent Operational Priorities.”

---

## Rationale
The current alternatives are not true alternatives.

They are better understood as:
- nearby emphasis areas
- secondary operational concerns
- emerging readiness areas
- priority shifts to monitor
- possible next emphasis candidates after reassessment

This framing supports continuity without undermining the current operational evaluation.

---

## Tradeoff
Clinicians lose a simple “option A / option B / option C” framing, but gain a more clinically honest representation of continuity-aware treatment prioritization.

---

## Status
ACTIVE

---

# DECISION 009

## Decision
Progression state and operational emphasis are related but distinct.

---

## Rationale
Progression state describes the client’s current operational continuity condition.

Operational emphasis describes the dominant intervention priority right now.

A client may be in “foundational participation” while the current operational emphasis is “caregiver-supported task setup” or “transfer control and sequencing.”

Forcing a one-to-one mapping would recreate the same authority conflicts the pathway model created.

---

## Tradeoff
Requires clearer UI language and deterministic derivation rules.

---

## Status
ACTIVE

---

# DECISION 010

## Decision
Phase 3B reassessment workflows should update operational emphasis through deterministic continuity logic, not through pathway reselection.

---

## Rationale
Reassessment should answer:
- what changed?
- what remains limiting?
- what now dominates treatment attention?
- what requires review before continuing?

It should not imply that the clinician is choosing from newly generated competing plans.

---

## Tradeoff
Requires tighter integration between follow-up status, stale-state flags, progression state, and operational prioritization output.

---

## Status
ACTIVE
