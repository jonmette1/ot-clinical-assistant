# OT Clinical Assistant — Project Snapshot

Last updated: 2026-06-03

---

## Product Purpose

The OT Clinical Assistant is a clinical workflow tool for adult rehabilitation and home health occupational therapy. It helps clinicians convert fragmented evaluation, caregiver, environmental, and follow-up information into continuity-aware treatment prioritization.

The product is intended to feel like a clinician command center, not an AI-generated report. Its core job is to help a therapist rapidly answer:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

---

## Current Product State

### Maturity Level

The project is past architecture discovery and is in workflow validation / adoption-readiness maturation.

Major architecture is stable. Current work should emphasize clinician orientation, state awareness, intake fidelity, trust, and real-world workflow fit rather than new reasoning systems.

### What Works Today

The implemented product supports:

* patient entry and lightweight Quick Preview
* a patient Command Center for current orientation
* a Reference Workspace for context, review, snapshots, generated outputs, and deeper investigation
* deterministic clinical reasoning inputs and operational prioritization
* generated plan synthesis constrained by deterministic reasoning
* progression-check capture
* longitudinal event creation
* current longitudinal state refresh
* clinical attention state
* Clinical Impact Summary after progression updates
* Clinical Status Explainability
* Clinical Impact CTA behavior
* refined Treatment Focus presentation
* refreshed Next Action behavior that accounts for newer longitudinal meaning

### What Is Validated

Validated directionally:

* deterministic reasoning should remain authoritative while AI supports synthesis and communication
* clinicians need cognitive compression more than narrative richness
* environmental barriers and caregiver feasibility are core to treatment prioritization
* current operational state should be more prominent than historical or configuration content
* Command Center / Reference Workspace separation fits the patient-centric workflow direction
* language compression improves clinician trust without changing reasoning architecture
* longitudinal delta support is necessary for continuity-aware use

### What Remains Uncertain

Still needs validation:

* whether clinicians tolerate the current structured intake burden in real workflows
* how much contradiction validation is helpful before it feels obstructive
* whether longitudinal value justifies added update behavior during busy home health routines
* whether snapshot/live-state awareness is sufficient to prevent confusion
* how the product should integrate with EMR, documentation, and visit preparation workflows
* whether clinical trust holds across varied patient complexity and clinician experience levels

---

## Architecture Summary

The system uses deterministic reasoning as the clinical authority layer and AI-generated text as a constrained synthesis layer.

High-level flow:

Structured Intake / Case Data
→ Deterministic Clinical Decision Inputs
→ Clinical Decision Engine
→ Progression and Continuity Interpretation
→ Operational Prioritization
→ Generated Plan Synthesis
→ Command Center / Reference Workspace
→ Progression Check Updates
→ Longitudinal Event + Current State Refresh

Key concepts:

* **Deterministic reasoning** establishes stable clinical signals, priorities, and constraints.
* **Generated plan** organizes and communicates the deterministic outputs; it is not the source of clinical authority.
* **Longitudinal workflow** carries current patient reality forward across visits.
* **Operational prioritization** identifies what treatment should focus on right now.
* **Progression check workflow** captures follow-up changes and refreshes clinical attention, treatment focus, and next action.
* **Command Center** is the primary orientation surface for current clinical reality.
* **Reference Workspace** is for deeper review, historical snapshots, generated outputs, and supporting context.

The architecture should remain mostly invisible to clinicians. Clinicians should see clear status, change, attention, focus, and next action rather than internal continuity terminology.

---

## Major Completed Milestones

### Orientation & Cognitive Compression

Completed:

* Command Center hierarchy stabilization
* Clinical Language Compression Phase 1
* Patient Entry Phase 1
* Patient Entry Quick Preview primitives
* Reference Workspace boundary clarification
* Treatment Focus refinement
* Next Action Refresh

### Workflow Continuity Infrastructure

Completed:

* continuity architecture
* canonical continuity state
* live current-state authority
* immutable historical snapshot governance
* mutation governance
* longitudinal event handling
* operational prioritization refresh after progression events

### Progression Foundations

Completed:

* deterministic progression model
* progression check data model
* progression check UX architecture
* current longitudinal state refresh
* clinical attention model
* reassessment-sensitive progression interpretation

### Longitudinal Clinical Delta Experience

Completed:

* Clinical Impact Summary
* Clinical Status Explainability
* Clinical Impact CTA
* Treatment Focus refinement
* Next Action Refresh

These milestones make the Command Center capable of showing what changed, what was confirmed, why it matters, and what should guide today’s visit after a progression update.

---

## Current Priorities

1. **Snapshot Awareness** — clarify when the clinician is viewing current operational truth versus historical/generated snapshot context.
2. **Intake Fidelity Validation** — validate high-signal intake and contradiction guardrails without adding excessive friction.
3. **EMR / Workflow Integration Research** — understand fit with visit preparation, documentation, and home health update routines.
4. **Clinician Testing** — test Command Center orientation, trust, state awareness, and next-action usability with practicing clinicians.
5. **Intake Fidelity Phase 1B** — implement contradiction guardrails once validation confirms thresholds and clinician-facing wording.

---

## Known Product Risks

### Clinical Risks

* Reasoning may appear more certain than the underlying intake supports.
* Contradiction guardrails could block legitimate clinical nuance if over-designed.
* Snapshot confusion could lead clinicians to rely on outdated generated context.
* Next Action language could be over-followed unless it remains framed as clinician decision support.

### Workflow Risks

* Structured intake and progression updates may be too much friction for real home health cadence.
* Clinicians may not consistently update progression data unless the payoff is immediate.
* Reference Workspace content could drift back into competing with Command Center orientation.
* Snapshot restoration/review workflows may need clearer boundaries as historical use increases.

### Adoption Risks

* EMR integration and documentation workflow fit may matter more than reasoning quality.
* Clinicians may distrust the product if state changes are not explained in simple clinical language.
* Buyers or auditors may need clearer evidence that the system supports, rather than replaces, clinician judgment.
* Different practice settings may require different tolerance for structured updates.

### Technical Risks

* Legacy pathway-shaped compatibility fields remain semantic debt.
* Generated plan snapshots and live current state must stay clearly separated.
* Longitudinal events can become harder to reason about as volume grows.
* Future schema/API changes should be avoided until workflow validation justifies them.

---

## Current Working Hypotheses

* Clinicians will tolerate short structured intake if it directly improves orientation and next-action clarity.
* Longitudinal value may justify additional update behavior if each update produces immediate clinical delta feedback.
* Workflow integration may be a larger adoption risk than reasoning quality.
* Snapshot/live-state clarity is necessary before longitudinal history becomes clinically safe at scale.
* Cognitive compression and clinician-facing explanation can improve trust without expanding reasoning architecture.
* Caregiver feasibility and environmental barriers remain differentiators for adult rehab and home health use.

---

## Recent Decisions

Recent sprint decisions now reflected in the product direction:

* Clinical Impact Summary is the preferred post-update delta pattern for explaining what changed and what was confirmed.
* Clinical Status should be explainable in clinician-facing terms without exposing internal continuity classifications.
* The Clinical Impact CTA should route clinician attention to the delta summary after a progression update.
* Treatment Focus should remain current-operational and concise, not a verbose plan narrative.
* Next Action should be refreshed from current longitudinal meaning and should suppress stale generated-plan actions when newer clinical meaning is active.
* Historical snapshots remain reference/continuity tools and should not compete with live Command Center authority.

---

## Recommended Next Implementation

**Snapshot Awareness** is the single highest-priority next implementation item.

Why:

The product now has meaningful longitudinal delta behavior. That increases the importance of helping clinicians understand which state is current, which content is historical, and whether a snapshot is being viewed only for reference. Snapshot Awareness directly supports clinical safety, trust, and adoption without requiring new reasoning architecture.

Recommended implementation shape:

* add clearer live-state versus snapshot-state labeling
* improve snapshot recency/status microcopy
* make historical snapshot context subordinate but unmistakable
* avoid timeline dashboards or new continuity systems
* preserve current data model and API contracts

---

## Quick Onboarding

Read in this order:

1. `AGENTS.md`
2. `docs/PROJECT_SNAPSHOT.md`
3. `docs/CONSULTANT_HANDOFF.md`
4. `docs/PROJECT_STATUS_AND_DIRECTION.md`
5. `docs/foundation/active_roadmap.md`
6. `docs/foundation/decision_log.md`
7. `docs/architecture/system_architecture.md`
8. `docs/UX/Visual_Design_Principles.md`
9. `docs/UX/Command_Center_UX_Normalization_Roadmap.md`
