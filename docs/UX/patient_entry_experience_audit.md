# OT Clinical Assistant — Patient Entry Experience Audit

## Audit Scope

This audit evaluates how occupational therapy clinicians should orient around a patient before entering the Command Center. It focuses on clinician behavior, information architecture, and pre-visit workflow needs. It does not redesign the product, propose technical implementation, introduce new systems, or change existing architecture.

Reviewed sources:

- `AGENTS.md`
- `docs/PROJECT_STATUS_AND_DIRECTION.md`
- `docs/foundation/active_roadmap.md`
- `docs/future_opportunities.md`
- `docs/UX/Visual_Design_Principles.md`
- `src/app/cases/page.tsx`
- `src/app/cases/[id]/CaseWorkspaceClient.tsx`
- `src/app/cases/[id]/components/SupportingProgressionSummaries.tsx`
- Directly imported case-workspace components related to patient orientation and progression support

---

## Current State Assessment

### What role does the current Cases page serve?

The current `/cases` page behaves primarily as a **case list**, not a mature **patient entry experience**.

It supports finding, sorting, selecting, deleting, and opening saved cases. Its dominant orientation model is administrative retrieval: find the saved record, confirm the client or diagnosis, then open it. This is useful, but it does not yet carry enough clinical orientation burden for a clinician parked outside the patient's home with 30–60 seconds to prepare.

### Current strengths

1. **Fast record retrieval**
   - The page loads saved cases and orders them by creation date.
   - Search includes client name, diagnosis, case type, barriers, target activity, hazards, and equipment.
   - Sorting by newest or oldest supports basic list management.

2. **Basic patient recognition**
   - Each card exposes the saved case title, created timestamp, diagnosis, and client name.
   - These fields help the clinician confirm they are opening the correct record.

3. **Administrative utility**
   - Bulk selection and deletion are available from the list.
   - This is useful for maintenance, test data cleanup, and case management.

### Current weaknesses

1. **The page does not answer the pre-visit clinical question**
   - The key driveway question is not “Which saved case is this?”
   - The key driveway question is “What do I need to know before I walk in?”
   - The current page does not expose current focus, status, attention required, since-last-visit change, next action, or operational emphasis.

2. **The visible fields are mostly identity and intake-era fields**
   - Diagnosis, client name, case type, barriers, hazards, and equipment are useful for record identification or search.
   - They do not adequately communicate the patient’s current clinical reality or today’s treatment priority.

3. **Administrative actions compete with patient-entry behavior**
   - Bulk selection and delete controls reinforce list-management behavior.
   - For a clinician preparing for a visit, those controls are lower value than orientation cues.

4. **The page does not reflect the product’s current longitudinal identity**
   - The broader product direction is a longitudinal clinical navigation platform that reduces cognitive burden by carrying continuity, progression, attention management, and clinical context forward.
   - The current list still feels closer to a saved-output archive than a patient-entry layer.

### Missing orientation information

The following orientation signals are clinically valuable before a clinician opens a patient, but are not visible from the current case list:

1. **Current Focus / current operational emphasis**
2. **Attention Required**
3. **Since Last Visit**
4. **Next Action**
5. **Clinical Status / trajectory**
6. **Last Visit summary**
7. **Latest Progression Event signal**

### Unnecessary or lower-value information for driveway review

The following are useful somewhere in the product but lower value in a 30–60 second pre-entry context:

1. **Bulk delete workflow**
2. **Oldest-first sorting as a primary orientation control**
3. **Raw created timestamp as the main temporal signal**
4. **Case type as a primary discriminator**
5. **Detailed search coverage across hazards/equipment/barriers without corresponding orientation output**

These elements are not wrong, but they currently shape the page around saved-case management more than patient-entry orientation.

---

## Clinician Orientation Needs

### What information matters most before treatment?

For the clinician parked outside the patient’s home, the highest-value information is the minimum set that supports safe, focused treatment entry without requiring deep chart reconstruction.

Ranked from highest to lowest value before treatment:

1. **Current Focus**
   - The clinician first needs to know what treatment should emphasize today.
   - This should remain the strongest orientation artifact because it converts case complexity into a practical treatment priority.

2. **Attention Required**
   - Safety risks, reassessment signals, caregiver constraints, decline, or instability must be visible before the clinician enters the home.
   - This is especially important when the planned visit needs adjustment.

3. **Since Last Visit**
   - The clinician needs to know what changed and why it matters.
   - This is the main continuity burden the software should carry.

4. **Next Action**
   - After understanding current focus and required attention, the clinician needs a concrete treatment direction.
   - This helps bridge orientation into action.

5. **Operational Focus**
   - Operational Focus is highly valuable because it explains the real-world treatment emphasis: the barrier, constraint, or clinical pressure shaping what should happen now.
   - Its value is strongest when presented as concise orientation rather than a full rationale dump.

6. **Clinical Status / trajectory**
   - “Improving,” “stable,” “declining,” “monitor closely,” or “needs reassessment” helps the clinician calibrate urgency.
   - It is important, but by itself it is less actionable than current focus and attention required.

7. **Last Visit**
   - Last Visit is useful for anchoring continuity, especially when the clinician did not perform the prior visit.
   - It should be summarized, not treated as a mini-chart review.

8. **Latest Progression Event**
   - Useful when it represents a meaningful transition, new barrier, regression, milestone, or treatment-direction change.
   - Less useful if exposed as event metadata rather than clinician-facing meaning.

9. **Historical Snapshot Summary**
   - Valuable for review and restoration workflows.
   - Usually too deep for a 30–60 second routine pre-visit orientation unless there is a major change or discrepancy.

### Routine visit likelihood-of-use ranking

For a routine visit, likely clinician review order is:

1. **Current Focus**
2. **Attention Required**
3. **Since Last Visit**
4. **Next Action**
5. **Operational Focus**
6. **Latest Progression Event**
7. **Historical Snapshots**

This order reflects actual pre-treatment behavior: clinicians orient around what to do today, what could go wrong, what changed, and what immediate action is appropriate. They are less likely to inspect event structures or historical snapshots unless something seems inconsistent or high risk.

---

## Patient Card Evaluation

### Highest-value patient-card information before opening a patient

Ranked for patient-list visibility or immediate pre-entry access:

1. **Current Focus**
   - Best answers: “What is this visit about?”
   - Highest direct treatment relevance.

2. **Attention Required**
   - Best answers: “Is there anything I must account for before entering?”
   - Highest safety and reassessment relevance.

3. **Since Last Visit**
   - Best answers: “What changed since I last saw or reviewed this patient?”
   - Highest continuity relevance.

4. **Next Action**
   - Best answers: “What should I do first or prioritize?”
   - High treatment-execution value.

5. **Clinical Status**
   - Best answers: “Is the patient improving, stable, declining, or requiring reassessment?”
   - Useful as a compact urgency and trajectory signal.

6. **Operational Focus**
   - Best answers: “What real-world operational constraint is shaping treatment right now?”
   - High value, but only if concise. Full rationale belongs deeper.

7. **Last Visit**
   - Best answers: “What happened last time?”
   - Useful as a short anchor, lower priority than current state.

8. **Latest Progression Event**
   - Best answers: “Was there a meaningful progression transition?”
   - Valuable when clinically meaningful; lower value if shown as raw event detail.

9. **Historical Snapshot Summary**
   - Best answers: “What prior version or historical state exists?”
   - Primarily reference/review content, not routine patient-entry content.

### What should not dominate patient cards

Patient cards should not be dominated by:

- raw longitudinal event metadata
- full historical snapshot summaries
- generated-output provenance
- pathway alternatives
- detailed progression architecture language
- administrative controls
- full operational rationale lists

Those details may remain available in the Command Center or Reference Workspace, but they are not the first information a clinician needs before opening a patient.

---

## Operational Focus Assessment

### Is Operational Focus orientation information, reference information, or both?

Operational Focus is **both orientation information and reference information**, but its highest-value use begins as orientation.

### Clinical value

Operational Focus has high clinical value because it translates the patient’s current condition, barriers, feasibility constraints, caregiver reality, and progression context into the treatment emphasis that should guide the next visit. It helps the clinician avoid treating from a generic plan and instead treat from the patient’s current operational reality.

### Orientation value

Operational Focus has high orientation value when it answers:

- “What should I be thinking about before I enter?”
- “What is shaping treatment today?”
- “What constraint or barrier should I not forget?”
- “What is the practical reason this visit should be approached a certain way?”

This is driveway-review information. The clinician does not need the entire explanation before opening the patient, but a concise Operational Focus signal can prevent wasted orientation time and reduce reliance on memory.

### Reference value

Operational Focus also has reference value when the clinician needs to understand:

- why the operational emphasis was chosen
- which barriers shaped it
- what adjacent priorities were considered
- what reassessment triggers exist
- how continuity or progression context influenced the emphasis

That deeper rationale belongs in the Command Center supporting details or Reference Workspace, not necessarily on the patient list.

### Current location evaluation: Reference Workspace only

Reference-only access is too deep for Operational Focus’s highest-value use. The current Reference Workspace placement is appropriate for rationale, supporting progression summaries, adjacent priorities, and review, but not sufficient for pre-visit orientation.

### Patient Entry Layer evaluation: available before opening patient

Patient-entry access aligns strongly with clinician behavior if Operational Focus is concise and subordinate to the highest-priority cues. It can help the clinician select the correct patient and immediately remember the treatment frame before entering the Command Center. However, it should not become a dense reference block or compete with Current Focus and Attention Required.

### Command Center evaluation: visible during workflow orientation

Command Center access is essential. Operational Focus is already closely tied to Current Focus and current operational emphasis. The Command Center is the appropriate place for the clinician-facing treatment priority and immediate rationale, because it is the primary workflow surface for what matters, what changed, what requires attention, and what should happen next.

### Best alignment with clinician behavior

The best behavioral alignment is:

1. **Patient Entry Layer:** concise preview of Operational Focus when it materially helps pre-visit orientation.
2. **Command Center:** primary workflow expression of Operational Focus as Current Focus / treatment emphasis.
3. **Reference Workspace:** deeper rationale, longitudinal context, adjacent priorities, reassessment triggers, and supporting summaries.

This does not imply a new system. It clarifies the information-authority relationship: concise operational orientation earlier; full operational reasoning deeper.

---

## Patient Entry Experience Findings

### What should be accessible before Command Center entry?

Before Command Center entry, clinicians should have access to a compact orientation layer that answers:

1. **Who is this patient?**
   - Name or patient identifier
   - Diagnosis or broad clinical context

2. **What is the current treatment frame?**
   - Current Focus or concise current operational emphasis

3. **What requires attention before entering?**
   - Attention Required or an equivalent clinician-facing signal

4. **What changed since the last visit?**
   - Since Last Visit summary when a meaningful update exists

5. **What should I do next?**
   - Next Action when available and concise

6. **When was this last updated or last seen?**
   - Last Visit / latest update timing, expressed as clinical recency rather than raw creation timestamp

### What should remain deeper in the workflow?

The following should remain deeper in the Command Center or Reference Workspace:

1. **Full Operational Focus rationale**
2. **Adjacent operational priorities**
3. **Detailed progression event rows**
4. **Current longitudinal state metadata**
5. **Clinical attention metadata**
6. **Historical snapshots and restoration workflows**
7. **Generated plan details**
8. **Full environmental, caregiver, and equipment feasibility detail**
9. **Decision transparency or internal continuity terminology**

These items are clinically useful, but they are not the first layer of patient entry.

---

## Opening a Patient vs. Opening a Command Center

There is a meaningful distinction between **Opening a Patient** and **Opening a Command Center**.

### Opening a Patient

Opening a patient is an orientation action. The clinician is asking:

- “Is this the right patient?”
- “What is the current situation?”
- “Do I need to adjust my mental plan before entering?”
- “Is there anything urgent or different from last time?”

This action begins before the Command Center loads. It may happen on the patient list, in a preview layer, or at the transition into the patient record.

### Opening a Command Center

Opening a Command Center is a workflow action. The clinician is asking:

- “What matters most?”
- “What changed?”
- “What requires attention?”
- “What should I do next?”
- “Does the current plan remain appropriate?”

The Command Center is the primary work surface once the clinician has chosen the patient.

### Should the product treat them as the same action?

They should be treated as related but not identical actions.

For a simple product flow, selecting a patient can still land in the Command Center. But the patient-entry experience should not be assumed to begin only after the patient opens. The patient list is part of clinical orientation, especially in home health and rapid pre-visit workflows.

The practical distinction is:

- **Patient Entry:** helps the clinician choose and orient.
- **Command Center:** helps the clinician act.

The entry layer should not duplicate the full Command Center. It should reduce the cognitive cost of deciding which patient to open and what mental frame to carry into the visit.

---

## Highest ROI Opportunity

The single highest ROI opportunity is to evolve the `/cases` page from a saved-case management list into a lightweight **patient-entry orientation surface** by making the patient card answer one additional clinical question:

> “What should I be ready to focus on or watch for before I open this patient?”

The highest-value content for that opportunity is a concise combination of:

1. **Current Focus / current operational emphasis**
2. **Attention Required**
3. **Since Last Visit**

This would most directly improve clinician orientation and reduce pre-visit cognitive load without changing the underlying clinical architecture or moving deep reference content into the list.

---

## Codex Readiness

### Recommended next step: specification

The next step should be **specification**, not implementation planning and not additional audit.

Rationale:

- The audit question is now answerable: the current page behaves like a case list, while the clinician need is a patient-entry orientation layer.
- The highest-value information hierarchy is clear enough to document.
- Operational Focus has been classified as both orientation and reference information, with concise orientation value before patient opening and deeper rationale value inside the Command Center / Reference Workspace.
- Additional audit is unlikely to change the core finding.
- Implementation planning should wait until the specification defines exact patient-entry content boundaries, priority order, and what remains deeper in the workflow.

### Specification should clarify, without redesigning architecture

A follow-up specification should define:

- patient-card information priority
- what counts as concise orientation versus reference detail
- which signals are always visible versus conditionally visible
- how patient-entry content relates to the existing Command Center hierarchy
- what information remains exclusive to Reference Workspace

No new reasoning systems, data models, workflows, or architecture changes are required by this audit finding.
