# AGENTS.md

# OT Clinical Assistant

Repository-wide guidance for all AI agents, Codex tasks, contributors, and future implementation work.

---

# Project Mission

The OT Clinical Assistant exists to support occupational therapy clinical reasoning for adult rehabilitation and home health workflows.

The system should help clinicians:

- identify what matters most
- prioritize intervention efforts
- understand environmental barriers
- understand caregiver constraints
- support continuity across visits
- reduce documentation and cognitive burden

The product should feel like:

> a clinician command center

not:

> an AI-generated report

---

# Source of Truth Documents

Before making architectural or UX decisions, review:

- docs/north_star.md
- docs/system_architecture.md
- docs/active_roadmap.md
- docs/decision_log.md

For Workspace V2 work also review:

- docs/UX/case_workspace_v2.md
- docs/UX/case_workspace_layout_specification_v1.md

For longitudinal workflows also review:

- docs/Longitudinal Progression Architecture.md
- docs/progression_display_principles.md

When conflicts exist:

When conflicts exist:

1. Decision Log
2. Active Roadmap
3. System Architecture
4. UX Documents

# Longitudinal UX Rule

The purpose of longitudinal UX is not to expose continuity architecture.

The purpose of longitudinal UX is to help clinicians understand:

- what changed
- why it changed
- what should be done differently
- what progression transition is approaching
- what treatment implications result

Prefer clinician-facing decision support over system-facing status displays.

---

# Documentation Standards

## New Markdown Files

All newly created project documentation should be delivered as downloadable `.md` files whenever possible.

Do not provide large project documents exclusively as chat responses.

Preferred workflow:

1. Generate document.
2. Save as `.md` file.
3. Provide downloadable artifact.
4. Commit to repository.

## Markdown Edits

For small edits to existing markdown documents:

- provide changes in markdown format
- preserve existing document structure
- avoid rewriting entire documents unless requested

For major document revisions:

- generate a complete downloadable `.md` artifact

---

# Current Project State

The project has completed major architectural stabilization.

The following systems are considered authoritative:

- continuity architecture
- progression architecture
- operational prioritization architecture
- reassessment architecture
- mutation governance architecture

Assume these systems are stable unless explicitly instructed otherwise.

---

# Architecture Stability Rule

When encountering a UX problem:

DO NOT immediately redesign architecture.

First consider:

- hierarchy
- information density
- section ordering
- visual authority
- progressive disclosure
- workflow clarity

The preferred solution is usually:

UX improvement

not:

architecture modification

---

# Workspace V2 Rule

Workspace V2 is a hierarchy and presentation effort.

Workspace V2 should not introduce:

- new reasoning engines
- new continuity systems
- new progression systems
- new prioritization systems
- new reassessment systems

Workspace V2 should focus on:

- scanability
- hierarchy
- cognitive load reduction
- workflow clarity
- command center behavior

---

# Command Center Philosophy

The workspace should answer:

1. What is happening?
2. What matters most?
3. What should I do next?
4. Does the current plan remain appropriate?

within approximately 10 seconds.

The clinician should not need to:

- open transparency panels
- inspect history
- understand continuity architecture
- understand system internals

to answer those questions.

---

# Continuity UX Rule

The continuity system may remain sophisticated.

The clinician experience should remain simple.

Do not expose:

- operational drift
- continuity interpretation
- change classification
- instability classifications
- internal continuity terminology

Primary workspace status should remain:

- On Track
- Monitor Closely
- Needs Reassessment

Use clinician-facing language.

---

# Operational Prioritization Rule

Current Operational State is the primary workspace output.

It should represent:

> what treatment should focus on right now

Current Operational State should always be more visually prominent than:

- progression state
- continuity information
- historical information
- configuration controls

---

# Progressive Disclosure Rule

Prefer:

collapsed secondary information

over:

large always-visible sections

Default workflow should emphasize:

- Command Center
- Operational Pressures

Secondary content should remain subordinate.

Examples:

- Detail Modules
- Historical Snapshots
- Decision Transparency
- Advanced Configuration

---

# Historical Snapshot Rule

Historical snapshots are continuity tools.

They are not primary workflow content.

History should support:

- review
- continuity
- restoration

History should not dominate workspace hierarchy.

---

# Clinical Focus Rule

Clinical Focus is configuration.

Clinical Focus is not workflow.

Clinical Focus belongs under:

Advanced Configuration

unless explicitly directed otherwise.

---

# Implementation Philosophy

Prefer:

- reordering
- simplifying
- collapsing
- grouping
- relabeling

Before introducing:

- new models
- new systems
- new workflows
- new abstractions

Preserve existing functionality whenever possible.

---

# Refactor Philosophy

Avoid large refactors unless explicitly requested.

Prefer:

small, targeted changes

over:

broad architectural rewrites

If architecture changes appear necessary:

1. explain why
2. identify affected systems
3. propose alternatives
4. wait for approval

---

# Data Model Protection

Do not modify without explicit approval:

- database schema
- persistence structure
- generation storage
- continuity storage
- progression storage

---

# API Protection

Do not modify API contracts unless required.

Avoid changing:

- request payload shapes
- response payload shapes
- generated output structures

without explicit approval.

---

# Longitudinal Workflow Rule

The product is transitioning toward continuity-aware longitudinal workflows.

Do not revert toward:

- isolated case generation
- pathway-selection workflows
- competing treatment plans

Prefer:

continuity-aware operational prioritization.

---

# Codex Completion Workflow

After implementation:

1. Create PR
2. Review PR
3. Merge PR
4. Return to local repository
5. Run:

git pull

6. Verify locally

Do not assume implementation exists locally until:

- PR merged
- local repository updated

---

# Success Metric

Successful changes should improve at least one of:

- clinician orientation
- workflow clarity
- treatment prioritization
- continuity usability
- cognitive load reduction

without increasing:

- complexity
- architecture surface area
- workflow friction
- implementation risk
