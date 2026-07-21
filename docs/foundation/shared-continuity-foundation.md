# Shared Continuity Foundation

## Status

This is the canonical approved conceptual definition of the **Shared Continuity Foundation**.

Approval is limited to platform-level responsibility ownership. It does not create a shared runtime, engine, package, schema, API, persistence model, workflow, UI, provider integration, AI behavior, or extraction plan. Current implementation evidence remains the Clinical Continuity application with an OT configuration; Care Continuity remains conceptual architecture-validation evidence and is not implemented.

## Evidence basis

This promotion is based on repository evidence in:

- [Platform Foundation](platform-foundation.md)
- [Candidate Shared Continuity Foundation](candidate-shared-continuity-foundation.md)
- [Clinical Continuity Application Definition](../applications/clinical/clinical-continuity-application-definition.md)
- [Care Continuity Application Definition](../applications/care/care-continuity-application-definition.md)
- [Capability Ownership Assessment](../assessment/capability-ownership-assessment.md)
- [System Architecture](../architecture/system-architecture.md)
- [Program State](../governance/program-state.md)
- [Current Focus](../governance/current-focus.md)
- [Active Roadmap](../governance/active-roadmap.md)
- [Decision Continuity Log](../governance/decision-continuity-log.md)
- [Operating Model](../governance/operating-model.md)

## Purpose

The Shared Continuity Foundation owns the smallest application-neutral continuity responsibilities that are supported by both Clinical Continuity and Care Continuity evidence: preserving a maintained current understanding, separating it from history, relating it to evidence, representing meaningful change, and preserving authority boundaries when current understanding changes.

The foundation exists so applications can share conceptual continuity obligations without sharing clinical, OT, care-specific, caregiver-specific, delivery, or implementation semantics.

## Foundation responsibilities

The approved foundation is responsible for defining these conceptual obligations:

1. maintain a current projection distinct from historical records;
2. compare current and prior state without rewriting history;
3. preserve supported conclusions with evidence lineage;
4. represent meaningful change without deciding application significance;
5. express present relevance and attention state without ranking or workflow meaning;
6. describe reconciliation outcomes for maintained conclusions;
7. preserve current-versus-historical authority;
8. recognize that corrections and state changes can affect downstream freshness.

These are conceptual responsibilities only. Future technical implementation would require a separate approved architecture boundary.

## Approved shared capabilities

| Capability | Approved shared responsibility | Current implementation evidence | Future technical status |
| --- | --- | --- | --- |
| State identity and current-state projection | Distinguish the continuity subject, maintained current projection, and historical records. | Clinical Continuity assembles canonical continuity state; Care Continuity conceptually requires a current supported view of care context. | No shared schema, payload, or engine is approved. |
| Temporal comparison | Represent that current understanding can be compared with prior understanding over time. | Clinical longitudinal and progression references use comparison; Care Continuity requires knowing what changed without rewriting prior care understanding. | No shared comparison algorithm is approved. |
| Event versus current-state separation | Preserve historical events separately from the current operational projection. | Clinical architecture distinguishes live current truth from historical generations; Care Continuity requires current care truth and historical care truth separation. | No storage or event model is approved. |
| Maintained conclusions | Preserve supported conclusions across time until reconciled, corrected, resolved, superseded, or invalidated. | Clinical Continuity preserves clinician-facing conclusions; Care Continuity conceptually needs maintained care understanding. | No conclusion object or lifecycle implementation is approved. |
| Evidence lineage | Keep maintained conclusions traceable to supporting evidence and source context. | Clinical Continuity includes Supporting Evidence; Care Continuity requires supported care conclusions traceable to observations and communication. | No provenance schema or correction workflow is approved. |
| Meaningful-change representation | Represent that a change has continuity relevance and should be explainable by the owning application. | Clinical Continuity includes Why This Changed; Care Continuity requires interpreted care changes. | No explanation format, prompt, or generated output contract is approved. |
| Present relevance | Represent that maintained current state can have present relevance. | Clinical attention and prioritization evidence exist; Care Continuity validates caregiver attention as a non-clinical analog. | No prioritization or ranking implementation is approved. |
| Attention-state abstraction | Represent that something may need application-owned attention now. | Clinical Continuity uses clinician attention; Care Continuity conceptually needs caregiver attention. | No UI, workflow, sort, copy, or action model is approved. |
| Reconciliation lifecycle | Describe neutral outcomes: remains current, monitor, resolved, superseded, replaced, or requires correction/review. | Clinical reconciliation references exist; Care Continuity conceptually needs prior care understanding to be reconciled as evidence changes. | No reconciliation engine or rule set is approved. |
| Current-versus-historical authority | Preserve current truth as the present projection and historical truth as what was known or generated earlier. | Clinical governance establishes live operational state versus immutable snapshots; Care Continuity requires the same separation. | No persistence mechanics are approved. |
| Freshness and correction consequences | Recognize that a changed or corrected current projection can make downstream maintained outputs no longer current. | Clinical stale-state flags and mutation governance show the concern; Care Continuity conceptually needs correction consequences. | No stale flags, schema fields, APIs, regeneration workflow, or provenance hardening are approved. |

## Authority boundaries

The foundation may define neutral continuity obligations, but it does not decide the meaning of those obligations inside an application.

- Applications decide significance, interpretation, communication, and user-facing action meaning.
- Discipline configurations decide discipline vocabulary and domain-specific evidence interpretation.
- Delivery infrastructure decides rendering, routing, persistence, provider integration, and vendor integration only when separately authorized.
- Deterministic systems remain authoritative for supported state transitions within their approved application scope.
- AI may assist with synthesis and communication of supported conclusions, but it is not continuity-state authority, clinical authority, care authority, or unsupported recommendation authority.
- Humans retain verification, correction, judgment, and final-use authority.

## Application relationships

### Clinical Continuity

Clinical Continuity remains the implemented application. It owns clinical significance, clinical reasoning, progression interpretation, reassessment interpretation, operational prioritization, clinician-facing action meaning, clinical attention, clinical evidence interpretation, and clinical current-state use.

The approved foundation can describe neutral continuity responsibilities that Clinical Continuity already exhibits, but this approval does not move Clinical Continuity code, rules, prompts, schemas, or workflows into a shared layer.

### Care Continuity

Care Continuity remains a conceptual architecture-validation application. It supports approval of neutral continuity responsibilities because it also needs maintained care understanding, current-versus-historical separation, evidence-linked conclusions, meaningful change, attention, reconciliation, and correction consequences.

Care Continuity owns care-specific meaning unless later evidence proves otherwise. This document does not implement Care Continuity, define caregiver workflows, define care schemas, or authorize care-to-clinical integration.

### Discipline configurations

Discipline configurations own discipline-specific vocabulary, thresholds, interpretation, and evidence meaning. The current OT configuration owns OT terms and occupational-performance framing, including ADLs, transfers, assistance levels, home environment factors, caregiver feasibility inside OT workflows, and OT-specific decision logic.

The foundation must not absorb OT vocabulary or treat OT evidence as proof of PT, SLP, nursing, or other discipline portability.

### Delivery infrastructure

Delivery infrastructure owns application mechanics such as Next.js routing, React components, Supabase persistence, OpenAI integration, application routes, styling, authentication, provider integrations, and tests. These mechanics may carry continuity information, but they are not the Shared Continuity Foundation.

## Explicit exclusions

The Shared Continuity Foundation does not own:

- clinical significance;
- clinical reasoning;
- operational prioritization;
- progression interpretation;
- reassessment interpretation;
- clinician-facing action meaning;
- caregiver-specific responsibility meaning;
- routine-specific care meaning;
- OT terminology;
- discipline vocabulary;
- provider integrations;
- persistence;
- schemas;
- APIs;
- UI;
- routing;
- AI provider implementation;
- application infrastructure;
- real-clinician validation claims;
- Care Continuity implementation readiness;
- cross-application technical reuse claims.

## Non-goals

This foundation is not a reusable engine, shared package, generic plugin system, clinical decision authority, care authority, UX design, implementation plan, migration plan, or validation claim that conceptual Care Continuity evidence proves runtime reuse.

## Boundary integrity check

Shared abstractions may interact with excluded areas only as neutral obligations:

| Interaction area | Boundary |
| --- | --- |
| Clinical significance, progression, reassessment, and operational prioritization | The foundation can say current state changes may matter; Clinical Continuity decides clinical meaning and priority. |
| Clinician-facing actions | The foundation can say attention exists; Clinical Continuity decides review, treatment, validation, and action language. |
| Caregiver responsibility and routines | The foundation can say maintained state and attention exist; Care Continuity owns responsibility and routine meaning. |
| Discipline vocabulary | The foundation can say evidence supports conclusions; configurations decide domain vocabulary and evidence semantics. |
| Persistence, schemas, APIs, routes, UI, AI providers, and integrations | The foundation can require conceptual preservation of current/history/evidence/freshness; delivery infrastructure decides mechanics only in a later approved boundary. |

## Unresolved architecture questions

1. What neutral terminology should future technical contracts use without importing clinical or care vocabulary?
2. What evidence identity model is sufficient across applications before implementation extraction is safe?
3. How should freshness and correction consequences be represented without binding to clinical stale flags or generated artifacts?
4. Which, if any, Clinical Continuity modules are future extraction seams after validated reuse evidence exists?
5. What evidence is required before responsibility continuity, routine continuity, care-specific evidence identity, non-clinical care authority, or care-to-clinical escalation can be promoted?
6. How can future shared reconciliation avoid importing OT barrier, activity, safety, caregiver-feasibility, or environmental semantics?

## Implementation-change confirmation

This approval is documentation-only. It does not modify runtime behavior, schemas, APIs, persistence, deterministic reasoning, clinical logic, progression logic, reassessment logic, continuity logic, operational prioritization, AI behavior, routes, UI, tests, or Care Continuity implementation.
