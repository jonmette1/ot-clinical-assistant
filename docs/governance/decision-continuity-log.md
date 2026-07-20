# Decision Continuity Log

## Purpose

This log records material decisions, why they were made, what they replaced, and when they may be reopened. Historical decisions are preserved without rewriting them as mistakes.

## Format

Each entry includes ID, date, decision, owner, rationale, supporting evidence, repository impact, implementation impact, superseded decision, reopening condition, and status.

## Decisions

### DCL-001 — Deterministic systems remain authoritative

- Date: 2026-06-04
- Decision: Deterministic reasoning is the authoritative clinical reasoning layer; AI is constrained to synthesis, organization, explanation, workflow communication, and narrative compression.
- Owner: Founder / Architecture
- Rationale: Supports explainability, consistency, defensibility, and clinician trust.
- Supporting evidence: Historical decision log and implemented reasoning architecture.
- Repository impact: Preserve deterministic authority in active documentation.
- Implementation impact: No autonomous AI-owned clinical reasoning.
- Superseded decision: None.
- Reopening condition: Founder-approved strategic change with safety and validation evidence.
- Status: active.

### DCL-002 — Continuity becomes the platform organizing principle

- Date: 2026-07-15
- Decision: Continuity is the organizing principle for the future Continuity Platform direction.
- Owner: Founder
- Rationale: Current product value centers on maintained understanding, meaningful change, evidence lineage, and reduced reconstruction burden.
- Supporting evidence: Reboot instruction and archived project status documents.
- Repository impact: New Platform Foundation and authority stack.
- Implementation impact: Documentation-only; no runtime change.
- Superseded decision: Broader Clinical Assistant Platform identity is narrowed and archived as historical.
- Reopening condition: Founder explicitly approves a new product identity.
- Status: active.

### DCL-003 — Clinical Continuity and Care Continuity are distinct applications

- Date: 2026-07-15
- Decision: Clinical Continuity and Care Continuity are distinct applications under the future Continuity Platform hierarchy.
- Owner: Founder
- Rationale: They may share continuity primitives but differ in authority, language, users, workflows, and obligations.
- Supporting evidence: Reboot instruction.
- Repository impact: Application placeholders and architecture separation.
- Implementation impact: Documentation-only; no Care Continuity implementation.
- Superseded decision: Any implied single clinical assistant expansion path.
- Reopening condition: Cross-application validation supports a different model.
- Status: active.

### DCL-004 — OT is the first implemented Clinical Continuity configuration

- Date: 2026-07-15
- Decision: OT is documented as the current implemented Clinical Continuity configuration.
- Owner: Founder
- Rationale: Repository implementation and source documents are OT-heavy, while the current product identity is Clinical Continuity Platform.
- Supporting evidence: Existing clinical model, UX, architecture, and status documents.
- Repository impact: Active docs separate OT configuration from Clinical Continuity application.
- Implementation impact: Documentation-only.
- Superseded decision: OT Clinical Assistant as current platform identity.
- Reopening condition: Additional validated discipline configurations exist.
- Status: active.

### DCL-005 — Current engine is not declared universal

- Date: 2026-07-15
- Decision: The current engine is not a proven universal continuity engine.
- Owner: Founder / Architecture
- Rationale: Cross-application reuse is unvalidated.
- Supporting evidence: Reboot evidence boundary.
- Repository impact: Shared foundation is labeled candidate.
- Implementation impact: No technical extraction from documentation alone.
- Superseded decision: Any overbroad universal-platform reading of older docs.
- Reopening condition: Clinical and Care validation proves shared ownership.
- Status: active.

### DCL-006 — Git is the source of truth; conversations are temporary

- Date: 2026-07-15
- Decision: Git is the durable source of truth; conversations, prompts, consultant exchanges, and handoffs are temporary working context.
- Owner: Founder / Chief of Staff
- Rationale: Reduce founder coordination burden and prevent agent memory drift.
- Supporting evidence: Reboot instruction.
- Repository impact: Operating model and AGENTS rewrite.
- Implementation impact: Agents must update durable docs for approved strategic changes.
- Superseded decision: Handoff-driven coordination as primary authority.
- Reopening condition: Founder approves another governance model.
- Status: active.

### DCL-007 — CoS owns coordination continuity

- Date: 2026-07-15
- Decision: The Chief of Staff owns coordination continuity, document authority, current focus, roadmap sequencing, decision continuity, and post-merge governance reconciliation.
- Owner: Founder
- Rationale: Centralizes coordination without making Founder the routine routing layer.
- Supporting evidence: Reboot instruction.
- Repository impact: Operating model defines CoS responsibilities.
- Implementation impact: Codex receives reconciled implementation boundaries.
- Superseded decision: Direct, conflicting multi-agent instructions to Codex.
- Reopening condition: Founder changes coordination model.
- Status: active.

### DCL-008 — Codex implements approved work and does not make product decisions

- Date: 2026-07-15
- Decision: Codex owns implementation, inspection, tests, mechanical documentation migration, scoped approved refactoring, PR creation, and reporting; Codex does not create strategy, choose roadmap, redesign UX, invent architecture, reopen decisions, or expand scope.
- Owner: Founder / Chief of Staff
- Rationale: Prevents implementation agents from becoming product governance.
- Supporting evidence: Reboot instruction.
- Repository impact: AGENTS and Operating Model role boundaries.
- Implementation impact: Codex must stop at approved boundary.
- Superseded decision: Informal implementation-agent strategy setting.
- Reopening condition: Founder grants explicit authority.
- Status: active.

### DCL-009 — Active authority stack replaces handoff-driven coordination

- Date: 2026-07-15
- Decision: The active authority stack governs before historical handoffs.
- Owner: Founder / Chief of Staff
- Rationale: Durable repository truth prevents fragmentation.
- Supporting evidence: Reboot instruction.
- Repository impact: README, AGENTS, and governance docs point to the stack.
- Implementation impact: Agents read active authorities first.
- Superseded decision: Project snapshot, consultant handoff, and next-agent handoff as primary orientation.
- Reopening condition: Founder changes repository governance.
- Status: active.

### DCL-010 — Historical documentation is archived, not discarded

- Date: 2026-07-15
- Decision: Superseded documentation is preserved in the dated reboot archive rather than silently deleted.
- Owner: Founder / Chief of Staff
- Rationale: Preserve evidence, conflicts, and decision lineage.
- Supporting evidence: Reboot instruction.
- Repository impact: Archive hierarchy and migration report.
- Implementation impact: Documentation-only.
- Superseded decision: None.
- Reopening condition: Repository retention policy changes.
- Status: active.

### DCL-011 — Cognitive compression over narrative richness

- Date: 2026-06-04
- Decision: The platform prioritizes cognitive compression and workflow clarity over narrative richness.
- Owner: Founder / Product Design
- Rationale: Primary workflows occur under time pressure, documentation fatigue, and cognitive overload; operational usability is more important than expansive narrative generation.
- Supporting evidence: Archived `DECISION 002` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active documentation should continue to favor concise orientation, maintained understanding, and workflow clarity.
- Implementation impact: Generated and displayed information should be compressed around current meaning, change, attention, and action rather than narrative breadth.
- Superseded decision: None.
- Reopening condition: Real-clinician validation demonstrates that richer narrative materially improves safe workflow use without increasing cognitive load.
- Status: Active.

### DCL-012 — Environmental realism and caregiver feasibility remain core reasoning priorities

- Date: 2026-06-04
- Decision: Environmental realism and caregiver feasibility are core reasoning priorities.
- Owner: Founder / Architecture
- Rationale: Adult rehabilitation and home-health workflows depend on real residential environments, caregiver limitations, and practical feasibility.
- Supporting evidence: Archived `DECISION 003` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Program State and architecture references should continue to classify environment and caregiver feasibility as material Clinical Continuity and OT configuration concerns.
- Implementation impact: Reasoning and workflow surfaces must not reduce Clinical Continuity to diagnosis-only or impairment-only interpretation.
- Superseded decision: None.
- Reopening condition: Validated application-specific evidence supports a different feasibility model for a non-OT configuration or Care Continuity.
- Status: Active.

### DCL-013 — Operational prioritization replaces pathway semantics as treatment-direction authority

- Date: 2026-06-04
- Decision: The product transitioned from multi-pathway recommendation architecture toward continuity-aware operational prioritization; current operational emphasis replaces selected-pathway semantics as the primary treatment-direction authority.
- Owner: Founder / Architecture
- Rationale: Historical pathways functioned as operational emphasis states, continuity-sensitive priorities, and progression-adjacent weighting states rather than true competing treatment plans.
- Supporting evidence: Archived `DECISION 004`, `DECISION 006`, and `DECISION 011` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active documents should refer to operational prioritization and current operational state rather than pathway selection as the governing model.
- Implementation impact: Implementations should derive what dominates treatment attention now through deterministic operational prioritization, not clinician selection among competing AI-generated plans.
- Superseded decision: Multi-pathway recommendation semantics as primary treatment direction.
- Reopening condition: Founder-approved architecture change supported by real-clinician validation and migration plan.
- Status: Active.

### DCL-014 — Pathway-era compatibility remains transitional debt

- Date: 2026-06-04
- Decision: Pathway-era structures such as `selectedPathwayIndex` may remain temporarily for backward compatibility but should not regain semantic authority.
- Owner: Architecture / Codex
- Rationale: Existing case rendering, historical generations, copy/export workflows, and guidance structures may depend on pathway-indexed data; immediate removal could destabilize stored cases or continuity workflows.
- Supporting evidence: Archived `DECISION 007` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active governance should preserve compatibility as transitional, not as current product direction.
- Implementation impact: Do not remove compatibility fields without explicit migration approval; do not use those fields to reintroduce pathway selection as current authority.
- Superseded decision: Immediate removal of pathway-era fields.
- Reopening condition: Migration audit proves stored cases, exports, and historical snapshots no longer depend on pathway-era structures.
- Status: Transitional.

### DCL-015 — Adjacent operational priorities replace alternative treatment approaches

- Date: 2026-06-04
- Decision: “Alternative Treatment Approaches” should be understood as adjacent operational priorities rather than true alternatives.
- Owner: Founder / Product Design / Architecture
- Rationale: The historical alternatives represented nearby emphasis areas, secondary concerns, emerging readiness areas, and possible next emphasis candidates; calling them alternatives created a false option-selection model.
- Supporting evidence: Archived `DECISION 008` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active documentation should avoid restoring alternative-treatment-pathway framing as current authority.
- Implementation impact: Workflow language should support continuity-aware priority movement without implying competing treatment philosophies.
- Superseded decision: Alternative Treatment Approaches as true competing plans.
- Reopening condition: Product Design and Founder approve a validated language model that safely reintroduces alternatives without pathway authority conflicts.
- Status: Active.

### DCL-016 — Progression state and operational emphasis remain distinct

- Date: 2026-06-04
- Decision: Progression state and operational emphasis are related but distinct authorities.
- Owner: Architecture
- Rationale: Progression state describes the patient’s operational continuity condition; operational emphasis describes the dominant intervention priority right now. One-to-one mapping would recreate pathway-era authority conflicts.
- Supporting evidence: Archived `DECISION 009` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Architecture and governance documents should not collapse progression, attention, and operational prioritization into one concept.
- Implementation impact: Deterministic derivation and UI language must preserve the distinction between state classification and current treatment emphasis.
- Superseded decision: One-to-one pathway/progression mapping.
- Reopening condition: Representative clinical validation proves a simpler authority model without loss of correctness or workflow clarity.
- Status: Active.

### DCL-017 — Reassessment updates operational emphasis through deterministic continuity logic

- Date: 2026-06-04
- Decision: Reassessment workflows update operational emphasis through deterministic continuity logic, not through pathway reselection.
- Owner: Architecture
- Rationale: Reassessment should identify what changed, what remains limiting, what dominates treatment attention, and what requires review before continuing.
- Supporting evidence: Archived `DECISION 010` and continuity mutation governance decisions in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Reassessment remains a Clinical Continuity capability governed by deterministic authority.
- Implementation impact: Reassessment-related changes must not be treated as a new AI plan-selection event.
- Superseded decision: Reassessment as pathway reselection.
- Reopening condition: Founder-approved architecture change with safety, validation, and migration evidence.
- Status: Active.

### DCL-018 — Continuity mutations require deterministic governance

- Date: 2026-06-04
- Decision: Any live case change that may affect progression state, operational prioritization, reassessment pressure, stale-state validity, caregiver feasibility, environmental limitation, or detail-module usefulness must be treated as a continuity mutation governed by deterministic authority rules.
- Owner: Architecture
- Rationale: Meaningful changes can otherwise create competing sources of truth across live case state, generated output, deterministic interpretation, AI synthesis, stale flags, detail modules, and historical generations.
- Supporting evidence: Archived continuity mutation `DECISION 012` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active architecture and program-state docs should preserve deterministic mutation governance as still-binding Clinical Continuity authority.
- Implementation impact: Meaningful current-state changes require governed regeneration/recalculation consequences; AI may synthesize but must not decide continuity authority.
- Superseded decision: Treating meaningful case changes as isolated UI edits or standalone regeneration events.
- Reopening condition: Approved architecture introduces an equally deterministic correction/mutation model.
- Status: Active.

### DCL-019 — Historical snapshots are immutable; live operational state owns current truth

- Date: 2026-06-04
- Decision: Live operational case state is the authoritative source of current truth; historical generations remain immutable continuity snapshots.
- Owner: Founder / Architecture
- Rationale: Reassessment and follow-up workflows require a clear authority boundary between current structured data/output/progression/operational emphasis and reviewable historical references.
- Supporting evidence: Archived `DECISION 005` and mutation governance rules in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active documents must continue to distinguish current truth from historical truth.
- Implementation impact: Historical generations and snapshots must not become active editing environments or independently evolving current clinical authorities.
- Superseded decision: Historical generations as active current-state authorities.
- Reopening condition: Founder-approved persistence and auditability model replaces current snapshot authority rules.
- Status: Active.

### DCL-020 — Occupational performance evolution is the primary longitudinal progress unit for the OT configuration

- Date: 2026-06-04
- Decision: For the current OT configuration, the primary longitudinal unit of progress is occupational performance evolution rather than visit history.
- Owner: Founder / Architecture
- Rationale: OT progression is best represented through occupational performance, assistance-level change, milestone attainment, barrier evolution, and operational priority transitions, not visit count or narrative treatment history alone.
- Supporting evidence: Archived longitudinal progress `DECISION 012` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: This decision is preserved as OT-configuration governance within Clinical Continuity, not as a universal Care Continuity rule.
- Implementation impact: OT progression workflows should prioritize structured follow-up data and performance evolution over narrative visit chronology alone.
- Superseded decision: Visit history as the primary progress unit.
- Reopening condition: Cross-application validation identifies a different shared progress abstraction or discipline-specific model.
- Status: Narrowed.

### DCL-021 — Visit Briefing is the primary clinician patient-level workflow surface

- Date: 2026-06-11
- Decision: Visit Briefing is the primary patient-level workflow surface for Clinical Continuity. The earlier Command Center concept is retained only as historical design lineage.
- Owner: Founder / Product Design
- Rationale: Visit Briefing provides rapid orientation around current focus, session focus, attention required, supporting evidence, progression constraints, and next action without exposing unnecessary system complexity.
- Supporting evidence: Archived project-status and workflow documentation.
- Repository impact: Active documentation and future workflow specifications should use Visit Briefing terminology.
- Implementation impact: Patient-level workflow surfaces should prioritize rapid clinical orientation over historical completeness.
- Superseded decision: Command Center as the current workflow name and product surface.
- Reopening condition: Product Design and Founder approve a new validated Clinical Continuity information architecture.
- Status: Active.


### DCL-022 — Deterministic continuity interpretation remains approved Clinical Continuity architecture

- Date: 2026-06-04
- Decision: The platform introduced a deterministic continuity interpretation layer between progression interpretation, operational prioritization, and longitudinal reassessment workflows.
- Owner: Architecture
- Rationale: Continuity interpretation formalized operational continuity condition interpretation, reassessment pressure classification, operational instability surfacing, and continuity-sensitive workflow interpretation without predictive analytics or autonomous AI reasoning.
- Supporting evidence: Archived “Decision — Deterministic Continuity Interpretation Layer” in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active architecture should treat continuity interpretation as an implemented Clinical Continuity capability and a possible candidate shared primitive only after validation.
- Implementation impact: Continuity interpretation must remain deterministic, explainable, operationally compressed, and non-predictive.
- Superseded decision: Multi-pathway architecture as the organizing continuity model.
- Reopening condition: Foundation validation proves a different ownership boundary for continuity interpretation.
- Status: Active.

### DCL-023 — Pause deeper continuity architecture expansion unless operationally justified

- Date: 2026-06-04
- Decision: Deeper continuity architecture expansion should pause after foundational continuity consolidation and prioritize UX compression, operational clarity, and clinician usability stabilization unless further architecture work is operationally justified.
- Owner: Founder / Architecture / Product Design
- Rationale: The primary product risk shifted from insufficient continuity infrastructure to clinician cognitive overload, workflow clarity, and architectural complexity leaking into UX.
- Supporting evidence: Archived `DECISION 014` in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: The active boundary now defines foundation ownership before extraction; it does not authorize speculative architecture expansion.
- Implementation impact: New architecture work should be incremental, implementation-driven, operationally necessary, and explicitly approved.
- Superseded decision: Recursively expanding continuity architecture as the default next step.
- Reopening condition: Current Focus changes or validated implementation need requires additional architecture authority.
- Status: Active.

### DCL-024 — New-case progression assembly and related continuity attachment remain transitional areas

- Date: 2026-06-04
- Decision: New-case progression assembly, API-owned continuity interpretation attachment, and detail-module continuity dependency standardization remain intentionally transitional until operationally necessary, UX-validated, or reassessment workflows mature further.
- Owner: Architecture / Codex
- Rationale: These areas were identified as acceptable transitional debt during the pause on deeper continuity expansion.
- Supporting evidence: Archived `DECISION 014` deferred transitional areas in `docs/archive/2026-continuity-platform-reboot/foundations/decision_log.md`.
- Repository impact: Active governance preserves the debt as known transitional state rather than silently deleting it into the archive.
- Implementation impact: Do not resolve these transitional areas through opportunistic refactor; require explicit approved boundary.
- Superseded decision: Treating transitional continuity attachment debt as completed or irrelevant.
- Reopening condition: Current Focus or roadmap explicitly activates correction/provenance hardening, technical extraction, or related implementation work.
- Status: Transitional.

### DCL-025 — Historical pathway-oriented product identity is superseded

- Date: 2026-07-15
- Decision: Historical pathway-oriented recommendation identity is superseded by Clinical Continuity and continuity-aware operational prioritization governance.
- Owner: Founder
- Rationale: The reboot established Clinical Continuity Platform as current implemented identity and Continuity Platform as future organizing direction.
- Supporting evidence: Reboot instruction and archived decision log.
- Repository impact: Archived decisions remain evidence, but active docs must not restore pathway-era identity as current product strategy.
- Implementation impact: No runtime change; prevents agents from treating archived pathway language as current authority.
- Superseded decision: Pathway-oriented recommendation synthesis as product identity.
- Reopening condition: Founder approves a new product strategy and records it in Git.
- Status: Superseded.

## Historical decision status review

| Archived decision | Active disposition | Active log entry |
| --- | --- | --- |
| DECISION 001 — deterministic reasoning authority | Active | DCL-001 |
| DECISION 002 — cognitive compression over narrative richness | Active | DCL-011 |
| DECISION 003 — environmental realism and caregiver feasibility | Active | DCL-012 |
| DECISION 004 — transition away from multi-pathway recommendation architecture | Active | DCL-013 |
| DECISION 005 — live operational state versus immutable snapshots | Active | DCL-019 |
| DECISION 006 — operational emphasis replaces selected pathway semantics | Active | DCL-013 |
| DECISION 007 — `selectedPathwayIndex` deprecation | Transitional | DCL-014 |
| DECISION 008 — adjacent operational priorities | Active | DCL-015 |
| DECISION 009 — progression state distinct from operational emphasis | Active | DCL-016 |
| DECISION 010 — reassessment through deterministic continuity logic | Active | DCL-017 |
| DECISION 011 — operational-state interpretation architecture | Active | DCL-013 |
| DECISION 012 — continuity mutation governance | Active | DCL-018 |
| DECISION 014 — pause deeper continuity architecture expansion | Active / Transitional | DCL-023 / DCL-024 |
| Duplicate DECISION 012 — occupational performance evolution | Narrowed to OT configuration | DCL-020 |
| DECISION 013 — Command Center primary workflow surface | Superseded by Visit Briefing terminology and workflow model | DCL-021 |
| Deterministic Continuity Interpretation Layer | Active | DCL-022 |
| Historical pathway-oriented product identity | Superseded | DCL-025 |
