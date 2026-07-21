# Clinical Continuity Application Definition

> Repository status note: This is the canonical product-definition reference for Clinical Continuity. It consolidates approved application purpose, responsibilities, authority boundaries, exclusions, and relationships. It is not a UX document, implementation specification, marketing artifact, technical contract, schema, route map, or authorization for runtime behavior changes.

## Evidence basis

This definition is derived from the active authority stack and approved repository evidence:

- [`../../foundation/platform-foundation.md`](../../foundation/platform-foundation.md)
- [`../../architecture/system-architecture.md`](../../architecture/system-architecture.md)
- [`../../governance/program-state.md`](../../governance/program-state.md)
- [`../../governance/current-focus.md`](../../governance/current-focus.md)
- [`../../governance/active-roadmap.md`](../../governance/active-roadmap.md)
- [`../../governance/decision-continuity-log.md`](../../governance/decision-continuity-log.md)
- [`../../governance/operating-model.md`](../../governance/operating-model.md)
- [`../../foundation/candidate-shared-continuity-foundation.md`](../../foundation/candidate-shared-continuity-foundation.md)
- [`clinical-continuity-v0.1.md`](clinical-continuity-v0.1.md)
- [`../../assessment/capability-ownership-assessment.md`](../../assessment/capability-ownership-assessment.md)

Where this document summarizes current implementation, it follows Program State and the capability ownership assessment. Where it describes application identity, it follows Platform Foundation, System Architecture, and Clinical Continuity v0.1.

## Concise definition

Clinical Continuity is the patient-level clinical continuity application in the broader Continuity Platform direction. It preserves maintained clinical understanding across time so clinicians can understand what is currently clinically meaningful, what changed, why it matters, what evidence supports it, and what requires attention now.

The current repository implements Clinical Continuity with an OT configuration. That implementation does not prove a universal shared continuity engine, a Care Continuity application, or portability to PT, SLP, or other disciplines.

## Mission

Clinical Continuity reduces repeated clinical reconstruction burden by maintaining patient-level clinical meaning, evidence lineage, current-versus-historical truth, meaningful change, operational priority, progression and reassessment implications, and clinician-facing continuity communication across time.

## Primary user

The primary user is the clinician responsible for reviewing, verifying, correcting, applying, and communicating patient-level clinical understanding.

In the current implemented configuration, this clinician is framed through OT/home-health workflows. That OT framing is a configuration of Clinical Continuity, not the application identity itself.

## Primary problem solved

Clinicians supporting complex patients often have to reconstruct current clinical meaning from scattered notes, prior generated outputs, recent changes, remembered context, and unresolved constraints. Clinical Continuity solves the patient-level continuity problem of preserving and updating supported clinical understanding so the clinician can act from maintained meaning rather than starting from reconstruction each time.

## Value proposition

Clinical Continuity helps clinicians:

- start from a maintained patient-level clinical understanding rather than a blank reconstruction task;
- distinguish current clinical truth from historical snapshots;
- see what changed and why the change matters clinically and operationally;
- verify evidence behind maintained conclusions;
- understand progression, reassessment, operational priority, and attention implications;
- communicate supported conclusions without turning AI into the clinical reasoning authority.

## Intended outcomes

Clinical Continuity should enable clinicians to:

1. understand current patient state with less reconstruction burden;
2. identify meaningful clinical change and its operational implications;
3. preserve evidence lineage for verification and correction;
4. maintain longitudinal clinical understanding without rewriting historical truth;
5. orient attention to what needs review, intervention, reassessment, monitoring, or correction now;
6. use AI-assisted synthesis only as bounded communication of supported conclusions;
7. retain clinician verification, judgment, correction, and final-use authority.

## Governing question

For an individual patient:

**What is clinically meaningful now, how did it change, what evidence supports it, and what should the clinician attend to next?**

## Application responsibilities

Clinical Continuity owns the application-specific clinical meaning that turns continuity information into clinician-usable understanding. Its responsibilities are conceptual product responsibilities, not technical contracts.

### Clinical understanding

Clinical Continuity owns the maintained interpretation of a patient's clinical situation for clinician use. It connects current patient state, relevant historical context, clinical constraints, safety and function considerations, evidence, and implications into a coherent understanding that can be reviewed and corrected.

### Maintained clinical meaning

Clinical Continuity owns preserving supported clinical conclusions across time until they are reconciled, corrected, resolved, superseded, or invalidated by newer evidence. Maintained meaning is not merely archived documentation; it is the current clinical understanding available for clinician verification and use.

### Clinical significance

Clinical Continuity owns deciding why a change, constraint, observation, or evidence pattern matters clinically. The candidate Shared Continuity Foundation may represent that meaningful change exists, but Clinical Continuity owns the clinical interpretation of significance.

### Operational prioritization

Clinical Continuity owns the current clinical-operational emphasis: what should dominate clinician attention and treatment direction now, based on deterministic clinical reasoning and continuity state. Operational prioritization replaces pathway-selection semantics as the treatment-direction authority and remains distinct from raw progression state.

### Progression interpretation

Clinical Continuity owns interpretation of patient progression, readiness, regression risk, limiting constraints, and why improvement does or does not change the current clinical posture. Progression is clinical and operational, not a generic shared-platform status.

### Reassessment interpretation

Clinical Continuity owns interpreting when changed evidence, unresolved constraints, stale understanding, or continuity movement creates reassessment pressure. Reassessment interpretation explains what clinical review is needed and why; it does not become a shared foundation lifecycle by documentation alone.

### Clinician attention

Clinical Continuity owns clinician-facing attention orientation: what the clinician should review, validate, observe, train, monitor, correct, or act on now. A future shared foundation may include an abstract attention-state concept, but the clinical priority categories and clinician action meaning belong to Clinical Continuity.

### Longitudinal clinical understanding

Clinical Continuity owns patient-level longitudinal clinical understanding across visits, progression checks, generated outputs, current state, and historical snapshots. It must preserve current truth separately from historical truth so prior snapshots remain historically accurate without overriding live clinical state.

### Clinician-facing continuity communication

Clinical Continuity owns the clinical content constraints for communicating supported conclusions to clinicians. AI may help synthesize, organize, explain, or compress supported conclusions, but the application remains responsible for ensuring communication reflects deterministic clinical reasoning, evidence lineage, and clinician verification boundaries.

## Application authority

Clinical Continuity's authority is bounded and shared with deterministic systems and humans:

- deterministic clinical systems are authoritative for supported clinical reasoning, clinical state transitions, continuity state, progression logic, operational prioritization, and current-versus-historical truth handling;
- clinicians retain verification, correction, judgment, and final-use authority;
- AI may synthesize and communicate supported conclusions, but it must not own clinical reasoning, care authority, current truth, unsupported recommendations, or state transitions.

Clinical Continuity owns clinical meaning, but it does not displace clinician authority or convert AI communication into reasoning authority.

## Application boundaries and exclusions

Clinical Continuity does not own the following areas. Each belongs elsewhere because its authority, portability, or implementation responsibility is outside the application-level clinical meaning boundary.

| Excluded area | Owner elsewhere | Why it belongs elsewhere |
| --- | --- | --- |
| Continuity abstractions | Candidate Shared Continuity Foundation | Application-neutral concepts such as state identity, temporal comparison, maintained conclusions, evidence lineage, present relevance, reconciliation, current-versus-historical authority, attention abstraction, and freshness/correction consequences may be shared only after validation. Clinical Continuity consumes these concepts but must not redefine them as clinical-only or claim them as universal. |
| OT terminology | OT configuration | ADLs, transfers, assistance levels, occupational performance, home-health vocabulary, home environment interpretation, caregiver feasibility in OT workflows, and OT-specific reasoning labels are current OT configuration concerns and are not portable by default. |
| Discipline-specific configuration | Relevant discipline configuration | PT, SLP, other clinical disciplines, and future configurations require explicit validation and approval. Clinical Continuity provides the clinical application layer; it does not automatically own every discipline's vocabulary, thresholds, or reasoning labels. |
| Provider integrations | Delivery or integration infrastructure | Provider connectivity is a delivery/integration mechanism, not the product definition of maintained clinical meaning. No provider integration contract is defined here. |
| Persistence | Delivery infrastructure | Supabase integration, storage mechanisms, persisted flags, schemas, and data migration behavior are implementation and delivery concerns. This definition does not authorize persistence changes. |
| UI framework | Delivery infrastructure | Next.js, React components, styling, and rendering mechanics deliver the application but do not define Clinical Continuity's conceptual responsibility. |
| Routing | Delivery infrastructure | Application routes and API routes are implementation mechanics. Clinical Continuity may define what clinical meaning must be communicated, but routing mechanics belong to delivery infrastructure. |
| AI provider implementation | Delivery infrastructure with Clinical Continuity content constraints | OpenAI or any other AI provider is an integration choice. Clinical Continuity constrains clinical communication and authority boundaries, but it does not own vendor implementation. |
| Application infrastructure | Delivery infrastructure | Build system, tests, deployment shape, seeding utilities, and framework mechanics support delivery rather than application-level clinical meaning. |

## Relationship to the Shared Continuity Foundation

Clinical Continuity consumes the candidate Shared Continuity Foundation conceptually as a possible source of neutral continuity primitives. These may include identity, temporal comparison, maintained conclusions, evidence lineage, meaningful-change representation, present relevance, reconciliation, current-versus-historical truth separation, attention-state abstraction, and freshness/correction consequences.

Clinical Continuity applies those concepts in a clinical context. It translates continuity movement into clinical significance, progression and reassessment implications, operational prioritization, and clinician attention. The foundation should not absorb clinical semantics, and Clinical Continuity should not declare its current implementation to be a universal shared engine.

## Relationship to OT configuration

The OT configuration supplies the current implemented discipline language and reasoning vocabulary that Clinical Continuity uses in this repository. It frames clinical meaning through occupational performance, ADLs, transfers, assistance levels, home-health context, home environment, equipment, caregiver feasibility, OT evidence vocabulary, and OT-specific operational decision logic.

Clinical Continuity consumes OT configuration to express clinical continuity in OT terms. OT configuration does not redefine the application identity, and OT-specific concepts must not be assumed portable to PT, SLP, Care Continuity, Patient Management, or other domains without validation and explicit approval.

## Relationship to delivery infrastructure

Delivery infrastructure makes Clinical Continuity runnable and communicable. It includes the Next.js application structure, routes, React UI components, Supabase connectivity, OpenAI-assisted synthesis integration, persistence mechanisms, deterministic tests, application tests, and related framework mechanics.

Clinical Continuity consumes delivery infrastructure to present, store, retrieve, and communicate maintained clinical understanding. Delivery infrastructure does not own clinical meaning, clinical authority, progression interpretation, operational prioritization, or continuity application identity.

## Non-goals

Clinical Continuity is not:

- a UX specification or visual design system;
- an implementation plan;
- an EMR replacement;
- a generic analytics dashboard;
- an autonomous clinician;
- an autonomous AI reasoning system;
- a documentation generator first;
- a scheduling or route-planning system;
- a universal shared continuity engine;
- a Care Continuity design;
- a PT, SLP, or cross-discipline expansion plan;
- a provider-integration strategy;
- a persistence, schema, API, routing, or UI framework definition.

## Product Design handoff definition

Product Design may treat Clinical Continuity as the patient-level clinical application that helps clinicians understand maintained clinical meaning over time. Its product center is clinical continuity: current meaning, meaningful change, evidence lineage, progression and reassessment implications, operational priority, clinician attention, and supported communication.

Product Design should not treat this definition as permission to redesign UX, introduce new features, define Care Continuity, generalize OT into other disciplines, alter authority boundaries, or convert candidate shared foundation concepts into approved shared architecture.

## Open questions reserved for Founder or Architecture

Product Design should not answer the following unresolved questions:

1. Which candidate Shared Continuity Foundation concepts should become approved shared architecture after validation across Clinical Continuity and Care Continuity?
2. What validation evidence is sufficient to move a continuity concept from candidate to approved shared foundation responsibility?
3. What neutral vocabulary should Architecture approve for shared primitives so clinical semantics are not accidentally embedded in platform concepts?
4. Which current Clinical Continuity modules are evidence sources only, and which could become future extraction seams after validation?
5. What minimum evidence identity, provenance, correction, and freshness model is required before shared extraction or hardening begins?
6. How should future non-OT discipline configurations be approved, validated, and bounded without assuming OT portability?
7. What authority checks are required to preserve deterministic and human authority if AI provider implementation or generated communication changes later?

## Implementation-change confirmation

This document is documentation-only. It does not modify runtime behavior, schemas, APIs, persistence, deterministic reasoning, clinical logic, progression logic, continuity logic, AI generation behavior, UI, routes, tests, provider integrations, OT configuration, Patient Management, or Care Continuity implementation.
