# Intake Workflow Architecture v2

---

# Purpose

This document defines the next UX direction for the New Case / Intake workflow in the OT Clinical Reasoning Assistant.

The intake workflow is not simply a form. It is the first clinical reasoning interaction between the clinician and the system.

The purpose of this redesign is to:
- reduce cognitive load
- increase clinician confidence
- preserve deterministic reasoning richness
- prevent input anxiety
- reduce perceived documentation burden
- hide backend ontology complexity
- support continuity-aware future reassessment
- improve first-use trust within 30–60 seconds

This document governs intake UX design before implementation.

---

# Core UX Problem

The current intake experience is clinically rich but cognitively heavy.

It currently feels like:
- a long form
- high-consequence data entry
- exposed backend ontology
- many equally weighted fields
- too many decisions too early

The desired experience should feel like:
- guided clinical reasoning
- safe approximation
- operational collaboration
- progressive refinement
- confidence-building workflow support

The clinician should not feel that one imperfect input will invalidate the usefulness of the system.

---

# Core UX Principle

The intake should communicate:

> Start with your best operational picture. You can refine the details later.

This is especially important in home health OT because real-world information is often incomplete, evolving, caregiver-dependent, environment-dependent, and discovered gradually across visits.

The system should support clinical approximation, not punish imperfect precision.

---

# Product Framing Shift

The intake should evolve from:

```txt
Complete a comprehensive intake form.
```

to:

```txt
Help the system understand the patient’s current operational problem.
```

This means the intake should prioritize:
- orientation
- clinical confidence
- operational clarity
- progressive detail
- later refinement

not:
- exhaustive first-pass data capture
- visible ontology completion
- architecture-driven field exposure

---

# Clinician Mental Journey

| Stage | Clinician Question | Desired Feeling |
|---|---|---|
| 1. Clinical Snapshot | Who is this patient and what is breaking down? | I can orient quickly. |
| 2. Operational Context | What makes the task hard or unsafe? | I understand the main problem. |
| 3. Support + Feasibility | Who or what helps make this realistic? | The system understands real-world constraints. |
| 4. Environment Detail | What home setup details matter? | I can add detail without being overwhelmed. |
| 5. Operational Preview | What picture is the system building? | The system understands the case. |

The workflow should avoid exposing all domains at once.

---

# Intake Stage Architecture

## Stage 1 — Clinical Snapshot

### Purpose

Create fast clinician orientation.

The goal is to establish the patient story in under 60 seconds.

### Visible Fields

- Client name
- Age range
- Primary diagnosis
- Target activity
- Assistance needed for primary activity
- Primary goal
- Key barriers
- Recent falls
- Caregiver involved?

### UX Goal

The clinician should feel:

> I gave the system enough to understand the basic case.

### Important Notes

This stage should not include:
- detailed caregiver profiling
- full environmental assessment
- detailed equipment access
- clinical focus selection
- clinical decision inputs
- all home assessment domains

---

## Stage 2 — Operational Context

### Purpose

Clarify what is making function unstable, unsafe, or difficult.

### Visible Fields

- ADL transfer assist levels
  - bed transfer
  - toilet transfer
  - shower transfer
- primary mobility method
- indoor mobility level
- endurance
- expanded key barriers if needed
- safety awareness / cognition / sequencing indicators

### UX Goal

The clinician should feel:

> The system is now understanding what operationally breaks down.

### Recommended Language Changes

Rename:

```txt
Current Assistance Level
```

to:

```txt
Assistance Needed for Primary Activity
```

or:

```txt
Overall Functional Assistance
```

Avoid unclear wording that makes the clinician wonder what the assistance level refers to.

---

## Stage 3 — Support + Feasibility

### Purpose

Capture real-world feasibility without frontloading caregiver burden.

### Visible Fields

Only if caregiver is involved:
- caregiver availability
- caregiver physical capacity
- caregiver confidence
- caregiver training/familiarity
- caregiver priorities

Other feasibility fields:
- equipment access
- financial limitations
- home environment barriers

### UX Goal

The clinician should feel:

> The system understands whether the plan is realistic in the home.

### Recommended Language Changes

Rename:

```txt
Environmental Constraint
```

to:

```txt
Home Environment Barriers
```

or:

```txt
Home Setup Complexity
```

Avoid abstract system language like:
- constraint
- weighting
- operational domain
- prioritization driver

---

## Stage 4 — Environmental Detail

### Purpose

Preserve environmental richness without overwhelming the clinician.

### UX Pattern

Use progressive disclosure.

Start with high-level complexity questions, then expand detail only when needed.

### Recommended First-Level Environmental Sections

- Bathroom setup
- Entry / outside access
- Bedroom / bed setup
- Transfer surfaces
- General mobility

Each section should be collapsed by default unless strongly relevant to the target activity.

### Example Pattern

Start with:

```txt
Bathroom setup complexity
- Simple
- Moderate
- Complex / safety concerns present
- Not yet assessed
```

Then conditionally expand:
- bathroom type
- space constraints
- toilet setup
- transfer surface
- grab bars
- handheld shower
- bath seating
- safety concerns
- equipment present

### UX Goal

The clinician should feel:

> I can add detail when it matters, but I am not forced to complete everything immediately.

---

## Stage 5 — Operational Preview

### Purpose

Build trust by showing the clinician what the system understands so far.

The preview should not feel like debug output or raw data echo.

It should feel like:

> Here is the operational picture being built.

### Preview Should Show

- primary activity
- assistance level
- key barriers
- major safety concerns
- caregiver support summary
- environmental complexity summary
- likely operational emphasis preview

### Preview Should Avoid

- backend field names
- raw ontology labels
- excessive data lists
- deterministic architecture language
- debugging-style summaries

---

# Confidence-Oriented UX Principles

## 1. Approximation Is Acceptable

The intake should communicate that precise certainty is not required.

Use phrases like:
- Best current estimate
- Not yet assessed
- Can refine later
- Add detail if known

Avoid implying:
- every field must be perfect
- incomplete data invalidates the output
- unknowns are failures

---

## 2. Refinement Can Happen Later

The intake should support the reality that home health cases evolve.

The system should make it clear:
- intake creates an initial operational picture
- later visits can refine environmental detail
- reassessment can update continuity state
- imperfect initial data is acceptable

---

## 3. Hide Backend Ontology

Clinicians should not see terms that reveal system architecture.

Avoid clinician-facing labels like:
- clinical decision inputs
- operational weighting
- prioritization driver
- deterministic reasoning
- continuity mutation
- ontology
- execution pressure point

Use clinician-natural language:
- safety concerns
- transfer difficulty
- home setup
- caregiver support
- barriers
- mobility concerns
- what makes this hard?

---

## 4. Distinguish Required vs Refinement Fields

The UI should visually separate:

### Core Intake Signals

Needed for useful initial reasoning.

### Refinement Signals

Improve specificity but are not required immediately.

This reduces anxiety and improves speed.

---

# Ontology Shielding Rules

The backend may maintain:
- clinical focus
- operational domains
- deterministic weighting
- progression logic
- continuity mutation logic
- environmental prioritization

But the intake UI should not expose these as clinician-facing concepts.

---

# Field-Level Recommendations

## Clinical Focus

Current problem:
- overlaps with target activity
- exposes internal prioritization language
- forces clinicians to choose a system lens

Recommendation:
- hide from clinician intake
- infer internally from target activity, barriers, caregiver involvement, and environment
- preserve backend field structurally for compatibility

---

## Clinical Decision Inputs Section

Current problem:
- exposes system architecture
- interrupts clinician flow
- reduces trust

Recommendation:
- remove from visible intake UI
- keep backend derivation unchanged

---

## Assistance Level

Current problem:
- ambiguous reference point

Recommendation:
Rename to:
- Assistance Needed for Primary Activity

Preserve the existing 1–7 scale.

Do not alter scale semantics.

---

## Unknown Values

Current problem:
- frequent use of “Unknown” can feel like poor data quality

Recommendation:
Prefer:
- Not Yet Assessed

This better fits longitudinal workflows and reduces user guilt.

Backend mapping can preserve existing values if needed.

---

# Input Conflict Resolution Rules

Clinicians should not have to manually reconcile ontology conflicts.

The UI should prevent or resolve conflicts where possible.

## Example Conflict

If:

```txt
Grab bars = Toilet and shower
```

then the system should not allow:

```txt
Safety hazard = No grab bars
```

without clarification.

## Recommended Patterns

- auto-remove conflicting selections
- disable mutually incompatible options
- show gentle clarification messages
- derive safety concern from equipment state where possible
- avoid duplicate questions that ask the same fact in different sections

---

# Known Redundancy Risks

## Bathroom Safety Hazards vs Equipment Present

Potential conflict:
- Safety hazard: No grab bars
- Equipment present: Grab bars

Recommendation:
Treat grab bar status as the authoritative structured field.

Then derive:
- equipment present
- safety hazard concern

rather than forcing the clinician to enter the same fact twice.

---

## Clinical Focus vs Target Activity

Potential conflict:
- Target activity: Bathing
- Clinical focus: Caregiver Training

Recommendation:
Target activity should remain clinician-facing.

Clinical focus should be inferred or hidden.

---

# Progressive Disclosure Rules

The form should not show all complexity simultaneously.

## Always Visible

- clinical snapshot
- core functional status
- primary activity
- primary goal
- key barriers
- recent falls
- caregiver involved?

## Conditional / Expandable

- caregiver details
- environmental details
- equipment details
- entrance details
- bedroom details
- transfer surface details
- feasibility details

## Advanced / Later Refinement

- highly granular environmental details
- secondary mobility methods
- detailed caregiver priorities
- detailed equipment access
- optional environmental hazards

---

# Intake vs Reassessment Boundary

Not all information must be captured during initial intake.

Some information may be better collected during:
- reassessment
- follow-up
- case editing
- environmental refinement
- detail module generation

Initial intake should prioritize:
- useful first plan generation
- clinician orientation
- operational snapshot

Later workflows can refine:
- environmental detail
- caregiver feasibility
- equipment specifics
- continuity changes
- reassessment triggers

---

# Operational Preview Philosophy

The preview should build confidence.

It should answer:

> What does the system currently understand?

It should help the clinician catch:
- missing primary goal
- mismatched target activity
- high-risk safety concerns
- caregiver feasibility issues
- major environmental gaps

It should not feel like:
- debug output
- raw payload preview
- AI prompt input
- backend data object

---

# Implementation Guardrails

Do not remove backend fields simply because they are hidden from UI.

Prefer:
- hiding
- deriving
- collapsing
- staging
- defaulting
- inferring

over:
- deleting
- flattening
- weakening payload structure

The reasoning architecture depends on structured richness.

The UX should reduce visible burden without reducing reasoning quality.

---

# Success Criteria

The redesigned intake should allow a clinician to:

- understand what the form is asking within 30 seconds
- complete a useful first-pass intake without feeling overwhelmed
- trust that imperfect information can be refined later
- avoid obvious conflicting inputs
- see an operational preview that builds confidence
- generate a useful case without completing every advanced field

The intake should feel like:

```txt
guided operational reasoning
```

not:

```txt
exhaustive data entry
```
