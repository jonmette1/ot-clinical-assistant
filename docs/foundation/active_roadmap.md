# OT Clinical Reasoning Assistant — Active Roadmap

Last updated: 2026-06-03

---

## Roadmap Status Summary

The project has moved from architecture stabilization into workflow validation and adoption readiness.

Completed foundations now include:

* deterministic clinical reasoning authority
* continuity architecture
* progression architecture
* operational prioritization architecture
* reassessment architecture
* mutation governance
* patient-centric navigation
* Command Center / Reference Workspace separation
* Patient Entry and Quick Preview primitives
* Intake Fidelity Phase 1A
* Clinical Language Compression Phase 1
* Reference Workspace cleanup
* Clinical Impact Summary
* Clinical Status Explainability
* Clinical Impact CTA
* Treatment Focus refinement
* Next Action Refresh

The current limiting question is no longer whether the platform has enough reasoning architecture. The current limiting question is whether clinicians can trust, update, and operationalize the longitudinal workflow inside real visit preparation.

---

## Current Highest-Priority Initiative

### Snapshot Awareness

Status:

ACTIVE

Objective:

Help clinicians understand whether they are looking at the current operational patient state or a historical/generated snapshot, and whether recent updates have changed what should guide treatment today.

Purpose:

Strengthen clinician trust and workflow safety by making live-state versus snapshot-state meaning obvious without exposing internal continuity architecture.

Why now:

* The Command Center now carries longitudinal change through Clinical Impact Summary, status explainability, refreshed Treatment Focus, and refreshed Next Action behavior.
* Historical snapshots remain clinically useful, but their meaning must not be confused with current operational truth.
* As longitudinal updates accumulate, adoption risk shifts from reasoning sufficiency to state awareness, trust, and workflow integration.

Primary implementation focus:

1. Clarify live Command Center state versus historical snapshot state.
2. Make snapshot recency and restored/generated context easier to understand.
3. Preserve Historical Snapshots as Reference Workspace support, not primary workflow content.
4. Avoid adding dashboard-style timelines or exposing continuity internals.
5. Preserve existing database schema, API contracts, and generated-output structures unless explicitly approved.

Implementation guardrails:

* Use clinician-facing labels and workflow language.
* Prefer hierarchy, microcopy, state labels, and progressive disclosure over new systems.
* Do not redesign continuity, progression, reassessment, or operational prioritization architecture.
* Do not turn historical snapshots into editable competing current states.
* Keep Current Operational State / Current Focus visually authoritative.

---

## Ranked Current Priorities

1. **Snapshot Awareness** — clarify current-state versus historical-snapshot meaning now that longitudinal delta and refreshed next-action behavior are implemented.
2. **Intake Fidelity Validation** — validate that short structured intake and contradiction guardrails improve downstream reasoning without adding unacceptable clinician friction.
3. **EMR / Workflow Integration Research** — investigate how the workflow fits visit preparation, documentation, and update routines in real home health environments.
4. **Clinician Testing** — test Command Center orientation, trust, and actionability with practicing clinicians.
5. **Intake Fidelity Phase 1B Implementation** — continue contradiction guardrails once validation confirms the right validation thresholds and wording.

---

## Recently Completed Milestones

### Orientation & Cognitive Compression

Completed:

* Command Center hierarchy stabilization.
* Clinical Language Compression Phase 1.
* Current Focus / Treatment Focus readability refinement.
* Next Action Refresh.
* Patient Entry Phase 1 and Phase 2A Quick Preview primitives.

Outcome:

The product more directly answers what matters now, what changed, and what should happen next without requiring the clinician to reconstruct the case from history.

### Workflow Continuity Infrastructure

Completed:

* continuity architecture
* canonical continuity state
* live state versus immutable historical snapshot governance
* longitudinal event handling
* operational prioritization refresh from progression events
* Reference Workspace cleanup and boundary clarification

Outcome:

The platform supports continuity-aware operational guidance while keeping historical snapshots subordinate to current workflow orientation.

### Progression Foundations

Completed:

* deterministic progression architecture
* progression check data model
* current longitudinal state updates
* clinical attention state
* reassessment-sensitive progression interpretation

Outcome:

The platform can record structured follow-up updates and translate them into current clinical orientation, treatment focus, and attention signals.

### Longitudinal Clinical Delta Experience

Completed:

* Clinical Impact Summary
* Clinical Status Explainability
* Clinical Impact CTA
* Treatment Focus refinement
* Next Action Refresh

Outcome:

Progression updates now produce a clinician-facing delta experience: what changed, what was confirmed, why it matters, and which next action should guide the visit.

---

## Intake Fidelity Normalization

Status:

VALIDATION / NEXT IMPLEMENTATION CANDIDATE

Completed:

* Intake Fidelity Audit
* Intake Fidelity Normalization Specification
* Intake Fidelity Phase 1A
* High-signal intake hierarchy
* Minimum viable intake validation
* Clinical Decision Inputs removal from the visible intake experience

Pending:

* contradiction classification
* blocking validation
* warning validation
* caregiver consistency validation
* environmental consistency validation
* transfer consistency validation

Current guidance:

Continue Intake Fidelity Phase 1B after Snapshot Awareness is addressed or in parallel only when implementation risk is low. The guardrails should remain clinician-facing and should not over-validate legitimate clinical complexity.

---

## Current Product Identity

The system is no longer attempting to answer:

> "Which treatment pathway should the clinician choose?"

The system is no longer primarily attempting to answer:

> "What plan should be generated?"

The system is now attempting to answer:

> "What changed, what requires attention, and what should happen next?"

This framing governs:

* progression interpretation
* continuity interpretation
* clinical attention
* operational prioritization
* reassessment escalation
* Command Center design
* Reference Workspace boundaries

---

## Current Architectural Model

Barrier Evolution
↓
Functional Change
↓
Milestone Achievement
↓
Clinical Attention
↓
Operational Emphasis
↓
Treatment Focus
↓
Next Action

The architecture should be consumed by workflow surfaces, not exposed as system status.

---

## Explicit Non-Goals

Do not:

* redesign reasoning architecture
* redesign progression architecture
* redesign continuity architecture
* redesign reassessment architecture
* redesign operational prioritization
* introduce route, API, persistence, or generated-output changes unless explicitly approved
* create dashboard-heavy longitudinal analytics
* reintroduce pathway selection as the primary workflow
* make historical snapshots compete with current operational truth

---

## Deferred / Parking Lot

The following concepts remain intentionally deferred:

* predictive analytics
* autonomous recommendation systems
* timeline-heavy progression systems
* large longitudinal dashboards
* adaptive learning systems
* multi-user collaboration systems
* advanced reporting systems
* automated discharge prediction
* cross-patient pattern intelligence

These may be revisited later only if they support workflow clarity, clinician trust, and operational usefulness without increasing cognitive burden, architectural instability, or workflow complexity.

---

## Roadmap Governance Rule

Before adding workspace functionality, ask whether it helps the clinician determine:

* what changed?
* what matters?
* what requires attention?
* what should happen next?
* am I viewing current operational truth or historical/reference context?

If not, simplify it, defer it, or reject it.
