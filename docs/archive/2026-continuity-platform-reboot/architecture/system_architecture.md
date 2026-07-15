# OT Clinical Reasoning Assistant — System Architecture

---

# System Purpose
The system transforms structured evaluation, follow-up, and environmental inputs into operationally useful Occupational Therapy clinical reasoning outputs for adult home health environments.

The platform prioritizes:
- clinician workflow support
- cognitive compression
- prioritization clarity
- environmental realism
- caregiver feasibility
- continuity-safe reassessment
- progression-sensitive operational emphasis

---

# Core Architectural Philosophy
The platform separates:

## 1. Deterministic Clinical Reasoning
from

## 2. AI-Assisted Workflow Synthesis

Deterministic systems are authoritative.

AI is constrained to:
- synthesis
- organization
- explanation
- workflow communication
- narrative compression

The system is transitioning away from a multi-pathway recommendation architecture and toward a continuity-aware operational prioritization architecture.

---

# Primary System Layers

## Layer 1 — Structured Input Layer
The system collects structured evaluation and operational case data including:
- demographic information
- diagnosis
- ADL assistance levels
- transfer assistance levels
- mobility status
- caregiver information
- environmental assessment
- safety concerns
- functional barriers
- follow-up status
- reassessment-relevant changes

Primary goal:
Create structured, clinically relevant reasoning inputs.

---

## Layer 2 — Deterministic Reasoning Engine
The deterministic layer governs:
- severity interpretation
- prioritization weighting
- barrier analysis
- environmental interpretation
- transfer risk interpretation
- caregiver feasibility logic
- safety logic
- progression state interpretation
- operational emphasis derivation
- adjacent priority identification
- reassessment trigger detection

This layer serves as the authoritative reasoning structure.

---

## Layer 3 — Operational Prioritization Layer
This layer replaces the prior pathway-centered architecture as the primary treatment direction model.

It derives:
- current progression state
- current operational emphasis
- dominant operational barriers
- adjacent or emerging operational priorities
- caregiver dependency state
- environmental limitation state
- reassessment triggers
- continuity summary

Primary purpose:
Clarify what should dominate intervention attention right now.

This layer should not imply:
- competing treatment philosophies
- mutually exclusive treatment plans
- clinician selection among separate AI-generated pathways

---

## Layer 4 — AI Synthesis Layer
AI converts deterministic reasoning outputs into:
- clinician-readable operational summaries
- concise treatment framing
- caregiver-facing guidance
- structured plan details
- first-session or next-visit priorities
- continuity-aware summaries

AI should not:
- generate unsupported reasoning
- override deterministic outputs
- invent clinical conclusions
- independently select operational emphasis
- create predictive progression narratives

---

## Layer 5 — Workflow Presentation Layer
Outputs are organized into:
- case identity header
- live operational state controls
- current progression state
- current operational emphasis
- priority barriers and risks
- structured intervention details
- caregiver guidance
- reassessment triggers
- historical continuity snapshots

Primary UX goals:
- rapid orientation
- scanability
- progressive disclosure
- reduced cognitive load
- continuity clarity

---

# Current Input Architecture

## Core Domains

### Functional Status
- ADL assist levels
- transfer performance
- mobility limitations
- endurance
- fall history

---

### Environmental Assessment
- entrance accessibility
- bathroom setup
- transfer surfaces
- bedroom setup
- mobility pathways

---

### Caregiver Assessment
- caregiver availability
- physical capacity
- training level
- confidence
- caregiver priorities

---

### Clinical Prioritization
- safety concerns
- transfer barriers
- environmental hazards
- functional limitations
- treatment feasibility

---

### Continuity and Follow-Up Status
- stale-state flags
- reassessment triggers
- follow-up changes
- functional carryover status
- caregiver status changes
- environmental modification updates

---

# Operational Prioritization Architecture

## Current Progression State
Represents the client’s current operational continuity condition.

It answers:
What functional progression condition is the case currently operating within?

Examples:
- stabilization
- foundational participation
- supported functional execution
- reduced dependency
- environmental optimization
- maintenance readiness

---

## Current Operational Emphasis
Represents the dominant intervention prioritization right now.

It answers:
What should treatment attention emphasize first, given the live case state?

Examples:
- safety stabilization
- caregiver-supported task setup
- transfer control and sequencing
- environmental access correction
- supported ADL participation
- carryover and reduced dependency

---

## Adjacent Operational Priorities
Represents nearby, emerging, or secondary emphasis areas that may become more important as conditions change.

They answer:
What operational priorities are close enough to monitor or prepare for, but should not override the current emphasis?

Examples:
- caregiver training readiness
- equipment setup refinement
- environmental modification follow-through
- reduced cueing progression
- endurance-supported participation

Adjacent priorities are not alternative treatment plans.

They are secondary operational considerations within the same continuity framework.

---

# Authority Hierarchy

## 1. Live Operational Case State
The active case is authoritative.

It owns:
- current structured data
- current generated output
- current progression state
- current operational emphasis
- stale-state flags
- editable live case updates

---

## 2. Deterministic Reasoning Engine
The deterministic engine is authoritative for deriving:
- severity weighting
- progression state
- operational emphasis
- environmental limitation state
- caregiver dependency state
- active barriers
- regression risks
- reassessment triggers
- adjacent priorities

---

## 3. AI Synthesis Layer
AI is authoritative only for wording and cognitive compression.

It is not authoritative for prioritization logic.

---

## 4. Historical Generations
Historical generations are immutable snapshots.

They preserve prior reasoning states for review or restoration.

They are not automatically updated when the live case changes.

---

# Selected Pathway Deprecation Direction

## Current Status
`selectedPathwayIndex` may remain temporarily for backward compatibility if existing UI and stored outputs depend on it.

## Target Direction
The system should migrate toward explicit operational emphasis fields such as:

```ts
operational_prioritization: {
  currentProgressionState: string;
  currentOperationalEmphasis: string;
  emphasisRationale: string[];
  dominantBarriers: string[];
  adjacentOperationalPriorities: string[];
  reassessmentTriggers: string[];
  continuitySummary: string;
}
```

## Migration Rule
Do not abruptly remove `selectedPathwayIndex` until:
- current stored cases can render safely
- historical generations remain readable
- copy/export workflows no longer depend on pathway index semantics
- caregiver guidance no longer assumes a selected pathway anchor

## Final State
The primary authority should become:

```txt
currentOperationalEmphasis
```

not:

```txt
selectedPathwayIndex
```

---

# Relationship Between Progression State and Operational Emphasis

Progression state describes the current continuity condition.

Operational emphasis describes the dominant intervention priority within that condition.

They are related but not identical.

Example:
- Progression state: foundational participation
- Operational emphasis: caregiver-supported task setup

This means the client can participate in parts of the task, but the immediate treatment emphasis is making that participation safe, structured, and feasible.

The system should avoid forcing a one-to-one relationship between phase labels and emphasis labels.

---

# Replacement for Alternative Treatment Approaches

Replace “Alternative Treatment Approaches” with:

## Adjacent Operational Priorities

These should represent:
- nearby emphasis areas
- secondary operational concerns
- emerging readiness areas
- barriers to monitor
- next emphasis candidates if the current condition changes

They should not be framed as:
- competing treatment plans
- optional philosophies
- clinician-selected pathways
- separate AI-generated care directions

---

# Caregiver Logic Model
Caregiver information modifies:
- feasibility interpretation
- carryover expectations
- supervision requirements
- implementation realism
- safety planning
- operational emphasis weighting
- reassessment trigger visibility

Caregiver information should influence workflow practicality without overriding core safety and functional priorities.

---

# Operational Constraints
The platform intentionally avoids:
- unrestricted generative AI
- autonomous treatment planning
- speculative recommendations
- predictive recovery modeling
- excessive narrative output
- non-explainable prioritization
- timeline-heavy longitudinal UX

---

# Current Product Priorities
1. reasoning consistency
2. workflow clarity
3. cognitive compression
4. operational usability
5. environmental realism
6. caregiver feasibility integration
7. continuity-safe reassessment
8. operational emphasis clarity

---

# Future Architectural Direction
Future layers may include:
- structured reassessment workflows
- continuity-aware follow-up updates
- operational emphasis history
- progression criteria tracking
- discharge readiness logic

Future expansion must preserve:
- explainability
- clinician trust
- workflow simplicity
- deterministic governance
- cognitive compression
