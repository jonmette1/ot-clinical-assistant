# Clinical Continuity Platform

This repository contains the **Clinical Continuity Platform** implementation within the broader **Continuity Platform** direction.

The current implemented application is **Clinical Continuity** with an **OT configuration**. The repository includes substantial OT-focused clinical reasoning, continuity, progression, prioritization, visit preparation, and translation workflow support.

**Care Continuity** is a future application concept under validation. It is not implemented in this repository.

## Repository authority

Git is the durable source of truth for this project. Conversations, prompts, consultant exchanges, and handoffs are temporary working context unless approved direction is written back to the repository.

## Active authority stack

Read active authority documents in this order before material work:

1. [Platform Foundation](docs/foundation/platform-foundation.md)
2. [System Architecture](docs/architecture/system-architecture.md)
3. [Program State](docs/governance/program-state.md)
4. [Current Focus](docs/governance/current-focus.md)
5. [Active Roadmap](docs/governance/active-roadmap.md)
6. [Decision Continuity Log](docs/governance/decision-continuity-log.md)
7. [Operating Model](docs/governance/operating-model.md)
8. Relevant subordinate technical references, including [Continuity Reconciliation Architecture](docs/architecture/references/continuity_reconciliation_architecture.md) and [Activity Constraint Reconciliation Architecture](docs/architecture/references/activity_constraint_reconciliation_architecture.md)

Historical documents are preserved in the [2026 Continuity Platform Reboot archive](docs/archive/2026-continuity-platform-reboot/) for reference, not as active authority.

## Application documentation

- [Clinical Continuity](docs/applications/clinical/README.md)
- [Care Continuity](docs/applications/care/README.md)

## Developer setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Run repository checks:

```bash
npm test
npm run lint
npm run build
```

Use the validation command appropriate to the change. Documentation-only work should also validate Markdown links and governance constraints.
