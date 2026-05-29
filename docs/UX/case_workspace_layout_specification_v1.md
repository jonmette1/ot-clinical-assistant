# Case Workspace Layout Specification V1

## Status

IMPLEMENTATION AUTHORITY

Approved hierarchy specification for Workspace V2 implementation.

This document defines:

- exact section order
- default open/collapsed behavior
- visible content
- collapsed content
- hierarchy implementation rules

This document does not define:

- continuity architecture
- progression architecture
- operational prioritization architecture
- reassessment architecture
- mutation governance architecture

Those systems are governed elsewhere.

---

# Primary Objective

A clinician should be able to answer:

1. What is happening?
2. What matters most?
3. What should I do next?
4. Does the current plan remain appropriate?

within approximately 10 seconds.

The workspace should behave as a clinical command center rather than a generated report.

---

# Workspace Hierarchy

## Section 1 — Sticky Header

### Default State

Always visible.

### Purpose

Orientation only.

### Display

- Patient Name
- Age / Diagnosis
- Target Activity
- Current Phase
- Last Updated

### Do Not Display

- continuity reasoning
- operational drift
- instability drivers
- decision transparency
- configuration controls

---

## Section 2 — Command Center

### Default State

Open

### Purpose

Primary workspace authority.

Most important section on the page.

### Display

#### Current Operational State

Most visually dominant element on the page.

Single concise statement.

#### Clinical Status

- On Track
- Monitor Closely
- Needs Reassessment

#### Clinical Status Explanation

Maximum one sentence.

#### Why This Status?

Collapsed by default.

Display only:

- Primary Driver
- What Changed
- Why It Matters

Maximum one sentence each.

#### Top Priorities

Maximum three.

Ordered by importance.

#### Immediate Actions

Always visible.

Action-oriented.

Reserved for current treatment priorities.

#### Potential Enhancements

Collapsed.

Optional optimization opportunities.

Not urgent.

### Primary Actions

- Review current operational emphasis
- Review immediate actions
- Determine whether reassessment is needed

---

## Section 3 — Operational Pressures

### Default State

Open

### Purpose

Primary supporting context.

Explains why the current operational emphasis exists.

### Display

#### Environment

Environmental barriers impacting performance.

#### Caregiver

Caregiver capacity and support considerations.

#### Transfer / Mobility

Mobility limitations influencing treatment priorities.

### Primary Actions

- Identify environmental barriers
- Identify caregiver limitations
- Identify transfer and mobility pressures

---

## Section 4 — Reference Workspace

### Default State

Collapsed

### Purpose

Supporting information.

Not required for initial orientation.

---

### Case Details

Default: Collapsed

Contains:

- demographics
- case metadata
- supporting patient information

---

### Detail Modules

Default: Collapsed

Contains:

- Equipment Assessment
- Transfer Assessment
- Caregiver Assessment
- Environmental Assessment

Modules remain available but do not compete with operational workflow.

---

### Historical Snapshots

Default: Collapsed

Contains:

- continuity snapshots
- historical case states
- restoration workflows

Primary Action:

- Restore snapshot

---

### Decision Transparency

Default: Collapsed

Contains:

- decision engine outputs
- supporting reasoning information
- advanced interpretation details

Not required for normal workflow.

---

### Advanced Configuration

Default: Collapsed

Contains:

- Clinical Focus
- advanced workspace controls
- future configuration settings

Primary Action:

- Modify workspace configuration

---

# Visual Hierarchy Rules

## Level 1 — Highest Authority

Current Operational State

Must be the most visually dominant element on the page.

---

## Level 2

Clinical Status

Top Priorities

Immediate Actions

---

## Level 3

Operational Pressures

- Environment
- Caregiver
- Transfer / Mobility

---

## Level 4

Reference Workspace

- Case Details
- Detail Modules
- Historical Snapshots
- Decision Transparency
- Advanced Configuration

---

# Progressive Disclosure Rules

A clinician should be able to use the workspace effectively without opening:

- Detail Modules
- Historical Snapshots
- Decision Transparency
- Advanced Configuration

Those sections exist for deeper review, not primary workflow.

---

# Implementation Constraints

Do not:

- add new sections
- expose continuity architecture
- expose operational drift
- expose change classifications
- expose instability classifications
- expose engine terminology

Do not modify:

- continuity systems
- progression systems
- operational prioritization systems
- reassessment systems
- mutation governance systems

Workspace V2 implementation is a hierarchy and presentation effort only.

---

# Implementation Success Criteria

When a clinician opens a case, they should immediately understand:

- current treatment emphasis
- current clinical status
- top priorities
- immediate actions
- primary operational pressures

without opening any secondary section.

If this can be accomplished within approximately 10 seconds, Workspace V2 implementation is successful.
