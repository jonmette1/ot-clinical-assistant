# Consultant Handoff — OT Clinical Assistant

Last updated: 2026-06-02

## 10-Minute Orientation

The OT Clinical Assistant is a Next.js clinical workflow application for occupational therapy. Its current product direction is not an AI report generator, a pathway picker, or a one-time treatment plan creator. It is a clinician command center that carries continuity across visits and helps the therapist quickly answer:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

The implemented application already reflects the major strategic shift documented across the project: from case-centric, pathway-oriented plan generation toward patient-centric, continuity-aware clinical navigation. The current implementation includes a patient entry surface, a Command Center route, a Reference Workspace route, deterministic progression and continuity utilities, progression-check event handling, current longitudinal state, clinical attention state, operational prioritization, and historical snapshots.

The most important consultant mindset is: do not redesign the clinical reasoning architecture. Most remaining work is presentation, hierarchy, workflow clarity, and validation of clinician-facing surfaces.

---

## Current Product State

### Application Stack

- Next.js app using the App Router.
- React client components for the main patient list, case workspace, edit workflow, and workspace panels.
- Supabase-backed persistence through `src/lib/supabase.ts`.
- OpenAI is used for operational synthesis, but deterministic project code remains the source of authoritative clinical reasoning.

### Implemented Navigation Reality

The live navigation model is already split into:

- Patient entry list: `src/app/cases/page.tsx`
- Patient entry card component: `src/app/cases/PatientEntryCard.tsx`
- Command Center route: `src/app/cases/[id]/page.tsx`
- Reference Workspace route: `src/app/cases/[id]/reference/page.tsx`
- Shared workspace renderer: `src/app/cases/[id]/CaseWorkspaceClient.tsx`

This means the documented patient-centric direction has moved beyond planning. The Command Center and Reference Workspace routes exist in code, and the `/cases` surface is functioning as the patient entry surface rather than a purely case-centric archive.

### Implemented Clinical Reasoning Reality

The implemented reasoning system includes:

- Deterministic clinical decision input derivation in `src/lib/buildClinicalDecisionInput.ts`.
- Deterministic clinical decision modeling in `src/lib/clinicalDecisionEngine.ts`.
- Progression state derivation in `src/lib/buildProgressionState.ts`.
- Continuity interpretation in `src/lib/buildContinuityInterpretation.ts`.
- Canonical continuity state construction in `src/lib/buildCanonicalContinuityState.ts`.
- Longitudinal event construction and state updates in `src/lib/longitudinal/`.
- Progression-check API mutation handling in `src/app/api/progression-check/route.ts`.
- Generated-plan synthesis and continuity injection in `src/app/api/generate-plan/route.ts`.

The application still carries some legacy pathway-shaped fields for compatibility, but current authority has migrated toward operational prioritization, clinical attention, progression state, continuity state, and longitudinal events.

### Implemented UX Reality

The current UI already contains:

- Patient Entry cards with patient identity, treatment frame, context indicators, selection, and primary Command Center entry.
- Quick Preview behavior on the patient entry surface, including on-demand loading of current state, clinical attention, generated output, and recent longitudinal events.
- A Command Center workspace mode for current clinical orientation.
- A Reference Workspace mode for deeper review and supporting context.
- Current Operational State presentation.
- Adjacent Operational Priorities instead of visible competing treatment pathways.
- Supporting progression summaries.
- Caregiver, environmental, transfer/mobility, structured plan, and historical snapshot sections.
- Clinical display-language compression helpers for Command Center readability.

Important documentation mismatch: `docs/foundation/active_roadmap.md` still frames Patient Entry Phase 2A Quick Preview as the highest-priority approved implementation, with Quick Preview listed as not yet implemented. The current code already implements Quick Preview primitives in `src/app/cases/page.tsx`, `src/app/cases/PatientEntryCard.tsx`, and `src/app/cases/patientEntryPreview.ts`. Treat this as implemented reality unless later product review says otherwise.

---

## Completed Workstreams

### 1. Architectural Stabilization

Completed and should be treated as stable:

- Deterministic reasoning engine authority.
- Continuity architecture.
- Progression architecture.
- Reassessment architecture.
- Longitudinal event architecture.
- Clinical attention architecture.
- Operational prioritization architecture.
- Mutation governance concepts around live state versus immutable historical snapshots.

Consultants should assume these systems are approved and implemented unless explicitly asked to audit or refactor them.

### 2. Operational Prioritization Migration

Completed directionally and substantially reflected in code:

- Current operational emphasis replaced selected pathway semantics as the primary treatment direction.
- Alternative Treatment Approaches were reframed as Adjacent Operational Priorities.
- Visible competing treatment-plan selection is no longer the intended workflow.
- Pathway-shaped data may remain for backward compatibility, historical generations, or generated-output compatibility.

Do not reintroduce a pathway-selection UX.

### 3. Longitudinal Foundation

Completed foundation:

- Progression checks create longitudinal events.
- Current longitudinal state is maintained on the live case.
- Clinical attention state is derived from longitudinal/progression events.
- Operational prioritization can refresh from longitudinal event context when appropriate.
- Historical snapshots exist as continuity references, not as competing current-truth objects.

### 4. Command Center / Reference Workspace Split

Implemented in routing and shared renderer structure:

- `/cases/[id]` opens the Command Center.
- `/cases/[id]/reference` opens the Reference Workspace.
- `CaseWorkspaceClient` receives a workspace mode and renders the appropriate workspace surface.

This supports the approved navigation model: Patient → Command Center + Reference Workspace.

### 5. Clinical Language Compression Phase 1

Documented as complete and reflected in code through display-language helper usage. The purpose was to reduce report-like density without changing reasoning architecture, generated output contracts, or persistence structures.

Do not continue compression work automatically. Future compression should be separately scoped and validated.

### 6. Patient Entry Phase 1

Completed:

- Patient-oriented card hierarchy.
- Command Center as the primary action.
- Treatment-frame fallback handling.
- Patient identity hierarchy correction.
- Patient entry implementation without route changes.

### 7. Patient Entry Quick Preview Primitives

Implemented in code, though roadmap wording may lag behind reality:

- Preview state map in the cases page.
- On-demand loading of additional case state and recent longitudinal events.
- Derived preview signals for Current Focus, Attention Required, Since Last Visit, and Next Action.
- Expand/collapse preview behavior on Patient Entry cards.

Consultant caution: Quick Preview should remain subordinate. It is not a second Command Center and should not absorb full Reference Workspace or operational-rationale content.

---

## Active Workstreams

### 1. Command Center UX Normalization

This is the most important current UX thread. The goal is not new architecture. It is to reduce visual competition and improve clinician scanning by using hierarchy, typography, whitespace, and restrained clinical color.

Current UX direction:

- Clinical Mission Control.
- Calm, focused, trustworthy, professional, decisive.
- Typography and whitespace before decorative cards.
- Clinically meaningful status color only.
- Reduced dashboard-like fragmentation.
- Level 1 authority for current clinical reality, then meaningful change, required attention, immediate action, and supporting context.

### 2. Longitudinal Workspace Design / Phase 5

The active product focus remains turning the workspace into a longitudinal clinical guidance surface. The workspace should consume existing reasoning outputs and help the clinician understand:

- What changed?
- What requires attention?
- What should happen next?
- Whether reassessment pressure exists.
- How current progression affects treatment focus.

### 3. Patient Entry / Quick Preview Refinement

Because Quick Preview is now present in code, near-term work should be refinement and validation rather than first implementation. Key guardrails:

- Preserve Command Center as the authoritative workflow surface.
- Keep preview lightweight.
- Do not load or render a full mini-workspace.
- Use existing current-state, clinical-attention, generated-output, and longitudinal-event data.
- Do not introduce new persistence or API contract changes solely for preview refinement.

### 4. Reference Workspace Cleanup / Boundary Clarification

Reference Workspace is for review, context, investigation, historical snapshots, generated outputs, and deeper longitudinal review. It should not compete with the Command Center for rapid visit orientation.

Some content currently in Reference Workspace may eventually move to a future preview/orientation layer, but that is deferred unless explicitly promoted.

---

## Deferred Workstreams

Items in `docs/future_opportunities.md` are intentionally not active roadmap work. They require explicit approval before implementation.

Deferred opportunities include:

- Patient Entry Card context deduplication.
- Broader Patient Preview / Visit Preparation experience beyond the implemented Quick Preview primitives.
- Richer Patient Entry Experience evolution.
- Intake Fidelity Optimization.
- Workflow Actions Consolidation.
- Current Focus adaptive typography.
- Reference Workspace evolution.
- Historical Snapshot experience enhancements.

Also deferred by roadmap governance:

- Predictive analytics.
- Autonomous recommendation systems.
- Timeline-heavy progression systems.
- Large longitudinal dashboards.
- Adaptive learning systems.
- Multi-user collaboration systems.
- Advanced reporting systems.
- Automated discharge prediction.
- Cross-patient pattern intelligence.

Do not treat these as approved implementation work because they appear in a document. They are parking-lot items.

---

## Authoritative Documents

### Highest Authority for Decisions

- `docs/foundation/decision_log.md`

Use this to prevent re-litigation. It records the decisions that have already stabilized the product direction.

### Current State and Direction

- `docs/PROJECT_STATUS_AND_DIRECTION.md`

Use this for product identity, validated systems, current migration posture, common agent failure modes, MVP assessment, and current best-next-action framing.

### Roadmap Authority

- `docs/foundation/active_roadmap.md`

Use this for active priorities, but compare it to implementation reality. At the time of this handoff, its Patient Entry Quick Preview section appears behind the current code.

### Future / Deferred Ideas

- `docs/future_opportunities.md`

Use this to understand known opportunities that are not approved for implementation.

### Mission and Operating Rules

- `AGENTS.md`

Use this for project philosophy, architecture-stability rules, data/API protection, Workspace V2 rules, Command Center expectations, patient-centric navigation rules, and UX governance.

### Architecture and UX Supporting Authority

For architecture decisions, also consult:

- `docs/architecture/system_architecture.md`
- `docs/architecture/longitudinal_progression_architecture.md`
- `docs/architecture/continuity_authority_matrix.md`
- `docs/architecture/canonical_continuity_pipeline.md`
- `docs/architecture/continuity_mutation_lifecycle.md`

For current UX decisions, also consult:

- `docs/UX/Visual_Design_Principles.md`
- `docs/UX/Command_Center_UX_Normalization_Roadmap.md`
- `docs/UX/Patient_Centric_Navigation_Specification.md`
- `docs/UX/Patient_Centric_Navigation_Implementation_Blueprint.md`
- `docs/UX/case_workspace_v2.md`
- `docs/UX/case_workspace_layout_specification_v1.md`

For longitudinal clinical model decisions, also consult:

- `docs/clinical_model/Clinical_Progression_Model.md`
- `docs/clinical_model/Clinical_Attention_Model.md`
- `docs/clinical_model/Progression_Check_Data_Model.md`
- `docs/clinical_model/Longitudinal_Data_Capture_Foundation.md`

---

## Decisions That Should Not Be Revisited Without Explicit Direction

Do not reopen these unless the user explicitly requests a strategic reconsideration:

1. Deterministic clinical reasoning is authoritative; AI is constrained to synthesis, explanation, communication, and organization.
2. Cognitive compression and workflow clarity are more important than narrative richness.
3. Environmental realism and caregiver feasibility are core reasoning priorities.
4. The product has moved from multi-pathway recommendations to continuity-aware operational prioritization.
5. The live operational case state is current truth; historical generations are immutable snapshots.
6. Current operational emphasis is the primary treatment direction authority.
7. `selectedPathwayIndex` may remain for compatibility but is not current clinical authority.
8. Alternative Treatment Approaches are now Adjacent Operational Priorities.
9. Phase 3B reassessment updates operational emphasis through deterministic continuity logic, not pathway reselection.
10. The Command Center is the primary clinician workflow surface.
11. The clinician should not have to inspect internals, history, or continuity architecture to understand current patient reality.
12. Continuity interpretation should remain deterministic, operational, explainable, and lightweight.
13. Workspace and UX work should consume existing systems rather than redesigning progression, continuity, reassessment, or operational prioritization.

---

## Current Implementation Focus

The practical focus for near-term implementation is:

1. Normalize Command Center UX hierarchy.
2. Refine patient entry and Quick Preview without turning it into a mini Command Center.
3. Strengthen the Command Center versus Reference Workspace boundary.
4. Improve scanability and clinician orientation using existing data.
5. Preserve stable architecture and avoid data-model or API-contract changes unless explicitly approved.

When deciding whether to implement something, ask:

- Does this help the clinician quickly understand what changed?
- Does this clarify what matters most right now?
- Does this make the next action easier to identify?
- Does this reduce cognitive burden without adding new system concepts?
- Can this be solved through hierarchy, ordering, collapse behavior, labels, typography, or whitespace instead of architecture?

If the answer is no, defer it.

---

## Implementation Guardrails for Consultants

### Do

- Make small, targeted changes.
- Preserve existing persistence shape.
- Preserve API contracts unless required and approved.
- Prefer UX hierarchy changes over architectural changes.
- Use clinician-facing language: On Track, Monitor Closely, Needs Reassessment.
- Keep Current Operational State visually prominent.
- Keep historical snapshots subordinate to current workflow orientation.
- Treat Clinical Focus as configuration, not workflow.
- Compare roadmap language against current code before assuming a task is not implemented.

### Do Not

- Reintroduce pathway selection as the primary workflow.
- Create a dashboard-heavy longitudinal analytics interface.
- Introduce predictive recovery or discharge prediction.
- Expose internal continuity terminology as primary UI.
- Add new reasoning engines for Workspace V2 or UX normalization.
- Modify database schema, persistence structure, generation storage, continuity storage, or progression storage without explicit approval.
- Modify request/response payloads or generated output structures without explicit approval.
- Turn Quick Preview into a full Command Center clone.
- Let Reference Workspace content compete with orientation content.

---

## Known Documentation Versus Implementation Notes

1. `docs/foundation/active_roadmap.md` describes Patient Entry Phase 2A Quick Preview as approved but not yet implemented. Current code already includes Quick Preview state management, preview loading, derived preview signals, and Patient Entry card rendering.
2. `docs/PROJECT_STATUS_AND_DIRECTION.md` states navigation migration implementation is focused on ownership separation inside `src/app/cases/[id]/page.tsx`. Current code already has separate Command Center and Reference Workspace routes with a shared `CaseWorkspaceClient` and `workspaceMode` prop.
3. Some AGENTS source-of-truth paths mention older document locations such as `docs/active_roadmap.md` and `docs/system_architecture.md`; the current repository stores these under `docs/foundation/` and `docs/architecture/`. Use the current paths listed in this handoff.
4. Legacy pathway fields still exist in generated-output types and rendering compatibility paths. This is transitional semantic debt, not permission to rebuild pathway-centric UX.

---

## First Places to Look in Code

- Patient entry list: `src/app/cases/page.tsx`
- Patient entry card: `src/app/cases/PatientEntryCard.tsx`
- Patient entry preview derivation: `src/app/cases/patientEntryPreview.ts`
- Command Center route: `src/app/cases/[id]/page.tsx`
- Reference Workspace route: `src/app/cases/[id]/reference/page.tsx`
- Shared workspace renderer: `src/app/cases/[id]/CaseWorkspaceClient.tsx`
- Current operational state panel: `src/app/cases/[id]/components/CurrentOperationalStatePanel.tsx`
- Historical snapshots: `src/app/cases/[id]/components/HistoricalSnapshotsSection.tsx`
- Progression-check API: `src/app/api/progression-check/route.ts`
- Generate-plan API: `src/app/api/generate-plan/route.ts`
- Deterministic clinical engine: `src/lib/clinicalDecisionEngine.ts`
- Progression state: `src/lib/buildProgressionState.ts`
- Continuity interpretation: `src/lib/buildContinuityInterpretation.ts`
- Clinical display language: `src/lib/clinicalDisplayLanguage.ts`
- Longitudinal utilities: `src/lib/longitudinal/`

---

## Bottom Line

The OT Clinical Assistant is architecturally stabilized and already implemented as a continuity-aware clinical navigation system. The next consultant should spend their first energy on understanding the existing Command Center, patient entry, Reference Workspace, progression-check flow, and deterministic reasoning utilities. The safest contribution path is targeted UX and workflow refinement that makes current clinical reality easier to scan without expanding architecture, changing persistence, or re-litigating approved product decisions.
