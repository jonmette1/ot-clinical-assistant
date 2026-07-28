# Clinical Continuity Platform Architecture Alignment Report

## Method

This report compares intended design from active foundation, architecture, governance, and cited subordinate references with runtime evidence in `src/`. Ratings mean:

- **Fully aligned:** observed ownership and behavior match the documented contract.
- **Mostly aligned:** core contract is present with bounded implementation debt.
- **Partially aligned:** important elements exist, but ownership/flow is incomplete or inconsistent.
- **Divergent:** implementation contradicts a material active contract.

Assessments distinguish repository observation from inference. “Transitional” is not synonymous with accidental defect.

## Alignment summary

| Subsystem | Alignment | Difference assessment |
| --- | --- | --- |
| Platform/application/configuration boundaries | Fully aligned | Intentional |
| Deterministic clinical reasoning authority | Fully aligned | Intentional |
| AI synthesis boundary | Mostly aligned | Transitional/uncertain enforcement |
| Canonical continuity assembly | Partially aligned | Explicitly transitional |
| Progression and operational emphasis separation | Mostly aligned | Transitional compatibility |
| Reconciliation | Mostly aligned | Intentional incremental implementation |
| Longitudinal baseline/event/current-state separation | Mostly aligned | Intentional, with persistence uncertainty |
| Historical generations versus current truth | Mostly aligned | Intentional, with terminology/operations caveats |
| Continuity mutation/freshness governance | Partially aligned | Transitional |
| Evidence lineage and correction | Partially aligned | Known deferred hardening |
| Visit Briefing workflow | Mostly aligned | Intentional migration residue |
| Shared Continuity Foundation | Fully aligned | Intentionally conceptual only |
| Care Continuity / discipline expansion | Fully aligned | Intentionally absent |
| Delivery/persistence encapsulation | Partially aligned | Likely evolutionary/uncertain |

## Subsystem comparisons

### Product ownership layers

**Intended architecture.** Continuity Platform is the broader direction; Shared Continuity Foundation is conceptual; Clinical Continuity owns clinical meaning; OT owns discipline vocabulary; Care Continuity is future only.

**Current implementation.** Source implements OT-centered case intake, deterministic clinical reasoning, progression, attention, operational prioritization, and clinician workflows. No shared runtime or Care application/package exists.

**Alignment:** **Fully aligned.**
**Evidence:** [Platform Foundation](../foundation/platform-foundation.md), [System Architecture](system-architecture.md), `src/lib/clinicalDecisionEngine.ts`, `src/lib/buildProgressionState.ts`.
**Assessment:** Intentional. Some repository/package naming (`ot-clinical-assistant`) reflects origin but does not create a competing architecture.

### Deterministic clinical reasoning

**Intended architecture.** Deterministic systems own clinical reasoning and supported state transitions; AI may only synthesize/communicate.

**Current implementation.** `buildClinicalDecisionModel` scores strategies from normalized structured inputs. Progression, attention, reconciliation, focus, and next-action calculations are deterministic TypeScript modules. Plan prompts explicitly identify the deterministic model as authoritative.

**Alignment:** **Fully aligned.**
**Evidence:** [DCL-001](../governance/decision-continuity-log.md#dcl-001--deterministic-systems-remain-authoritative), `src/lib/clinicalDecisionEngine.ts`, `src/app/api/generate-plan/route.ts`.
**Assessment:** Intentional. AI JSON can still influence stored operational wording, but it is downstream of the deterministic model.

### AI synthesis

**Intended architecture.** AI is limited to synthesis, organization, explanation, and communication of supported conclusions and cannot introduce unsupported authority.

**Current implementation.** Generation routes pass deterministic inputs and strong prompt constraints, parse structured JSON, and add deterministic continuity interpretation. Detail modules are prompted not to create a new plan.

**Alignment:** **Mostly aligned.**
**Evidence:** `src/app/api/generate-plan/route.ts`, `src/app/api/generate-detail-module/route.ts`, [Prompt Library](../ai-workflows/prompt-library.md).
**Assessment:** The boundary is intentional; enforcement is partly prompt-based and schemas are not runtime-validated beyond JSON parsing, so provider output compliance is uncertain/transitional rather than proven.

### Canonical continuity pipeline

**Intended architecture.** A canonical sequence should assemble normalized case, deterministic decision, progression, continuity interpretation, and freshness consequences without competing sources of truth.

**Current implementation.** `buildCanonicalContinuityState` represents that seam, but intake, workspace, generate-plan, edit, and seed flows also assemble subsets independently. Governance explicitly calls new-case assembly and API-owned attachment transitional.

**Alignment:** **Partially aligned.**
**Evidence:** `src/lib/buildCanonicalContinuityState.ts`, `src/app/new-case/page.tsx`, `src/app/cases/[id]/CaseWorkspaceClient.tsx`, [Canonical Pipeline](canonical_continuity_pipeline.md), [DCL-024](../governance/decision-continuity-log.md#dcl-024--new-case-progression-assembly-and-related-continuity-attachment-remain-transitional-areas).
**Assessment:** Explicitly transitional, not an accidental divergence and not authorization to refactor.

### Progression versus operational emphasis

**Intended architecture.** Progression classifies clinical continuity condition; operational emphasis describes what should dominate current treatment attention. No one-to-one mapping is allowed.

**Current implementation.** Separate progression and operational-prioritization objects/builders exist. Progression checks refresh prioritization only when `treatmentDirectionChanged` is true. Some legacy `commandCenter` and strategy/pathway compatibility names remain.

**Alignment:** **Mostly aligned.**
**Evidence:** [DCL-016](../governance/decision-continuity-log.md#dcl-016--progression-state-and-operational-emphasis-remain-distinct), `src/lib/buildProgressionState.ts`, `src/app/api/progression-check/route.ts`, `src/lib/currentFocusProgressionAwareness.ts`.
**Assessment:** Core separation is intentional; naming and backward-compatible structures are documented transitional debt.

### Reconciliation

**Intended architecture.** Prior conclusions must be tested against current evidence. Barrier/activity reconciliation may change relevance but must not independently select treatment; contradiction and history rules must be preserved.

**Current implementation.** Dedicated barrier, activity-constraint, and trigger reconcilers feed next-action calculation and have deterministic tests. Reconciliation is concentrated in downstream projections rather than uniformly persisted as canonical state.

**Alignment:** **Mostly aligned.**
**Evidence:** `src/lib/continuity/*`, `src/lib/commandCenterNextAction.ts`, [Continuity Reconciliation](references/continuity_reconciliation_architecture.md), [Activity Constraint Reconciliation](references/activity_constraint_reconciliation_architecture.md).
**Assessment:** Intentional incremental implementation. Detail-module dependency standardization remains transitional.

### Longitudinal state and events

**Intended architecture.** Original baseline never changes, current state mutates, and longitudinal history remains immutable. Progression checks create events and update present attention/orientation.

**Current implementation.** The progression API initializes baseline only when null, builds and inserts an event with snapshots, updates current longitudinal/attention state, and leaves generations untouched.

**Alignment:** **Mostly aligned.**
**Evidence:** [Progression Check Data Model](../clinical_model/Progression_Check_Data_Model.md), `src/app/api/progression-check/route.ts`, `src/lib/longitudinal/*`.
**Assessment:** Intentional. “Never changes” is guarded in application logic for this route, but repository-absent database constraints and other direct browser writes prevent a fully verified rating.

### Current versus historical truth

**Intended architecture.** Live case state owns current truth; generations and event snapshots are immutable historical truth and must not become editing authorities.

**Current implementation.** Workspace separately loads live case, generations, and events; progression mutations update the case and append events without updating generations. Historical generation payloads are selectable for review/copy/regeneration-related workflows, and generation records can be deleted.

**Alignment:** **Mostly aligned.**
**Evidence:** [DCL-019](../governance/decision-continuity-log.md#dcl-019--historical-snapshots-are-immutable-live-operational-state-owns-current-truth), `src/app/cases/[id]/CaseWorkspaceClient.tsx`, `src/app/api/progression-check/route.ts`.
**Assessment:** Content-authority separation is intentional. Deletability is a retention question rather than evidence that snapshots are mutable; the precise historical-retention contract is uncertain.

### Mutation and freshness consequences

**Intended architecture.** Meaningful current-state changes must trigger deterministic recalculation/regeneration/stale consequences across dependent projections.

**Current implementation.** Multiple workspace/edit mutation paths update cases, generated output, generations, and stale fields. Some paths recompute canonical payload/progression, but orchestration is distributed.

**Alignment:** **Partially aligned.**
**Evidence:** [Mutation Lifecycle](continuity_mutation_lifecycle.md), [DCL-018](../governance/decision-continuity-log.md#dcl-018--continuity-mutations-require-deterministic-governance), Supabase update paths in `src/app/cases/[id]/CaseWorkspaceClient.tsx` and `src/app/cases/[id]/edit/page.tsx`.
**Assessment:** Transitional. Repository governance already identifies attachment/standardization debt; no opportunistic refactor is authorized.

### Evidence lineage and human correction

**Intended architecture.** Maintained conclusions remain traceable to evidence and users can verify/correct them; correction/provenance consequences remain safe.

**Current implementation.** Deterministic builders provide Supporting Evidence and Why This Changed, generations/events retain source snapshots, and edit/mutation workflows exist. A unified provenance identity/correction/rejection model is not visible.

**Alignment:** **Partially aligned.**
**Evidence:** `src/lib/buildConclusionEvidence.ts`, `src/lib/buildConclusionChangeExplanation.ts`, `src/app/cases/[id]/components/HistoricalSnapshotsSection.tsx`, [Program State known gaps](../governance/program-state.md#known-gaps).
**Assessment:** Known and intentionally deferred to correction/provenance hardening after validation, not proven accidental drift.

### Visit Briefing and patient caseload

**Intended architecture.** Visit Briefing is the primary patient-level orientation surface; patient management surfaces provide caseload awareness without becoming a separate implemented application.

**Current implementation.** `/cases/[id]` renders the workspace/briefing; `/cases` derives patient summaries and views. Many internal names still say Command Center.

**Alignment:** **Mostly aligned.**
**Evidence:** [DCL-021](../governance/decision-continuity-log.md#dcl-021--visit-briefing-is-the-primary-clinician-patient-level-workflow-surface), `src/app/cases/[id]/page.tsx`, `src/app/cases/patientCaseload.ts`.
**Assessment:** Current workflow is intentional; internal naming is migration residue and should not be treated as product authority.

### Persistence and delivery encapsulation

**Intended architecture.** Delivery infrastructure carries, but does not own, clinical/continuity meaning. Current and historical authority must remain preserved.

**Current implementation.** Pure reasoning modules are delivery-independent, but client components directly access Supabase and contain mutation orchestration. No repository-local schema/types/policy/migration layer is visible.

**Alignment:** **Partially aligned.**
**Evidence:** `src/lib/supabase.ts`, Supabase calls under `src/app/`, [System Architecture](system-architecture.md).
**Assessment:** Likely evolutionary implementation. Whether deployed database controls compensate is uncertain; repository evidence cannot establish it.

## No major divergent subsystem found

The audit found material transitional and partial-alignment areas, but no major subsystem rated **Divergent** from active authority. This conclusion does not mean the implementation is complete, production-ready, or validated by real clinicians. It means observed gaps are generally already bounded as transitional/deferred or do not contradict the governing ownership model.
