# Consultant Handoff — OT Clinical Assistant

Last updated: 2026-06-03

---

## 10-Minute Orientation

The OT Clinical Assistant is a Next.js clinical workflow application for occupational therapy in adult rehabilitation and home health. It is not an AI report generator, a pathway picker, or a one-time treatment plan creator. It is a clinician command center that carries continuity across visits and helps the therapist quickly answer:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

The implemented application has already moved from case-centric, pathway-oriented plan generation toward patient-centric, continuity-aware clinical navigation. Current work should improve workflow safety, clinician trust, snapshot awareness, intake fidelity, and real-world adoption fit without redesigning the reasoning architecture.

---

## Current Product State

### Application Stack

* Next.js app using the App Router.
* React client components for patient entry, Command Center, Reference Workspace, edit workflow, and workspace panels.
* Supabase-backed persistence through `src/lib/supabase.ts`.
* OpenAI is used for constrained operational synthesis; deterministic project code remains the source of authoritative clinical reasoning.

### Implemented Navigation Reality

The live navigation model is patient-centric:

* Patient entry list: `src/app/cases/page.tsx`
* Patient entry card component: `src/app/cases/PatientEntryCard.tsx`
* Command Center route: `src/app/cases/[id]/page.tsx`
* Reference Workspace route: `src/app/cases/[id]/reference/page.tsx`
* Shared workspace renderer: `src/app/cases/[id]/CaseWorkspaceClient.tsx`

The `/cases` surface functions as patient entry and orientation, not merely a saved-case archive.

### Implemented Clinical Reasoning Reality

The implemented reasoning system includes:

* deterministic clinical decision input derivation in `src/lib/buildClinicalDecisionInput.ts`
* deterministic clinical decision modeling in `src/lib/clinicalDecisionEngine.ts`
* progression state derivation in `src/lib/buildProgressionState.ts`
* continuity interpretation in `src/lib/buildContinuityInterpretation.ts`
* canonical continuity state construction in `src/lib/buildCanonicalContinuityState.ts`
* longitudinal event construction and state updates in `src/lib/longitudinal/`
* Clinical Impact Summary construction in `src/lib/clinicalDelta/buildClinicalImpactSummary.ts`
* refreshed Command Center next action derivation in `src/lib/commandCenterNextAction.ts`
* progression-check mutation handling in `src/app/api/progression-check/route.ts`
* generated-plan synthesis and continuity injection in `src/app/api/generate-plan/route.ts`

Legacy pathway-shaped fields still exist for compatibility, but current authority has migrated to operational prioritization, clinical attention, progression state, continuity state, longitudinal events, and current Command Center state.

### Implemented UX Reality

The UI already contains:

* Patient Entry cards with identity, treatment frame, context indicators, selection, Command Center entry, and Quick Preview.
* Command Center mode for current clinical orientation.
* Reference Workspace mode for deeper review, historical snapshots, generated outputs, and supporting context.
* Current Operational State / Current Focus presentation.
* Since Last Visit and Attention Required orientation.
* Clinical Impact Summary after progression updates.
* Clinical Status Explainability.
* Clinical Impact CTA behavior.
* Treatment Focus refinement.
* Next Action Refresh that accounts for newer longitudinal meaning.
* Caregiver, environmental, transfer/mobility, structured plan, and historical snapshot sections.

---

## Current Product Maturity

The project has transitioned from architecture discovery to workflow validation and adoption-readiness maturation.

Architecture is stable. The highest-value consultant work is now:

* state awareness and snapshot clarity
* clinician trust and explainability
* intake fidelity validation
* contradiction guardrail implementation after validation
* EMR/workflow integration research
* clinician testing
* Command Center scanability and cognitive load reduction

---

## Completed Workstreams

### 1. Architectural Stabilization

Completed and stable:

* deterministic reasoning engine authority
* continuity architecture
* progression architecture
* reassessment architecture
* longitudinal event architecture
* clinical attention architecture
* operational prioritization architecture
* mutation governance around live state versus immutable historical snapshots

### 2. Operational Prioritization Migration

Completed directionally and substantially reflected in code:

* Current operational emphasis replaced selected pathway semantics as the primary treatment direction.
* Alternative Treatment Approaches were reframed as Adjacent Operational Priorities.
* Visible competing treatment-plan selection is no longer the intended workflow.
* Historical snapshots exist as continuity references, not competing current-truth objects.

### 3. Command Center / Reference Workspace Split

Completed:

* Command Center route exists for rapid orientation.
* Reference Workspace route exists for review, context, snapshots, generated outputs, and deeper investigation.
* Patient Entry routes users toward the Command Center first.

### 4. Orientation & Cognitive Compression

Completed:

* Command Center hierarchy stabilization.
* Clinical Language Compression Phase 1.
* Patient Entry Phase 1 and Quick Preview primitives.
* Treatment Focus refinement.
* Next Action Refresh.

### 5. Longitudinal Clinical Delta Experience

Completed:

* Clinical Impact Summary.
* Clinical Status Explainability.
* Clinical Impact CTA.
* Treatment Focus refinement.
* Next Action Refresh.

The progression-check flow can now explain what changed, what remained confirmed, why it matters, and what should guide the visit.

### 6. Intake Fidelity Phase 1A

Completed:

* Intake Fidelity Audit.
* Intake Fidelity Normalization Specification.
* Intake Fidelity Phase 1A.
* High-signal intake hierarchy.
* Minimum viable intake validation.
* Removal of Clinical Decision Inputs from the visible intake experience.

---

## Active Workstreams

### 1. Snapshot Awareness

Status: active highest-priority roadmap item.

Current direction:

* Make live Command Center state versus historical/generated snapshot state unmistakable.
* Clarify snapshot recency and context using clinician-facing language.
* Keep Historical Snapshots in the Reference Workspace as supporting context.
* Avoid timeline dashboards and continuity-internal terminology.

### 2. Intake Fidelity Validation and Phase 1B

Status: validation / next implementation candidate.

Current direction:

* Validate how clinicians respond to structured intake and contradiction guardrails.
* Implement clinically meaningful blocking and warning validation after thresholds and language are confirmed.
* Preserve existing data model and API contracts unless explicitly approved.

### 3. EMR / Workflow Integration Research

Status: active product-risk investigation.

Current direction:

* Determine where the tool fits in visit preparation, follow-up updates, and documentation.
* Identify whether adoption depends more on integration workflow than reasoning quality.

### 4. Clinician Testing

Status: active validation need.

Current direction:

* Test Command Center orientation speed, trust, state awareness, and next-action usability.
* Validate that clinicians understand Clinical Impact Summary and snapshot/live-state distinctions.

---

## Deferred Workstreams

Do not treat these as active unless explicitly reopened:

* predictive analytics
* autonomous recommendation systems
* timeline-heavy progression dashboards
* large longitudinal dashboards
* multi-user collaboration
* automated discharge prediction
* cross-patient pattern intelligence
* broad schema/API redesign
* additional reasoning engines

---

## Authoritative Documents

### Fast Orientation

1. `AGENTS.md`
2. `docs/PROJECT_SNAPSHOT.md`
3. `docs/CONSULTANT_HANDOFF.md`
4. `docs/PROJECT_STATUS_AND_DIRECTION.md`
5. `docs/foundation/active_roadmap.md`

### Highest Authority for Decisions

1. `docs/foundation/decision_log.md`
2. `docs/foundation/active_roadmap.md`
3. `docs/architecture/system_architecture.md`
4. UX specifications under `docs/UX/`

### UX Governance

* `docs/UX/Visual_Design_Principles.md`
* `docs/UX/Command_Center_UX_Normalization_Roadmap.md`
* `docs/UX/case_workspace_v2.md`
* `docs/UX/case_workspace_layout_specification_v1.md`

### Longitudinal / Progression Authority

* `docs/architecture/longitudinal_progression_architecture.md`
* `docs/UX/progression_display_principles.md`
* `docs/clinical_model/Clinical_Progression_Model.md`
* `docs/clinical_model/Progression_Check_Data_Model.md`
* `docs/clinical_model/Clinical_Attention_Model.md`

---

## Decisions That Should Not Be Revisited Without Explicit Direction

1. Deterministic clinical reasoning is authoritative; AI is constrained to synthesis, explanation, communication, and organization.
2. Cognitive compression and workflow clarity are more important than narrative richness.
3. Environmental realism and caregiver feasibility are core reasoning priorities.
4. The product has moved from multi-pathway recommendations to continuity-aware operational prioritization.
5. The live operational case state is current truth; historical generations are immutable snapshots.
6. Current operational emphasis / Treatment Focus is the primary treatment direction authority.
7. `selectedPathwayIndex` may remain for compatibility but is not current clinical authority.
8. Alternative Treatment Approaches are Adjacent Operational Priorities.
9. Reassessment-sensitive updates should flow through deterministic continuity logic, not pathway reselection.
10. The Command Center is the primary clinician workflow surface.
11. The clinician should not inspect internals, history, or continuity architecture to understand current patient reality.
12. Workspace and UX work should consume existing systems rather than redesign progression, continuity, reassessment, or operational prioritization.

---

## Current Implementation Focus

Near-term implementation should prioritize:

1. Snapshot Awareness.
2. Intake Fidelity validation.
3. EMR / workflow integration research.
4. Clinician testing.
5. Intake Fidelity Phase 1B contradiction guardrails after validation.

When deciding whether to implement something, ask:

* Does this help the clinician quickly understand what changed?
* Does this clarify what matters most right now?
* Does this make the next action easier to identify?
* Does this clarify whether the clinician is viewing current operational truth or historical/reference context?
* Does this reduce cognitive burden without adding new system concepts?

If the answer is no, defer it.

---

## Implementation Guardrails for Consultants

### Do

* Make small, targeted changes.
* Preserve existing persistence shape.
* Preserve API contracts unless required and approved.
* Prefer UX hierarchy changes over architectural changes.
* Use clinician-facing language: On Track, Monitor Closely, Needs Reassessment.
* Keep Current Operational State / Treatment Focus visually prominent.
* Keep historical snapshots subordinate to current workflow orientation.
* Treat Clinical Focus as configuration, not workflow.
* Compare roadmap language against current code before assuming a task is not implemented.

### Do Not

* Reintroduce pathway selection as the primary workflow.
* Create dashboard-heavy longitudinal analytics.
* Introduce predictive recovery or discharge prediction.
* Expose internal continuity terminology as primary UI.
* Add new reasoning engines for Workspace V2 or UX normalization.
* Modify database schema, persistence structure, generation storage, continuity storage, or progression storage without explicit approval.
* Modify request/response payloads or generated output structures without explicit approval.
* Turn Quick Preview into a full Command Center clone.
* Let Reference Workspace content compete with orientation content.

---

## First Places to Look in Code

* Patient entry list: `src/app/cases/page.tsx`
* Patient entry card: `src/app/cases/PatientEntryCard.tsx`
* Patient entry preview derivation: `src/app/cases/patientEntryPreview.ts`
* Command Center route: `src/app/cases/[id]/page.tsx`
* Reference Workspace route: `src/app/cases/[id]/reference/page.tsx`
* Shared workspace renderer: `src/app/cases/[id]/CaseWorkspaceClient.tsx`
* Current operational state panel: `src/app/cases/[id]/components/CurrentOperationalStatePanel.tsx`
* Historical snapshots: `src/app/cases/[id]/components/HistoricalSnapshotsSection.tsx`
* Progression-check API: `src/app/api/progression-check/route.ts`
* Generate-plan API: `src/app/api/generate-plan/route.ts`
* Deterministic clinical engine: `src/lib/clinicalDecisionEngine.ts`
* Progression state: `src/lib/buildProgressionState.ts`
* Continuity interpretation: `src/lib/buildContinuityInterpretation.ts`
* Clinical display language: `src/lib/clinicalDisplayLanguage.ts`
* Clinical Impact Summary: `src/lib/clinicalDelta/buildClinicalImpactSummary.ts`
* Command Center next action: `src/lib/commandCenterNextAction.ts`
* Longitudinal utilities: `src/lib/longitudinal/`

---

## Bottom Line

The OT Clinical Assistant is architecturally stabilized and implemented as a continuity-aware clinical navigation system. The next consultant should focus on snapshot awareness, clinician trust, intake validation, workflow integration, and clinician testing. The safest contribution path is targeted workflow and UX refinement that makes current clinical reality easier to understand without expanding architecture, changing persistence, or re-litigating approved decisions.
