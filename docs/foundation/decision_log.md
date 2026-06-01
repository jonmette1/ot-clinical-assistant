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

# DECISION 011

## Decision

The platform will formally transition from pathway-oriented recommendation synthesis toward operational-state interpretation architecture.

Operational authority is now centered on:

- current operational instability
- progression-conditioned prioritization
- continuity-aware operational emphasis
- feasibility constraints
- environmental pressures
- reassessment-sensitive instability tracking

The system will no longer frame generated outputs as:

- competing treatment philosophies
- alternative treatment pathways
- clinician pathway selection workflows

Operational emphasis should describe:

- what is currently unstable
- why participation remains fragile
- what operational pressures dominate
- what continuity-sensitive constraints persist

NOT:

- what intervention should be selected
- what treatment philosophy should dominate
- what recommendation pathway should be chosen

---

## Rationale

The prior pathway-oriented architecture created several structural conflicts:

- progression state conflicted with pathway selection
- alternative approaches behaved like adjacent progression conditions
- pathway plurality implied competing treatment philosophies that did not actually exist
- operational prioritization became obscured by recommendation-oriented semantics
- continuity logic became difficult to reconcile with pathway reselection workflows

The system was already functionally behaving as:

- operational prioritization
- instability weighting
- continuity-sensitive emphasis shifting
- environmental and caregiver feasibility interpretation

The architecture has now been realigned to reflect the system’s actual operational behavior.

The product is no longer attempting to answer:

> "Which treatment pathway should the clinician choose?"

The product is now attempting to answer:

> "What operational condition is currently most unstable, and what pressures are sustaining that instability?"

This creates substantially stronger alignment with:

- real-world OT clinical reasoning
- longitudinal continuity workflows
- reassessment evolution
- caregiver/environment feasibility interpretation
- operational workflow support

---

## Implemented Changes

Completed architectural changes include:

- removal of live selectedPathway authority
- removal of pathway-centric rendering hierarchy
- migration toward operational prioritization rendering
- replacement of recommendation-oriented operational emphasis phrasing
- replacement of executive-summary bucket architecture
- migration toward instability-driver synthesis
- migration toward feasibility-constraint interpretation
- migration toward environmental pressure interpretation
- migration toward execution pressure-point interpretation
- suppression of directive recommendation language
- suppression of treatment-command phrasing
- suppression of generalized OT recommendation semantics

Structured detail generation now prioritizes:

- observational operational language
- instability interpretation
- continuity-sensitive operational pressures
- environmental grounding
- caregiver feasibility realism
- operational compression

---

## Tradeoff

This transition requires:

- temporary hybrid compatibility layers
- continued support for legacy restore structures
- phased deprecation of pathway-era fields
- tighter semantic integration between progression state and operational emphasis
- increased prompt governance complexity to maintain observational language consistency

The architecture now depends more heavily on:

- semantic precision
- operational compression
- continuity coherence
- instability-state consistency

rather than:

- recommendation richness
- pathway differentiation
- narrative plan generation

# DECISION 012

## Decision

Continuity mutation must be governed by deterministic authority rules before implementation.

Any live case change that may affect progression state, operational prioritization, reassessment pressure, stale-state validity, caregiver feasibility, environmental limitation, or detail module usefulness must be treated as a continuity mutation.

Continuity mutations must not be handled as simple UI edits or isolated regeneration events.

---

## Rationale

The platform is now moving from single-plan generation toward longitudinal operational continuity.

As cases evolve over time, changes may affect:
- current operational emphasis
- progression state
- continuity interpretation
- reassessment pressure
- dominant instability drivers
- stale-state flags
- detail module validity
- historical snapshot meaning

Without mutation governance, the system risks creating multiple competing sources of truth across:
- live case state
- generated output
- deterministic interpretation
- AI synthesis
- stale flags
- detail modules
- historical generations

Continuity mutation governance ensures that every meaningful case change has a defined consequence.

---

## Governance Rules

Continuity mutations must follow these rules:

1. Structured case changes may make reasoning stale.
2. Operational meaning changes may make the generated plan stale.
3. Detail modules become stale when the core plan or continuity interpretation changes.
4. Deterministic continuity interpretation must be recalculated through governed regeneration.
5. AI may synthesize updated operational meaning but must not independently decide continuity authority.
6. Historical generations remain immutable unless intentionally restored.
7. Restore is a full snapshot restoration, not a partial continuity merge.
8. Reassessment workflows must update continuity state through deterministic logic, not through pathway reselection.

---

## Tradeoff

This adds architectural discipline before feature expansion.

It may slow immediate implementation of reassessment workflows, but it prevents:
- continuity drift
- stale-state confusion
- AI authority leakage
- historical snapshot corruption
- hidden conflicts between live and historical case states

---

## Status

ACTIVE

---

DECISION 014
Decision

The platform will pause deeper continuity architecture expansion after foundational continuity consolidation and shift primary focus toward UX compression, operational clarity, and clinician usability stabilization.

The current continuity foundation is considered sufficient for near-term reassessment workflow evolution.

Further architecture work should become:

incremental
operationally justified
UX-constrained

rather than:

theoretically expansive
recursively abstracted
infrastructure-driven
Rationale

The platform has now established:

deterministic continuity authority
continuity mutation governance
canonical continuity state infrastructure
reassessment-sensitive continuity interpretation
continuity-safe regeneration workflows
stale-state governance
operational prioritization architecture

At this stage, the primary product risk is no longer insufficient continuity infrastructure.

The primary risk is now:

clinician cognitive overload
operational complexity leakage
reduced workflow clarity
excessive architectural visibility within UX
increasing onboarding friction

The product’s strategic value is not:

deeper architectural sophistication

The value is:

operational cognition compression
continuity readability
reassessment clarity
low-friction clinical usability
continuity-aware workflow support
Strategic Direction

Future product evolution should prioritize:

operational scanability
continuity readability
progressive disclosure
reassessment comprehension
workflow compression
clinician confidence
low-friction continuity interpretation
operational clarity
longitudinal usability stability

Future architecture work should be:

incremental
implementation-driven
operationally necessary

rather than:

speculative
recursively abstracted
infrastructure-expansive
Deferred Transitional Areas

The following areas remain intentionally transitional:

new-case progression assembly
API-owned continuity interpretation attachment
detail-module continuity dependency standardization

These areas are considered acceptable transitional debt until:

operationally necessary
UX-validated
reassessment workflows mature further
Tradeoff

This decision intentionally slows deeper continuity consolidation.

However, it protects against:

architectural recursion
continuity overengineering
UX degradation
workflow complexity escalation
clinician usability decline

This creates healthier balance between:

architectural sophistication
operational usability
clinician cognition
workflow clarity
Status

ACTIVE

# DECISION 012

## Decision

The primary longitudinal unit of progress will be occupational performance evolution, not visit history.

The platform will prioritize tracking:

- occupational performance
- assistance level change
- milestone attainment
- barrier evolution
- operational priority transitions

rather than:

- visit count
- treatment count
- narrative treatment history

---

## Rationale

Clinical progression occurs because:

- barriers are resolved
- new barriers emerge
- operational priorities shift
- occupational performance improves

The most meaningful longitudinal questions are:

- What changed?
- Why did it change?
- What barrier was resolved?
- What barrier became dominant?
- What milestone was achieved?

These questions cannot be answered reliably through visit history alone.

---

## Tradeoff

This increases the importance of structured follow-up data capture and reduces reliance on narrative documentation as the source of continuity interpretation.

However, it creates substantially stronger alignment with actual OT clinical reasoning and progression workflows.

---

## Status

# DECISION 013

## Decision

The Command Center is the primary clinician workflow surface.

The primary purpose of opening a patient case is clinician orientation and clinical navigation, not evaluation review, documentation review, or treatment-plan review.

---

## Rationale

Longitudinal validation demonstrated that the system can:

* preserve continuity
* mutate interpretation appropriately
* maintain clinical context
* update attention over time
* update operational focus over time

The remaining challenge is not information generation.

The remaining challenge is helping clinicians rapidly consume the information already available.

Clinical review indicates that therapists returning to a case are attempting to answer:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Does that change today's treatment approach?
4. What requires attention today?
5. What should I do next?

The Command Center should prioritize answering these questions immediately upon case open.

---

## Implications

The Command Center becomes the primary workflow surface.

Information should be prioritized according to clinical orientation value rather than historical importance.

Priority hierarchy:

1. Case Status
2. Since Last Visit
3. Attention Required
4. Current Focus
5. Next Action

---

## Secondary Information

The following remain important but are supporting information:

* evaluation details
* intake details
* diagnosis context
* historical progression records
* generated reasoning
* longitudinal history
* environmental details
* caregiver details

These should support orientation rather than drive it.

---

## Non-Goals

This decision does not:

* redesign reasoning architecture
* redesign continuity architecture
* redesign progression architecture
* redesign reassessment architecture
* redesign operational prioritization architecture

These systems remain authoritative and stable.

The objective is improving clinician consumption of existing intelligence.

---

## Success Measure

A clinician should be able to open a case and understand the patient's current clinical reality without reconstructing prior visits from memory.

The software should carry the continuity burden.

The clinician should not.


ACTIVE

## Next Phase

Next work should focus on:

### Progression-State UX Integration

Primary goals:

- clarify the relationship between progression condition and operational instability
- visually communicate why operational emphasis changes over time
- strengthen continuity-state orientation
- support reassessment-sensitive prioritization evolution
- improve continuity-aware workflow readability

This phase should prioritize:

- semantic continuity
- operational scanability
- instability-state visibility
- reassessment-trigger clarity
- continuity-aware weighting interpretation

Avoid:

- dashboard-heavy longitudinal systems
- predictive recovery workflows
- timeline-centric analytics
- autonomous progression planning
- generalized EHR visualization complexity

---

## Status

ACTIVE

# Decision — Deterministic Continuity Interpretation Layer

## Status
APPROVED

---

## Decision

The platform will introduce a deterministic continuity interpretation layer positioned between:

- progression interpretation
- operational prioritization
- longitudinal reassessment workflows

The continuity interpretation layer is responsible for:

- operational continuity condition interpretation
- reassessment pressure classification
- operational instability surfacing
- continuity-sensitive workflow interpretation
- operational drift interpretation

The continuity layer is intentionally:

- deterministic
- explainable
- continuity-oriented
- operationally compressed
- longitudinally extensible

The continuity layer is intentionally NOT:

- predictive analytics
- autonomous longitudinal reasoning
- trend forecasting
- dashboard analytics
- AI-generated progression scoring
- patient trajectory prediction

---

## Architectural Structure

The authoritative reasoning hierarchy is now:

Structured Case Inputs
→ Deterministic Clinical Decision Engine
→ Progression Interpretation
→ Continuity Interpretation
→ AI Operational Synthesis
→ UI Rendering

Continuity interpretation is generated in:

src/lib/buildContinuityInterpretation.ts

and injected into generated plan output through:

src/app/api/generate-plan/route.ts

---

## UI Direction

Continuity interpretation is surfaced through a lightweight:

Continuity Status

workflow section rather than:

- pathway selection systems
- longitudinal dashboards
- trend visualization systems
- progression scoring displays

Current surfaced continuity concepts include:

- Current Continuity Condition
- Operational Change Classification
- Reassessment Pressure
- Dominant Instability Drivers

The UX direction prioritizes:

- operational readability
- cognitive compression
- reassessment awareness
- continuity-sensitive workflow orientation

---

## Rationale

The previous multi-pathway architecture increasingly behaved like:

- operational state interpretation
- continuity-sensitive prioritization
- reassessment-aware workflow weighting

rather than:

- truly competing treatment plans

The continuity interpretation layer formalizes this architectural evolution while preserving:

- deterministic authority
- workflow stability
- historical generation compatibility
- continuity-safe progression expansion

---

## Important Constraints

The continuity interpretation layer must remain:

- deterministic
- operational
- explainable
- longitudinally extensible

The system should avoid introducing:

- speculative AI continuity behavior
- hidden reasoning mutation
- opaque scoring systems
- trajectory forecasting
- clinician replacement behavior