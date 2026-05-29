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

Current Operational State is the primary output of the workspace and should be the most visually dominant element on the page.

The workspace should immediately communicate:

> What should treatment focus on right now?

before communicating:

- status
- progression
- demographics
- supporting rationale
- historical information

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

Clinical Status exists to answer:

> Does the current plan remain appropriate?

Clinical Status should be visually prominent but subordinate to Current Operational State.

## Why This Status?

Collapsed by default.

Purpose:

Increase clinician trust in the displayed Clinical Status.

It does not exist to expose continuity architecture.

Display format:

### Primary Driver
One sentence.

### What Changed
One sentence.

### Why It Matters
One sentence.

Constraints:

- maximum three statements
- maximum one sentence per statement
- no lists
- no status classifications
- no continuity terminology
- no operational drift terminology
- no instability classifications
- no engine-specific language

The clinician should understand the rationale without needing to understand how the continuity system functions.

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

Potential Enhancements are optional optimization opportunities.

They are not urgent actions.

They should never compete visually with Immediate Actions.

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

Operational Pressures provide the primary supporting context for the current operational emphasis.

Environment, Caregiver, and Transfer / Mobility should be visually subordinate to the Command Center but more prominent than historical, transparency, or configuration content.

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

The clinician should never need to understand internal continuity architecture in order to use the product effectively.

---

# Workspace V2 Scope Protection

Workspace V2 implementation is a hierarchy and presentation effort.

Do not modify:

- continuity architecture
- progression architecture
- operational prioritization architecture
- reassessment architecture
- mutation governance architecture

Do not introduce:

- new reasoning systems
- new continuity models
- new prioritization models
- new progression models

Implementation work should focus exclusively on:

- hierarchy
- scanability
- information density
- progressive disclosure
- workflow clarity
- cognitive load reduction

The purpose of Workspace V2 is to improve clinician usability without changing underlying system behavior.

---

# Success Criteria

A clinician should be able to answer:

- What is happening?
- What matters most?
- What should I do next?
- Does the plan remain appropriate?

within 10 seconds.

The clinician should not need to:

- open modules
- review transparency
- review history
- understand continuity architecture

to answer those questions.

---

# Next UX Phase

1. Validate clinician usability.
2. Refine visual hierarchy.
3. Redesign New Case Intake workflow.
4. Align intake structure with operational prioritization outputs.
