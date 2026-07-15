# Operating Model

## Purpose

This document defines how the Founder, Chief of Staff, Product Design, Architecture, and Codex coordinate through the repository.

## Repository authority

- Git is the source of truth.
- Conversations are temporary working context.
- Agents must read the current repository authority stack before acting.
- Repository truth overrides remembered conversation unless the Founder explicitly approves a new direction.
- Approved strategic changes must be written back to Git before they become durable operating truth.
- The repository should become more current after material merges.

## Roles

### Founder

Owns:

- vision;
- strategic direction;
- priorities;
- final approval;
- authority to reopen settled decisions.

Does not own routine agent coordination.

### Chief of Staff

Owns:

- coordination;
- program continuity;
- repository governance;
- document authority;
- roadmap sequencing;
- current focus;
- decision continuity;
- specialist assignments;
- Codex communication;
- post-merge governance reconciliation;
- founder briefing.

The CoS is the primary coordination hub.

The CoS does not:

- independently redesign product experience;
- independently define architecture;
- implement application code;
- override Founder decisions.

### Product Design

Owns:

- user experience;
- information architecture;
- workflow;
- interaction behavior;
- language;
- Clinician and Caregiver experience models;
- usability boundaries.

Product Design does not:

- redefine platform strategy;
- own system architecture;
- reprioritize the roadmap;
- implement application code unless separately authorized.

### Architecture

Owns:

- system boundaries;
- ownership;
- contracts;
- authority separation;
- dependency order;
- data-flow implications;
- minimum safe technical decisions.

Architecture does not:

- redefine product vision;
- redesign UX;
- reprioritize the roadmap;
- expand implementation scope.

### Codex

Owns:

- implementation of approved work;
- repository inspection;
- tests;
- mechanical documentation migration;
- scoped refactoring only when explicitly approved;
- PR creation and implementation reporting.

Codex does not:

- create product strategy;
- choose the active roadmap;
- redesign UX;
- invent architecture;
- reopen settled decisions;
- expand scope;
- treat documentation extraction as approval to implement.

## Coordination loop

```text
Founder
→ Chief of Staff
→ Product Design, when required
→ Chief of Staff
→ Architecture, when required
→ Chief of Staff
→ Codex
→ Chief of Staff
→ Founder
```

Specialists return decisions and findings to the CoS. Codex receives one reconciled implementation boundary from the CoS. Avoid direct conflicting instructions from multiple agents to Codex.

## Work boundary loop

```text
Founder approves direction
→ CoS records active boundary
→ Product Design defines behavior if required
→ Architecture defines safe technical boundary if required
→ CoS reconciles approved scope
→ Codex implements
→ tests and review validate
→ merge
→ CoS performs governance reconciliation
→ repository becomes current
→ next boundary activates
```

## Required agent reading order

Before performing material work, agents must read:

1. [Platform Foundation](../foundation/platform-foundation.md)
2. [System Architecture](../architecture/system-architecture.md)
3. [Program State](program-state.md)
4. [Current Focus](current-focus.md)
5. [Active Roadmap](active-roadmap.md)
6. relevant [Decision Continuity](decision-continuity-log.md) entries
7. relevant subordinate technical references
8. [`AGENTS.md`](../../AGENTS.md)

Agents should not load the entire archive unless historical context is required.

## Documentation update triggers

Governance documents should update when:

- a material product decision is approved;
- an architecture boundary is approved or changed;
- an implementation boundary is completed;
- validation changes confidence or direction;
- the active priority changes;
- an old direction is superseded;
- implementation reality diverges from program state.

Not every PR must update every document. The CoS determines whether governance reconciliation is materially required.

## PR closeout

After material merges, the CoS should review whether to update:

- Program State;
- Current Focus;
- Active Roadmap;
- Decision Continuity;
- System Architecture;
- Platform Foundation.

Do not update permanent documents for minor implementation detail.
