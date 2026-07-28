# Clinical Continuity Platform Repository Health Assessment

## Scope

This is an architecture-health assessment, not a code review, product critique, security audit, or implementation authorization. Observations are repository evidence. Recommendations are reasoned next-step options and remain subordinate to Current Focus, roadmap sequencing, Product Design, Architecture, and Founder approval.

## Overall assessment

The repository has a coherent architectural center: structured evidence flows into deterministic clinical/progression/continuity interpretation, then into attention and communication, while current truth remains distinct from history. Governance is unusually explicit about authority and scope. Health risk is concentrated less in conceptual inconsistency than in distributed orchestration, implicit persistence contracts, transitional assembly paths, and incomplete provenance/correction mechanics.

## Observations

### Architectural consistency

- Deterministic authority is consistent across active documentation, pure builders, progression orchestration, and AI prompts.
- Clinical Continuity, OT configuration, conceptual shared foundation, and delivery responsibilities are consistently distinguished.
- Progression, operational emphasis, attention, and reconciliation are modeled as related but non-identical concepts.
- No implemented Care Continuity/shared runtime was found, matching governance.

### Coupling

- `CaseWorkspaceClient.tsx` combines persistence reads/writes, workflow commands, history selection, regeneration, deterministic composition, and UI state in one very large client module.
- Browser components directly depend on Supabase table/column shapes, increasing coupling among UI, persistence, and mutation behavior.
- Pure `src/lib` builders generally avoid provider/persistence coupling and form the healthier architectural core.

### Duplicated concepts and assembly

- Canonical normalization/decision/progression assembly occurs in multiple intake, workspace, seed, and API paths rather than exclusively through `buildCanonicalContinuityState`.
- Current product language (“Visit Briefing”, “operational prioritization”) coexists with implementation-era `commandCenter*` and residual pathway compatibility terminology.
- Similar current-orientation concepts are represented in generated output, progression state, current longitudinal state, attention state, and client-derived projections; ownership is documented, but the number of representations increases drift risk.

### Undocumented or implicit assumptions

- Complete Supabase schema, migrations, RLS policies, indexes, foreign keys, database constraints, and generated types are absent from the repository.
- Atomicity across longitudinal-event insertion and current-case projection update is not demonstrated in repository code.
- Runtime validation for AI response object shape is limited; valid JSON does not prove contract completeness.
- Environment variables and deployment topology are only partially inferable from code.
- Retention/deletion policy for historical generations is unclear even though content authority is clear.

### Stale implementation and documentation

- Internal Command Center naming persists after Visit Briefing became the authoritative workflow term.
- Pathway-era compatibility structures are documented transitional debt rather than current product semantics.
- Some subordinate clinical/UX documents still use historical product/workflow terminology; active authority precedence prevents them from governing, but agents may misread them.
- `continuity-model-working-draft-v0.1.md` still describes shared concerns as candidates even though the later canonical Shared Continuity Foundation approves a bounded conceptual set. Its status note and precedence mitigate, but do not eliminate, stale-language risk.

### Ownership clarity

- Strategic and conceptual ownership is clear in the authority stack.
- Runtime ownership is clearest in pure builders and weakest in the workspace/mutation/persistence boundary.
- Generated operational prioritization has bounded authority, but its representation can be created by AI generation and refreshed deterministically from an event; the dual production paths deserve explicit contract documentation.

### Architectural drift and missing decisions

- Canonical continuity attachment and mutation standardization are known transitional areas, not hidden drift.
- Correction/provenance hardening is explicitly deferred and therefore incomplete by design.
- No repository-local ADR/index identifies which subordinate architecture references remain active beyond links in authorities.
- No explicit decision defines persistence transaction/immutability enforcement, historical retention, or runtime schema ownership in Git.

### Validation health

- Deterministic and presentation tests exist, but the default `npm test` script covers only colocated longitudinal/caseload tests, not the broader root `tests/` suite.
- Repository evidence does not establish real-clinician validity, production readiness, representative clinical accuracy, or adoption.
- Seed/persona evidence is synthetic and correctly must not be promoted as clinical proof.

## Recommendations

These recommendations are ordered by architectural risk, **not roadmap priority**. They do not activate implementation.

1. **Keep this audit set as a maintained implementation map.** Update it when source ownership, public interfaces, persistence state, or alignment materially changes.
2. **Define persistence contracts in Git when authorized.** Record schema/migrations or an authoritative schema reference, security-policy ownership, write-once/append-only enforcement, and transaction expectations.
3. **Treat workspace decomposition as a future bounded architecture task, not cleanup.** Separate data access, mutation commands, deterministic view-model assembly, and presentation only after Product Design and Architecture establish the safe boundary.
4. **Standardize canonical assembly only when DCL-024 is reopened.** Use the existing canonical continuity seam or a successor to prevent independent assembly drift; do not opportunistically refactor now.
5. **Add runtime schemas at provider/API boundaries when approved.** Validate generated JSON and progression commands structurally while preserving deterministic semantic authority.
6. **Make history retention explicit.** Decide whether “immutable” means immutable content, undeletable records, auditable deletion, or a defined retention policy.
7. **Plan terminology cleanup as a mechanical migration.** Retire Command Center/pathway-era identifiers only when compatibility and Product Design language are settled; avoid mixing it with behavioral change.
8. **Index active subordinate references.** A short status register could mark each as active, working, transitional, or historical without rewriting its contents.
9. **Clarify test tiers.** Distinguish the default fast suite, full deterministic suite, presentation/static checks, integration tests requiring Supabase/OpenAI, and future real-clinician validation.
10. **Use real-clinician evidence before broadening abstractions.** Do not convert current OT builders into shared or multi-discipline contracts based on code shape alone.

## Risk register

| Risk | Likelihood from evidence | Impact | Existing control | Remaining uncertainty |
| --- | --- | --- | --- | --- |
| Mutation bypasses freshness/recalculation | Medium | High | DCL-018, stale flags, explicit mutation flows | Distributed writes and absent central command boundary |
| Current/history confusion | Low–medium | High | DCL-019, separate tables/snapshots, briefing labels | Retention and historical selection behavior |
| AI output contract drift | Medium | Medium–high | Strong prompts, JSON parsing, deterministic inputs | No full runtime schema/semantic validator |
| Persistence contract drift | Medium | High | Repeated query shapes and application tests | Schema/policies absent from Git |
| OT logic generalized prematurely | Low under current governance | High | Explicit ownership and scope boundaries | Future contributor misunderstanding |
| Composition-root regression | Medium | High | Pure builder tests and presentation tests | Workspace size and responsibility concentration |
| Documentation authority confusion | Medium | Medium | Active stack and archive rules | Numerous subordinate/historical terms |

## Health baseline for future audits

Future audits should compare: count/location of direct persistence writers; use of canonical assembly; current/history enforcement; AI response validation; terminology residue; test-tier coverage; provenance/correction implementation; and whether real-clinician evidence has changed Program State. A change in these measures makes architectural drift observable without turning this document into a roadmap.
