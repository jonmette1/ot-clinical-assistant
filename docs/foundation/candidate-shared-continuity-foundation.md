# Candidate Shared Continuity Foundation Definition

## Status and purpose

This document defines the smallest candidate Shared Continuity Foundation that can be described today from repository-backed evidence. It is a documentation and architecture-definition artifact only.

This document does not approve shared architecture, extract implementation, create implementation contracts, or change runtime behavior. The current repository remains the Clinical Continuity Platform implementation with an OT configuration; Care Continuity remains a future application concept and is not implemented here.

## Evidence basis

This definition relies on the active authority stack and the completed capability ownership assessment:

- `docs/foundation/platform-foundation.md`
- `docs/architecture/system-architecture.md`
- `docs/governance/program-state.md`
- `docs/governance/current-focus.md`
- `docs/governance/active-roadmap.md`
- `docs/governance/decision-continuity-log.md`
- `docs/governance/operating-model.md`
- `docs/assessment/capability-ownership-assessment.md`

The assessment is treated as repository-backed evidence. This document does not recreate the assessment inventory and does not add new capability claims beyond that evidence.

## Foundation boundary

The candidate Shared Continuity Foundation owns only the application-neutral continuity concepts that may be reusable after validation:

- continuity mechanics;
- continuity state concepts;
- continuity abstractions.

It does not own:

- clinical reasoning;
- OT terminology;
- caregiver workflows;
- UI;
- persistence;
- provider integrations;
- application-specific interpretation.

The foundation must remain candidate until validated across Clinical Continuity and future Care Continuity. Current Clinical Continuity modules may serve as evidence sources, but they are not thereby renamed into a universal shared engine.

## Smallest candidate foundation

No capability is proven shared today because the repository implements one application layer, Clinical Continuity, with an OT configuration. The following accepted capabilities are therefore candidate abstractions only. Their inclusion means repository evidence supports defining them as possible shared foundation concerns, not extracting or reusing current implementation.

### State identity and current-state projection

- **Responsibility:** Represent a continuity subject's maintained current state separately from raw historical records so an application can reason about what is current now.
- **Ownership:** Candidate Shared Continuity Foundation owns the abstract distinction between identity, current projection, and historical records. Clinical Continuity owns clinical state content. OT configuration owns OT vocabulary inside that state.
- **Authority limits:** Does not define clinical state fields, patient schemas, storage tables, or care-recipient models. Does not decide what clinical or care facts mean.
- **Supporting repository evidence:** The assessment identifies state identity and current-state projection as plausible candidate shared capabilities and notes current implementation evidence through canonical continuity state assembly. Program State also lists state identity/current-state projection and current-versus-historical state handling as candidate primitives.

### Temporal comparison and event/current-state separation

- **Responsibility:** Describe change over time by separating historical events from the current operational projection.
- **Ownership:** Candidate Shared Continuity Foundation owns the continuity abstraction of comparing prior and current state while preserving event history. Clinical Continuity owns longitudinal clinical event semantics.
- **Authority limits:** Does not own progression events, reassessment checks, OT measures, or event storage. Does not rewrite historical truth to simplify current truth.
- **Supporting repository evidence:** The assessment classifies longitudinal event capture and current-state update as plausible evidence for temporal comparison and current-vs-historical truth patterns, while keeping event semantics Clinical Continuity-owned.

### Maintained conclusions with evidence lineage

- **Responsibility:** Preserve supported conclusions across time with traceable evidence so applications can verify, correct, reuse, and communicate maintained understanding.
- **Ownership:** Candidate Shared Continuity Foundation owns the abstract need for maintained conclusions and evidence lineage. Clinical Continuity owns clinician-facing conclusions and clinical evidence interpretation.
- **Authority limits:** Does not determine clinical significance, care authority, evidence sufficiency, provenance hardening design, or correction workflows.
- **Supporting repository evidence:** The assessment identifies maintained conclusions with evidence lineage as plausible and notes canonical continuity state and supported-evidence builders as Clinical Continuity evidence sources. Platform Foundation names maintained understanding and evidence lineage as core principles.

### Meaningful-change representation

- **Responsibility:** Represent that a change matters to the maintained state and should be explainable to the active application.
- **Ownership:** Candidate Shared Continuity Foundation owns the neutral abstraction that meaningful change exists and should be represented. Clinical Continuity owns clinical impact semantics and Why This Changed language.
- **Authority limits:** Does not define clinical impact, safety implications, treatment implications, caregiver instructions, or generated explanations.
- **Supporting repository evidence:** The assessment identifies Why This Changed/conclusion change explanation as plausible only for the shared idea of meaningful-change representation, while assigning clinical impact semantics to Clinical Continuity.

### Present relevance and attention-state abstraction

- **Responsibility:** Represent that some current state requires attention now without prescribing the application's workflow or priority language.
- **Ownership:** Candidate Shared Continuity Foundation owns the abstract attention/relevance concept. Clinical Continuity owns clinical attention orientation, review priority, patient caseload triage, and command-center action meaning. Future Care Continuity would own caregiver-facing attention meaning if validated.
- **Authority limits:** Does not own clinical triage ranking, Session Focus, Visit Briefing, UI display, caregiver workflow, or action copy.
- **Supporting repository evidence:** The assessment identifies clinical attention state and patient caseload prioritization as plausible only for attention abstraction, and explicitly keeps clinical categories, statements, sorting, and ranking Clinical Continuity-owned.

### Reconciliation lifecycle

- **Responsibility:** Represent that prior supported conclusions may remain current, require monitoring, resolve, or be superseded when new evidence appears.
- **Ownership:** Candidate Shared Continuity Foundation owns the abstract reconciliation lifecycle and current-versus-historical truth preservation. Clinical Continuity owns clinical reconciliation rules for barriers, reassessment triggers, and activity constraints.
- **Authority limits:** Does not own clinical evidence rules, OT barrier identity matching, monitoring thresholds, activity-constraint semantics, or deterministic clinical authority.
- **Supporting repository evidence:** The assessment identifies continuity reconciliation as plausible for a shared reconciliation pattern while keeping current rules Clinical Continuity-owned. Architecture references require deterministic authority and preserving historical truth.

### Freshness and correction consequences

- **Responsibility:** Represent that maintained outputs may become stale or require downstream reconsideration after continuity state changes or corrections.
- **Ownership:** Candidate Shared Continuity Foundation owns the neutral concept that continuity mutations can affect freshness/currentness. Clinical Continuity owns clinical reasoning, plan, and module staleness semantics. Delivery infrastructure owns persisted flags.
- **Authority limits:** Does not define schema flags, persistence behavior, API behavior, generated-plan lifecycle, detail-module lifecycle, or correction/provenance hardening.
- **Supporting repository evidence:** The assessment identifies stale-state flags and continuity mutation consequences as plausible only for correction/freshness abstraction and warns that current flags are named around clinical reasoning, plans, and generated modules.

## Application relationships

### Clinical Continuity

Clinical Continuity remains the implemented application layer. It owns clinical significance, progression interpretation, reassessment support, safety interpretation, treatment implications, clinician verification, operational prioritization, clinical attention orientation, and clinical current-versus-historical truth handling.

The candidate foundation may eventually supply neutral continuity abstractions that Clinical Continuity uses, but this document does not move current Clinical Continuity logic into a shared layer. Existing implementation remains authoritative only for the Clinical Continuity application unless future validation proves reuse.

### OT configuration

The OT configuration remains the implemented Clinical Continuity domain configuration. It owns occupational performance framing, ADL and transfer vocabulary, assistance-level interpretation, home environment factors, caregiver feasibility within OT workflows, OT-specific evidence vocabulary, and OT-specific operational decision logic.

The candidate foundation must not absorb OT terms, thresholds, clinical labels, or reasoning vocabulary. OT evidence may demonstrate that continuity abstractions are useful in one configuration, but it does not prove portability to PT, SLP, Care Continuity, or other domains.

### Future Care Continuity

Care Continuity remains a future application concept under validation. It may pressure-test candidate foundation abstractions around care state, responsibilities, observations, instructions, communication, and caregiver attention.

This document does not define Care Continuity implementation contracts, workflows, schemas, UI, provider integrations, or caregiver authority. Any Care Continuity relationship to the foundation remains hypothetical until approved validation or demonstrator work supplies evidence.

## Excluded capabilities

The following capabilities are intentionally excluded from the candidate Shared Continuity Foundation.

| Capability or area | Exclusion reason |
| --- | --- |
| Deterministic clinical decision scoring and clinical decision engine behavior | Clinical Continuity responsibility. It performs clinical significance interpretation and deterministic clinical reasoning, which active architecture assigns to Clinical Continuity. |
| OT intake vocabulary, ADLs, transfers, assistance levels, home-health semantics, occupational performance, home environment, and OT caregiver feasibility | OT-specific. The architecture explicitly says OT-specific fields, thresholds, terms, and reasoning labels must not be assumed portable without validation. |
| Progression state, readiness interpretation, and progression narrative | Clinical Continuity responsibility with OT configuration semantics. The assessment warns it depends on clinical progression, safety, caregiver feasibility, and OT/home-health task meaning. |
| Reassessment Summary implementation | Clinical Continuity responsibility. Only the abstract reconciliation lifecycle is a candidate; the reassessment workflow and clinical implications remain application-specific and unresolved for shared use. |
| Session Focus | Clinical Continuity responsibility. It identifies clinician visit priorities and uses clinician workflow language rather than application-neutral attention semantics. |
| Patient caseload prioritization and Command Center next-action sorting/ranking | Clinical Continuity plus delivery UI. A generic attention abstraction is plausible, but current ranking and next-action behavior are clinical workflow logic. |
| Visit Briefing, Case Workspace, and Clinical Translation Workspace UI | Clinical Continuity application UI and delivery infrastructure. UI composition is not evidence of reusable foundation architecture. |
| AI-assisted detail modules, OpenAI prompts, generated plans, and generated clinical output contracts | Delivery infrastructure plus Clinical Continuity communication constraints. AI may synthesize supported conclusions but must not become shared reasoning authority. |
| OpenAI API integration | Delivery infrastructure. Vendor integration is not a continuity foundation capability. |
| Supabase persistence integration and persistence mechanisms | Delivery infrastructure. Persistence schemas and storage mechanics are explicitly outside this foundation definition. |
| Next.js routes, React components, styling, and application routing | Delivery infrastructure and application UI. Rendering and route mechanics do not define shared continuity architecture. |
| Seed data, persona simulation artifacts, and deterministic/application tests | Test or validation infrastructure. They support current-app confidence but do not prove cross-application reuse or real-clinician validation. |
| Provider integrations | Excluded by boundary. The repository evidence does not establish provider integration as a candidate shared continuity foundation capability. |
| Caregiver workflows | Future Care Continuity/application responsibility. The foundation may include attention/relevance abstractions, but it does not own caregiver workflow design. |
| Application-specific interpretation | Application responsibility. Clinical interpretation belongs to Clinical Continuity, OT interpretation belongs to OT configuration, and any future care interpretation would belong to Care Continuity after validation. |

## Open Architecture questions

The following unresolved Architecture questions must be answered before future implementation or technical extraction. This document intentionally does not answer them.

1. What neutral boundary vocabulary should be approved for state identity, temporal comparison, maintained conclusion, evidence lineage, relevance, reconciliation, attention, freshness, and current/historical truth?
2. Which existing Clinical Continuity modules are evidence sources only, and which, if any, are possible future extraction seams after validation?
3. What minimum evidence identity and provenance model is required before shared extraction can begin?
4. How should freshness and correction consequences be described without binding the future foundation to clinical reasoning, generated-plan, or detail-module terminology?
5. What validation evidence from Care Continuity is sufficient to move a capability from candidate to approved shared architecture?
6. How should a future shared reconciliation abstraction avoid importing clinical evidence semantics, OT barrier identity matching, or caregiver-environment assumptions?
7. What authority checks are required to ensure AI-assisted synthesis remains communication support rather than continuity-state or clinical-reasoning authority?

## Implementation-change confirmation

This definition is documentation-only. It does not modify product functionality, runtime behavior, schemas, APIs, persistence, deterministic reasoning, continuity logic, progression logic, AI behavior, UI, tests, provider integrations, Clinical Continuity workflows, OT configuration, or Care Continuity implementation.
