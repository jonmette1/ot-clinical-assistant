# Progression Check Data Model

---

# Purpose

This document defines the authoritative data model governing routine longitudinal treatment updates.

The purpose of a Progression Check is not to recreate the evaluation.

The purpose is to identify meaningful clinical change since the previous visit and determine whether treatment direction should change.

Progression Checks are the primary longitudinal workflow.

Reassessment is an escalation workflow.

---

# Core Architectural Principle

Every visit begins as a Progression Check.

A visit may escalate into a Reassessment when clinically necessary.

Default Workflow:

Evaluation
→ Progression Check
→ Progression Check
→ Progression Check
→ Reassessment (if required)
→ Progression Check

The system should never require clinicians to re-enter information that has not changed.

---

# What A Progression Check Creates

A Progression Check does not recreate the case.

A Progression Check creates a Longitudinal Event.

A Longitudinal Event:

- captures meaningful change
- records progression interpretation
- updates current state
- preserves historical continuity

---

# Primary Progression Hierarchy

Progression Checks should interpret change using the following hierarchy:

1. Barrier Evolution
2. Functional Change
3. Milestone Achievement

Barrier evolution is the primary organizing principle.

Functional change provides evidence.

Milestones provide clinical interpretation.

---

# Core Progression Questions

Every Progression Check should answer:

- What improved?
- What declined?
- What remained unchanged?
- What is limiting performance now?
- Has a barrier been resolved?
- Has a new barrier become dominant?
- Was a milestone achieved?
- Did treatment direction change?
- What should treatment focus on next?

---

# Required Progression Inputs

## Functional Domains Changed

Only changed domains should require updates.

Examples:

- bathing
- dressing
- toileting
- transfers
- mobility
- endurance
- participation

The system should not require full functional re-documentation.

---

## Current Dominant Barrier

Required.

Examples:

- transfer mechanics
- endurance
- balance
- caregiver dependence
- safety awareness
- environmental constraints

The dominant barrier is the primary progression variable.

---

## Secondary Barrier

Optional.

Used when clinically relevant.

Provides sufficient information to model barrier hierarchy shifts without excessive documentation burden.

---

## Progression Status

Required.

Choose one:

- Progressing As Expected
- Progressing Faster Than Expected
- Minimal Progress
- Plateau Emerging
- Regression Detected

This represents clinician interpretation of the overall progression trajectory.

---

## Treatment Direction Changed

Required.

Values:

- Yes
- No

If No:

Current operational emphasis remains appropriate.

If Yes:

Operational prioritization should be re-evaluated.

This is the primary trigger for operational emphasis review.

---

# Milestone Achievement

Optional.

Examples:

- safe shower transfer achieved
- supervision level achieved
- independent task completion achieved
- caregiver burden reduced
- standing tolerance goal achieved

Milestones explain the clinical significance of progression.

---

# Optional Progression Inputs

## Caregiver Change

Examples:

- confidence improved
- availability changed
- training improved
- support reduced

## Environmental Change

Examples:

- grab bars installed
- equipment obtained
- hazard removed
- new hazard identified

## Medical Change

Examples:

- hospitalization
- fall
- medication change
- new diagnosis
- pain increase
- pain decrease

---

# Why Did Treatment Need To Change?

Optional when treatment direction changes.

Examples:

- transfer barrier resolved
- endurance now limiting participation
- caregiver burden reduced
- safety concerns increased
- environmental limitation emerged

This provides the bridge between:

Barrier Evolution
→ Operational Prioritization

---

# Operational Priority Review

The system should determine whether current operational emphasis remains appropriate.

Operational priority changes should always be explainable through barrier evolution.

---

# Reassessment Escalation Triggers

Progression Checks may escalate into Reassessment when clinically significant change occurs.

## Functional

- major improvement
- major decline

## Medical

- hospitalization
- new diagnosis
- major medication change

## Safety

- repeated falls
- increased assistance requirements
- significant caregiver concerns

## Environmental

- major environmental modification
- major support system disruption

## Plateau Conditions

Plateau alone should not automatically trigger reassessment.

Potential escalation examples:

- plateau across multiple progression checks
- plateau plus unresolved safety concerns
- plateau plus caregiver strain
- plateau plus unmet goals

---

# Longitudinal State Model

The system maintains three distinct longitudinal states.

## Original Baseline

Created during evaluation.

Never changes.

Represents the original point of origin.

Used to answer:

How far has the patient progressed?

---

## Current State

Continuously updated.

Represents current clinical reality.

Used to answer:

What is true today?

---

## Longitudinal History

Immutable.

Stores every longitudinal event.

Each event may include:

- functional change
- barrier evolution
- milestone achievement
- progression status
- operational emphasis
- reassessment status

Used to answer:

What changed over time?

---

# Progression Check Behavior

Progression Checks:

- create longitudinal events
- update current state
- preserve historical continuity

Progression Checks do not:

- recreate evaluation
- replace original baseline
- overwrite longitudinal history

---

# Longitudinal Outputs

Progression Checks should produce:

- functional change summary
- barrier evolution summary
- milestone summary
- progression status
- operational priority recommendation
- reassessment recommendation

---

# Success Criteria

A successful Progression Check allows the system to answer:

- What changed?
- Why does it matter?
- What barrier is dominant now?
- What milestone was achieved?
- Did treatment direction change?
- What should treatment focus on next?

without requiring full reassessment documentation.
