# Product Maturity Assessment

Last updated: 2026-06-10

## Scoring Method

Scores describe current evidence in this repository, not theoretical potential.

- **1 — Concept:** direction exists, with little or no implemented workflow.
- **2 — Prototype:** meaningful implementation exists but is incomplete or weakly governed.
- **3 — Functional MVP:** core workflow works and can be evaluated end to end.
- **4 — Clinician-ready MVP:** workflow, trust, correction, usability, and reliability are ready for structured clinician use.
- **5 — Pilot-ready:** validated, instrumented, operationally supported, and ready for a controlled real-world pilot.

## Maturity Scores

| Area | Score | Rationale | Next Needed |
| ---- | ----: | --------- | ----------- |
| Clinical reasoning | 3 | Structured inputs feed a deterministic decision model with goals, barriers, safety, support, environment, strategies, and clinical lenses. Breadth and clinical accuracy are not validated across representative cases. | Clinician-reviewed case set, disagreement analysis, and diagnosis/activity coverage testing. |
| Deterministic governance | 4 | Authority boundaries are explicit: deterministic systems own clinical meaning; AI is constrained to synthesis; historical state is immutable. | Add automated authority-boundary checks and provenance visible to clinicians. |
| Progression modeling | 3 | Progression state and readiness are implemented, with negative signals blocking readiness and positive evidence prompting evaluation rather than advancement. | Validate transition criteria with clinicians and broaden structured progression evidence. |
| Continuity reconciliation | 3 | Reassessment triggers and barriers are reconciled against current evidence without rewriting history. Scope is targeted rather than comprehensive. | Audit remaining lifecycle-bearing conclusions and downstream stale-state propagation. |
| Activity constraint handling | 3 | Barrier existence is separated from target-activity constraint and blocking eligibility, with safety overrides and tests. Matching remains dependent on incomplete structured evidence and text heuristics. | Structured activity-performance capture and clinician validation of relation transitions. |
| Current Focus quality | 3 | Current Focus incorporates progression, readiness, reconciled barriers, and activity relevance in compressed language. | Test comprehension, correctness, and correction behavior with clinicians. |
| Next Action quality | 3 | Recommendation ordering evolves with safety, regression, reassessment, barrier state, and progression readiness; stale actions can be suppressed. | Scenario coverage, provenance, and real-clinician usefulness/safety review. |
| Visit Briefing usability | 3 | A hierarchy-led Command Center exists with Current Reality, Attention Required, Next Action, Patient Status, and Clinical Impact. | Moderated task testing and density/terminology refinement based on observed failures. |
| Case Preview usability | 3 | Compact signals provide meaningful orientation before opening a patient and share derivation logic with the briefing. | Measure patient-selection speed, signal retention, and false confidence risk. |
| Visit History usefulness | 2 | Immutable visit-oriented snapshots and review controls exist, but the longitudinal clinical story remains underdeveloped and payload quality varies. | Clinical story timeline, reliable deltas, evidence links, and older-snapshot handling. |
| Mobile readiness | 2 | Mobile-conscious hierarchy and screenshots exist, but real-device, field-context, accessibility, and performance validation are absent. | Real-device testing across common viewport, touch, lighting, and connectivity conditions. |
| Explainability / provenance | 2 | Deterministic sources and internal reasoning boundaries exist, but clinicians do not yet receive sufficient evidence references and source lineage at the point of trust. | Evidence references, source dates, rationale trace, and clear uncertainty language. |
| Trust readiness | 2 | Coherent state transitions and historical safeguards support trust, but correction, provenance, and real-clinician verification behavior remain untested. | Correction workflow, targeted verification study, and trust-threshold measurement. |
| Workflow reuse | 2 | The architecture can maintain conclusions that could feed several workflows, but dedicated reuse outputs are mostly opportunities rather than proven product surfaces. | Prototype one or two clinician-reviewed outputs and measure reuse value. |
| Documentation support | 2 | Snapshot copy/download and generated content are documentation-adjacent, but documentation is not the product center and integration quality is unvalidated. | Define bounded, evidence-linked draft support without claiming note replacement. |
| Real clinician validation | 1 | No durable evidence of representative clinician testing, measured clinical accuracy, adoption, or workflow impact is present. | Recruit OT clinicians; run task-based studies and case review with defined metrics. |
| Product positioning | 3 | Clinical Attention System and clinical cognition/continuity framing are coherent, with clear exclusions. Buyer language and market resonance remain untested. | Clinician, manager, and buyer interviews; compare orientation versus documentation framing. |
| Technical architecture clarity | 4 | Reasoning, progression, continuity, reconciliation, mutation, and UX authority are extensively documented and implemented in named modules. Some older target-state docs and terminology can still cause drift. | Keep status/index documents current and mark implemented versus proposed architecture explicitly. |

## Overall Maturity Assessment

The product is a **functional MVP with strong architecture governance and weak external validation**. Its deterministic foundation and end-to-end longitudinal workflow are more mature than its trust, usability, provenance, mobile, and market evidence.

The average score is less important than the shape of the maturity profile: architecture is approaching clinician-ready quality, while validation and adoption readiness remain at concept-to-prototype maturity. The project should not respond to that imbalance by adding architecture. It should expose the existing system to clinicians, strengthen correction and provenance, and measure whether it reduces reconstruction burden.

## MVP Readiness Judgment

**Functional MVP: yes. Clinician-ready MVP: not yet.**

A complete product loop exists and can be evaluated. The MVP can ingest a case, derive governed clinical guidance, present a Visit Briefing, accept a Patient Status update, refresh progression and recommendations, and preserve Visit History. It still lacks enough evidence and controls to call the workflow clinician-ready.

Minimum conditions for clinician-ready MVP status:

- real clinicians can complete orientation and update tasks without facilitation;
- Current Focus and Next Action have visible provenance;
- clinicians can correct wrong or outdated conclusions;
- mobile behavior is verified on real devices;
- representative cases show acceptable reasoning and transition reliability; and
- live, preview, impact, and history surfaces remain coherent.

## Clinician Exposure Readiness

**Ready for controlled formative exposure, not unsupervised clinical reliance.**

The product is appropriate for moderated usability sessions, retrospective case walkthroughs, simulated visit preparation, and clinician review of recommendation transitions. Participants should be told that clinical accuracy, safety, and workflow impact are under evaluation and that outputs require verification.

## Pilot Readiness Judgment

**Not pilot-ready.**

A pilot would currently carry avoidable trust and operational risk because clinician validation, correction/provenance, instrumentation, workflow support, privacy/security readiness, and integration assumptions are not documented as complete. The next milestone should be a clinician-ready MVP and a pilot protocol—not a broad deployment.
