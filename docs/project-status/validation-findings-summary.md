# Validation Findings Summary

Last updated: 2026-06-10

## Evidence Boundary

The repository supports three evidence types:

1. **Implemented behavior and deterministic tests** for progression, reconciliation, recommendation evolution, and preview consistency.
2. **Internal workflow and visual review** represented by UX revisions, lifecycle screenshots, and repeated hierarchy/compression changes.
3. **Persona-style simulation findings** supplied as project learning, but without a populated experiment corpus in `docs/persona-simulation/`.

No finding below should be interpreted as proof of clinical accuracy, real-world adoption, measured time savings, or willingness to pay. The empty persona-simulation templates are themselves an evidence-management gap: future studies should preserve scenarios, observations, failures, and decisions in the repository.

## Persona Simulation Summary

Persona-oriented review shifted the product from generated-plan inspection toward task-based orientation: choose the patient, recover the current clinical reality, identify what changed, determine what needs attention, and decide what to do next.

The strongest simulation-supported observations are:

- clinicians do not want to inspect the continuity architecture to understand the patient;
- pre-visit orientation is time-constrained and often mobile;
- Case Preview can begin orientation earlier than expected;
- Visit Briefing becomes harder to use when supporting context competes with current reality;
- Current Reality, Attention Required, and Next Action are more retainable than a broad set of equally weighted outputs;
- a recommendation that evolves coherently with a Patient Status update feels more trustworthy than a fluent but unexplained generated recommendation; and
- clinicians are likely to verify a focused conclusion against a few sources rather than accept it without checking.

These findings are directionally useful but remain simulation-supported because participant identities, protocols, observations, and quantitative results are not stored in the current persona-simulation files.

## Workflow Usability Findings

- **Orientation should begin before the full workspace.** Case Preview can surface enough decision-relevant context to support patient selection and initial mental setup.
- **Visit Briefing must be a briefing, not a report.** Current Reality, Attention Required, and Next Action need stronger authority than history, controls, and supporting modules.
- **Since Last Visit is essential continuity compression.** Clinicians need a meaningful delta, not a replay of the entire case.
- **Patient Status is the longitudinal update event.** The workflow is strongest when an update visibly changes or confirms the maintained clinical conclusion.
- **Visit History should tell a clinical story.** Visit-oriented snapshots are better than software-version language, but usefulness depends on visible evolution and consistent snapshot content.
- **Patient History should remain subordinate.** Context is available for review without competing with immediate orientation.
- **Consistency across surfaces matters.** Case Preview, Visit Briefing, Clinical Impact, and Visit History should not express different current conclusions.

## Mobile Findings

- Mobile pre-visit orientation is a primary use case, not a reduced desktop afterthought.
- A compact Case Preview is particularly valuable on mobile because it reduces unnecessary workspace entry.
- Visit Briefing requires aggressive hierarchy, short sentences, limited action competition, and progressive disclosure.
- Current Reality / Attention Required / Next Action survive narrow-screen compression better than multi-card dashboards.
- Sticky navigation and action crowding require real-device review; screenshots cannot establish touch ergonomics, viewport behavior, outdoor readability, accessibility, or network performance.
- Mobile readiness remains a strongly supported hypothesis rather than a validated field result.

## Trust Findings

- **Coherent state transition is the primary trust mechanism.** Clinicians need to understand why a recommendation changed, remained stable, or moved to monitoring.
- **Determinism supports but does not complete trust.** Internal authority boundaries reduce hidden behavior, but clinicians still need visible provenance.
- **Historical immutability protects orientation trust.** Prior snapshots should remain true to their time while the live case evolves.
- **Targeted verification is the desired behavior.** The product should make it easy to verify the key conclusion against its evidence, not encourage blind acceptance.
- **Correction is a prerequisite for reliance.** A clinician must be able to challenge stale evidence or a wrong conclusion without creating ambiguous authority.
- **Trust thresholds are likely context-dependent.** Safety-sensitive recommendations may require more evidence and verification than workflow summaries; this has not been measured.

## Recommendation Evolution Findings

Implemented scenarios show that Next Action can evolve in clinically coherent ways:

- regression, unsafe performance, falls, or near-falls retain priority over positive progression;
- positive transfer progression can demote a safety barrier to monitoring and promote evaluation of progression readiness;
- a clinician-selected current limiting factor can remain active when treatment direction changes;
- explicit caregiver-capacity loss can promote caregiver reassessment;
- generic improvement alone does not prove that a barrier no longer constrains an activity; and
- patient preview can match the Visit Briefing recommendation after transition logic is applied.

This is implementation validation, not clinical validation. The ordering rules still require representative clinician review and broader scenario coverage.

## Continuity Reconciliation Findings

Progression improvements exposed a continuity problem: prior triggers and barriers could remain technically present and continue influencing recommendations after current evidence changed.

The implemented reconciliation sequence supports several findings:

- historical truth and current relevance are different;
- absence of a repeated concern should not automatically clear it;
- current urgent or safety evidence should preserve active authority;
- positive progression plus readiness can move a concern to monitoring or resolution when deterministic evidence supports it;
- reconciliation should update the live runtime projection without mutating historical snapshots; and
- downstream Current Focus and Next Action must consume reconciled state or stale recommendations will persist despite correct reconciliation.

## Clinical Conclusion Reuse Findings

The same maintained conclusion appears useful across multiple tasks:

- pre-visit orientation;
- treatment planning and next-visit focus;
- reassessment preparation;
- physician communication;
- care conference preparation;
- documentation support;
- QA review; and
- longitudinal history review.

The opportunity is not to copy one sentence everywhere. It is to reuse a governed conclusion with workflow-appropriate compression, evidence, and clinician review. Reuse could eliminate repeated reconstruction, but it could also amplify a wrong conclusion; provenance and correction must precede broad reuse.

## Key Metrics Identified

| Metric | Definition | Suggested measurement |
| --- | --- | --- |
| Clinical Reconstruction Events Eliminated | Number of occasions where the clinician can use a maintained conclusion instead of rebuilding it from source facts. | Compare baseline and assisted workflows across orientation, planning, reassessment, communication, and QA tasks. |
| Time to Clinical Orientation | Time required to correctly state current status, meaningful change, attention need, and next action. | Timed task from patient selection to an accurate verbal or written orientation. |
| Clinical Sources Consulted | Number and type of records opened before the clinician feels oriented or completes a task. | Interaction logging plus participant explanation of why each source was used. |
| Mental Effort Score | Perceived cognitive effort required to orient, verify, or produce an output. | Short post-task scale, used consistently rather than as a standalone success claim. |
| Retained Clinical Reality | Whether the clinician accurately remembers the current state, attention need, and next action after a short delay or task switch. | Structured recall questions scored against the case truth. |
| Verification Behavior | What clinicians check, how often, and whether verification is targeted or reconstructive. | Screen/task observation and source-click sequence analysis. |
| Trust Threshold | Evidence and explanation required before a clinician is willing to rely on a conclusion for a specified task. | Scenario-based confidence and reliance questions, stratified by risk level. |
| Workflow Reuse Score | Number and value of workflows in which a maintained conclusion can be reused with minimal correction. | Track conclusion acceptance, edits, and reconstruction avoided across selected outputs. |

Metrics should distinguish speed from correctness. Faster orientation that produces false confidence is not success.

## Findings Confidence

| Finding | Confidence | Evidence Type | Caveat |
| ------- | ---------- | ------------- | ------ |
| Deterministic reasoning can remain authoritative while AI is constrained to synthesis. | High | Architecture and implementation inspection | Does not establish clinical correctness of the deterministic rules. |
| Progression readiness can support review without autonomous advancement. | High | Implemented builder and tests | Readiness criteria have not been clinically validated across case diversity. |
| Reassessment triggers and barriers can be reconciled without rewriting history. | High | Implemented reconciliation logic and snapshot governance | Not every lifecycle-bearing conclusion has been audited. |
| Barrier existence differs from whether it constrains a target activity. | High | Architecture analysis, implementation, and scenario tests | Free-text and incomplete activity evidence limit generalizability. |
| Safety/regression should override positive progression in recommendation ordering. | High | Deterministic scenario tests | Requires clinician confirmation of coverage and edge cases. |
| Case Preview and Visit Briefing can express the same clinical story. | High | Shared implementation and consistency tests | Comprehension by real users is untested. |
| Case Preview is stronger than expected as an orientation surface. | Medium | Internal workflow/visual review | No measured patient-selection or orientation study. |
| Visit Briefing benefits from Current Reality / Attention Required / Next Action hierarchy. | Medium | UX iteration and simulation-supported findings | No comparative usability test is stored. |
| Mobile pre-visit orientation is a primary use case. | Medium | Product learning, responsive implementation, and screenshots | No real-device field observation. |
| Coherent state transitions increase clinician trust. | Medium | Architecture rationale and simulation-supported findings | Trust and reliance behavior have not been measured. |
| Targeted verification is less burdensome than full reconstruction. | Medium | Product thesis and simulation-supported workflow analysis | Requires observed baseline-versus-assisted study. |
| Maintained conclusions can be reused across multiple workflows. | Medium | Cross-workflow analysis | Reuse quality, correction burden, and governance are untested. |
| Clinical conclusion reuse is the larger commercial/product opportunity. | Low–Medium | Strategic inference | Requires workflow-value and buyer validation. |
| The product saves clinician time in practice. | Low | Hypothesis only | No real-world time study. |
| Clinicians will adopt or pay for the product. | Low | Hypothesis only | No adoption or willingness-to-pay evidence. |
