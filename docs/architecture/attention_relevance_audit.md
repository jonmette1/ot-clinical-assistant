# Attention Relevance Audit

## Status

Architecture analysis only.

This audit does not authorize implementation, schema changes, API changes, new recommendation logic, autonomous treatment advancement, predictive recovery, or AI-owned clinical reasoning.

---

## Executive Finding

**Activity Constraint Reconciliation is necessary, but it is not itself the system that answers what deserves clinician attention now.**

The three statements below are clinically and deterministically distinct:

1. **Barrier Exists** — the condition remains clinically present.
2. **Barrier Constrains Activity** — the condition currently and materially limits a specified activity.
3. **Barrier Deserves Attention** — the condition, activity consequence, risk, change, or progression implication warrants clinician attention relative to all other current concerns.

The third concept is real. It is not reducible to activity constraint because:

- a constraining barrier may be stable, adequately managed, and lower priority than a new safety or medical concern;
- a non-constraining barrier may still deserve monitoring because of recurrence, cross-activity impact, medical significance, or supervision uncertainty;
- a milestone or positive progression transition may deserve attention even when no barrier is worsening; and
- clinician attention is comparative and operational, while activity constraint is relational and validity-oriented.

However, **the architecture is not missing a new Attention Relevance layer**. The approved architecture already assigns the relevant responsibilities to two existing deterministic systems:

- **Clinical Attention** owns: “What requires attention today?”
- **Operational Prioritization** owns: “What should treatment attention emphasize first?”

Activity Constraint Reconciliation should improve the eligible current evidence consumed by those systems. It should not become a recommendation engine, and a new Attention Relevance layer should not be inserted between it and Operational Prioritization.

### Decision

**Choose Option A:**

> Implement Activity Constraint Reconciliation. Stop. No additional architecture is required.

This conclusion has one important qualification:

> Activity Constraint Reconciliation eliminates the identified barrier-to-activity staleness pathway only when Clinical Attention, Operational Prioritization, Current Focus, and Next Action are recomputed from the effective reconciled constraint set.

If those downstream systems preserve a prior emphasis, continue to treat monitoring evidence as blocking evidence, or fail to re-rank after a relation changes, recommendation staleness can remain. That would be a failure to execute the existing authority model, not evidence that a new attention architecture is needed.

---

## 1. Architecture Review Table

| System | Question Answered | Remaining Gap |
|---|---|---|
| **Reassessment Trigger Reconciliation** | Does a previously supported reassessment trigger remain active, move to monitoring, or no longer warrant current trigger influence? | Does not determine whether a barrier exists, whether it constrains an activity, what issue is most important, what treatment should emphasize, or what action should occur next. Trigger relevance is escalation/review relevance, not general treatment priority. |
| **Active Barrier Reconciliation** | Does a previously supported barrier remain part of the current limiting-condition set, remain under monitoring, resolve, or become replaced? | Does not determine whether the still-existing barrier materially constrains a particular activity. It also does not rank current concerns or determine treatment emphasis. |
| **Progression Readiness** | Is the patient currently low, partially, or highly ready to progress to a higher functional demand, based on safety, assistance, consistency, caregiver feasibility, environment, participation, and regression risk? | Does not determine which current issue deserves attention first. Readiness is an advancement classification, not a priority ranking, barrier-validity engine, or treatment focus. |
| **Activity Constraint Reconciliation** | Does this currently existing barrier still materially constrain this specified target activity now? Should the relation be Constraining, Monitor Only, or Not Currently Constraining? | Does not compare that relation against medical change, safety risk, caregiver disruption, environmental limitation, milestones, progression transitions, other activities, or other eligible constraints. It does not select attention, rank treatment emphasis, or author an action. |
| **Clinical Attention** | What current issue, change, risk, milestone, or unresolved limitation requires clinician attention today? | Does not mutate barrier existence or barrier–activity validity. It should identify actionable attention, but it does not own final treatment prioritization or treatment recommendation. |
| **Operational Prioritization** | What should treatment attention emphasize first, given the live case state? What eligible concerns are adjacent rather than dominant? | It should not decide whether a historical barrier–activity relationship remains valid. Its quality depends on receiving reconciled current evidence and applying deterministic rank rules without preserving stale inputs. |
| **Current Focus** | What concise clinician-facing treatment focus should represent the current operational emphasis? | It is a projection of authority, not an independent authority. It cannot repair stale constraint eligibility or defective operational ranking and must not create a separate focus-selection logic. |
| **Next Action** | Given current readiness, attention, reassessment pressure, operational emphasis, and reconciled current constraints, what should the clinician evaluate or do next? | It is an action projection. It should not determine barrier truth, activity relevance, attention rank, progression phase, or operational emphasis. If upstream authority is stale, Next Action will faithfully express stale meaning. |

### Boundary summary

The architecture forms a sequence of increasingly operational questions:

```text
Trigger Reconciliation
Does the prior review/escalation condition remain current?

Barrier Reconciliation
Does the prior limiting condition remain current?

Activity Constraint Reconciliation
Does that condition still materially limit this activity?

Clinical Attention
Which current consequence, change, risk, or transition requires awareness now?

Operational Prioritization
Which eligible issue should dominate treatment attention now?

Current Focus / Next Action
How should that authority be presented and acted upon?
```

This is not six competing recommendation engines. The first three are **validity and eligibility gates**. Clinical Attention and Operational Prioritization are the **attention and ranking authorities**. Current Focus and Next Action are **workflow projections**.

---

## 2. OA + Toilet Transfer Scenario Analysis

### Scenario assumptions

- Primary target activity: toilet transfer.
- Persistent condition: osteoarthritis-related pain.
- No new fall, acute medical change, unsafe transfer event, or regression contradicts the improvement.
- Visit 5 evidence includes supervision-level transfer performance, independent setup, achieved milestones, and completed environmental supports.

### Visit 1

```text
Pain exists.
Pain materially limits toilet-transfer execution.
Physical assistance is required.
```

Deterministic interpretation:

- **Barrier existence:** active.
- **Pain × toilet transfer:** Constraining.
- **Attention:** transfer safety, assistance need, and pain-linked performance limitation appropriately deserve attention.
- **Operational priority:** pain-linked transfer performance may appropriately dominate treatment emphasis.
- **Current Focus / Next Action:** transfer execution, safety, setup, and pain-related movement limitation are appropriately primary.

There is no meaningful divergence between condition truth, functional impact, and attention relevance at Visit 1.

### Visit 3

```text
Pain remains.
Transfers are improving.
Physical assistance is reduced.
Consistency or durability is not fully established.
```

Deterministic interpretation depends on the current performance evidence:

- If pain still causes required assistance, unsafe execution, incomplete performance, or inconsistent carryover, **Pain × toilet transfer remains Constraining**.
- If pain remains present but no longer explains the reduced performance and durability is not yet established, **Pain × toilet transfer becomes Monitor Only**.

The correct attention question is no longer simply “Is pain still present?” It becomes:

> Does pain still change transfer safety, assistance, completion, consistency, or participation enough to warrant blocking weight, or is it now observation context?

At this visit, clinicians may reasonably differ if the structured evidence does not capture why supervision or assistance remains necessary. That disagreement is an evidence-resolution problem, not proof that activity constraint and attention relevance are the same concept.

### Visit 5

```text
Pain remains.
Transfers are at supervision level.
Setup is independent.
Milestones are achieved.
Environmental supports are complete.
No current safety or regression contradiction exists.
```

Under Activity Constraint Reconciliation as designed:

- **Barrier existence:** pain remains active/present.
- **Pain × toilet transfer:** Not Currently Constraining.
- **Blocking eligibility:** pain loses blocking weight for toilet-transfer prioritization.
- **Historical truth:** Visit 1 and Visit 3 remain unchanged.
- **Downstream requirement:** Clinical Attention, Operational Prioritization, Current Focus, and Next Action refresh from the effective current constraint set.

### Recommendation problems that disappear

If Activity Constraint Reconciliation is implemented exactly as designed, the following problems should disappear for the reconciled activity:

1. **Persistent symptom equals persistent activity limiter.** Pain can remain medically or clinically true without remaining the transfer constraint.
2. **Pain remains Current Focus solely because it still exists.** A Monitor Only or Not Currently Constraining relation cannot preserve primary blocking weight by persistence alone.
3. **Pain-centered Next Action survives after transfer milestones are achieved.** Existing action logic receives a constraint set in which pain is no longer eligible to drive the toilet-transfer action.
4. **Readiness remains artificially suppressed by an obsolete pain–transfer relationship.** Pain cannot continue to block transfer readiness through a relation that is no longer constraining.
5. **Transfer improvement falsely resolves pain globally.** The relation changes without rewriting the condition or its relevance to other activities.
6. **History is retroactively normalized.** Prior snapshots continue to show pain as a valid earlier transfer limiter.

### Recommendation problems that can remain

Activity Constraint Reconciliation does not eliminate every form of recommendation disagreement or staleness:

1. **Successor-priority ambiguity.** Removing pain from transfer blocking eligibility does not identify which remaining concern should rank first. The next emphasis may be transfer consistency, generalization, a higher-demand activity, another barrier, caregiver carryover, discharge readiness, or no urgent treatment shift.
2. **Competing-domain priority.** A new medical change, fall risk, caregiver disruption, or environmental issue may deserve more attention than the improving transfer even though it is not represented by the pain–transfer relation.
3. **Cross-activity relevance.** Pain may no longer constrain toilet transfers but may still constrain prolonged standing, bathing, community mobility, sleep, or another meaningful occupation.
4. **Supervision interpretation.** “Supervision level” does not by itself establish that the transfer is non-constraining. If supervision compensates for current safety inconsistency, pain-related guarding, cueing need, or recurrence risk, the relation may remain Constraining or Monitor Only.
5. **Evidence conflict.** If the clinician explicitly identifies pain as the current dominant transfer barrier while other structured evidence suggests it is not constraining, the architecture must preserve clinician authority or expose the input conflict rather than silently overrule it.
6. **Attention or ranking execution defect.** If downstream systems retain an old Current Operational Emphasis, use accumulated barriers instead of the effective constraint set, or fail to refresh when relation relevance changes, stale recommendations can persist despite correct activity reconciliation.
7. **Projection defect.** Current Focus or Next Action may continue to display old wording if they are not faithful projections of refreshed deterministic authority.

### Would clinicians still potentially disagree with Current Focus?

**Yes.** Activity Constraint Reconciliation removes an invalid candidate or invalid blocking weight; it does not guarantee universal agreement about the highest-value successor focus.

Clinician disagreement can remain because:

- multiple valid current concerns may compete for first position;
- the target activity represented in structured data may be narrower than the clinician's actual visit objective;
- supervision may have different clinical meaning depending on why it remains necessary;
- patient goals, visit context, caregiver availability, medical changes, and environmental constraints may change comparative priority;
- the deterministic operational ranking may be incomplete or may consume stale inputs; or
- Current Focus may be a stale projection even when the underlying rank changed.

The important architectural distinction is:

> Activity Constraint Reconciliation determines whether pain is still eligible to dominate toilet-transfer reasoning. Operational Prioritization determines what should dominate after that eligibility decision.

Clinician disagreement after correct reconciliation is therefore not automatically evidence of a missing relevance layer. It may be disagreement with the existing prioritization result, insufficient structured evidence, or a projection defect.

---

## 3. Is Attention Relevance Real?

### Explicit answer

**Yes — “What deserves attention now?” is a separate deterministic concept from “Does this barrier constrain this activity?”**

But:

**No — it is not a missing architectural layer.**

It is already represented by the approved Clinical Attention and Operational Prioritization responsibilities.

### Why the concepts are distinct

A useful deterministic model is:

```text
Condition Truth
↓
Functional Relationship
↓
Attention Significance
↓
Operational Rank
↓
Workflow Action
```

More precisely:

| Concept | Unit of evaluation | Deterministic question |
|---|---|---|
| **Condition Truth** | Barrier or condition | Does it exist now? |
| **Functional Relationship** | Barrier × activity | Does it materially constrain this activity now? |
| **Attention Significance** | Current consequence, change, risk, or transition | Does this require clinician awareness or review now? |
| **Operational Rank** | All eligible current concerns | Which issue should dominate treatment attention now? |
| **Workflow Action** | Ranked current state | What should the clinician do or evaluate next? |

Activity constraint cannot fully cover attention significance because the mapping is not one-to-one.

### Constraining but not dominant

A barrier may still constrain an activity while another concern deserves attention first.

Example:

```text
Pain still mildly constrains transfers.
A new fall with increased cueing creates immediate safety concern.
```

Pain is functionally relevant, but it should not automatically dominate clinician attention.

### Not constraining but still attention-worthy

A barrier may no longer block the target activity while still warranting attention.

Example:

```text
Pain no longer limits toilet transfers.
Pain remains relevant to prolonged standing and community mobility.
Durability at the new transfer level is not yet confirmed.
```

The pain–transfer relation may be Monitor Only or Not Currently Constraining, while recurrence, another activity, or medical context still deserves secondary attention.

### No barrier worsening, but attention still required

A milestone or readiness transition can deserve attention because it changes what the clinician should evaluate next.

Example:

```text
Transfer milestone achieved.
Setup independent.
Safety stable.
Readiness now supports progression evaluation.
```

The attention-worthy event is positive progression and a possible change in treatment demand, not a worsening barrier.

### The true unit of value

The true unit of value is not a new stored “attention relevance” status attached to every barrier. It is the system's ability to produce a trustworthy, current answer to:

> What requires clinician attention now, and what should treatment emphasize first?

That answer depends on validated current evidence, comparative priority, and workflow context. It is already the purpose of Clinical Attention and Operational Prioritization.

---

## 4. Operational Prioritization Ownership

### Does existing Operational Prioritization own “What matters now?”

**Yes, with an important division of language:**

- **Clinical Attention** owns what requires awareness, review, or concern today.
- **Operational Prioritization** owns what treatment attention should emphasize first.

Together they own the practical meaning of “What deserves attention now?”

The architecture already defines Current Operational Emphasis as the dominant intervention prioritization and explicitly asks what treatment attention should emphasize first given the live case state. The decision log also establishes operational emphasis as the primary treatment-direction authority.

### Why Activity Constraint Reconciliation should improve inputs

Operational Prioritization can rank only what is eligible and current. It should not be responsible for validating whether a historical barrier–activity relationship remains true because combining validity and rank would collapse two different questions:

```text
Is pain still a valid transfer constraint?
```

and:

```text
Among all valid current concerns, should pain dominate treatment attention?
```

Keeping those questions separate provides:

- clearer auditability;
- safer historical preservation;
- explainable de-escalation;
- prevention of stale baseline relationships being treated as current;
- prevention of ranking logic becoming a hidden lifecycle engine; and
- preservation of Operational Prioritization as the single treatment-emphasis authority.

The correct architecture is:

```text
Current evidence
→ trigger and barrier reconciliation
→ barrier × activity reconciliation
→ effective eligible current evidence
→ Clinical Attention
→ Operational Prioritization
→ Current Focus and Next Action
```

Activity Constraint Reconciliation supplies **eligibility**. Operational Prioritization supplies **comparative rank**.

### What would indicate an Operational Prioritization gap?

A gap exists if Operational Prioritization cannot deterministically compare the already-valid current concerns it receives, or if it preserves prior emphasis despite material current-state change.

Examples include:

- a prior emphasis remains authoritative after its only supporting relation becomes non-constraining;
- Monitor Only evidence receives full blocking weight;
- a new safety, caregiver, medical, or environmental concern is not compared against functional constraints;
- a milestone or readiness transition cannot change emphasis when rules say it should; or
- no deterministic fallback exists when the prior dominant constraint becomes ineligible.

These are gaps in the existing prioritization owner's rules or input consumption. They do not justify inserting another prioritization layer.

---

## 5. Architectural Boundary

### Would introducing an Attention Relevance layer improve the architecture?

**No. A new independent Attention Relevance layer would duplicate existing prioritization responsibilities.**

The phrase “attention relevance” is useful as an analytic distinction. It is not useful as a new authority-bearing engine between Activity Constraint Reconciliation and Operational Prioritization.

### Why a new layer would create duplication

A new layer would need to decide one or more of the following:

- whether a current issue deserves awareness;
- whether it deserves treatment emphasis;
- whether it should outrank another issue;
- whether it should alter Current Focus; or
- whether it should alter Next Action.

Those responsibilities already belong to Clinical Attention, Operational Prioritization, Current Focus projection, and Next Action projection.

If the new layer does not affect any of those outputs, it has no operational value. If it does affect them, it becomes a second attention or prioritization authority.

### Hidden prioritization risk

A relevance score, relevance tier, or deserves-attention flag would become hidden prioritization if it determines which concerns reach Operational Prioritization or assigns differential weight beyond narrow validity/eligibility.

That would make it difficult to tell whether a concern lost priority because:

- the condition resolved;
- the barrier stopped constraining the activity;
- the concern remained valid but was outranked;
- a new attention layer suppressed it; or
- a presentation rule hid it.

### Dual authority risk

Dual authority appears if both Attention Relevance and Operational Prioritization can answer “what matters now.” The systems could disagree:

```text
Attention Relevance: pain deserves attention.
Operational Prioritization: caregiver carryover should dominate.
```

Without a strict boundary, either output could drive Current Focus or Next Action, recreating the authority conflict the architecture has already worked to remove.

### Competing recommendation layer risk

If Attention Relevance recommends a replacement focus when a relation becomes non-constraining, it becomes a recommendation engine. That would violate the constraints against:

- second recommendation engines;
- duplicate prioritization systems;
- autonomous treatment advancement; and
- architecture surface-area expansion.

### Appropriate boundary

The safe boundary remains:

| System | Exact authority |
|---|---|
| **Continuity Reconciliation** | Which prior conclusions remain eligible to influence current reasoning? |
| **Activity Constraint Reconciliation** | Does an existing barrier still materially constrain this specified activity, and therefore retain blocking eligibility for that relation? |
| **Clinical Attention** | Which current issue, change, risk, or transition requires clinician awareness or review? |
| **Operational Prioritization** | Which eligible current issue should dominate treatment attention, and which should remain adjacent? |
| **Current Focus** | How is the dominant operational emphasis expressed concisely? |
| **Next Action** | What action follows from current attention, rank, readiness, and reassessment pressure? |

No additional authority layer is needed between these responsibilities.

---

## 6. Ownership Recommendation

### Primary ownership decision

**Do not create a new Attention Relevance architecture.**

Use the term only as a conceptual audit lens:

> Attention relevance is the combined result of Clinical Attention significance and Operational Prioritization rank after current evidence has passed continuity and activity-constraint validity gates.

It should not become:

- a new persisted object;
- a new lifecycle;
- a new score;
- a new recommendation source;
- a new ranker;
- a new API contract;
- a new status displayed to clinicians; or
- a new authority over Current Focus or Next Action.

### Responsibility allocation

#### Activity Constraint Reconciliation

Owns only:

- the `Barrier × Target Activity` relation;
- current relation state;
- blocking eligibility for that activity;
- conservative transition handling;
- current evidence trace; and
- downstream refresh signaling.

It does not own:

- whether the issue deserves top-level attention;
- comparative concern ranking;
- replacement focus selection;
- intervention selection; or
- action authoring.

#### Clinical Attention

Owns:

- whether a current functional consequence, safety issue, medical change, caregiver issue, environmental issue, milestone, progression change, or uncertainty requires attention now;
- concise, actionable articulation of that issue; and
- whether operational review or reassessment awareness is required.

It does not own:

- barrier or relation mutation;
- final treatment emphasis rank; or
- autonomous intervention selection.

#### Operational Prioritization

Owns:

- comparative ranking across eligible current concerns;
- current operational emphasis;
- dominant versus adjacent priority distinction; and
- continuity-aware shift of treatment attention.

It does not own:

- historical-to-current validity of a barrier or relation;
- historical snapshot mutation; or
- AI-authored clinical conclusions.

#### Current Focus and Next Action

Own only clinician-facing projections of the existing deterministic authorities. They must not become fallback rankers when upstream outputs are incomplete.

---

## 7. Risks

| Risk | Severity | Architectural failure mode | Required boundary |
|---|---:|---|---|
| **Attention Relevance becomes a second prioritization engine** | High | A new layer independently decides what matters and competes with Operational Prioritization | Do not create the layer; preserve Operational Prioritization as the single treatment-emphasis authority |
| **Activity constraint is mistaken for priority** | High | Every constraining relation is treated as equally attention-worthy or dominant | Treat relation state as eligibility, not rank |
| **Barrier persistence is mistaken for attention relevance** | High | Pain remains primary merely because it still exists | Require activity-specific constraint validity before blocking weight |
| **Monitor Only retains blocking weight** | High | Recommendation staleness survives under a new label | Monitor Only may support observation but must not preserve primary blocking authority by default |
| **Clinical Attention becomes a second treatment ranker** | High | Attention statements directly override current operational emphasis | Keep attention significance distinct from final treatment-emphasis rank |
| **Operational Prioritization becomes a hidden lifecycle engine** | High | Ranking rules silently decide that old relations are invalid | Reconcile validity before ranking |
| **No successor focus after de-eligibility** | Medium–High | Current Focus becomes empty, generic, or reuses stale emphasis | Existing Operational Prioritization must support a neutral/current-milestone/next-eligible state without inventing a new engine |
| **Cross-activity overgeneralization** | High | Pain loses all relevance when only toilet-transfer relevance changed | Scope relation changes to the identified activity |
| **Supervision is treated as independence** | High | A real safety or consistency constraint is removed | Interpret the reason for supervision using current safety, assistance, cueing, and consistency evidence |
| **Explicit clinician input conflicts with derived relation** | High | The system silently overrides a clinician-selected dominant barrier | Preserve clinician authority and identify the evidence/capture conflict |
| **Downstream refresh is conditional or incomplete** | High | Correct reconciliation does not change Clinical Attention, Current Focus, or Next Action | Material relation change must invalidate stale downstream projections and trigger recomputation within existing ownership |
| **Current Focus or Next Action develops independent authority** | Medium–High | Presentation logic repairs upstream gaps by creating its own priority | Keep both as projections, not reasoning authorities |
| **Historical snapshots are rewritten** | High | Earlier clinically valid pain–transfer conclusions disappear | Reconcile live state only; preserve immutable snapshots |
| **State proliferation** | Medium | Existence, relation, attention, rank, and display each acquire overlapping public statuses | Keep relation state narrow and attention/rank within existing systems |

---

## 8. Recommended Path

### Selected option

### Option A

**Implement Activity Constraint Reconciliation. Stop. No additional architecture required.**

### Rationale

1. **The identified staleness mechanism is real and specific.** Barrier existence is currently capable of carrying more operational weight than its current activity relationship justifies.
2. **Activity Constraint Reconciliation addresses that mechanism at the correct boundary.** It determines whether the barrier–activity relation remains valid and blocking.
3. **The architecture already contains the attention concept.** Clinical Attention explicitly answers what requires attention today.
4. **The architecture already contains the prioritization authority.** Operational Prioritization explicitly answers what treatment attention should emphasize first.
5. **A new layer would duplicate authority.** Any layer capable of changing Current Focus or Next Action based on “deserves attention” would necessarily perform attention selection, priority ranking, or recommendation.
6. **Remaining staleness should be treated as an execution defect in existing ownership.** If reconciled evidence does not refresh attention, rank, focus, or action, the problem is not conceptual absence; it is failure to consume current authority.
7. **Historical immutability remains intact.** The live relationship changes without rewriting earlier snapshots.
8. **No second recommendation engine is required.** Existing deterministic systems can produce the new emphasis after eligibility changes.

### Architecture acceptance test

The architecture has reached the correct unit of value when it can explain this sequence without adding a new authority:

```text
Pain remains clinically present.
Pain no longer materially constrains toilet transfers.
Pain therefore loses toilet-transfer blocking eligibility.
Clinical Attention determines whether pain still warrants monitoring or cross-activity awareness.
Operational Prioritization determines what now deserves treatment emphasis.
Current Focus and Next Action express that refreshed result.
```

### Stop condition

After Activity Constraint Reconciliation is introduced, do not add Attention Relevance architecture merely because a clinician disagrees with a resulting Current Focus.

First classify the disagreement:

1. **Validity disagreement:** Does pain still constrain the activity?
2. **Evidence disagreement:** Does the structured record accurately explain assistance, supervision, safety, consistency, and target activity?
3. **Ranking disagreement:** Among valid concerns, what should dominate?
4. **Projection disagreement:** Does Current Focus or Next Action accurately express the deterministic result?

Only the first belongs to Activity Constraint Reconciliation. The third belongs to Operational Prioritization. The fourth belongs to workflow projection. None requires a new layer by default.

---

## 9. If Additional Architecture Is Needed

### Finding

**Additional architecture is not recommended.**

Therefore there should be no new Attention Relevance responsibility, input model, output object, or authority boundary.

For clarity, the analytically useful concept can be expressed without becoming a system:

### Exact responsibility

None as an independent layer.

“Attention relevance” should describe whether current deterministic evidence, after reconciliation, warrants Clinical Attention and/or Operational Prioritization consideration. Those decisions remain owned by the existing systems.

### Exact inputs

No new input contract.

Existing owners should consume their already-authorized inputs, including:

- reconciled reassessment triggers;
- reconciled active barriers;
- barrier–activity relation state and blocking eligibility;
- current functional performance;
- safety and regression evidence;
- milestone achievement;
- progression status and readiness;
- caregiver context;
- environmental context;
- medical change;
- current target activity; and
- explicit clinician confirmation where required.

### Exact outputs

No new output contract.

Existing outputs remain:

- Clinical Attention statement and review/reassessment significance;
- Current Operational Emphasis;
- adjacent operational priorities;
- Current Focus;
- Next Action; and
- clinician-facing Clinical Impact/continuity explanation where applicable.

### Exact ownership boundary

```text
Activity Constraint Reconciliation
= relation validity and blocking eligibility

Clinical Attention
= current attention significance

Operational Prioritization
= comparative treatment-emphasis rank

Current Focus / Next Action
= clinician-facing workflow projections
```

If future evidence demonstrates that Operational Prioritization cannot rank valid current concerns, the proper response would be to clarify the rules of the existing Operational Prioritization authority—not to insert a competing Attention Relevance system.

---

## Final Architectural Position

The audit confirms that the product's true unit of value is:

> What deserves clinician attention right now?

But that unit of value does not imply a new architecture layer.

The correct deterministic chain is:

```text
What is true?
→ What remains current?
→ What constrains this activity?
→ What requires attention?
→ What should treatment emphasize first?
→ What should the clinician do next?
```

Activity Constraint Reconciliation closes the missing validity gap between barrier existence and current activity impact.

Clinical Attention and Operational Prioritization already convert valid current impact into attention and treatment emphasis.

Therefore:

> **Attention relevance is a real clinical distinction, but not a missing architectural authority. Implement Activity Constraint Reconciliation, require existing downstream authorities to consume its result, and do not create a second prioritization layer.**

---

## Sources Reviewed

- [Project Snapshot](../PROJECT_SNAPSHOT.md)
- [Consultant Handoff](../CONSULTANT_HANDOFF.md)
- [Project Status and Direction](../PROJECT_STATUS_AND_DIRECTION.md)
- [North Star](../foundation/north_star.md)
- [Active Roadmap](../foundation/active_roadmap.md)
- [Decision Log](../foundation/decision_log.md)
- [System Architecture](system_architecture.md)
- [Longitudinal Progression Architecture](longitudinal_progression_architecture.md)
- [Continuity Reconciliation Architecture](continuity_reconciliation_architecture.md)
- [Activity Constraint Reconciliation Architecture](activity_constraint_reconciliation_architecture.md)
- [Clinical Attention Model](../clinical_model/Clinical_Attention_Model.md)
- [Clinical Progression Model](../clinical_model/Clinical_Progression_Model.md)
- [Progression Check Data Model](../clinical_model/Progression_Check_Data_Model.md)
- [Progression Display Principles](../UX/progression_display_principles.md)
