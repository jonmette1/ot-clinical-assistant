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

- docs/PROJECT_SNAPSHOT.md
- docs/CONSULTANT_HANDOFF.md
- docs/PROJECT_STATUS_AND_DIRECTION.md
- docs/foundation/north_star.md
- docs/foundation/active_roadmap.md
- docs/foundation/decision_log.md
- docs/architecture/system_architecture.md

For Workspace V2 work also review:

- docs/UX/case_workspace_v2.md
- docs/UX/case_workspace_layout_specification_v1.md

For longitudinal workflows also review:

- docs/architecture/longitudinal_progression_architecture.md
- docs/UX/progression_display_principles.md

When conflicts exist:

1. Decision Log
2. Active Roadmap
3. System Architecture
4. UX Documents
5. Project Snapshot / Consultant Handoff

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

The project has completed major architectural stabilization and is now in workflow validation / adoption-readiness maturation.

The following systems are considered authoritative:

- deterministic clinical reasoning architecture
- continuity architecture
- progression architecture
- operational prioritization architecture
- reassessment architecture
- mutation governance architecture
- patient-centric Command Center / Patient History navigation

Recently completed work includes:

- Snapshot Awareness Phase 1
- Clinical Impact Summary
- Command Center delta visibility
- refreshed Next Action derivation
- Intake Prioritization Phase 1 and Phase 2
- High Impact intake hierarchy
- Workflow Simplification / Navigation Normalization
- Patient History terminology update
- Visit History access from Command Center
- Clinical Briefing UX Normalization
- Visit History reorientation from software versions to visit-based clinical summaries

Current priorities are:

1. Progression Check discoverability / sticky navigation jump
2. Action bar cleanup / overflow menu
3. Responsive UX / mobile-desktop polish
4. Longitudinal Visibility / Continuity Compression as a future opportunity
5. PT platform configuration validation and SLP feasibility review as post-MVP expansion research

Assume stable systems should be consumed by workflow surfaces rather than redesigned unless explicitly instructed otherwise.

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
# Patient-Centric Navigation Rule

The product has transitioned from:

Case-Centric Navigation

to:

Patient-Centric Navigation.

Approved navigation model:

Patient

├── Command Center
└── Patient History

---

## Command Center Purpose

The Command Center is the primary clinician workflow surface.

Its purpose is rapid clinical orientation.

The Command Center should allow a clinician to answer within approximately 5 seconds:

1. Is the patient improving, stable, or declining?
2. What changed since the last visit?
3. Why does that change matter?
4. What requires attention today?
5. What should I do next?

without reconstructing prior visits from memory.

The software should carry the continuity burden.

The clinician should not.

---

## Command Center Content

Command Center content should prioritize:

* Case Status
* Since Last Visit
* Attention Required
* Current Focus
* Next Action
* Clinical Impact Summary when recent progression updates changed or confirmed clinical conclusions
* Recent Visit History

Recent visit history is considered orientation content, not historical reference content.

---

## Patient History Purpose

Patient History exists for context, review, and deeper investigation.

Examples:

* Evaluation
* Goals
* Caregiver Context
* Environmental Context
* Operational Pressures
* Visit History
* Saved clinical snapshots
* Generated Outputs
* Full Longitudinal Review

Patient History content should not compete with orientation content.

---

## Navigation Decision Rule

When determining placement of information:

If a clinician would need the information while preparing for a visit within the next 15 minutes:

Place it in the Command Center.

If the information is primarily for review, context, explanation, investigation, or historical understanding:

Place it in Patient History.

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
- Visit History
- Generated Outputs
- Advanced Configuration

---

# Historical Snapshot and Snapshot Awareness Rule

Historical snapshots are continuity tools.

They are not primary workflow content and should not compete with live Command Center authority.

History should support:

- review
- continuity
- restoration
- auditability

Snapshot Awareness is now an active roadmap priority. Clinicians must be able to tell whether they are viewing current operational truth, a historical/generated snapshot, or reference context without understanding continuity internals.

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

# Implementation Bias Rule

When documentation, architecture, and UX specifications already exist:

Assume planning is complete.

Do not generate additional recommendation phases unless explicitly requested.

Do not pause implementation to:

- revisit approved hierarchy
- revisit approved UX decisions
- revisit approved workflows
- propose documentation updates
- propose roadmap updates

If an approved specification exists:

implement it.

Only stop implementation when:

1. a technical conflict exists
2. a documented decision conflict exists
3. required information is missing

Otherwise proceed directly to implementation planning.

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
# Implementation Execution Rule

When an approved architecture, roadmap direction, or UX objective already exists:

Implementation agents should assume strategic planning is complete.

Do not respond with:

* stop implementation
* gather more feedback
* validate before proceeding
* revisit roadmap
* revisit architecture

unless:

1. a documented conflict exists
2. required information is missing
3. implementation cannot proceed safely

Implementation responses should default to:

* exact files
* exact changes
* exact implementation steps
* exact Codex prompts

The role of an implementation agent is execution support, not product governance.

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

The product has transitioned toward continuity-aware longitudinal workflows.

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

## UX Governance

The following UX documents are considered authoritative:

* `docs/UX/Visual_Design_Principles.md`
* `docs/UX/Command_Center_UX_Normalization_Roadmap.md`

When proposing UX, visual design, layout, hierarchy, or presentation changes:

Review both documents before making recommendations.

Do not introduce visual patterns that conflict with these documents without explicit approval.

### Approved Visual Direction

The OT Clinical Assistant is a clinical operations command center.

The approved design philosophy is:

* Clinical Mission Control
* The restraint of Apple
* The clarity of Linear
* The authority of a clinical workstation

The interface should feel:

* calm
* focused
* trustworthy
* clear
* professional
* decisive

The interface should not feel:

* flashy
* futuristic
* AI-centric
* dashboard-heavy
* over-designed

### UX Priorities

Prefer:

1. hierarchy
2. scanability
3. cognitive load reduction
4. typography-driven organization
5. whitespace-driven organization
6. clinically meaningful color
7. workflow continuity

Avoid:

* decorative color systems
* category-based color systems
* excessive card nesting
* competing visual authority
* dashboard-style visual fragmentation
* UI patterns that increase interpretation burden

### Information Authority Model

Visual hierarchy should reinforce:

Level 1 — Current Clinical Reality

Level 2 — Meaningful Change

Level 3 — Required Attention

Level 4 — Immediate Action

Level 5 — Supporting Context

Not all information deserves equal visual authority.

Whenever hierarchy decisions are made, determine the information authority level before determining visual treatment.

### Current UX Workstream

The project is currently executing:

Command Center UX Normalization and Snapshot Awareness

Primary objectives:

* reduce visual competition
* reduce card fragmentation
* move hierarchy from containers to typography
* reduce decorative color usage
* strengthen workflow-oriented scanning
* clarify live current-state versus historical snapshot context

Do not propose architecture, navigation, workflow, or ownership changes as part of UX normalization or Snapshot Awareness efforts.
