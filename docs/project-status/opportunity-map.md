# Opportunity Map

Last updated: 2026-06-10

## Decision Rules

- Impact is judged against clinician orientation, continuity usability, trust, reconstruction reduction, and OT MVP validation.
- Effort includes implementation, clinical governance, data requirements, workflow change, and validation—not code volume alone.
- Placement reflects the current product state. Opportunities can move only when new evidence changes a dependency or expected value.
- The recommended sequence is to improve trust and validate the OT workflow before broad integration or discipline expansion.

## High Impact / Low Effort

| Opportunity | Description | Why it matters | Dependency | Recommended timing |
| --- | --- | --- | --- | --- |
| Since Last Visit delta summary | Tighten the visit-to-visit summary around meaningful functional, safety, caregiver, environmental, and treatment-direction changes. | Directly reduces reconstruction and supports rapid Visit Briefing orientation. | Existing longitudinal event and snapshot fields; clear omission rules. | **Now:** first trust-and-reuse phase. |
| Evidence/provenance under Current Focus and Next Action | Add progressive-disclosure references to the current observations, fields, visit date, and reconciliation basis supporting each conclusion. | Makes deterministic governance visible and enables targeted verification. | Provenance mapping from current builders; clinician-facing language. | **Now:** before broader clinician reliance. |
| Improved mobile compression | Refine sentence length, action density, spacing, sticky behavior, and progressive disclosure for pre-visit use. | Mobile is a primary orientation context and current screenshots do not prove field usability. | Real-device task testing and accessibility review. | **Now:** iterate alongside clinician testing. |
| Reassessment summary | Produce a concise, clinician-reviewed summary of why reassessment is or is not indicated and what evidence changed. | Reuses existing progression and reconciliation conclusions in a high-value adjacent workflow. | Provenance and clear non-autonomous language. | **Next:** first bounded reuse prototype. |
| Real clinician testing | Conduct retrospective case review and task-based evaluation of Case Preview, Visit Briefing, Patient Status, verification, and correction. | Converts simulation-supported assumptions into evidence and identifies adoption blockers. | Recruit representative OTs; test protocol and metrics. | **Immediate and continuous.** |
| Pricing / willingness-to-pay testing | Interview clinicians, managers, and likely buyers using a concrete workflow and value metric. | Prevents investment based on assumed buyer value. | Stable demo narrative and early usability evidence. | **After initial clinician usefulness signal; before pilot investment.** |

## High Impact / High Effort

| Opportunity | Description | Why it matters | Dependency | Recommended timing |
| --- | --- | --- | --- | --- |
| Visit History clinical story timeline | Present visit-based changes in Current Reality, Attention Required, Next Action, supporting evidence, and clinician corrections without becoming an analytics dashboard. | Makes maintained understanding visible over time and strengthens continuity trust. | Reliable snapshot/delta payloads, provenance, and historical immutability. | **Near term:** after the basic delta and evidence model are validated. |
| Clinician correction/edit workflow | Let clinicians correct source evidence or maintained conclusions with attribution, rationale, and controlled refresh behavior. | Required for trust, safety, and scalable conclusion reuse. | Authority model, audit expectations, current-versus-historical rules, and UX testing. | **Near term:** before pilot or broad reuse. |
| Structured activity evidence capture | Capture target activity, assistance, setup, supervision, safety, consistency, and contextual performance in structured form. | Reduces free-text ambiguity and improves activity-constraint reliability. | Clinical model validation and minimal-change data design; explicit schema approval if persistence changes. | **After clinician validation confirms the highest-value fields.** |
| Workflow reuse outputs | Build an output framework that adapts maintained conclusions to distinct clinician-reviewed workflows. | Could eliminate reconstruction across communication, reassessment, documentation, and QA. | Provenance, correction, output governance, and workflow-specific validation. | **Stage after one or two bounded prototypes prove value.** |
| Physician update | Create a concise change-and-action update for physician communication. | Reuses longitudinal meaning in a frequent coordination task. | Workflow reuse foundation, provenance, clinician approval, and communication requirements. | **After reassessment-summary validation.** |
| Care conference summary | Create a cross-disciplinary summary of current reality, meaningful change, constraints, and recommended discussion points. | Reduces preparation burden and supports continuity across the care team. | Workflow reuse foundation and role-specific content testing. | **After core OT briefing trust is established.** |
| QA review support | Surface evidence-linked conclusion evolution, corrections, and unresolved risks for quality review. | Could reduce retrospective reconstruction and improve auditability. | Provenance, immutable history, correction trace, and QA stakeholder validation. | **Post clinician-ready MVP.** |
| Documentation support | Produce bounded, evidence-linked draft language from maintained conclusions for clinician review. | May extend reuse value without making documentation the product identity. | Provenance, correction, workflow integration, compliance review, and drift controls. | **Post core validation; start narrow.** |
| EMR integration | Read relevant source data and return approved outputs or references to the system of record. | Could reduce duplicate entry and increase workflow fit if the standalone value is proven. | Validated data requirements, security/privacy readiness, partner access, and buyer demand. | **Post pilot decision; not before workflow validation.** |

## Low Impact / Low Effort

| Opportunity | Description | Why it matters | Dependency | Recommended timing |
| --- | --- | --- | --- | --- |
| Terminology and status-note maintenance | Keep current project status, implemented/proposed labels, and clinician-facing terminology aligned. | Reduces agent and contributor drift but does not directly validate product value. | Documentation ownership. | **As-needed hygiene.** |
| Visit History labeling refinement | Continue replacing software-version language with visit-oriented clinical language where remnants remain. | Improves comprehension and supports the clinical-story direction. | No architecture change. | **Opportunistically with related UX work.** |
| Export template cleanup | Improve current copy/download labels and formatting without adding new generation logic. | Removes friction for current users but is not a core differentiator. | Action-bar cleanup and current snapshot content. | **Only when addressing nearby workflow friction.** |

## Low Impact / High Effort

| Opportunity | Description | Why it matters | Dependency | Recommended timing |
| --- | --- | --- | --- | --- |
| Broad EMR-style record features | Add billing, scheduling, comprehensive charting, or system-of-record functions. | These features dilute the cognition/continuity thesis and create high implementation and compliance burden. | Major product and architecture change. | **Do not pursue unless strategy changes with strong evidence.** |
| Predictive recovery analytics | Forecast recovery or generate trajectory intelligence. | Conflicts with current non-predictive, clinician-governed product boundaries and increases trust risk. | New evidence, data scale, validation, governance, and regulatory review. | **Do not prioritize.** |
| PT/SLP expansion | Translate the product to other disciplines. | Potential platform value exists, but premature expansion can encode unvalidated OT assumptions and distract from OT proof. | OT clinician-ready MVP, discipline-specific research, configuration model, and separate validation. | **Post-OT validation only.** |
| Broad longitudinal dashboard | Add dense trend charts, population analytics, and timeline-heavy reporting. | Risks increasing interpretation burden without improving immediate clinical decisions. | New validated use case and information-authority rationale. | **Defer unless clinician evidence identifies a specific unmet decision.** |

## Recommended Sequence

1. Run real-clinician orientation testing while improving Since Last Visit, mobile compression, and evidence references.
2. Define and test the clinician correction workflow.
3. Upgrade Visit History into an evidence-linked clinical story.
4. Validate one bounded reuse output, beginning with a reassessment summary.
5. Test willingness to pay against observed value.
6. Decide whether pilot operations, EMR integration, or additional reuse surfaces are justified.
7. Consider PT/SLP only after the OT MVP demonstrates reliable use and a transferable platform core.
