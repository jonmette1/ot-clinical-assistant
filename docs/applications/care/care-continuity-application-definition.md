# Care Continuity Application Definition

## Status and purpose

Care Continuity is a conceptual future application under the broader Continuity Platform direction. It is not implemented in this repository.

This definition exists for architectural validation only: it pressure-tests whether the candidate Shared Continuity Foundation remains internally consistent when applied to a second application that maintains care understanding rather than clinical understanding.

This document does not authorize product functionality, UX design, workflows, schemas, APIs, persistence, deterministic logic, AI behavior, infrastructure, or implementation tasks.

## Evidence basis

This definition is derived from the active authority stack and subordinate validation references:

- [`../../foundation/platform-foundation.md`](../../foundation/platform-foundation.md)
- [`../../architecture/system-architecture.md`](../../architecture/system-architecture.md)
- [`../../governance/program-state.md`](../../governance/program-state.md)
- [`../../governance/current-focus.md`](../../governance/current-focus.md)
- [`../../governance/active-roadmap.md`](../../governance/active-roadmap.md)
- [`../../governance/decision-continuity-log.md`](../../governance/decision-continuity-log.md)
- [`../../governance/operating-model.md`](../../governance/operating-model.md)
- [`../../foundation/candidate-shared-continuity-foundation.md`](../../foundation/candidate-shared-continuity-foundation.md)
- [`../clinical/clinical-continuity-application-definition.md`](../clinical/clinical-continuity-application-definition.md)
- [`../../assessment/capability-ownership-assessment.md`](../../assessment/capability-ownership-assessment.md)

Clinical Continuity is treated as the implemented application. Care Continuity is treated as conceptual only.

## Concise definition

Care Continuity is the conceptual continuity application for maintaining shared care understanding over time: what is currently understood about a person's day-to-day care context, responsibilities, routines, observations, support needs, communication needs, and caregiver attention.

Its architectural center is maintained care understanding, not clinical reasoning.

## Purpose

Care Continuity would reduce repeated care reconstruction burden for people coordinating or providing day-to-day support. It would preserve what is currently understood about care context, what has changed, why those changes matter for care support, what requires caregiver attention, and which prior care understandings remain current versus historical.

## Primary users

Conceptually, primary users may include:

- family caregivers;
- informal caregivers;
- paid non-clinical caregivers;
- care coordinators or support coordinators acting in non-clinical care-continuity roles;
- authorized helpers who need a maintained understanding of care responsibilities and support context.

This definition does not validate personas, purchasing models, permissions, roles, workflows, or UX.

## Primary problem solved

Care situations change across routines, responsibilities, observations, instructions, household realities, support availability, and caregiver attention. Without maintained care understanding, caregivers must repeatedly reconstruct what is happening, what remains true, what changed, what needs follow-up, and what others need to know.

Care Continuity conceptually addresses that reconstruction burden by maintaining care-relevant understanding across time while preserving evidence lineage and human verification.

## Responsibilities

### Maintained care understanding

Care Continuity owns the concept of maintained care understanding: the current supported view of care context, responsibilities, routines, support needs, observations, communication needs, and caregiver attention.

Foundation validation: this validates the candidate foundation concept of maintained conclusions when the conclusion is care-oriented rather than clinical. It also exposes that the neutral abstraction should not use clinical terms such as diagnosis, impairment, progression, treatment implication, or reassessment as universal language.

### Caregiver context

Care Continuity owns caregiver-context meaning conceptually: who is involved in support, what constraints affect support, what information caregivers need to coordinate safely within non-clinical authority, and what context must travel between people over time.

Foundation validation: this supports state identity and current-state projection as candidate shared concerns, but it reveals a terminology tension because current repository examples often treat caregiver feasibility as an OT clinical factor rather than as a care-application center.

### Responsibilities

Care Continuity owns the care meaning of responsibilities: who is expected to notice, communicate, perform, monitor, prepare, remind, coordinate, or follow up on non-clinical care support.

Foundation validation: responsibility continuity appears to fit maintained understanding, present relevance, attention orientation, and evidence lineage. It may require an abstraction not yet named in the candidate foundation: responsibility ownership or care obligation continuity. This is evidence only, not a redesign.

### Observations

Care Continuity owns non-clinical observation continuity conceptually: what caregivers noticed, when it was noticed, what appears changed, what remains uncertain, and what requires verification or communication.

Foundation validation: observations validate temporal comparison, meaningful-change representation, evidence lineage, and current-versus-historical truth separation. The conflict is that current implemented observation and event patterns are clinical/OT-oriented and cannot be assumed portable.

### Routines

Care Continuity owns routine understanding conceptually: known patterns, changes in routines, practical supports around routines, and care-relevant context that helps avoid repeated reconstruction.

Foundation validation: routines validate state preservation and temporal comparison, but they may be incomplete under the current candidate foundation because routine stability, disruption, and practical workaround concepts are not explicitly named shared capabilities.

### Support needs

Care Continuity owns care support needs conceptually: non-clinical needs for assistance, preparation, supervision, reminders, environment setup, communication, or escalation to a human decision-maker when appropriate.

Foundation validation: support needs fit maintained conclusion, present relevance, attention state, reconciliation, and correction consequences. A tension remains because implemented repository language around assistance levels, home environment, safety, and caregiver feasibility is OT-configured clinical vocabulary and should not leak into Care Continuity as a universal model.

### Care communication

Care Continuity owns the care meaning of communicating supported care understanding to appropriate humans. Communication may organize what is currently understood, what changed, what is uncertain, and what requires attention.

Foundation validation: this validates evidence-linked maintained conclusions and AI-assisted synthesis boundaries in principle, but the candidate foundation should not inherit Clinical Continuity prompt contracts, generated-plan artifacts, provider-facing documentation, or clinical communication authority.

### Caregiver attention

Care Continuity owns caregiver attention conceptually: the care-relevant items that require awareness, verification, communication, follow-up, monitoring, or human judgment now.

Foundation validation: caregiver attention strongly validates attention orientation as a candidate shared abstraction. It also exposes a conflict: current attention implementations use clinical categories and clinical review language, so only the abstract attention concept is supported as shared evidence.

### Longitudinal care understanding

Care Continuity owns longitudinal care understanding conceptually: preserving prior care state, distinguishing current truth from historical truth, recognizing meaningful change, and avoiding silent rewriting of previous care understanding.

Foundation validation: this validates temporal comparison, event/current-state separation, current-versus-historical truth separation, reconciliation, and correction consequences. It remains incomplete until care-specific evidence identity and correction consequences are validated.

## Application authority

Care Continuity authority is care-continuity authority, not clinical authority.

Conceptually:

- deterministic systems would remain authoritative for supported care-continuity state transitions if implemented;
- AI may assist with synthesis, organization, explanation, and communication of supported care conclusions;
- AI must not become an autonomous care authority or unsupported recommendation engine;
- humans retain verification, correction, judgment, and final-use authority;
- clinicians and clinical systems retain clinical reasoning, diagnosis, treatment planning, and clinical escalation authority;
- current care truth and historical care truth must remain distinct.

Foundation validation: the candidate foundation's authority model remains consistent if care authority is explicitly bounded. A tension remains because the foundation currently has clearer language for clinical authority than for care authority.

## Boundaries

Care Continuity conceptually owns care meaning only. It may consume candidate shared continuity concepts, but it does not own the Shared Continuity Foundation itself.

| Boundary area | Owner | Care Continuity relationship |
| --- | --- | --- |
| Shared continuity concepts | Candidate Shared Continuity Foundation | Care Continuity pressure-tests state identity, temporal comparison, maintained conclusions, evidence lineage, meaningful change, present relevance, reconciliation, attention abstraction, current/historical truth separation, and freshness consequences. |
| Clinical meaning | Clinical Continuity | Care Continuity does not determine clinical significance, progression, reassessment, safety interpretation, treatment implication, or clinician-facing clinical priority. |
| OT vocabulary | OT configuration | Care Continuity must not inherit ADL/transfer/assistance-level/home-health OT semantics as universal care language. |
| Future discipline vocabulary | Future discipline configurations | Care Continuity does not define PT, SLP, nursing, or other discipline-specific clinical vocabulary. |
| Delivery mechanics | Delivery infrastructure | Care Continuity does not define UI, routes, APIs, persistence, authentication, integrations, or vendor services. |

## Explicit exclusions

Care Continuity does not own:

- clinical reasoning;
- diagnosis;
- treatment planning;
- discipline vocabulary;
- clinical progression interpretation;
- reassessment support;
- clinical safety interpretation;
- provider integrations;
- persistence;
- schemas;
- APIs;
- UI;
- infrastructure;
- AI implementation;
- autonomous recommendations;
- claim of real-caregiver validation;
- implementation readiness.

## Relationship to the Shared Continuity Foundation

Care Continuity is a validation lens for the candidate Shared Continuity Foundation. It does not prove the foundation, redesign it, or authorize extraction.

Care Continuity appears to validate several foundation concepts at an architectural level because care support also needs maintained state, temporal comparison, meaningful change, evidence lineage, attention orientation, reconciliation, current-versus-historical truth separation, and correction consequences.

Care Continuity also exposes missing or incomplete abstractions: responsibility continuity, routine disruption, care-context identity, caregiver communication context, and non-clinical care authority may need clearer vocabulary before any shared implementation is declared.

## Relationship to Clinical Continuity

Clinical Continuity and Care Continuity are distinct applications. Clinical Continuity maintains clinical understanding for clinicians. Care Continuity would maintain care understanding for caregivers and care coordinators.

They may share candidate continuity primitives only after validation. They must not share clinical interpretation, OT vocabulary, progression semantics, treatment implications, provider-facing artifacts, or clinician workflow assumptions by default.

A future interaction between applications, if ever approved, would require explicit authority boundaries so that care observations can inform human awareness without becoming clinical conclusions and clinical conclusions can be communicated without turning Care Continuity into a clinical system.

## Relationship to future discipline configurations

Care Continuity is not a discipline configuration. It should not be treated as PT, SLP, OT-generalized, nursing, or another clinical discipline.

Future discipline configurations would belong under Clinical Continuity or another explicitly approved clinical application layer. Care Continuity may coexist with those configurations as a distinct care-understanding application, but it does not define their vocabulary, reasoning, assessment, treatment, or evidence standards.

## Foundation Validation Summary

| Candidate shared capability | Care Continuity assessment | Why |
| --- | --- | --- |
| State identity and current-state projection | Validated | Care Continuity needs a current supported view of care context, responsibilities, routines, observations, and support needs. Current repository implementation remains clinical/OT-specific evidence only. |
| Temporal comparison and event/current-state separation | Validated | Care understanding depends on knowing what changed over time without rewriting historical observations or prior supported care understanding. |
| Maintained conclusions with evidence lineage | Validated | Care Continuity would need supported care conclusions traceable to observations, communication, and source context. Evidence identity remains incomplete for shared implementation. |
| Meaningful-change representation | Validated | Care changes matter only when interpreted for care support, communication, responsibility, or attention. Clinical impact semantics are not portable. |
| Present relevance and attention-state abstraction | Validated | Caregiver attention is a clear non-clinical analog to attention orientation, but current clinical attention categories are not reusable as-is. |
| Reconciliation lifecycle | Validated | Prior care understandings may remain current, require monitoring, become resolved, or be replaced by newer supported understanding. Current reconciliation rules are clinical and OT-heavy. |
| Current versus historical authority | Validated | Care Continuity requires a current supported care projection while preserving historical observations and prior understandings. |
| Freshness and correction consequences | Incomplete | Care corrections and changed observations should affect downstream maintained understanding, but current stale flags are tied to clinical reasoning, generated plans, and modules. |
| Responsibility continuity | Incomplete | Care Continuity suggests responsibility ownership and follow-up continuity may be central, but this abstraction is not explicit in the candidate foundation. |
| Routine continuity and disruption | Incomplete | Routines are central to care understanding, but the current candidate foundation does not explicitly name routine stability, disruption, or workaround continuity. |
| Delivery infrastructure | Unnecessary | UI, persistence, routes, provider integrations, and AI vendor implementation are not needed to validate the conceptual foundation. |
| Clinical progression and reassessment semantics | Unnecessary | These are Clinical Continuity responsibilities and should not be imported into Care Continuity. |
| OT assistance-level and home-health vocabulary | Unnecessary | These are OT configuration concerns and should not become shared foundation vocabulary. |

## Architecture Tension Register

| Tension | Where it appears | Evidence collected | Do not resolve in this document |
| --- | --- | --- | --- |
| Caregiver feasibility has dual meaning | OT configuration and conceptual Care Continuity | In current repository authority, caregiver feasibility is an OT/home-health clinical reasoning concern; in Care Continuity, caregiver context is central care meaning. | Keep OT caregiver feasibility clinical/OT-owned; collect evidence that care-context vocabulary needs separation. |
| Attention language is clinical by implementation | Clinical attention state and caseload prioritization | Current implementations derive clinical review priorities and clinical categories; Care Continuity validates only abstract caregiver attention. | Do not generalize clinical attention categories. |
| Reconciliation rules are clinical/OT-heavy | Barrier, reassessment trigger, and activity-constraint reconciliation | Existing reconciliation depends on clinical evidence, progression, barriers, and activity constraints. Care Continuity validates reconciliation as a pattern only. | Do not extract reconciliation implementation. |
| Evidence lineage lacks care-specific identity | Candidate foundation and current clinical evidence builders | Evidence lineage is shared in principle, but current evidence examples are clinician-facing and clinical. | Do not define schemas or provenance workflow. |
| Freshness language leaks generated-plan concepts | Stale-state flags | Current freshness evidence uses `reasoning_stale`, `plan_stale`, and `modules_stale`, which imply clinical reasoning and generated artifacts. | Do not rename or redesign flags. |
| Routine continuity is absent from shared vocabulary | Care Continuity responsibilities | Care Continuity likely needs routine stability/disruption understanding, but the candidate foundation does not name it. | Record as incomplete abstraction only. |
| Responsibility continuity is absent from shared vocabulary | Care Continuity responsibilities | Care support depends on who notices, follows up, communicates, or helps, but this is not explicit in candidate capabilities. | Record as incomplete abstraction only. |
| Clinical escalation boundary is undefined | Care authority section | Care observations may require human escalation, but the foundation does not define care-to-clinical authority transfer. | Do not invent workflows or integrations. |
| Provider integration assumptions could leak | Exclusions and relationship to Clinical Continuity | Care communication could be mistaken for provider integration or clinical documentation. | Keep provider integrations excluded. |
| Discipline vocabulary could leak into care | OT configuration and future discipline relationship | ADLs, transfers, assistance levels, safety, and home environment terms may be useful care language but are currently OT configuration semantics. | Do not declare them shared or Care-owned without validation. |
| Architecture can become application-specific through examples | Foundation pressure test | Clinical Continuity has implemented evidence; Care Continuity is conceptual, so shared abstractions risk inheriting clinical implementation details. | Treat Clinical implementation as evidence, not universal architecture. |

## Unresolved questions

1. What neutral vocabulary can describe care authority without implying clinical authority or autonomous care decision-making?
2. Does responsibility continuity belong in the Shared Continuity Foundation, Care Continuity only, or a future subordinate care reference?
3. Does routine continuity belong in the Shared Continuity Foundation, Care Continuity only, or future application-specific modeling?
4. What minimum evidence identity and correction model is required before care observations can support maintained care conclusions?
5. How can care observations remain useful without becoming clinical conclusions or provider-integration claims?
6. Which caregiver concepts are care-application concerns versus OT clinical factors about caregiver feasibility?

## Implementation-change confirmation

This document intentionally modifies documentation only. It does not implement Care Continuity, define UX, change schemas, change APIs, change persistence, alter clinical reasoning, alter continuity logic, alter progression logic, change AI behavior, or create implementation tasks.
