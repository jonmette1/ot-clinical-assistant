# OT Clinical Assistant — Patient Entry Interaction Model

## Purpose

This document defines how clinicians should interact with patient cards during patient-entry workflows.

It is an interaction behavior audit only. It does not redesign the product, introduce new systems, approve architecture changes, define visual styling, create mockups, or implement features.

---

# Role Boundary

This document evaluates patient card behavior from three perspectives:

* Clinical Workflow Audit
* Information Architecture Audit
* Interaction Design Audit

It does not act as:

* Visual Design
* Product Strategy
* Software Architecture
* Implementation Engineering

---

# Authoritative Context Reviewed

This recommendation is aligned with the following existing direction:

* `AGENTS.md`
* `docs/PROJECT_STATUS_AND_DIRECTION.md`
* `docs/foundation/active_roadmap.md`
* `docs/future_opportunities.md`
* `docs/UX/Visual_Design_Principles.md`
* `docs/UX/Patient_Entry_Experience_Specification.md`
* `docs/UX/Patient_Card_Information_Hierarchy.md`

Key governing constraints:

* Patient Entry is an orientation layer, not a replacement for Command Center.
* Command Center remains the primary clinical workflow surface.
* Reference Workspace remains the deeper context and review surface.
* Patient cards are orientation surfaces, not mini Command Centers or mini Reference Workspaces.
* Opening a patient and opening the Command Center are related, but not identical.
* Full Operational Focus rationale belongs in Reference Workspace.
* Patient Entry may expose only a concise Operational Focus preview.

---

# Primary Question

What should happen when a clinician interacts with a patient card?

The answer should preserve the current clinical workflow while resolving the interaction ambiguity between:

* opening the patient for work, and
* briefly orienting before opening the patient.

---

# Evaluated Models

## Model A — Patient Card → Click → Command Center

### Description

The current behavior treats clicking a patient card as opening the Command Center.

### Strengths

* Fastest path into the primary workflow surface.
* Preserves the Command Center as the main clinical work area.
* Minimizes interaction decisions for routine visits.
* Avoids creating an intermediate screen that clinicians must pass through.
* Low cognitive overhead when the clinician already knows which patient they need to open.

### Weaknesses

* Treats orientation and workflow entry as the same action.
* Does not support a 30–60 second driveway review before entering the home.
* Forces clinicians to open the full workflow even when they only need a quick reminder.
* Makes patient selection less forgiving when a clinician wants to compare multiple patients quickly.
* Provides no interaction space for concise pre-visit signals such as meaningful change, attention required, or compressed Operational Focus.

### Audit Finding

Model A is efficient but too blunt. It is appropriate as the primary workflow path, but it should not be the only interaction available from a patient card.

---

## Model B — Patient Card → Expand Preview → Command Center

### Description

Clicking or interacting with a patient card first opens an expandable preview, then the clinician proceeds to Command Center if needed. The preview is optional in concept, but the interaction sequence implies preview before entry.

### Strengths

* Acknowledges that pre-visit orientation is a real clinician need.
* Gives patient-entry content an explicit home without creating a full new screen.
* Supports quick review of Current Focus, Attention Required, Since Last Visit, Next Action, and concise Operational Focus.
* Reduces the need to enter the Command Center for every orientation question.

### Weaknesses

* Can add friction if preview becomes the default path before Command Center.
* Risks making patient cards feel like mini Command Centers.
* May slow routine visits where the clinician wants immediate workflow entry.
* Can overload the list if preview expansion becomes common or persistent.
* Blurs the hierarchy between scanable patient-entry content and full workflow content.

### Audit Finding

Model B is directionally useful but should not make preview a required or implied step. Preview should be available, not imposed.

---

## Model C — Patient Card → Patient Overview → Command Center → Reference Workspace

### Description

Clicking a patient card opens a separate Patient Overview layer before the clinician chooses Command Center or Reference Workspace.

### Strengths

* Separates patient orientation from clinical workflow clearly.
* Could provide a structured place for patient identity, clinical status, recent change, and quick navigation.
* Makes the distinction between patient-level entry and workspace-level work explicit.
* Could support future patient-centric navigation patterns.

### Weaknesses

* Introduces a new required surface between patient selection and work.
* Risks redesigning navigation rather than solving the immediate interaction question.
* Adds interaction cost for routine visits.
* Could compete with Command Center as the place where clinicians expect orientation.
* Risks creating another surface that must be governed, maintained, and differentiated from Command Center and Reference Workspace.
* Exceeds the current audit boundary by implying a new workflow layer or page.

### Audit Finding

Model C is too heavy for the current decision. It may be conceptually aligned with patient-centric navigation, but it introduces more product surface than required to resolve patient card interaction behavior.

---

## Model D — Patient Card → Quick Preview OR Command Center

### Description

The patient card supports two distinct actions:

* a primary action to open the Command Center, and
* a secondary action to open a Quick Preview without leaving the patient-entry surface.

### Strengths

* Preserves the fastest path into the primary workflow.
* Recognizes that quick orientation and workflow entry are related but different actions.
* Supports driveway review without forcing it.
* Keeps patient cards lightweight by making expanded detail optional.
* Aligns with progressive disclosure.
* Avoids creating a new Patient Overview screen.
* Allows high-risk or reassessment-relevant signals to be inspected before opening the patient.
* Keeps Reference Workspace subordinate to primary workflow entry.

### Weaknesses

* Requires clear interaction labeling so clinicians understand the difference between opening and previewing.
* Introduces one additional affordance on each patient card.
* Requires discipline to prevent Quick Preview from becoming a mini Command Center.
* Requires careful content governance so preview content remains concise and clinically meaningful.

### Audit Finding

Model D best resolves the current interaction ambiguity with the least workflow disruption. It preserves Command Center primacy while adding an optional orientation path.

---

# Recommended Interaction Model

## Recommendation

Use **Model D — Patient Card → Quick Preview OR Command Center**.

## Rationale

Model D is the best fit because it separates two clinician intents without redesigning the product:

1. **I am ready to work with this patient.**
   *Open Command Center.*

2. **I need a brief reminder before I open the patient.**
   *Open Quick Preview.*

This preserves the Command Center as the primary clinical workflow surface while allowing patient-entry to function as a lightweight orientation layer. It also supports real home health behavior, where clinicians often need a brief pre-visit recall check before entering the home but should not be forced through an intermediate screen.

Model D should be treated as an interaction rule, not a new product system.

---

# Patient Card Actions

## Primary Action

### Open Command Center

The primary patient card action should open the Command Center.

Use when the clinician is ready to answer:

* What matters most?
* What changed?
* What requires attention?
* What should I do next?

The primary action should remain the fastest and clearest path into clinical work.

## Secondary Action

### Quick Preview

The secondary patient card action should expand a concise preview on the patient-entry surface.

Use when the clinician is asking:

* Is this the right patient?
* What should I remember before entering the home?
* Is anything urgent or meaningfully changed?
* Do I need deeper review before opening the full workflow?

The Quick Preview should not navigate away from the patient-entry surface.

## Reference Workspace Access

Reference Workspace access may be available as a secondary or tertiary navigation option, but it should not be the primary patient card action for routine visits.

If exposed from patient entry, it should communicate deeper review rather than immediate workflow entry.

---

# Operational Focus Accessibility

## Should Clinicians Access a Compressed Operational Focus Preview Before Command Center?

Yes, but only as concise orientation content within Quick Preview.

### Why

Operational Focus can help a clinician understand the real-world treatment frame before entering the home. In home health, the clinician may need to remember the practical treatment constraint quickly: for example, whether mobility safety, caregiver feasibility, bathroom access, or transfer reliability is the dominant operational concern.

However, the full Operational Focus rationale is too dense for the patient card default state and too explanatory for quick list scanning.

## Preview Access Belongs In

### Quick Preview

The compressed Operational Focus preview belongs in Quick Preview, not as a large always-visible patient-card block.

Recommended preview level:

* one-sentence Operational Focus
* up to three concise Why bullets
* up to three concise Watch For bullets

This supports orientation without becoming a reference review.

## Full Access Belongs In

### Reference Workspace

Full Operational Focus belongs in Reference Workspace.

The full version may include:

* current operational emphasis
* emphasis rationale
* dominant barriers
* adjacent priorities
* monitoring concerns
* reassessment triggers
* continuity summary

## Command Center Relationship

Command Center should continue to surface Current Focus or current operational emphasis as part of immediate workflow orientation.

Command Center should not become the full Operational Focus rationale surface unless separately approved.

---

# Workflow Evaluation

The interaction model should remain consistent across patient types. The product should not change the fundamental card behavior by scenario.

What may differ is the content emphasis available on the card or in Quick Preview.

---

## Routine Visit

### Recommended Behavior

* Primary action: Open Command Center.
* Secondary action: Quick Preview.

### Rationale

For routine visits, the clinician often knows which patient is next and needs the fastest path into treatment preparation. Quick Preview remains useful for a brief memory refresh, but it should not interrupt direct entry.

### Content Emphasis

* Current Focus
* Clinical Status
* Last Visit or recency
* Since Last Visit only if meaningful
* Next Action if concise

---

## New Patient

### Recommended Behavior

* Primary action: Open Command Center.
* Secondary action: Quick Preview, if there is enough orientation content to justify it.

### Rationale

A new patient may not yet have longitudinal change, reassessment signals, or visit-to-visit continuity. For that reason, Quick Preview may be less clinically rich. The model should not create empty or artificial preview content.

### Content Emphasis

* Patient identity
* diagnosis or primary clinical context
* initial Current Focus if available
* recency of evaluation or intake
* missing longitudinal signals should simply be absent, not replaced with system explanations

---

## Reassessment Visit

### Recommended Behavior

* Primary action: Open Command Center.
* Secondary action: Quick Preview.

### Rationale

Reassessment visits are exactly the kind of workflow where a quick orientation path is valuable. The clinician may need to know what changed, why reassessment is relevant, and what to watch for before entering the home. However, the full reassessment workflow belongs in Command Center, not on the patient card.

### Content Emphasis

* Reassessment-needed or monitor-closely status when clinically meaningful
* Since Last Visit
* Attention Required
* concise Next Action
* concise Operational Focus preview if it clarifies why reassessment may matter

---

## High-Risk Patient

### Recommended Behavior

* Primary action: Open Command Center.
* Secondary action: Quick Preview.

### Rationale

High-risk patients benefit from pre-entry awareness of safety, caregiver, environmental, or decline-related concerns. The card should surface meaningful risk signals, and Quick Preview should provide just enough context to orient the clinician before entering the home.

The interaction behavior should not force a separate high-risk flow. Forcing a different path may increase friction and make the system feel unpredictable.

### Content Emphasis

* Attention Required
* Clinical Status or trajectory
* Since Last Visit if risk changed
* Next Action if immediate
* concise Operational Focus preview if it identifies what to watch for

---

# Clinician Workflow Alignment

Model D aligns with real-world home health behavior because it supports two common clinician states:

## Clinician Already Knows the Patient

The clinician can open Command Center immediately.

This preserves speed and avoids unnecessary steps.

## Clinician Needs Driveway Orientation

The clinician can open Quick Preview before entering the home.

This supports the practical reality that clinicians often need to recall:

* the patient’s current treatment frame
* what changed since the last visit
* what requires attention today
* what to watch for during the visit
* whether deeper review is needed before entry

The model lets the software carry continuity burden without requiring the clinician to reconstruct prior visits from memory.

---

# Interaction Rules

## Rule 1 — Do Not Make Preview Mandatory

Quick Preview should remain optional.

The clinician should never be forced to expand preview before opening Command Center.

## Rule 2 — Do Not Turn Preview Into a Mini Command Center

Quick Preview should support orientation only.

It should not include:

* full treatment planning
* full Operational Focus rationale
* detailed progression metadata
* historical snapshot detail
* structured plan detail
* Reference Workspace content

## Rule 3 — Preserve Command Center Primacy

Command Center remains the primary workflow destination.

Quick Preview exists to decide whether the clinician is ready to open Command Center or needs a reminder before doing so.

## Rule 4 — Preserve Reference Workspace Depth

Reference Workspace remains the home for full rationale, review, and deeper investigation.

Patient-entry preview should not compete with Reference Workspace.

## Rule 5 — Keep Scenario Behavior Predictable

Routine, new, reassessment, and high-risk patients should use the same interaction model.

Only the displayed clinical signals should vary based on meaningful available data.

---

# Codex Readiness

Implementation planning can begin after this document.

The next planning step should define implementation details such as:

* exact patient-card affordances
* exact labels for primary and secondary actions
* available data fields on the patient-entry surface
* preview expansion behavior
* empty-state handling for new patients
* safeguards that prevent preview from becoming a mini Command Center or Reference Workspace

This document does not approve direct implementation by itself. It establishes the interaction decision required before implementation planning.

---

# Final Recommendation

Adopt **Model D**.

Patient Card interaction should provide:

1. **Primary action:** Open Command Center.
2. **Secondary action:** Quick Preview.

Compressed Operational Focus should be available only inside Quick Preview as concise orientation content.

Full Operational Focus should remain in Reference Workspace.

The model should remain consistent across routine, new, reassessment, and high-risk visits, with content emphasis adapting only when clinically meaningful data exists.
