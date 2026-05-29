# Case Workspace V2

## Status

APPROVED FOR UX IMPLEMENTATION

---

# Purpose

The Case Workspace should function as a clinician command center rather than a generated report.

The workspace should answer three questions within the first 10 seconds:

1. What is happening?
2. What matters most?
3. What should I do next?

The workspace should prioritize operational clarity over reasoning transparency.

---

# Design Principles

## Principle 1 — Operational First

Lead with current clinical priorities.

Do not lead with:
- demographics
- case metadata
- reasoning details
- configuration controls

---

## Principle 2 — Progressive Disclosure

Information should be layered.

### Level 1
Required for every visit.

### Level 2
Helpful supporting context.

### Level 3
Reference information.

### Level 4
System transparency and configuration.

---

## Principle 3 — Complex Reasoning, Simple Presentation

The system may perform sophisticated continuity and prioritization logic.

Clinicians should not need to understand:
- operational drift
- instability drivers
- continuity interpretation
- change classification

The interface should translate these concepts into simple clinical language.

---

# Workspace Structure

## Sticky Header

Persistent orientation only.

Display:
- Patient Name
- Age / Diagnosis
- Target Activity
- Current Phase
- Last Updated

Keep compact.

---

# Command Center (Hero Section)

Single unified card.

## Current Operational State

One concise summary explaining the dominant treatment emphasis.

## Clinical Status

Three clinician-facing states only:

### On Track
Current plan remains appropriate.

### Monitor Closely
Meaningful change detected. Monitor for progression or decline.

### Needs Reassessment
Current priorities may no longer match presentation.

Reassessment recommended.

## Clinical Status Explanation

One sentence maximum.

## Why This Status?

Collapsed by default.

May display:
- primary instability driver
- continuity trigger
- reassessment rationale

Translate system reasoning into clinician language.

## Top Priorities

Maximum three items.

Ordered by operational importance.

## Immediate Actions

Always visible.

Reserved for actions requiring current attention.

## Potential Enhancements

Collapsed by default.

Examples:
- progression opportunities
- independence advancement
- caregiver burden reduction
- performance optimization

---

# Operational Pressure Section

Always visible.

Contains:

## Environment
Environmental barriers impacting performance.

## Caregiver
Caregiver capacity and support considerations.

## Transfer / Mobility
Mobility limitations influencing treatment priorities.

---

# Collapsed Reference Section

Collapsed by default.

## Case Details

## Detail Modules

Generated supporting assessments.

Examples:
- equipment assessment
- transfer assessment
- caregiver assessment
- environmental assessment

## Historical Snapshots

## Decision Transparency

## Advanced Configuration

---

# Clinical Focus

Clinical Focus is not primary workspace content.

Move under:

Advanced Configuration

Clinical Focus should function as a system configuration input rather than a primary workflow element.

---

# Continuity UX Rules

Do not expose:
- operational drift
- continuity interpretation
- change classification
- instability drivers

Instead expose:
- On Track
- Monitor Closely
- Needs Reassessment

with plain-language explanations.

---

# Success Criteria

A clinician should be able to answer:

- What is happening?
- What matters most?
- What should I do next?
- Does the plan remain appropriate?

within 10 seconds.

---

# Next UX Phase

1. Validate clinician usability.
2. Refine visual hierarchy.
3. Redesign New Case Intake workflow.
4. Align intake structure with operational prioritization outputs.
