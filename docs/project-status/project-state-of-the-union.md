# Project State of the Union

Last updated: 2026-06-10

## Executive Summary

The OT Clinical Assistant is a **functional MVP** in adoption-readiness maturation. It began as a tool for generating OT recommendations from an evaluation and has become a continuity-aware clinical cognition layer: it maintains structured clinical meaning across intake, visit preparation, Patient Status updates, Visit Briefing, and Visit History so clinicians do not have to repeatedly reconstruct the case.

The product has a stable deterministic reasoning, progression, continuity, reassessment, and operational-prioritization foundation. Recent implementation closes important stale-state gaps by reconciling reassessment triggers, active barriers, and whether a barrier still constrains the current target activity. The primary remaining risk is not missing core architecture; it is whether real clinicians can quickly orient, verify, correct, trust, and reuse the maintained conclusions in real workflows.

Internal workflow review, implementation exercises, screenshots, and persona-based simulation support the direction but do **not** establish clinical accuracy, measured time savings, adoption, or willingness to pay. The next phase should remain narrow: strengthen the longitudinal clinical story, provenance and correction controls, reusable workflow outputs, and real-clinician testing before broad integration or discipline expansion.

## Original Product Vision

The product started as an OT Clinical Assistant that transformed structured evaluation data into treatment-planning guidance. The early center of gravity was a generated plan: identify barriers, apply clinical lenses, suggest strategies, and provide a usable starting point for adult rehabilitation and home health OT.

That foundation established several durable constraints:

- environmental and caregiver realities must shape recommendations;
- deterministic logic must remain authoritative;
- AI may organize and communicate supported reasoning but may not own it; and
- the product supports, rather than replaces, skilled clinical judgment.

The limitation of the original frame was that it treated generation as the main value event. Clinical work is longitudinal: clinicians must repeatedly recover what is true, what changed, and what the prior plan now means.

## Current Product Vision

The product is now a **clinical cognition and clinical continuity system** for OT workflows. Its purpose is to generate, maintain, reconcile, and communicate clinical understanding over time.

The clinician-facing product is a command center, not an AI report. It should compress the current state into a small number of retained concepts, preserve the visit-to-visit story, identify when prior conclusions are no longer current, and help the clinician verify rather than reconstruct.

The current experience centers on:

- mobile and desktop pre-visit orientation;
- Current Reality, Attention Required, and Next Action;
- a progression-aware Current Focus;
- Patient Status updates that refresh longitudinal state;
- Visit Briefing and Since Last Visit compression;
- Visit History as immutable visit context;
- coherent recommendation evolution; and
- maintained clinical conclusions that can eventually support multiple workflows.

## Current Best Positioning

### Short positioning statement

**A clinical cognition and continuity layer that helps rehabilitation clinicians understand what changed, what matters now, and what to do next without reconstructing the patient story.**

### Expanded positioning statement

The OT Clinical Assistant converts structured evaluation data, visit updates, caregiver and environmental context, and prior clinical conclusions into a maintained, continuity-aware view of the patient. Deterministic reasoning governs clinical state and prioritization; constrained AI supports readable synthesis. The platform helps clinicians orient before a visit, recognize meaningful change, verify the evidence behind current conclusions, and reuse those conclusions across downstream communication and review workflows.

### What the platform is

- A clinician orientation and cognitive-compression layer.
- Clinical continuity infrastructure for maintained meaning across visits.
- A deterministic clinical attention and operational-prioritization system.
- A visit-preparation and longitudinal reconciliation workflow.
- A potential source of reusable, clinician-governed clinical conclusions.

### What the platform is not

- An EMR, billing system, or system of record.
- A documentation platform first.
- An autonomous clinical decision maker.
- A predictive recovery or trajectory model.
- An AI-owned reasoning engine.
- A replacement for therapist verification, correction, or judgment.

## Core Product Thesis

A **clinical reconstruction event** occurs whenever a clinician must reassemble the same clinical meaning from evaluation fields, prior notes, caregiver reports, environmental facts, and recent changes before acting. These events recur during patient orientation, treatment planning, documentation, reassessment, physician communication, care coordination, and QA review.

The product thesis is that the system should maintain the conclusion, not merely store the facts. A maintained clinical conclusion is a current, evidence-linked interpretation—such as the dominant treatment focus, an active safety concern, or a recommended next action—that can be reconciled when new evidence arrives and reused across appropriate workflows.

The desired shift is:

```text
Repeatedly search facts and reconstruct meaning
→ maintain current clinical meaning
→ reconcile it when the patient changes
→ present it at the point of work
→ verify or correct it
→ reuse it without treating it as autonomous truth
```

This is larger than faster plan generation. It is continuity of clinical understanding under clinician governance.

## Major Discoveries

1. **Clinicians repeatedly reconstruct clinical meaning.** The recurring burden is not simply finding data; it is recovering the interpretation that connects the data to treatment.
2. **The product's value moved from generation to maintained understanding.** A one-time generated plan is less valuable than conclusions that remain coherent across updates.
3. **Mobile pre-visit orientation is a primary use case.** The highest-value moment is often immediately before a visit, when time, screen space, and attention are constrained.
4. **Case Preview is stronger than expected.** The compact patient-selection preview can surface enough Current Focus, Attention Required, Since Last Visit, and Next Action context to begin orientation before opening the workspace.
5. **Visit Briefing needs hierarchy and compression.** More content does not improve orientation; the interface must strongly rank current reality, required attention, and immediate action.
6. **Current Reality / Attention Required / Next Action are the primary retained concepts.** These concepts survive compression and map directly to the clinician's orientation questions. Current Focus supports Current Reality as a concise trajectory-and-treatment statement.
7. **Trust comes from coherent state transitions, not AI generation.** Recommendations become credible when clinicians can see that new evidence changed—or intentionally did not change—the maintained conclusion.
8. **Progression readiness must invite review, not advance treatment automatically.** Positive evidence can indicate readiness for clinician evaluation without authorizing an autonomous state transition.
9. **Continuity reconciliation became necessary once progression improved.** Better progression signals exposed stale triggers and barriers that could continue dominating recommendations after the limiting condition changed.
10. **Barrier existence and activity constraint are different.** A condition may remain clinically present but no longer block the current target activity; this distinction is now handled explicitly.
11. **Maintained clinical conclusions can be reused across workflows.** The same governed conclusion may support briefing, reassessment, physician communication, care conference preparation, documentation support, and QA review.
12. **Clinical conclusion reuse may be the larger opportunity.** The platform may create more value by reducing repeated reconstruction across workflows than by optimizing any single output.

## Major Product Decisions

- **Deterministic reasoning remains authoritative.** Structured inputs and deterministic builders own clinical state, prioritization, progression, reconciliation, and recommendation eligibility.
- **AI synthesis is constrained.** AI may compress, organize, and explain supported conclusions; it may not invent or override authoritative reasoning.
- **There is no autonomous advancement.** Progression readiness supports clinician review and evaluation, not automatic progression.
- **Historical snapshots remain immutable.** Visit History preserves what was represented at that time and does not silently inherit live-state changes.
- **Live current state is authoritative.** Historical context may inform review but must not compete with the current operational truth.
- **Progression readiness is review-oriented, not advancement-oriented.** `ready_for_evaluation` means evaluate the transition; it does not mean the transition has occurred.
- **Continuity reconciliation is runtime/current-state focused.** It refreshes which prior conclusions may influence current reasoning without rewriting history or requiring a new persistence model.
- **Activity Constraint Reconciliation distinguishes barrier existence from activity constraint.** A barrier can be constraining, monitor-only, or not currently constraining for a named target activity.
- **No separate Attention Relevance layer should be created at this time.** Existing Clinical Attention and Operational Prioritization authorities should consume reconciled current evidence rather than being duplicated.
- **Patient-centric navigation is settled.** Command Center is the primary orientation surface; Patient History is supporting review context.
- **Current Operational State remains the primary workspace output.** Progression, continuity, history, and configuration are subordinate to what treatment should focus on now.

## Current System Capabilities

| Capability | Current implementation reality |
| --- | --- |
| Case Preview | Patient-selection preview derives compact Current Focus, Attention Required, Since Last Visit, and Next Action signals from the same current-state sources used by the workspace. |
| Visit Briefing | Command Center presents Current Reality, Attention Required, Next Action, Patient Status, progression context, and recent clinical impact in a mobile-conscious hierarchy. |
| Patient Status update workflow | Progression Check captures visit updates, updates longitudinal state, and refreshes the Visit Briefing and Clinical Impact presentation. |
| Visit History / historical snapshots | Saved clinical snapshots are visit-oriented, reviewable, restorable through controlled flows, and presented as read-only historical context. |
| Progression readiness | Deterministic readiness classifies the case as `not_ready`, `emerging`, or `ready_for_evaluation`; negative or reassessment signals prevent readiness. |
| Reassessment trigger reconciliation | Prior operational and progression triggers are retained, monitored, or cleared based on current urgent signals, positive progression, and readiness. |
| Active barrier reconciliation | Barriers are classified as active, monitoring, or resolved; current safety, clinician-selected limiting factors, and unresolved hazards retain authority. |
| Activity constraint reconciliation | Barrier-to-target-activity relevance is classified separately from barrier existence and controls whether the barrier remains eligible for blocking weight. |
| Current Focus progression awareness | Current Focus wording incorporates trajectory, readiness, reconciled barriers, and activity relevance while remaining concise. |
| Next Action recommendation evolution | Next Action prioritizes current safety and regression, then appropriate reassessment or progression evaluation, while suppressing stale barrier-led actions. |
| Patient preview consistency | Shared builders align Case Preview with Visit Briefing so the compact entry point does not tell a different clinical story. |
| Deterministic clinical decision foundation | Structured inputs normalize goals, barriers, support, safety, environment, and clinical lenses into governed strategy selection and reasoning summaries. |
| Continuity interpretation | Deterministic continuity condition, change, reassessment pressure, instability, and drift concepts support downstream synthesis, though internal terminology should remain hidden from the primary UX. |

## Current Product Maturity

**Assessment: functional MVP.**

The product is beyond concept and prototype because the end-to-end workflow exists: structured intake, deterministic guidance, patient selection and preview, Command Center Visit Briefing, Patient Status updates, longitudinal progression, reconciliation, Visit History, and historical snapshot safeguards.

It is not yet a clinician-ready MVP because the repository does not contain evidence of real-clinician usability testing, clinical accuracy validation, measured workflow impact, correction/provenance usability, or reliable mobile performance on real devices. It is not pilot-ready because pilot operations, support, governance, instrumentation, and integration assumptions remain unproven.

## Validated Hypotheses

Here, **validated** means confirmed by implementation behavior, deterministic tests, or repository inspection—not validated clinical effectiveness.

- Deterministic clinical reasoning can govern structured recommendation inputs while AI remains downstream and constrained.
- Longitudinal updates can refresh progression-aware Current Focus and Next Action without autonomous advancement.
- Reassessment triggers and barriers can be reconciled in the live runtime state without changing database schema or rewriting historical snapshots.
- Barrier existence can be separated from barrier-to-activity constraint eligibility.
- Current safety events and regression can override positive progression signals.
- Patient preview and Visit Briefing can use shared derivation logic to preserve message consistency.
- Historical snapshots can remain immutable and visibly subordinate to the live case.

## Strongly Supported Hypotheses

These claims are supported by internal workflow analysis, screenshots, persona-style reasoning exercises, and implementation iteration, but they are not yet real-world validated.

- Mobile pre-visit orientation is a high-value entry point.
- Case Preview can reduce the effort required to choose and orient to the next patient.
- Visit Briefing performs better when organized around Current Reality, Attention Required, and Next Action rather than equally weighted cards.
- Coherent recommendation evolution improves orientation trust more than generative sophistication.
- Since Last Visit and Clinical Impact summaries can reduce longitudinal reconstruction effort.
- Targeted verification of a maintained conclusion is less burdensome than reconstructing the conclusion from raw sources.
- Maintained clinical conclusions can support multiple downstream workflows with less duplication.
- A visit-based clinical story will be more useful than software-version-oriented history.

## Unproven Hypotheses

- Real clinician adoption and sustained use.
- Willingness to pay and the buyer with budget authority.
- Actual measured time savings or reduction in clinical reconstruction events.
- Clinical accuracy and safety across representative real-world cases.
- Real-world EMR integration value relative to integration cost and governance burden.
- Reliability across many diagnoses, target activities, home environments, and caregiver conditions.
- Real-world documentation workflow integration and whether supported outputs reduce burden without creating drift.
- Whether conclusion reuse creates enough value across physician, care conference, QA, and documentation workflows to justify dedicated surfaces.
- Whether the current correction and provenance model is sufficient for clinician trust.

## Current Risks

- **Over-reliance on simulated personas.** Internal simulations can expose workflow logic but cannot establish adoption, safety, or clinical validity.
- **Validation evidence is incompletely captured.** Persona-simulation directories currently contain placeholders rather than a durable experiment corpus, reducing traceability.
- **Free-text matching limitations.** Current deterministic reconciliation relies partly on normalized text and phrase matching, which may fail across varied clinical language.
- **Insufficient structured activity evidence.** Assistance, supervision, safety, consistency, setup, and activity-specific performance are not always represented with enough structure to support confident constraint transitions.
- **Mobile usability still requires real-device testing.** Code and screenshots support the direction but do not prove field usability, touch ergonomics, readability, or performance.
- **No real clinician validation yet.** Product usefulness and trust remain inferred rather than observed in representative practice.
- **Possible documentation drift.** Multiple historical strategy and architecture documents can mislead a new agent if current status and authority are not clear.
- **Complexity growth.** Progression, continuity, reconciliation, attention, prioritization, and presentation can become difficult to reason about if ownership boundaries erode.
- **Explainability/provenance is incomplete.** Clinician trust still requires visible evidence references, source timing, and a clear correction path.
- **Stale-state risk remains broader than implemented collections.** Trigger, barrier, and activity-constraint reconciliation do not guarantee every downstream narrative or generated module has refreshed correctly.
- **Reuse can amplify errors.** A maintained conclusion reused across workflows must remain correctable and traceable or one error may propagate widely.

## Recommended Next Phase

Run a focused **trust-and-reuse validation phase** for the OT MVP. Do not add a new reasoning architecture.

1. **Make Visit History tell the clinical story.** Improve visit-to-visit delta compression and show how Current Focus, Attention Required, and Next Action evolved without turning history into analytics.
2. **Add conclusion provenance and evidence references.** Let clinicians see which current observations, structured fields, and visit updates support Current Focus and Next Action.
3. **Design a clinician correction/edit workflow.** Support correction of evidence and maintained conclusions through existing authority boundaries; record who changed what and why without mutating prior snapshots.
4. **Validate output coherence.** Test that Case Preview, Visit Briefing, Clinical Impact, Visit History, and reusable outputs express the same current state.
5. **Prototype limited workflow reuse surfaces.** Begin with low-risk drafts such as reassessment summary, physician update, or care conference summary, always clinician-reviewed and evidence-linked.
6. **Conduct real-clinician testing.** Observe pre-visit orientation, Patient Status updating, targeted verification, correction behavior, and willingness to rely on the longitudinal story.
7. **Measure reconstruction reduction.** Instrument Time to Clinical Orientation, sources consulted, verification behavior, and Clinical Reconstruction Events Eliminated rather than claiming time savings in advance.

The phase is complete when clinicians can rapidly orient, identify why the system changed, correct it when needed, and safely reuse a conclusion in at least one adjacent workflow.

## What Not To Do Next

Unless new evidence appears, do not prioritize:

- broad PT or SLP product expansion before OT MVP validation;
- EMR integration before the standalone workflow and data requirements are proven;
- predictive recovery, trajectory forecasting, or autonomous progression;
- a new Attention Relevance layer or another recommendation engine;
- broad schema, persistence, or API redesign;
- dashboard-heavy longitudinal analytics;
- an AI-first documentation generator or unrestricted note production;
- billing, scheduling, population management, or full EMR features;
- large visual redesigns that displace hierarchy, compression, and workflow clarity;
- rewriting stable deterministic reasoning, progression, continuity, reassessment, or mutation-governance architecture;
- pricing conclusions before value and buyer interviews, or time-savings claims before measurement;
- treating simulated persona findings as clinical validation.
