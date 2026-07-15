# AGENTS.md

## Repository identity

This repository is the **Clinical Continuity Platform** implementation inside the broader **Continuity Platform** direction.

The current implemented application is **Clinical Continuity** with an **OT configuration**. **Care Continuity** is a future application concept under validation and is not implemented here.

Git is the source of truth. Conversations, prompts, consultant exchanges, and handoffs are temporary working context unless approved direction is written back to the repository.

## Active authority stack

Before material work, read active authorities in this order:

1. `docs/foundation/platform-foundation.md`
2. `docs/architecture/system-architecture.md`
3. `docs/governance/program-state.md`
4. `docs/governance/current-focus.md`
5. `docs/governance/active-roadmap.md`
6. `docs/governance/decision-continuity-log.md`
7. `docs/governance/operating-model.md`
8. relevant subordinate technical references

Archive documents are historical reference only unless an active authority explicitly cites them for evidence.

## Authority precedence

When active documents appear to conflict:

1. Platform Foundation governs enduring product identity and principles.
2. System Architecture governs permanent system ownership and contracts.
3. Program State governs current repository implementation truth.
4. Current Focus governs the single active work boundary.
5. Active Roadmap governs sequencing.
6. Decision Continuity governs why material decisions were made.
7. Operating Model governs agent roles and coordination workflow.
8. Subordinate references govern only within their scoped technical area.

Inspect repository reality before acting. Do not rely on memory or prior chat when it conflicts with the repository.

## Role boundaries for Codex and implementation agents

Codex owns implementation of approved work, repository inspection, tests, mechanical documentation migration, scoped refactoring only when explicitly approved, PR creation, and implementation reporting.

Codex must not:

- create product strategy;
- choose or reprioritize the active roadmap;
- redesign UX;
- invent architecture;
- reopen completed boundaries without new evidence and Founder approval;
- expand scope beyond the approved boundary;
- treat documentation extraction as approval to implement;
- make Care Continuity, PT, SLP, or other expansion implementation without explicit approval.

Do not answer implementation tasks with open-ended product redesign. If approved specifications exist, implement them within scope.

## Clinical and continuity authority boundaries

- Deterministic systems remain authoritative for clinical reasoning, continuity state, current-versus-historical truth, and supported state transitions.
- AI may assist with synthesis, organization, explanation, and communication of supported conclusions.
- AI must not become the authority for clinical reasoning, care authority, unsupported recommendations, or current truth.
- Humans retain verification, correction, judgment, and final use authority.
- Current truth and historical truth must remain distinct. Historical snapshots, generations, and prior longitudinal events must not be rewritten to simplify current state.
- Candidate shared architecture must remain labeled candidate until validated across Clinical Continuity and Care Continuity.
- Simulated or persona-based validation must not be described as real-clinician proof.

## Documentation update expectations

Update governance documents when a material product decision, architecture boundary, implementation boundary, validation result, active priority, superseded direction, or implementation reality changes.

Not every PR requires governance updates. Do not update permanent documents for minor implementation details unless the active authority stack would otherwise become inaccurate.

Preserve superseded governance or strategy documents in the archive rather than deleting them silently.

## Terminal and repository execution rules

- Use `rg` for search; do not use `grep -R` or `ls -R` in large trees.
- Prefer small, targeted changes over broad rewrites.
- Do not modify application code, schemas, API contracts, persistence, clinical logic, progression logic, continuity logic, AI generation behavior, UI, or tests unless explicitly in scope.
- Never put try/catch blocks around imports.
- Run checks appropriate to the change and report failures honestly.
- For documentation-only work, validate Markdown links, stale authority references, current identity language, and `git diff --check`.
- Commit changes on the current branch and open one pull request when changes are made.
