# Capability Ownership Assessment

## Status and scope

This assessment completes the repository-inspection portion of the active **Continuity Platform Foundation Definition** boundary. It classifies implemented repository capabilities by observed ownership. It does **not** approve a Shared Continuity Foundation, extract shared code, redesign architecture, or make product decisions.

Care Continuity is used only as a sanity check. Because it is not implemented in this repository, no capability is classified as proven shared across Clinical Continuity and Care Continuity.

## Classification rules used

- **Current owner** means the owner implied by implemented code plus active repository authorities.
- **Candidate ownership layer** means the smallest future layer that repository evidence appears to support for further validation.
- **Reuse status** means:
  - **Proven**: implemented and validated across more than one application or configuration in repository evidence.
  - **Plausible**: implemented in Clinical Continuity and conceptually aligned with candidate shared concerns, but cross-application reuse is not proven.
  - **Unsupported**: repository evidence does not support reuse beyond the current owner.
- **Unresolved** means evidence is insufficient or ownership depends on unapproved Founder or Architecture decisions.

## Capability Ownership Matrix

| Capability | Current implementation location | Current owner | Current responsibility | Candidate ownership layer | Reuse status | Supporting evidence | Unresolved issues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Canonical case payload and decision input assembly | `src/lib/buildCanonicalCasePayload.ts`, `src/lib/buildClinicalDecisionInput.ts` | Clinical Continuity with OT configuration inputs | Normalize live case data into deterministic clinical-decision and continuity inputs. | Candidate Shared Continuity Foundation only for generic state identity/payload assembly; clinical and OT mappings remain application/configuration owned. | Plausible for assembly pattern; unsupported for clinical/OT content. | The active Program State lists state identity and current-state projection as candidate shared primitives, while Clinical Continuity and OT-specific concerns remain separately owned. Implementation feeds clinical decision input and OT-heavy fields into downstream reasoning. | Need Architecture decision on whether payload assembly can be separated from clinical vocabulary without schema/API change. |
| Deterministic clinical decision engine | `src/lib/clinicalDecisionEngine.ts` | Clinical Continuity with OT configuration | Derive selected intervention mechanisms, primary strategy, scoring notes, and reasoning summary from clinical goals, barriers, safety, support, lenses, and environment. | Clinical Continuity; OT configuration owns domain vocabulary embedded in current inputs. | Unsupported as shared foundation. | Active architecture states Clinical Continuity owns clinical significance, safety interpretation, treatment implications, and operational prioritization; OT owns assistance/environment/caregiver and OT-specific decision vocabulary. | Extraction would risk turning clinical meaning into shared platform logic before Care Continuity or other disciplines validate it. |
| Operational prioritization synthesis contract | `src/app/api/generate-plan/route.ts`, generated `operational_prioritization` consumers | Clinical Continuity | Generate one current operational prioritization communication artifact constrained by deterministic clinical reasoning. | Clinical Continuity; AI delivery remains delivery infrastructure. | Unsupported as shared foundation; plausible only for the abstract idea of present relevance. | Decision log preserves deterministic authority and operational prioritization as clinical treatment-direction authority; the route prompt explicitly constrains AI to synthesis and workflow communication. | AI prompt and output contract are runtime/API behavior and should not be extracted or generalized in this boundary. |
| Canonical continuity state assembly | `src/lib/buildCanonicalContinuityState.ts` | Clinical Continuity | Assemble canonical payload, progression state, continuity interpretation, stale flags, and continuity assembly state for current clinical workflow use. | Candidate Shared Continuity Foundation for state identity/current-vs-historical assembly pattern; Clinical Continuity for clinical interpretation content. | Plausible. | Platform Foundation names state identity, maintained conclusions, evidence lineage, current-vs-historical authority, reconciliation, and attention state as potential shared concerns; implementation currently assembles clinical progression and continuity interpretation. | Need component-level Architecture decision before any central pipeline extraction; current assembly is coupled to clinical progression and stale-plan semantics. |
| Progression state and readiness | `src/lib/buildProgressionState.ts`, `src/lib/progression/buildProgressionReadiness.ts`, `src/lib/progression/*` | Clinical Continuity; OT configuration contributes functional and caregiver/environment semantics | Determine phase, advancement readiness, barriers, regression risks, caregiver/environment limitation states, and readiness for evaluation. | Clinical Continuity. | Unsupported as shared foundation. | System Architecture assigns progression interpretation and reassessment support to Clinical Continuity and assistance/environment/caregiver feasibility to OT configuration. | Should not be extracted until another application proves an analogous progression concept with compatible authority and language. |
| Continuity interpretation | `src/lib/buildContinuityInterpretation.ts` | Clinical Continuity | Interpret current continuity condition, instability drivers, operational change classification, drift signals, alerts, and reassessment pressure. | Candidate Shared Continuity Foundation only for abstract meaningful-change/relevance/reconciliation concepts; clinical interpretation remains Clinical Continuity. | Plausible for abstraction; unsupported for current implementation reuse. | Active authorities identify meaningful change, present relevance, reconciliation, current-vs-historical truth, and attention orientation as candidate shared concerns; implementation uses clinical barriers, safety risk, caregiver feasibility, and progression phase. | High risk of over-extracting clinical semantics under generic continuity labels. |
| Supporting Evidence and conclusion evidence | `src/lib/buildConclusionEvidence.ts`, `src/lib/buildProgressEvidence.ts` | Clinical Continuity | Build clinician-facing evidence summaries for current recommendations, progress, and maintained conclusions. | Candidate Shared Continuity Foundation for evidence lineage concept only; Clinical Continuity for evidence meaning and display content. | Plausible. | Platform Foundation makes evidence lineage a core principle and candidate shared concern; Program State lists Supporting Evidence and Progress Evidence as implemented Clinical Continuity capabilities. | Stable evidence identifiers and correction consequences remain insufficiently hardened for shared extraction. |
| Why This Changed / conclusion change explanation | `src/lib/buildConclusionChangeExplanation.ts`, `src/lib/clinicalDelta/buildClinicalImpactSummary.ts` | Clinical Continuity | Explain clinically meaningful changes and their impact on the maintained conclusion. | Candidate Shared Continuity Foundation for meaningful-change representation; Clinical Continuity for clinical impact semantics. | Plausible. | Program State lists Why This Changed as implemented; Platform Foundation names meaningful change as a core principle, but active architecture assigns clinical significance interpretation to Clinical Continuity. | Need validated non-clinical change model before declaring shared behavior. |
| Progression Constraint and progression narrative | `src/lib/buildConstraintProgressionNarrative.ts`, `src/lib/buildProgressionState.ts` | Clinical Continuity with OT configuration semantics | Explain why improvement does or does not change progression/readiness and what remains limiting. | Clinical Continuity. | Unsupported as shared foundation. | Program State lists Progression Constraint; active architecture assigns progression interpretation and treatment implications to Clinical Continuity. | Should not be extracted because it depends on clinical progression, safety, caregiver feasibility, and OT/home-health task meaning. |
| Reassessment Summary | `src/lib/buildReassessmentSummary.ts`, `src/app/api/progression-check/route.ts` | Clinical Continuity | Summarize reassessment pressure and current clinical implications after progression checks. | Clinical Continuity; candidate shared only for abstract reconciliation lifecycle. | Unsupported for implementation reuse; plausible for concept. | Decision log states reassessment updates operational emphasis through deterministic continuity logic; Program State lists reassessment support as implemented Clinical Continuity. | Requires Founder/Architecture decisions before deciding whether reassessment is application-specific workflow or shared continuity lifecycle primitive. |
| Session Focus | `src/lib/buildSessionFocus.ts` | Clinical Continuity | Identify what the clinician should validate, observe, train, reassess, or address during a visit. | Clinical Continuity. | Unsupported as shared foundation. | Program State lists Session Focus; System Architecture assigns clinician verification, operational prioritization, and clinical attention orientation to Clinical Continuity. | Caregiver attention may share the broad attention-orientation idea, but current Session Focus is clinician workflow language. |
| Patient caseload prioritization / Command Center next action | `src/app/cases/patientCaseload.ts`, `src/lib/commandCenterNextAction.ts`, `src/app/cases/page.tsx`, `src/app/cases/PatientEntryCard.tsx` | Clinical Continuity application surface plus delivery UI | Sort and orient patient/case work by clinical status, attention need, stale state, and next action. | Delivery infrastructure for UI mechanics; Clinical Continuity for prioritization meaning; candidate shared only for attention-state abstraction. | Plausible for attention abstraction; unsupported for current prioritization implementation. | Program State lists patient caseload prioritization; System Architecture assigns operational prioritization and clinical attention to Clinical Continuity; Program State separates delivery infrastructure from platform architecture. | Boundary between generic attention state and clinical triage ranking remains ambiguous. Do not extract sorting/ranking without validation. |
| Visit Briefing / Case Workspace | `src/app/cases/[id]/CaseWorkspaceClient.tsx`, `src/app/cases/[id]/page.tsx`, `docs/UX/*case_workspace*`, `docs/UX/clinical_workflow_workspace_architecture_v1.md` | Clinical Continuity application UI with OT configuration content | Present maintained clinical understanding, evidence, progression, reassessment, and generated artifacts for clinician workflow. | Clinical Continuity; UI delivery infrastructure owns rendering mechanics. | Unsupported as shared foundation. | Program State lists Visit Briefing and Clinical Translation Workspace concepts; System Architecture assigns clinical workflow responsibilities to Clinical Continuity. | UI composition may later consume shared primitives, but current workspace is not evidence of reusable shared application architecture. |
| Longitudinal event capture and current-state update | `src/lib/longitudinal/buildLongitudinalEvent.ts`, `src/lib/longitudinal/updateCurrentStateFromEvent.ts`, `src/lib/longitudinal/longitudinalTypes.ts` | Clinical Continuity | Record progression-check events and update current longitudinal clinical state without rewriting event history. | Candidate Shared Continuity Foundation for temporal comparison/current-vs-historical truth pattern; Clinical Continuity for event semantics. | Plausible. | Platform Foundation names temporal comparison and current-vs-historical truth as candidate shared concerns; DCL-019 says live operational case state owns current truth and historical generations are immutable. | Need evidence model and stable event identity before shared extraction; current event fields are clinical/OT-oriented. |
| Clinical attention state | `src/lib/longitudinal/buildClinicalAttentionState.ts`, `src/lib/longitudinal/buildAttentionRequiredHeadline.ts` | Clinical Continuity | Derive one deterministic clinical review priority and headline from current state/event evidence. | Candidate Shared Continuity Foundation only for attention-state abstraction; Clinical Continuity owns clinical categories and statements. | Plausible for abstraction; unsupported for current implementation reuse. | Platform Foundation includes attention state as a candidate shared concern; System Architecture assigns clinical attention orientation to Clinical Continuity. | Caregiver attention should not inherit clinical safety/function/caregiver/environment categories without validation. |
| Continuity reconciliation of barriers, reassessment triggers, and activity constraints | `src/lib/continuity/reconcileBarriers.ts`, `src/lib/continuity/reconcileReassessmentTriggers.ts`, `src/lib/continuity/reconcileActivityConstraint.ts`, `docs/architecture/references/*reconciliation_architecture.md` | Clinical Continuity | Determine whether prior barriers/triggers/activity constraints remain current, require monitoring, resolve, or are superseded. | Candidate Shared Continuity Foundation for reconciliation pattern; Clinical Continuity for current clinical evidence rules. | Plausible. | Platform Foundation lists reconciliation as a core principle and candidate shared concern; subordinate references state reconciliation must preserve deterministic authority and not rewrite historical truth. | Free-text identity mismatch, monitoring semantics, and clinical authority conflicts remain extraction risks. |
| Stale-state flags and continuity mutation consequences | `reasoning_stale`, `plan_stale`, `modules_stale` usage in `src/lib/buildCanonicalContinuityState.ts`, routes, and patient surfaces | Clinical Continuity and delivery persistence | Signal when current reasoning, generated plan, or modules may no longer reflect live case state. | Candidate Shared Continuity Foundation for correction consequences/current-state freshness; delivery infrastructure for persistence flags. | Plausible. | Program State lists current-versus-historical state handling and delivery persistence mechanisms; DCL-018 requires deterministic governance for continuity mutations. | Existing stale flags are named around clinical reasoning/plan/modules and may not map cleanly to Care Continuity responsibilities. |
| AI-assisted detail modules | `src/app/api/generate-detail-module/route.ts` | Clinical Continuity plus AI delivery infrastructure | Generate constrained detail-module communication around supported conclusions. | Delivery infrastructure for OpenAI integration; Clinical Continuity for clinical content constraints. | Unsupported as shared foundation. | Authority docs allow AI synthesis but prohibit AI as reasoning authority; Program State lists OpenAI-assisted synthesis as delivery infrastructure. | Extraction risks AI authority leakage and prompt contract generalization before validation. |
| OpenAI API integration | `src/app/api/test-openai/route.ts`, `src/app/api/generate-plan/route.ts`, `src/app/api/generate-detail-module/route.ts`, package dependencies | Delivery infrastructure | Connect server routes to OpenAI for bounded synthesis. | Delivery infrastructure. | Unsupported as shared foundation. | Program State explicitly classifies OpenAI-assisted synthesis and application routes as delivery infrastructure, not platform architecture. | Shared platform should not be defined by vendor integration. |
| Supabase persistence integration | `src/lib/supabase.ts`, route usage, case pages | Delivery infrastructure | Persist and retrieve cases, progression checks, generated outputs, and stale/current fields. | Delivery infrastructure. | Unsupported as shared foundation. | Program State lists Supabase integration and persistence mechanisms as delivery infrastructure, not Continuity Platform architecture. | Persistence schema/API changes are explicitly out of scope and should not be inferred from this assessment. |
| Next.js routes and React UI components | `src/app/**`, `src/components/AppNav.tsx`, `src/app/globals.css` | Delivery infrastructure and Clinical Continuity application UI | Render application surfaces and route user/API workflows. | Delivery infrastructure; Clinical Continuity where UI expresses clinical workflow. | Unsupported as shared foundation. | Program State names Next.js structure, application routes, and UI components as delivery infrastructure. | Clear rendering infrastructure boundary, but some components encode clinical prioritization language. |
| Seed/test cases and deterministic tests | `src/lib/testCases/*`, `src/app/api/seed-progression-checks/route.ts`, `*.test.mjs` | Delivery/test infrastructure | Seed representative cases and assert deterministic behavior for patient caseload and longitudinal logic. | Delivery/test infrastructure; validation evidence only within current app. | Unsupported as shared foundation. | Program State lists deterministic and application tests and states real-clinician validation is not established. | Synthetic fixtures should not be treated as proof of cross-application reuse or real-clinician validation. |
| OT intake/domain vocabulary | `src/app/new-case/page.tsx`, `src/lib/clinicalDecisionEngine.ts`, `docs/clinical_model/*`, `docs/UX/intake_workflow_architecture_v2.md` | OT configuration | Capture and interpret ADLs, transfers, assistance levels, home environment, caregiver feasibility, barriers, and clinical lenses. | OT configuration. | Unsupported as shared foundation. | System Architecture states OT-specific fields, thresholds, terms, and reasoning labels must not be assumed portable. | Should not be extracted; future PT/SLP/Care use requires separate validation. |

## Candidate Shared Capabilities

No candidate below is approved as shared. Each remains a classification finding for Founder and Architecture review.

### Proven candidates

None. The repository implements Clinical Continuity with an OT configuration and does not contain a second implemented application proving reuse.

### Plausible candidates

Repository evidence suggests these may be plausible Shared Continuity Foundation candidates after validation:

- state identity and current-state projection patterns;
- temporal comparison and longitudinal event/current-state separation;
- maintained conclusions with evidence lineage;
- meaningful-change representation;
- present relevance and attention-state abstraction;
- reconciliation of prior conclusions against current evidence;
- current-truth versus historical-truth separation;
- correction/freshness consequences represented today through stale-state flags.

These are plausible because active authorities name them as candidate shared concerns and current implementation contains Clinical Continuity versions of them. They are not proven because the repository does not implement Care Continuity or another application layer.

### Unsupported candidates

The following should not be treated as shared candidates based on current repository evidence:

- deterministic clinical decision scoring;
- OT intake vocabulary, ADL/transfer fields, assistance levels, and OT home-health semantics;
- progression state/readiness implementation;
- clinical reassessment, Session Focus, Visit Briefing, and patient caseload triage implementations;
- OpenAI prompts and generated clinical output contracts;
- Supabase/Next.js delivery mechanics;
- synthetic seed data or persona simulation tooling.

## Application Boundary Assessment

### Clinical Continuity observed responsibilities

Clinical Continuity currently owns deterministic clinical meaning: clinical significance, safety interpretation, progression/reassessment support, clinical attention, operational prioritization, clinician verification framing, current clinical state, and maintained clinician-facing conclusions. The codebase supports these responsibilities through deterministic builders, progression and longitudinal modules, continuity interpretation, patient caseload prioritization, and constrained AI synthesis routes.

### OT configuration observed responsibilities

The OT configuration owns the implemented domain language and clinical configuration: ADL/task framing, transfers, assistance levels, home environment, caregiver feasibility, occupational performance, barriers, support levels, safety risk, and OT-specific reasoning vocabulary. These concerns appear throughout intake, clinical decision input/model construction, progression interpretation, and clinical workflow outputs.

### Delivery infrastructure observed responsibilities

Delivery infrastructure owns how the application is delivered rather than what the continuity architecture means: Next.js routes, React components, application styling, Supabase connectivity, OpenAI API calls, seeding utilities, and deterministic/application tests. Some delivery surfaces encode Clinical Continuity language, so they should be treated as mixed implementation surfaces rather than clean shared platform boundaries.

### Clear boundaries

- Care Continuity is not implemented and cannot prove reuse.
- OT-specific vocabulary and decision labels are not portable by default.
- AI synthesis is bounded communication, not deterministic authority.
- Supabase, OpenAI integration, routes, and UI rendering are delivery infrastructure, not the platform foundation.

### Ambiguous boundaries

- Canonical continuity state assembly mixes candidate-shared concepts with clinical progression and stale-plan semantics.
- Attention orientation may be shared in abstraction, but the implemented attention state is clinical.
- Reconciliation may be shared in pattern, but current rules are clinical and OT-heavy.
- Evidence lineage is a shared principle, but stable evidence identity and correction consequences are not yet sufficiently generalized.
- Patient caseload prioritization may contain reusable attention ideas, but current ranking is clinical workflow logic.

## Ownership Conflict Register

| Conflict or risk | Current evidence | Assessment | Should not be extracted yet |
| --- | --- | --- | --- |
| Clinical semantics embedded in candidate-shared names | Continuity interpretation, canonical continuity state, reconciliation, and attention modules use clinical/progression/caregiver/environment fields. | Naming may make Clinical Continuity implementation appear more generic than the evidence supports. | Yes. Extract only after neutral contracts are approved and validated. |
| Pathway-era compatibility debt | Decision log identifies `selectedPathwayIndex` and pathway-era structures as transitional debt. | Backward compatibility may constrain refactoring and output contracts. | Yes. Do not remove or reinterpret compatibility fields without migration audit. |
| AI prompt contracts encode clinical authority boundaries | Generate-plan/detail routes contain strict instructions that AI is synthesis only. | Reusing prompts as shared platform behavior risks AI authority leakage. | Yes. Keep AI behavior application-specific until validated. |
| Stale-state flags mix clinical and delivery concepts | `reasoning_stale`, `plan_stale`, and `modules_stale` signal current-state freshness but are named for clinical reasoning/generation modules. | Plausible freshness primitive exists, but current names and consequences are not application-neutral. | Yes. Do not generalize without correction/provenance design. |
| Reconciliation rules rely on clinical evidence semantics | Barrier, trigger, and activity-constraint reconciliation depend on clinical current evidence and safety/progression meaning. | Shared reconciliation pattern is plausible; implementation reuse is not proven. | Yes. Keep current rules Clinical Continuity-owned. |
| Attention state categories are clinical | Safety, Function, Caregiver, Environment, and Medical categories are derived for clinician review. | Shared attention orientation is plausible, but category semantics may not transfer. | Yes. Do not map caregiver attention directly from clinical categories. |
| Evidence lineage lacks fully hardened correction/provenance workflow | Active roadmap defers correction and provenance hardening. | Evidence-linked conclusions are plausible shared candidates but not extraction-ready. | Yes. Defer until validation and hardening. |
| Synthetic validation over-read risk | Tests and seed/persona artifacts exercise current workflows but do not establish real-clinician or cross-application proof. | Evidence supports internal correctness only. | Yes. Do not treat simulation as proven shared architecture. |

## Recommendations

Recommendations are not decisions.

### Smallest Founder decisions required

1. Confirm whether the next documentation artifact should approve only a candidate Shared Continuity Foundation definition or continue with additional clinician/caregiver experience modeling first.
2. Confirm which non-Clinical Continuity concept is sufficient for pressure testing: Care Continuity concept model only, or a thin demonstrator later after foundation approval.
3. Confirm that no current Clinical Continuity implementation should be renamed as universal shared foundation until cross-application validation exists.

### Smallest Architecture decisions required

1. Define a neutral boundary vocabulary for candidate shared primitives without moving code: state identity, temporal comparison, maintained conclusion, evidence lineage, relevance, reconciliation, attention, freshness, and current/historical truth.
2. Identify which current modules are evidence sources only versus possible future extraction seams.
3. Decide what evidence identity/provenance minimum is required before any shared extraction can begin.
4. Decide how stale-state/freshness semantics should be described without binding the future foundation to clinical reasoning, generated plan, or detail-module terminology.

### Recommended next implementation boundary

The next implementation boundary should remain documentation-only: produce a **candidate foundation pressure-test document** that maps the plausible shared primitives against Clinical Continuity and the approved Care Continuity concept, explicitly marking every concept as approved, candidate, or unresolved. It should stop before code extraction, schema/API/persistence changes, UI changes, or AI behavior changes.

## Implementation-change confirmation

This assessment intentionally modifies documentation only. It does not modify runtime behavior, UI, schemas, APIs, persistence, deterministic reasoning, continuity logic, progression logic, AI behavior, tests, or product functionality.
