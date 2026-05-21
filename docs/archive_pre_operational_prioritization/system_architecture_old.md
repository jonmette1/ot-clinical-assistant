# OT Clinical Reasoning Assistant — System Architecture

---

# System Purpose

The system transforms structured evaluation inputs into operationally useful Occupational Therapy clinical reasoning outputs for adult home health environments.

The platform prioritizes:
- clinician workflow support
- cognitive compression
- prioritization clarity
- environmental realism
- caregiver feasibility

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

---

# Primary System Layers

## Layer 1 — Structured Input Layer

The system collects structured evaluation data including:
- demographic information
- diagnosis
- ADL assistance levels
- transfer assistance levels
- mobility status
- caregiver information
- environmental assessment
- safety concerns
- functional barriers

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
- pathway weighting
- safety logic

This layer serves as the authoritative reasoning structure.

---

## Layer 3 — AI Synthesis Layer

AI converts structured reasoning outputs into:
- clinician-readable workflows
- pathway summaries
- treatment framing
- cognitive compression outputs
- workflow-oriented narratives

AI should not:
- generate unsupported reasoning
- override deterministic outputs
- invent clinical conclusions

---

## Layer 4 — Workflow Presentation Layer

Outputs are organized into:
- patient snapshot
- task breakdown
- functional problem areas
- structured pathways
- clinical considerations
- caregiver guidance
- first-session priorities

Primary UX goals:
- rapid orientation
- scanability
- progressive disclosure
- reduced cognitive load

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

# Pathway Architecture

The system generates multiple structured intervention pathways.

Pathways are:
- deterministic-guided
- feasibility-aware
- operationally distinct
- environmentally grounded

The selected pathway becomes:
- the primary workflow recommendation
- the caregiver guidance anchor
- the executive summary direction

---

# Clinical Continuity Architecture

The platform maintains separation between:

- active operational clinical state
- historical continuity snapshots
- rendered historical preview state

The active operational plan is:
- editable
- regeneratable
- operationally authoritative

Historical snapshots are:
- immutable
- read-only
- reviewable
- continuity references
- restoration-capable

Historical snapshots are intentionally presented as:
> saved clinical snapshots

rather than:
> software versions

to preserve:
- operational clarity
- clinician trust
- cognitively lightweight continuity workflows

Continuity workflows prioritize:
- rapid orientation
- historical reasoning comprehension
- continuity-safe restoration
- low-friction longitudinal review

The architecture intentionally avoids:
- engineering-oriented version control metaphors
- complex historical diff systems
- technically dense continuity management workflows
- excessive timeline complexity

---

# Caregiver Logic Model

Caregiver information modifies:
- feasibility interpretation
- carryover expectations
- supervision requirements
- implementation realism
- safety planning

Caregiver information should influence:
- workflow practicality
without overriding:
- core clinical priorities

---

# Operational Constraints

The platform intentionally avoids:
- unrestricted generative AI
- autonomous treatment planning
- speculative recommendations
- excessive narrative output
- non-explainable prioritization

---

# Current Product Priorities

1. reasoning consistency
2. workflow clarity
3. cognitive compression
4. operational usability
5. environmental realism
6. caregiver feasibility integration

---

# Future Architectural Direction

Potential future layers may include:
- longitudinal progression support
- visit-to-visit continuity
- progression criteria tracking
- discharge readiness logic

Future expansion must preserve:
- explainability
- clinician trust
- workflow simplicity
- deterministic governance