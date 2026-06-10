# Activity Constraint Reconciliation Architecture

> Status note: see `docs/project-status/project-state-of-the-union.md` for current project status. The targeted runtime reconciliation described here has since received an initial implementation; this document remains the architectural rationale and boundary definition.

## Status

Proposed design for targeted implementation.

This document defines the smallest deterministic extension needed to distinguish a barrier that **still exists** from a barrier that **still constrains a specific target activity**. It does not authorize a database migration, API contract change, new recommendation engine, autonomous treatment recommendation, predictive recovery model, or AI-owned clinical interpretation.

---

## Executive Recommendation

Implement **Activity Constraint Reconciliation** as a relation-level capability inside the existing **Continuity Reconciliation** step.

The unit being reconciled should be:

```text
Barrier × Target Activity
```

not:

```text
Barrier alone
```

The reconciler should answer one narrow question:

> Does the currently existing barrier still materially constrain performance of the current target activity?

It should produce a small internal activity-relevance projection before progression readiness, clinical attention, and operational prioritization are refreshed. Existing systems remain authoritative for phase, readiness, attention, treatment focus, and Next Action.

The recommended activity-relevance states are:

1. **Constraining** — current evidence shows that the barrier materially limits safety, assistance, consistency, completion, or participation in the target activity.
2. **Monitor Only** — the barrier remains clinically present or could recur, but current evidence does not support continued blocking weight for the target activity; durability or consistency still warrants observation.
3. **Not Currently Constraining** — current evidence shows that the barrier no longer meaningfully limits the target activity.

These are states of the **barrier–activity relationship**, not new barrier lifecycle states. A barrier may remain active elsewhere while being not currently constraining for the target activity.

The architecture should follow this rule:

```text
Barrier existence
+ target activity
+ current activity-performance evidence
→ activity relevance
→ eligible inputs for existing prioritization
```

The highest-value, lowest-risk first slice is to reconcile the current dominant barrier against the primary target activity during every Progression Check using existing evidence: current dominant barrier selection, functional changes, milestone achievement, progression status, current assistance/supervision evidence where available, caregiver/environment changes, safety/regression signals, and readiness. The result should only filter or reduce the barrier's target-activity influence; it should not generate a replacement priority.

---

## Problem Definition

Current continuity logic can determine whether a prior barrier remains present, is resolved, or should remain under monitoring. That is necessary but not sufficient for trustworthy operational prioritization.

A clinical condition can remain true while its relevance to a particular occupation changes.

Example:

```text
Pain still exists.
Pain no longer materially limits toilet transfer performance.
Pain may still limit prolonged standing or community mobility.
```

If the platform uses barrier existence as a proxy for activity constraint, it can continue to center Current Focus and Next Action on pain even after toilet-transfer performance has progressed to supervision, setup is independent, milestones are achieved, and environmental supports are complete.

This produces recommendation staleness because the current operational priority is being derived from a historically valid but no longer activity-dominant relationship.

The missing capability is therefore not another barrier lifecycle. It is a deterministic reconciliation of **current relational relevance**.

---

## 1. Conceptual Model

### Barrier Existence

**Barrier Existence** answers:

> Is the clinical, functional, caregiver, environmental, or medical condition still present?

Examples:

- pain remains reported;
- reduced endurance remains present;
- caregiver availability remains limited;
- a cognitive sequencing deficit remains observable;
- a bathroom hazard remains uncorrected.

Barrier Existence is condition-centered. It is not specific enough to determine treatment priority by itself.

### Barrier Activity Relevance

**Barrier Activity Relevance** answers:

> Does this barrier currently and materially constrain performance of this target activity?

Activity relevance is relational and time-sensitive. It depends on:

- the barrier;
- the target activity;
- the current level and quality of activity performance;
- the assistance, supervision, cueing, safety, setup, and consistency required;
- environmental and caregiver conditions;
- recent functional direction;
- achieved milestones; and
- current regression or safety evidence.

### The architectural distinction

```text
Barrier Existence = condition truth
Barrier Activity Relevance = current relationship between that condition and an activity outcome
```

The two may diverge.

| Clinical condition | Barrier exists? | Target activity | Currently constraining? | Why |
|---|---:|---|---:|---|
| Pain remains 4/10 with prolonged standing | Yes | Toilet transfer | No | Transfer is completed at supervision level with independent setup and no current safety deterioration |
| Pain remains 4/10 with prolonged standing | Yes | Community mobility | Yes | Standing and walking tolerance continue to limit distance and participation |
| Mild sequencing deficit remains | Yes | Dressing using established visual routine | Monitor only | Task is completed consistently with setup; carryover durability still warrants observation |
| Mild sequencing deficit remains | Yes | Novel medication-management routine | Yes | Errors and cueing needs continue in the target task |
| Caregiver availability remains limited | Yes | Toilet transfer | No | Patient performs the transfer safely without physical caregiver assistance |
| Caregiver availability remains limited | Yes | Shower routine | Yes | Shower access still requires caregiver setup and safety supervision |
| Bathroom hazard was corrected | No, for that environment | Toilet transfer | No | Grab bar installation and safe setup removed the environmental constraint |

### Important clinical rules

1. **Presence does not imply dominance.** A condition may remain clinically important without deserving primary treatment authority for the target activity.
2. **Relevance is activity-specific.** The same barrier may be constraining for one activity and non-constraining for another.
3. **Relevance is current-state specific.** A barrier that constrained an activity at Visit 1 may no longer constrain it at Visit 5.
4. **Improvement does not automatically mean non-constraining.** Better performance can coexist with a meaningful residual constraint.
5. **A symptom is not a functional conclusion.** Pain persistence alone does not establish that pain still limits a given activity.
6. **Historical truth remains true.** A prior snapshot may correctly state that pain limited toilet transfers at that time even when the live state no longer gives pain blocking authority for that activity.

---

## 2. Activity Constraint Reconciliation Architecture

### Architectural position

Activity Constraint Reconciliation should be implemented as a focused substep within Continuity Reconciliation, after the latest event and mutable current state are available and before downstream builders consume active barriers.

```text
Progression Check Input
→ Normalize current progression evidence
→ Create candidate longitudinal event
→ Update mutable Current Longitudinal State
→ Reconcile barrier existence and lifecycle
→ Reconcile Barrier × Target Activity relevance
→ Build effective current activity-constraint context
→ Build Progression State
→ Build Progression Readiness
→ Build Clinical Attention
→ Refresh Operational Prioritization
→ Build Continuity Interpretation
→ Build Current Focus / Attention Required / Next Action / Clinical Impact
→ Persist live state and immutable event snapshots
```

Activity Constraint Reconciliation must occur before operational prioritization. Otherwise the prioritizer can continue ranking an existing barrier as dominant based on stale activity linkage.

### Internal conceptual output

The implementation may use an internal projection similar to:

```ts
{
  barrier: string;
  targetActivity: string;
  relevance: "constraining" | "monitor_only" | "not_currently_constraining";
  evidenceKeys: string[];
  transitionReason: string;
  blockingWeightEligible: boolean;
}
```

This is a conceptual shape, not an approved API or persistence contract.

Phase 1 should compute this projection in memory and use it to construct the effective inputs passed to existing downstream builders.

### Non-goals

Activity Constraint Reconciliation does not:

- determine whether the barrier medically exists;
- diagnose the source of impairment;
- select the progression phase;
- classify readiness;
- generate a new treatment priority;
- recommend an intervention;
- predict recovery;
- infer an unrecorded target activity;
- rewrite historical events or snapshots; or
- use AI prose as clinical authority.

---

## 3. Ownership Model

### Recommended ownership

Activity Constraint Reconciliation should belong to **Continuity Reconciliation**, implemented as a lightweight relation-level extension rather than a new independent architecture layer.

The ownership question is temporal:

> Does a previously supported barrier–activity relationship remain relevant now?

That is a continuity reconciliation responsibility.

The result then constrains, but does not replace, progression, readiness, clinical attention, or operational prioritization.

### Why it should not belong exclusively to progression state

Progression state owns the patient's current phase, active milestones, active barriers, regression risks, and readiness-related evidence. It can supply functional evidence, but it should not own the historical-to-current relevance transition for each barrier–activity relationship.

Putting the transition inside progression state would mix:

- current progression description; and
- temporal reconciliation of a prior conclusion.

It would also make it easier for the state builder to recreate stale activity linkage from baseline data after reconciliation had removed it.

### Why it should not belong exclusively to operational prioritization

Operational prioritization should rank the constraints that are currently eligible to influence treatment focus. It should not decide whether historical barrier linkage remains clinically valid.

If prioritization owns both validity and ranking, the system cannot clearly distinguish:

```text
This barrier still constrains the activity
```

from:

```text
This barrier is valid but no longer the highest-ranked constraint
```

That distinction is essential for auditability and clinician trust.

### Why it should not belong to readiness

Readiness consumes current constraints and milestones to determine whether advancement should be evaluated. It should not determine whether a barrier–activity relationship remains valid. Otherwise readiness would become a hidden barrier-lifecycle engine.

### Why it should not become a new independent layer

A standalone Activity Relevance engine would duplicate existing authority and increase architecture surface area. The required behavior is a narrow extension of an already approved continuity relevance gate.

The correct pattern is:

```text
Continuity Reconciliation owns current relevance.
Operational Prioritization owns current rank and treatment emphasis.
```

### Exact boundaries

| System | Owns | Does not own |
|---|---|---|
| **Barrier lifecycle reconciliation** | Whether a barrier remains present as a current limiting condition, is resolved, or is replaced | Activity-specific blocking authority across every target activity |
| **Activity Constraint Reconciliation** | Whether an existing barrier currently constrains a specified target activity; relation-state transition; blocking eligibility; deterministic evidence trace | Barrier diagnosis, barrier invention, phase selection, readiness classification, priority ranking, treatment recommendation |
| **Progression state** | Current phase, active milestones, current progression barriers, regression risks, caregiver/environment state | Historical relevance transition; treatment ranking |
| **Progression readiness** | Readiness classification from reconciled current evidence | Barrier–activity lifecycle, autonomous advancement, treatment focus |
| **Clinical attention** | What requires attention now, including active safety concerns and monitor-only observations | Barrier relevance mutation, treatment prioritization |
| **Operational prioritization** | Rank eligible current constraints; determine current operational emphasis and adjacent priorities | Decide whether old barrier–activity linkage remains valid |
| **Continuity interpretation** | Explain meaningful current change, reassessment pressure, and continuity condition from reconciled outputs | Perform activity reconciliation or generate recommendations |
| **AI synthesis** | Compress and communicate deterministic results | Determine barrier existence, activity relevance, readiness, rank, or treatment action |

---

## 4. Deterministic Inputs

### Input principles

Activity relevance should be determined from current structured evidence whenever possible. Free-text matching may support backward compatibility, but it should not become the target authority model.

The reconciler should evaluate evidence in the following precedence order:

1. explicit clinician identification of the current dominant barrier and target activity;
2. explicit current activity-performance evidence;
3. current safety, regression, or assistance-change evidence;
4. current milestone achievement tied to the activity;
5. current environmental and caregiver evidence tied to the activity;
6. current readiness and progression status as supporting context;
7. prior live barrier–activity relevance;
8. baseline and historical snapshots for context only.

Historical evidence must not override newer current evidence.

### Deterministic inputs table

| Input | Existing source or likely existing source | Relevance use | Relative authority | Guardrail |
|---|---|---|---|---|
| **Target activity** | Primary goal / target activity in structured case data; current functional domain; explicit activity in Progression Check evidence | Establishes the activity side of the relation | Required | Do not infer a different activity from generic barrier text when no stable activity identity exists |
| **Current dominant barrier** | Progression Check required field / current longitudinal state | Strong direct evidence that the clinician considers the barrier currently limiting | High | Apply to the identified target/activity context; do not globalize to all activities |
| **Secondary barrier** | Progression Check optional field / current longitudinal state | Supports adjacent or residual constraint relevance | Medium–high | Secondary does not equal non-constraining; it means lower operational rank |
| **Functional changes** | Progression Check current functional changes | Shows improvement, decline, consistency, completion, or continued limitation in the activity | High when activity-linked | Generic improvement without activity linkage should not clear a relation |
| **Assistance level change** | Structured case function, activity-specific update where available, or normalized current evidence | Direct indicator of dependency reduction or increase | High | Use direction and current level; a one-level improvement does not automatically remove the constraint |
| **Supervision transition** | Activity performance evidence / assistance descriptors | Indicates movement from physical assistance toward monitoring-level support | High | Supervision may still represent a safety constraint; evaluate why supervision remains required |
| **Setup independence** | Milestone or functional evidence | Strong evidence that setup-related barriers no longer constrain the activity | High for setup/environment/caregiver barriers | Does not prove independence in task execution or safety |
| **Cueing change** | Functional change, caregiver update, or activity evidence | Indicates cognitive/sequencing constraint direction | High when task-linked | Reduced cueing can support monitor-only before non-constraining when carryover durability is uncertain |
| **Activity completion** | Functional change or milestone | Indicates whether the occupation can be completed at the current expected level | High | Completion with unsafe technique or unsustainable effort remains constraining |
| **Safety and consistency** | Falls, near falls, loss of balance, unsafe performance, repeated successful performance | Determines whether improvement is reliable enough to reduce blocking authority | Highest override | Current regression or safety evidence prevents transition to non-constraining |
| **Milestone achievement** | `milestoneAchieved` / active milestone lifecycle | Confirms clinically meaningful activity progression | High when explicitly linked | Milestone alone should not clear unrelated barriers |
| **Progression status** | Current Progression Check | Supports the direction and expectedness of change | Supporting | “Progressing faster than expected” is not sufficient without activity-specific evidence |
| **Advancement readiness** | Existing readiness builder | Supports whether residual constraints remain blocking | Supporting | Readiness consumes reconciled state in the target flow; avoid circular use. In Phase 1, only use pre-existing/non-circular readiness signals or evaluate relevance before final readiness refresh |
| **Caregiver support change** | `caregiverChange`, caregiver dependency state | Determines whether caregiver dependence still constrains activity execution or setup | High when activity-linked | Caregiver availability may remain a barrier for other activities |
| **Environmental change** | `environmentalChange`, environmental limitation state | Determines whether equipment, access, or hazard constraints remain | High when activity-linked | Modification completion does not prove safe performance; combine with functional evidence |
| **Medical or symptom change** | `medicalChange`, pain increase/decrease, fatigue change | Indicates persistence or worsening of the condition | Medium for activity relevance; high for medical attention | Symptom persistence alone must not preserve activity-blocking authority |
| **Regression risks** | Reconciled risks and current safety signals | Prevents premature de-escalation; may support monitor-only | High | Monitoring risk should not automatically carry full blocking weight |
| **Reassessment triggers** | Reconciled current triggers | Indicates need for updated review | High for attention, indirect for relevance | A reassessment trigger does not by itself prove that the barrier still constrains this activity |
| **Treatment direction changed** | Progression Check explicit clinician input | Forces prioritization review | High refresh signal | It does not identify the replacement priority by itself |
| **Reason treatment changed** | Progression Check explanation | Can explicitly identify resolved activity linkage or a new limiting domain | High when structured/normalized | Do not rely on unconstrained narrative as sole authority in the target model |
| **Recent repeated confirmation** | Immutable longitudinal events | Supports durability and transition from monitor-only to not currently constraining | Medium–high | Use recent comparable activity evidence; do not average across unrelated activities |
| **Baseline barrier/activity relationship** | Original case state and historical snapshot | Establishes prior relationship and audit context | Context only | Baseline must never override current performance evidence |

### Evidence patterns

#### Evidence that supports **Constraining**

- the clinician explicitly identifies the barrier as the current dominant limitation for the target activity;
- assistance, cueing, supervision, or setup burden increases because of the barrier;
- the activity cannot be completed, is unsafe, or is inconsistent because of the barrier;
- a current fall, near fall, regression, or deterioration is linked to the activity;
- the environmental or caregiver requirement remains necessary for basic activity completion;
- the barrier prevents advancement to the next defined milestone.

#### Evidence that supports **Monitor Only**

- the activity has improved and the barrier no longer appears to be the primary limiter, but consistency is not yet established;
- the activity is at supervision level and supervision is precautionary rather than compensating for an active performance failure;
- a milestone has been achieved, but only one recent confirmation exists;
- the environmental correction is complete and current performance is improved, but carryover has not been confirmed across visits;
- the barrier remains present and could recur under higher demand, though it no longer blocks the current target activity at its present demand level.

#### Evidence that supports **Not Currently Constraining**

- the target activity reaches the defined milestone or expected current level;
- setup is independent and the prior setup-related barrier is no longer needed to explain performance;
- current activity performance is safe and consistent at the new assistance/supervision level;
- the environmental or caregiver constraint tied to the activity has been corrected;
- current evidence identifies a different barrier as limiting the target activity;
- the clinician explicitly confirms that the barrier remains present but no longer limits the target activity.

#### Evidence that blocks de-escalation

- new or current safety event;
- regression or increased assistance;
- persistent unsafe or inconsistent activity performance;
- contradictory current evidence;
- no stable target activity identity;
- improvement evidence that is generic and cannot be linked to the activity;
- unresolved requirement for physical assistance caused by the barrier.

---

## 5. Constraint State Model

### Recommended minimum lifecycle

The smallest useful model is:

```text
Constraining
↕
Monitor Only
→ Not Currently Constraining
```

Reactivation is permitted:

```text
Not Currently Constraining
→ Monitor Only or Constraining
```

when new current evidence supports recurrence.

### State definitions

| State | Definition | Blocking weight | Clinician-facing implication |
|---|---|---:|---|
| **Constraining** | Current deterministic evidence shows the barrier materially limits the target activity's safety, completion, consistency, assistance, cueing, setup, or participation | Full eligibility | May influence Current Focus, Attention Required, readiness, and Next Action through existing builders |
| **Monitor Only** | The barrier remains present or recurrence remains plausible, but current evidence does not justify treating it as the target activity's primary blocking constraint | Non-blocking by default; observation only | May appear as supporting monitoring context when clinically useful; should not keep Current Focus centered on the barrier |
| **Not Currently Constraining** | Current deterministic evidence shows the barrier no longer meaningfully limits the target activity | None for this activity | Excluded from target-activity prioritization; may remain relevant to other activities or medical context |

### Why these states are preferable

- They directly answer the missing clinical question.
- They avoid changing the existing barrier existence lifecycle.
- They distinguish reduced blocking authority from full resolution.
- They support conservative transitions without forcing a persisted universal lifecycle object.
- They prevent “barrier still exists” from becoming “barrier still dominates this activity.”

### Why no separate “unknown” public state

Uncertainty should be handled as a conservative evaluation rule, not as another clinician-facing lifecycle state.

When evidence is insufficient:

- retain the prior barrier–activity relevance for the current cycle;
- avoid de-escalation based on silence;
- record an internal insufficient-evidence reason if a trace exists; and
- request no autonomous conclusion.

This prevents state proliferation while preserving safety.

### Relation to existing barrier lifecycle

| Barrier existence/lifecycle | Activity relevance | Valid interpretation |
|---|---|---|
| Active | Constraining | Barrier exists and currently limits this activity |
| Active | Monitor Only | Barrier exists but has reduced/non-blocking relevance to this activity |
| Active | Not Currently Constraining | Barrier exists but does not currently limit this activity; it may constrain another activity |
| Resolved/replaced | Not Currently Constraining | The prior barrier no longer has current activity influence |
| Resolved/replaced | Constraining | Invalid combination; existence reconciliation must be resolved before relation evaluation |

### Transition rules

| Transition | Minimum deterministic support |
|---|---|
| Constraining → Monitor Only | Activity-linked improvement or milestone evidence plus no current regression/safety contradiction; durability or supervision rationale remains uncertain |
| Constraining → Not Currently Constraining | Explicit clinician confirmation, or strong current activity evidence showing milestone/expected level achieved and no current contradictory safety or assistance evidence |
| Monitor Only → Not Currently Constraining | Repeated or sustained confirmation, or explicit current confirmation that the barrier no longer limits the activity |
| Monitor Only → Constraining | Recurrence, inconsistency, safety concern, increased assistance/cueing, or explicit current barrier selection for the activity |
| Not Currently Constraining → Constraining | New current evidence that the barrier again materially limits the activity |
| Any → unchanged | Evidence is absent, generic, unrelated, or contradictory |

---

## 6. Recommendation Impact Without a Second Reasoning Engine

Activity relevance should change only which barriers are eligible to influence existing deterministic outputs.

The valid architecture is:

```text
Barrier–activity relevance reconciled
→ effective current constraint set updated
→ existing progression/readiness/attention/prioritization builders recompute
→ existing Command Center projections communicate the result
```

The invalid architecture is:

```text
Barrier becomes non-constraining
→ Activity Constraint Reconciler recommends a new treatment plan
```

### Current Focus

- **Constraining:** barrier remains eligible for dominant or adjacent operational ranking.
- **Monitor Only:** barrier should not remain Current Focus solely because it still exists; it may appear as secondary monitoring context.
- **Not Currently Constraining:** barrier is excluded from target-activity focus derivation.

Operational prioritization remains responsible for selecting the current emphasis from the remaining eligible constraints, active milestones, and current functional needs.

### Attention Required

- Surface the barrier when current safety, regression, medical, or consistency evidence requires attention.
- Do not escalate a persistent symptom merely because it exists if it no longer affects the target activity.
- A Monitor Only relation may appear when durability, recurrence, or supervision rationale deserves observation.
- A Not Currently Constraining relation should not appear as target-activity attention unless a separate medical or cross-activity concern independently warrants attention.

### Next Action

- Next Action should consume refreshed readiness, attention, and operational emphasis after activity reconciliation.
- Removing blocking weight may allow existing logic to shift from barrier containment toward progression evaluation, higher-demand activity, generalization, or another current constraint.
- The reconciler must not author those actions.
- Monitor-only content may appear as a supporting action, not automatically as the primary action.

### Clinical Impact

Clinical Impact should communicate the operational consequence of the change in clinician-facing language, for example:

> Pain remains present, but improved transfer performance and independent setup mean it no longer drives toilet-transfer treatment focus.

or:

> Transfer safety improved to supervision level; pain should remain monitored while current focus shifts to the next active limitation.

Clinical Impact should not expose internal state labels such as `not_currently_constraining`.

### Visit History meaning

Visit History must preserve what was true at each visit.

- Visit 1 can state that pain limited toilet transfers.
- Visit 3 can state that pain remained relevant while transfer assistance improved.
- Visit 5 can state that pain remained present but no longer drove toilet-transfer performance.

Prior snapshots must not be rewritten. The value of history is the visible change in relationship over time, not retroactive normalization of old conclusions.

### Readiness

- Constraining relations may reduce or block readiness where current readiness rules assign that effect.
- Monitor Only relations should not automatically preserve low readiness.
- Not Currently Constraining relations should have no blocking effect for that activity.
- Readiness remains a separate classification and may still be limited by another barrier, regression risk, or unmet milestone.

---

## 7. Clinical Example Walkthrough

### Scenario assumptions

- Primary target activity: toilet transfer.
- Barrier condition: pain.
- Pain remains clinically present across all three visits.
- No new fall, regression, or unsafe transfer event occurs.

### Visit 1

**Evidence**

- Pain is identified as the current dominant barrier.
- Toilet transfers require physical assistance.
- Pain limits movement and transfer execution.
- No transfer milestone has been achieved.

| Element | Visit 1 state |
|---|---|
| Barrier existence | **Active/present** — pain remains clinically present |
| Activity relevance | **Constraining** — pain materially limits toilet-transfer execution and assistance level |
| Current Focus | Improve safe toilet-transfer performance while addressing the pain-related movement limitation |
| Attention Required | Transfer safety and physical assistance needs |
| Next Action | Continue the existing deterministic transfer-focused action based on current assistance, safety, and pain constraint |

**Interpretation**

Barrier existence and activity relevance align. Pain appropriately carries blocking weight for toilet transfers.

### Visit 3

**Evidence**

- Pain remains present.
- Transfers are improving.
- Physical assistance has reduced, but consistency is not fully established.
- No regression or safety event is present.
- The transfer milestone is emerging but not yet durably achieved.

| Element | Visit 3 state |
|---|---|
| Barrier existence | **Active/present** |
| Activity relevance | **Monitor Only** if current evidence shows pain is no longer the primary performance limiter but durability remains uncertain; otherwise **Constraining** if pain still causes required assistance or unsafe/inconsistent execution |
| Current Focus | The current operational emphasis should reflect the remaining active transfer constraint, not pain by default. If no stronger constraint is identified, transfer consistency may remain the focus |
| Attention Required | Confirm whether improved transfer performance is sustained and whether pain still changes assistance, safety, or completion |
| Next Action | Use existing logic to continue transfer progression/consistency work while monitoring pain's effect; pain monitoring should be supporting, not automatically primary |

**Interpretation**

Visit 3 is the transition point. Improvement alone does not clear relevance. The determining question is whether pain still changes toilet-transfer performance. If it does, the relation remains Constraining. If it does not but durability is uncertain, the relation becomes Monitor Only.

### Visit 5

**Evidence**

- Pain remains present.
- Toilet transfers are at supervision level.
- Transfer setup is independent.
- Relevant milestones have been achieved.
- Bathroom modifications are complete.
- Progression is faster than expected.
- No current safety or regression evidence contradicts the improvement.

| Element | Visit 5 state |
|---|---|
| Barrier existence | **Active/present** — pain is not falsely resolved |
| Activity relevance | **Not Currently Constraining** for toilet transfers |
| Current Focus | Re-rank from the remaining eligible current constraints or next milestone. Pain should not remain the toilet-transfer focus solely because it persists |
| Attention Required | No pain-centered toilet-transfer escalation. Pain may remain supporting medical or cross-activity context if it limits endurance, community mobility, prolonged standing, or higher-level activity |
| Next Action | Existing logic should evaluate progression/generalization or the next active constraint; pain monitoring may remain secondary when clinically warranted |

**Interpretation**

Pain remains true as a condition but loses blocking authority for toilet transfers. This is not barrier resolution. It is activity-specific relevance reconciliation.

### Longitudinal summary

| Visit | Barrier state | Toilet-transfer relevance | Primary operational meaning |
|---|---|---|---|
| Visit 1 | Pain present | Constraining | Pain appropriately shapes toilet-transfer focus |
| Visit 3 | Pain present | Constraining or Monitor Only, based on whether pain still changes assistance/safety | Reconcile the relationship; do not de-escalate from generic improvement alone |
| Visit 5 | Pain present | Not Currently Constraining | Remove pain's blocking weight for toilet transfers and refresh existing prioritization |

---

## 8. Deterministic Reconciliation Rules

### Core decision sequence

For each eligible `Barrier × Target Activity` pair:

1. **Confirm barrier existence.** If the barrier is resolved or replaced, activity relevance becomes Not Currently Constraining.
2. **Resolve target activity identity.** Use the current explicit target or stable structured case target. If no safe identity exists, retain prior relevance.
3. **Check current safety/regression overrides.** Current unsafe performance, increased assistance, decline, or recurrence preserves or restores Constraining.
4. **Check explicit clinician authority.** A current explicit dominant-barrier selection linked to the activity preserves Constraining unless the input is internally invalid and requires correction.
5. **Evaluate activity-performance change.** Compare assistance, supervision, cueing, setup, completion, safety, and consistency evidence.
6. **Evaluate milestone and context changes.** Use activity-linked milestones, caregiver changes, and environmental changes.
7. **Assign the smallest supported relation transition.** Prefer Monitor Only when improvement is meaningful but durability or causality is not fully established.
8. **Build effective constraint inputs.** Only Constraining relations receive blocking eligibility for that target activity.
9. **Signal downstream refresh.** Material relation changes require readiness, attention, prioritization, continuity interpretation, Current Focus, Next Action, and Clinical Impact refresh as applicable.

### Conservative fallback

Absence of a barrier mention does not establish that the barrier no longer constrains the activity.

Generic phrases such as “doing better” or “pain still present” are insufficient by themselves. De-escalation requires current activity-linked evidence.

### Conflict handling

When evidence conflicts:

- current safety or regression evidence wins over positive progression status;
- explicit current clinician barrier selection wins over historical barrier state;
- activity-specific evidence wins over generic symptom evidence;
- current performance evidence wins over baseline relationship;
- stronger transitions require stronger evidence;
- unresolved conflict preserves the prior relation for the current cycle and should not silently remove blocking authority.

### Cross-activity rule

A relation transition applies only to the evaluated activity.

```text
Pain × Toilet Transfer = Not Currently Constraining
Pain × Community Mobility = Constraining
```

Phase 1 should avoid pretending to maintain a complete barrier-by-activity matrix if the current product only has one stable primary target. It should evaluate the current primary target accurately before expanding breadth.

---

## 9. Risk Assessment

| Risk | Severity | Failure mode | Mitigation |
|---|---:|---|---|
| Barrier existence is accidentally treated as resolved | High | Pain or another condition disappears entirely when only one activity relationship improved | Keep existence and activity relevance as separate concepts and outputs |
| Activity relevance becomes a second prioritization engine | High | Reconciler selects a replacement focus or authors treatment actions | Limit output to relevance, evidence trace, blocking eligibility, and refresh signals |
| Generic improvement clears a real constraint | High | Unsafe or assistance-dependent activity is de-escalated prematurely | Require activity-linked performance evidence and apply safety/regression overrides |
| Existing required dominant-barrier input conflicts with derived relevance | High | Clinician selects pain as dominant while system de-escalates it | Treat explicit current clinician selection as high authority; identify validation/capture mismatch rather than silently override |
| Free-text matching becomes hidden clinical authority | High | Keyword overlap incorrectly links pain, transfer, or milestone evidence | Use free text only as compatibility support; normalize stable activity and barrier identities over time |
| Readiness circularity | Medium–high | Relevance uses readiness while readiness uses relevance | Reconcile from primary evidence before final readiness build; use readiness only as supporting/non-circular context |
| Monitor Only retains full blocking weight | Medium–high | Recommendation staleness persists under a new label | Define Monitor Only as non-blocking by default and test Current Focus/Next Action behavior |
| Supervision is misread as independence | High | A genuine safety constraint is removed | Evaluate the reason for supervision, current consistency, and safety evidence; supervision is not automatically non-constraining |
| Cross-activity generalization | High | Barrier is removed globally after improvement in one activity | Scope every transition to a stable target activity identity |
| Stale baseline function recreates the relation | Medium–high | Downstream builders reintroduce pain as transfer constraint | Build an effective current activity context and require downstream builders to consume it |
| State proliferation | Medium | Additional lifecycle/status objects increase complexity | Use three internal relation states and no new public/persisted object in Phase 1 |
| Historical snapshots are mutated | High | Visit 1 no longer reflects the original clinical truth | Reconcile live state only; preserve immutable event and generation snapshots |
| No replacement constraint exists | Medium | Current Focus becomes empty after pain loses relevance | Let existing prioritization choose from remaining evidence; use existing neutral/follow-up behavior rather than inventing a priority |
| One-visit improvement is over-trusted | Medium | Relation moves directly to non-constraining before durability is known | Use Monitor Only as the conservative intermediate when confirmation is incomplete |
| Implementation silently changes API semantics | Medium | External callers receive unexpected new fields or behavior | Keep Phase 1 projection internal and contract-compatible; separately approve additive structured capture if needed |

---

## 10. Minimal Implementation Roadmap

The phases are ordered by highest clinical value and lowest architectural risk.

### Phase 1 — Current dominant barrier × primary target activity reconciliation

**Objective**

Prevent a persistent barrier from continuing to dominate Current Focus and Next Action after current evidence shows that it no longer constrains the primary target activity.

**Scope**

1. Evaluate only the current/previous dominant barrier against the stable primary target activity.
2. Compute the three relation states in memory during every Progression Check.
3. Use existing evidence:
   - current dominant and secondary barrier;
   - target activity already present in case data;
   - functional changes;
   - milestone achieved;
   - progression status;
   - assistance/supervision/setup/cueing evidence where already available;
   - caregiver and environmental changes;
   - safety/regression signals;
   - treatment-direction change.
4. Remove blocking eligibility when the relation is Monitor Only or Not Currently Constraining.
5. Trigger refresh of readiness, clinical attention, operational prioritization, continuity interpretation, Current Focus, Next Action, and Clinical Impact when the relation materially changes.
6. Preserve active barrier existence and all historical snapshots.
7. Add deterministic tests for the pain/toilet-transfer scenario and contradictory safety cases.

**Persistence/API impact**

- No database migration.
- No public API shape change.
- No historical rewrite.
- Internal projection only.

**Clinical value**

High. It directly addresses stale recommendations in the primary workflow.

**Architectural risk**

Low–moderate. The main risk is imperfect activity linkage in existing evidence.

### Phase 2 — Stable normalized activity evidence and adjacent relevance

**Objective**

Improve determinism and reduce dependence on narrative matching while extending relevance to secondary/adjacent barriers.

**Scope**

1. Introduce an internal normalization adapter for existing target activity, assistance, supervision, setup, cueing, safety, and milestone evidence.
2. Reconcile dominant and secondary/adjacent barriers against the primary target activity.
3. Add recent-event consistency rules for Monitor Only → Not Currently Constraining.
4. Ensure dominant-barrier re-ranking uses only activity-eligible constraining relations.
5. Add Clinical Impact and Visit History projections that communicate changed activity relevance without exposing internal lifecycle terms.
6. Add cross-activity safeguards so a relation change does not retire the barrier globally.

**Persistence/API impact**

Prefer no change. If existing structured fields cannot provide stable activity identity or current performance level, document the exact capture gap before proposing an additive contract change.

**Clinical value**

High. It improves reliability and reduces false relation transitions.

**Architectural risk**

Moderate. Identity normalization and backward-compatible evidence mapping require careful tests.

### Phase 3 — Structured multi-activity relevance only if validated as necessary

**Objective**

Support a barrier that constrains different activities differently when the workflow has sufficient structured evidence to justify multi-activity modeling.

**Scope**

1. Consider minimal additive structured capture for activity-specific performance change only if Phase 1–2 evidence proves insufficient.
2. Support multiple current target activities without creating a full predictive barrier matrix.
3. Persist a compact relation trace only if audit, restore, or cross-request reconstruction cannot be achieved from existing live state and immutable events.
4. Add recurrence/reactivation and restore tests across activities.
5. Confirm that UI presentation remains clinician-facing and does not expose architecture terminology.

**Persistence/API impact**

Potentially additive and therefore subject to explicit approval. Database and API changes are not pre-authorized by this document.

**Clinical value**

Selective. Valuable only after real workflow evidence demonstrates that primary-target reconciliation is insufficient.

**Architectural risk**

Moderate–high. Multi-activity identity and persistence can expand scope rapidly.

---

## 11. Recommended First Implementation Slice

Implement one deterministic reconciliation rule set for:

```text
Current dominant barrier × primary target activity
```

on every Progression Check.

The first slice should support the following behavior:

```text
Pain remains present
+ toilet transfer reaches supervision
+ setup becomes independent
+ activity-linked milestone is achieved
+ environment is corrected
+ progression is positive
+ no current safety/regression contradiction
→ Pain × Toilet Transfer = Not Currently Constraining
→ pain remains clinically present
→ pain loses blocking eligibility for toilet-transfer prioritization
→ existing operational prioritization refreshes
→ existing Current Focus and Next Action refresh
```

Use **Monitor Only** instead when the improvement is recent, the reason for supervision remains uncertain, or consistency has not been confirmed.

### First-slice acceptance criteria

1. A barrier may remain present without remaining eligible as the primary constraint on the target activity.
2. A relation cannot de-escalate from generic improvement or symptom persistence alone.
3. Current safety, regression, or increased-assistance evidence preserves Constraining.
4. Monitor Only does not carry the same blocking weight as Constraining.
5. A non-constraining relation does not remove the barrier from other activity contexts.
6. Existing operational prioritization—not the reconciler—determines the resulting Current Focus.
7. Existing Next Action logic—not the reconciler—determines the resulting action.
8. Visit 1 and Visit 3 historical snapshots remain unchanged after Visit 5 reconciliation.
9. No database schema or API contract change is required.
10. The pain/toilet-transfer scenario is covered by deterministic tests, including a contradictory unsafe-supervision case.

---

## Final Architectural Decision

Activity Constraint Reconciliation should be treated as a **relation-level extension of Continuity Reconciliation**.

It reconciles:

```text
Does this existing barrier still constrain this target activity now?
```

It does not reconcile:

```text
What treatment should be recommended next?
```

The authority chain remains:

```text
Current structured evidence
→ barrier lifecycle reconciliation
→ barrier–activity relevance reconciliation
→ effective current constraint set
→ existing progression and readiness
→ existing clinical attention and operational prioritization
→ existing Current Focus, Next Action, and Clinical Impact projections
```

This is the smallest architectural change that addresses recommendation staleness while preserving deterministic authority, current continuity architecture, progression and readiness ownership, historical snapshots, and existing contracts.
