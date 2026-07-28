# Clinical Continuity Platform Architecture Documentation Strategy

## Recommendation

Keep all seven audit deliverables permanently under `docs/architecture/` beside the governing System Architecture:

```text
docs/architecture/
├── system-architecture.md                 # permanent ownership authority
├── architecture-knowledge-map.md          # subsystem inventory
├── architecture-guide.md                  # Founder teaching guide
├── agent-orientation.md                    # rapid contributor onboarding
├── architecture-reference.md              # definitive implementation reference
├── architecture-alignment.md              # intent-versus-runtime baseline
├── repository-health-assessment.md         # observations and non-authorizing recommendations
└── documentation-strategy.md               # maintenance and placement contract
```

This placement keeps architecture discovery centralized without creating a new top-level authority tier. The active precedence remains Platform Foundation → System Architecture → Program State → Current Focus → Roadmap → Decision Continuity → Operating Model → subordinate references. These audit documents synthesize that authority; they do not supersede it.

## Permanent-document roles

| Document | Why permanent | Update trigger | Primary audience |
| --- | --- | --- | --- |
| [Knowledge Map](architecture-knowledge-map.md) | Fast inventory of subsystems, interfaces, dependencies, lifecycle, stability, and evidence. | Subsystem added/removed; ownership/interface/lifecycle changes. | Architects, implementers, agents. |
| [Architecture Guide](architecture-guide.md) | Explains how and why the engine works without source reconstruction. | Enduring architecture/domain/invariant changes. | Founder and contributors. |
| [Agent Orientation](agent-orientation.md) | Provides a 10–15 minute safe-start path and common traps. | Authority order, integration seam, naming, or safe-change guidance changes. | Future AI agents and new engineers. |
| [Architecture Reference](architecture-reference.md) | Central implementation map of modules, APIs, state, lifecycle, and evidence. | Material implementation reality changes. | Implementers and reviewers. |
| [Alignment Report](architecture-alignment.md) | Establishes a measurable baseline between intent and runtime. | A rated gap closes/widens or an authority contract changes. | Founder, Architecture, governance. |
| [Repository Health Assessment](repository-health-assessment.md) | Separates evidence from recommendations and preserves known architectural risks. | Material risk/control/evidence changes; periodic audit. | Founder, CoS, Architecture. |
| Documentation Strategy | Prevents duplication and explains document maintenance/precedence. | Documentation topology or authority policy changes. | Maintainers and agents. |

## How this set becomes a continuity layer

- **Authority remains small:** `system-architecture.md` continues to define permanent ownership; the reference explains current mechanics.
- **Different audiences get different compression:** Founder guide teaches concepts; agent guide accelerates safe contribution; reference supports detailed tracing.
- **Drift is explicit:** the alignment report uses consistent ratings and records whether differences appear intentional, transitional, accidental, or uncertain.
- **Evidence remains navigable:** every document links to governing documents and names source locations rather than copying implementation line-by-line.
- **Recommendations stay non-authorizing:** health suggestions cannot override Current Focus or roadmap sequencing.

## Maintenance rules

1. Update Program State first when implementation truth materially changes; then reconcile these audit documents.
2. Update System Architecture first when an approved permanent ownership/contract changes.
3. Do not turn the Architecture Reference into a route/component-by-component encyclopedia.
4. Cite stable module paths and authoritative documents; avoid volatile source line numbers inside repository docs.
5. Label observation, inference, uncertainty, status, stability, and confidence where conclusions are not direct contracts.
6. Preserve prior alignment reports in the archive if a future audit replaces the baseline wholesale; ordinary incremental updates can remain in Git history.
7. Do not duplicate strategy, Product Design, validation findings, schema specifications, or API schemas into this set; link their authoritative homes.
8. Do not describe conceptual Shared Continuity responsibilities as implemented packages.
9. Run documentation checks for links, identity language, stale authority references, and whitespace on every change.

## Recommended entry points

- Add the architecture set to `docs/README.md` as an ordered collection.
- Keep `AGENTS.md` reading order unchanged; the Agent Orientation should be read after the active authority stack.
- Link the Guide and Reference from `system-architecture.md` only if Architecture approves changing that permanent authority document. This audit does not need to modify the authority to exist.

## Review cadence

- **Event-driven:** after a material architecture, state-ownership, persistence, public-interface, or validation change.
- **Boundary closeout:** when a roadmap boundary changes implementation truth relevant to the ratings.
- **Periodic:** before major roadmap planning or cross-application extraction review.
- **Not required:** for minor copy, styling, or internal refactors that leave all documented contracts true.

## Completion assessment

The set is reusable because a reader can move from subsystem inventory → conceptual guide → safe agent rules → comprehensive reference → alignment gaps → health recommendations without loading archives or reverse engineering every source file. It remains safe because every document explicitly defers to the active authority stack and distinguishes implemented Clinical Continuity/OT behavior from conceptual or future platform direction.
