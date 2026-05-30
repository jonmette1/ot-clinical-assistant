# Progression Check UX Architecture

---

# Purpose

This document defines the UX architecture for Progression Check workflows.

This is not an implementation document.

This is not a component specification.

This is not a page layout document.

This document defines the clinician-facing workflow logic required to support longitudinal treatment continuity.

The Progression Check UX should help clinicians answer:

> What requires attention today?

and then capture the minimum information required to update longitudinal state.

---

# Product Shift

The platform is transitioning from:

Input
→ Reasoning
→ Output

toward:

Baseline
→ Observation
→ Change
→ Clinical Attention
→ Action
→ Re-observation

The Progression Check is the center of this continuum.

The case workspace should no longer behave primarily as a generated plan viewer.

It should behave as a longitudinal treatment workspace.

---

# Core UX Principle

The clinician is not opening the case to update data.

The clinician is opening the case to determine:

- what changed
- what matters
- what requires attention
- what should be addressed today

Progression Check UX must organize around clinician reasoning, not database structure.

Do not organize the workflow around:

- intake fields
- generated plan sections
- backend objects
- data categories
- historical documentation

Organize around:

- orientation
- change detection
- clinical attention
- treatment direction
- reassessment need

---

# Primary Workflow

The Progression Check UX should follow this cognitive sequence:

Orient
↓
Identify Events
↓
Capture Change
↓
Clarify Limiting Factor
↓
Confirm Treatment Direction
↓
Escalate If Needed
↓
Save Longitudinal Event
↓
Update Current State

---

# Step 1 — Orient

Before entering updates, the clinician needs rapid orientation.

The system should answer:

> Where are we right now?

This should be based on current state, not original intake.

## Clinician Should See

- current clinical attention required
- current operational emphasis
- current progression status
- current reassessment status
- most recent progression event
- current functional snapshot for relevant domains only

## Clinician Should Not See First

- full intake
- full evaluation history
- raw reasoning details
- internal continuity classifications
- mutation logic
- long generated narrative

---

# Step 2 — Identify Events Since Last Visit

The first interaction should ask whether anything meaningful happened since the last visit.

This question should come before functional updates because major events often reframe the entire visit.

## Event Options

- no meaningful events
- fall
- hospitalization
- medication change
- new medical issue
- caregiver change
- environmental change
- equipment obtained or changed
- near miss / safety concern
- other

Events may trigger reassessment recommendation, but should not automatically force reassessment without clinician confirmation.

---

# Step 3 — Capture Functional Change

The system should ask what changed, not ask the clinician to re-enter everything.

## Required Concept

Functional domains changed since last visit.

## Pattern

For relevant functional domains:

- improved
- unchanged
- declined
- not assessed today

Only changed domains should require additional detail.

## Relevant Domains May Include

- bathing
- dressing
- toileting
- transfers
- mobility
- endurance
- cognition / sequencing
- medication management
- meal preparation
- caregiver-supported task completion
- other target activity

The system should show only domains relevant to the case, target activity, and current operational emphasis.

---

# Step 4 — Clarify Current Limiting Factor

Do not lead with abstract system language such as:

> Current Dominant Barrier

Clinicians should be asked in observational language:

> What is limiting function most right now?

The system may map this answer into structured barrier categories.

## Examples

Clinician-facing language:

- gets tired before finishing the task
- unsafe transfer consistency
- needs repeated safety cues
- caregiver cannot safely assist
- bathroom setup still limits access
- pain limits participation
- sequencing breaks down during task

System-mapped barrier categories may include:

- endurance
- balance
- strength
- pain
- cognition / sequencing
- safety awareness
- environment
- caregiver support
- medical instability

The clinician should confirm the final limiting factor if it affects treatment direction.

---

# Step 5 — Milestone Check

Milestone capture should be available but not mandatory unless a milestone is clearly achieved.

## Ask

> Was a meaningful milestone achieved since the last visit?

Options:

- no milestone
- safe transfer achieved
- reduced assistance level
- reduced cueing
- increased task completion
- caregiver burden reduced
- adaptive equipment successfully used
- independent completion achieved
- other

Milestones explain clinical significance.

They should not become the primary burden of the workflow.

---

# Step 6 — Progression Status

The clinician should provide a simple interpretation of overall progression.

## Required

Progression Status:

- progressing faster than expected
- progressing as expected
- minimal progress
- plateau emerging
- regression detected

This is a clinician interpretation layer.

The system should not infer this without confirmation.

---

# Step 7 — Treatment Direction Confirmation

This is one of the highest-authority questions in the workflow.

## Required

> Did today's findings change treatment direction?

Options:

- no, current focus remains appropriate
- yes, treatment focus should shift
- uncertain, monitor closely
- reassessment may be needed

If treatment direction changed, the system should ask:

> Why does treatment need to change?

Examples:

- previous barrier improved
- new barrier is limiting performance
- safety risk increased
- caregiver capacity changed
- environment changed
- milestone achieved
- functional decline occurred

This creates the bridge between progression input and operational prioritization.

---

# Step 8 — Reassessment Escalation

The system may recommend reassessment when progression check inputs indicate significant change.

## Reassessment Candidates

- hospitalization
- new diagnosis
- major functional decline
- major assistance increase
- repeated falls
- significant caregiver change
- major environmental disruption
- plateau across multiple progression checks with unresolved safety concerns
- goal achieved requiring plan recalibration

## UX Rule

The system may recommend reassessment.

The clinician must confirm reassessment escalation.

Do not automatically force reassessment from a single routine progression check.

---

# Step 9 — Save Longitudinal Event

A completed Progression Check should create a longitudinal event.

The event should capture:

- events since last visit
- functional domains changed
- current limiting factor
- milestone achievement
- progression status
- treatment direction status
- reassessment recommendation
- clinical attention at that moment
- operational emphasis at that moment

The event should be immutable after saving except through explicit correction workflows.

---

# Step 10 — Update Current State

After saving the longitudinal event, the system should update current state.

Current state may include:

- current functional status
- current limiting factor
- current clinical attention
- current operational emphasis
- current progression status
- reassessment status

The original baseline should remain unchanged.

Historical progression events should remain preserved.

---

# What Should Be Visible

Always visible during orientation:

- current clinical attention required
- current operational emphasis
- current progression status
- reassessment status
- most recent progression event
- relevant current functional snapshot

Visible during update:

- previous relevant state
- current update choices
- system-suggested implications
- confirmation prompts

Visible after save:

- updated clinical attention
- updated operational emphasis
- progression summary
- next treatment focus
- reassessment recommendation if applicable

---

# What Should Be Updated By Clinician

Required:

- events since last visit
- functional domains changed
- current limiting factor
- progression status
- treatment direction changed

Optional:

- milestone achieved
- caregiver change
- environmental change
- medical change
- secondary limiting factor
- free-text clinical note

---

# What Should Remain Hidden

Do not expose:

- raw continuity calculations
- deterministic scoring
- mutation governance mechanics
- internal barrier weighting
- operational priority scoring
- detailed engine logic
- backend state transitions
- technical stale-state explanations

Clinicians should experience insight, not machinery.

---

# What Should Be Progressive Disclosure

Show only when relevant:

- caregiver change details
- environmental change details
- medical change details
- secondary barrier details
- milestone details
- why treatment changed
- reassessment rationale
- decision transparency

Progressive disclosure should reduce cognitive load, not hide essential information.

---

# What Should Be Auto-Derived

The system should derive:

- barrier evolution summary
- clinical change summary
- treatment implication
- updated clinical attention
- operational priority recommendation
- reassessment recommendation
- progression interpretation wording
- continuity summary
- suggested next focus

Auto-derived outputs should remain explainable and clinician-confirmable when they affect treatment direction.

---

# What Requires Explicit Confirmation

The clinician must explicitly confirm:

- current limiting factor when treatment direction changes
- treatment direction changed
- reassessment escalation
- major functional decline
- major safety event
- transition from progression check to reassessment

The system may recommend.

The clinician confirms.

---

# Minimum Viable Progression Check

A viable Progression Check should be possible with approximately four core inputs:

1. What changed since last visit?
2. What is limiting function most right now?
3. What is the progression status?
4. Did treatment direction change?

This is the minimum viable longitudinal event.

Everything else should be conditional.

---

# Command Center Implication

The command center should be organized around:

1. Current Clinical Attention Required
2. Current Operational Emphasis
3. Current Progression Status
4. Reassessment Status
5. Most Recent Progression Event

The command center should not be organized around:

- intake order
- documentation sections
- generated plan sections
- historical report structure

---

# Relationship To Existing Workspace

The existing case workspace should be treated as a prototype that helped validate reasoning, continuity, and progression concepts.

Future Progression Check UX should not be constrained by the existing case page structure.

Use existing UX only where it supports the new workflow.

Do not preserve existing UX patterns that reinforce input/output behavior.

---

# Success Criteria

The Progression Check UX is successful when a clinician can quickly answer:

- What requires my attention today?
- What changed since the last visit?
- What is limiting function now?
- Did the treatment focus change?
- Does this require reassessment?
- What should I do next?

without reviewing the full intake, full evaluation, or generated plan history.

---

# Governance Rule

Before adding any Progression Check UX feature, ask:

Does this help the clinician determine what changed, what matters, what requires attention, or what should happen next?

If not:

- simplify it
- defer it
- reject it
