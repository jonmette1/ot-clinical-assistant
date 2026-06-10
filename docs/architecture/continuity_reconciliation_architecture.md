# Continuity Reconciliation Architecture

> Status note: see `docs/project-status/project-state-of-the-union.md` for current project status. The targeted runtime reconciliation described here has since received an initial implementation; this document remains the architectural rationale and boundary definition.

## Status

Proposed architecture for implementation.

This document defines the smallest safe framework for maintaining the **current relevance** of longitudinal clinical conclusions. It does not authorize a database migration, API contract change, historical snapshot rewrite, new recommendation engine, or AI-owned clinical reasoning.

---

## Executive Recommendation

Introduce one deterministic **Continuity Reconciliation** step inside the existing canonical continuity pipeline.

Continuity Reconciliation should:

1. consume the prior live conclusions, the latest mutable current state, and the new progression event;
2. determine whether each prior lifecycle-bearing conclusion remains current, should remain under monitoring, has been resolved, or has been replaced by a newer conclusion;
3. expose an **effective current conclusion set** to the existing progression, readiness, clinical-attention, operational-prioritization, and continuity-interpretation builders; and
4. produce a compact reconciliation trace that explains removals and transitions without becoming a new clinical recommendation source.

Continuity Reconciliation should not decide what treatment to recommend. It should decide which already-supported conclusions are still eligible to influence current reasoning.

The architectural distinction is:

> Existing deterministic systems determine clinical meaning and priority. Continuity Reconciliation determines whether prior conclusions remain relevant to the current event context.

The smallest safe initial implementation should be a pure deterministic projection over existing data. It should not require database migration. Existing arrays and scalar fields remain the public/live output contract; reconciliation filters or replaces their current values before downstream derivation. Historical events and snapshots preserve what was true at the time they were created.

### Recommended first implementation target

Start with **reassessment trigger and active barrier reconciliation on every Progression Check**, followed immediately by recalculation of advancement readiness.

This target has the highest clinical trust value because stale triggers and barriers can keep a patient in reassessment or stabilization logic after improvement, while stale readiness can suppress an appropriate progression review. It can be implemented deterministically from existing progression-check evidence and current state, does not require autonomous advancement, and does not require a schema migration.

---

## Problem Definition

The current architecture can generate, persist, and display conclusions, but persistence alone does not establish present relevance.

A conclusion may be historically valid and currently inapplicable at the same time.

Examples include:

- a fall-related reassessment trigger after repeated safe transfer performance;
- a bathroom barrier after the environmental hazard has been corrected;
- a caregiver mismatch after training and reliable carryover improve;
- an active milestone after the milestone has been achieved;
- advancement readiness that remains low after the limiting conditions have changed.

The required capability is not recommendation regeneration. It is a deterministic relevance transition:

```text
Prior supported conclusion
+ current longitudinal evidence
+ explicit progression event
→ current relevance disposition
```

This disposition then constrains the existing reasoning pipeline.

---

## Design Principles

### 1. Reconciliation is a relevance gate, not a reasoning engine

Reconciliation may retain, monitor, resolve, or replace a conclusion only when deterministic evidence supports that transition. It may not invent a new barrier, milestone, risk, trigger, priority, treatment direction, or clinical recommendation.

New conclusions continue to originate from their current authoritative builders and structured progression inputs.

### 2. Reconcile live authority; never rewrite historical truth

Only the live current-state projection changes. Historical generations, prior longitudinal events, and their embedded snapshots remain immutable.

### 3. Absence of evidence is not evidence of resolution

A prior conclusion must not disappear merely because a Progression Check did not mention it. Resolution requires one of:

- explicit structured evidence that the condition is corrected or achieved;
- deterministic current-state evidence that contradicts the prior condition;
- a newer authoritative conclusion that replaces it; or
- clinician confirmation already represented in the existing workflow input.

Otherwise the conclusion remains active or moves to monitoring, depending on the collection-specific rule.

### 4. Use collection-specific transitions

Not every collection has the same semantics. A milestone is achieved, a barrier is resolved, a dominant barrier is replaced, and an adjacent priority may be promoted. A universal four-state lifecycle would add false complexity.

### 5. Evaluate on every progression update; mutate only when warranted

Every Progression Check should run deterministic reconciliation and scalar refresh evaluation. That does not mean every value changes. Stable conclusions should pass through unchanged.

### 6. Preserve current contracts

The existing live collections continue to represent currently influential conclusions. Resolved, achieved, demoted, or replaced items should not remain in those active arrays merely for historical visibility; their history already belongs in immutable events and snapshots.

### 7. Reconciliation results are explainable

Every transition should have:

- prior conclusion;
- resulting disposition;
- deterministic evidence key or source;
- source event identifier/date; and
- optional replacement conclusion when superseded.

This trace is an internal continuity artifact, not a new clinician-facing status system.

---

## Continuity Reconciliation Architecture

### Architectural position

The target flow is:

```text
Progression Check Input
→ Validate and normalize progression evidence
→ Create candidate longitudinal event
→ Update mutable Current Longitudinal State
→ Reconcile prior live conclusions against current evidence
→ Build effective current clinical context
→ Build Progression State
→ Build Progression Readiness
→ Build Clinical Attention State
→ Refresh Operational Prioritization when reconciliation or event meaning requires it
→ Build Continuity Interpretation
→ Build Clinical Impact / Next Action inputs
→ Persist current live state and immutable longitudinal event snapshots
→ Render Command Center
```

This differs from placing reconciliation after operational prioritization. Reconciliation must occur before downstream systems consume stale collections. Otherwise stale triggers and barriers can influence progression, prioritization, and continuity interpretation before being removed.

### Inputs

Continuity Reconciliation should consume only existing authoritative evidence:

- prior live `progression_state`;
- prior live `operational_prioritization`;
- current structured case state;
- updated `current_longitudinal_state`;
- the new normalized progression event;
- deterministic clinical decision outputs;
- stale-state flags; and
- when needed, recent immutable longitudinal events for persistence/consistency confirmation.

It should not consume AI prose as evidence unless that prose is only a label for a deterministic field with a stable identifier. Free-text matching may be used as a backward-compatibility fallback, but it should not be the target authority model.

### Outputs

The reconciler should return an internal result such as:

```ts
{
  effectiveConclusions: {
    reassessmentTriggers: string[];
    regressionRisks: string[];
    activeBarriers: string[];
    dominantBarriers: string[];
    activeMilestones: string[];
    adjacentOperationalPriorities: ExistingPriorityShape[];
  };
  dispositions: ReconciliationDisposition[];
  refreshSignals: {
    progressionStateChanged: boolean;
    readinessRefreshRequired: boolean;
    operationalPrioritizationRefreshRequired: boolean;
    continuityInterpretationRefreshRequired: boolean;
    clinicalImpactRequired: boolean;
  };
}
```

The exact implementation type is not prescribed here. The architectural requirements are:

- current active arrays remain contract-compatible;
- downstream builders consume `effectiveConclusions`, not unreconciled historical carry-forward;
- dispositions explain why a current item was retained, monitored, resolved, achieved, demoted, promoted, or replaced; and
- the reconciler does not generate treatment content.

### Persistence approach

#### Phase 1 default: no new persistence

Compute reconciliation during the Progression Check transaction and use its output to refresh existing live fields. Preserve transition evidence in the immutable longitudinal event snapshots already created by the workflow where existing payload capacity permits.

Do not add a database column merely to begin reconciliation.

#### Later persistence only if operationally necessary

A dedicated persisted reconciliation trace should be considered only if audit, restore, or cross-request reconstruction proves impossible from:

- current live state;
- immutable longitudinal events;
- historical generated snapshots; and
- deterministic recomputation.

That decision would require separate approval because it changes persistence structure.

---

## Exact Ownership Boundaries

| System | Owns | Does not own |
|---|---|---|
| **Continuity Reconciliation** | Present relevance of prior conclusions; deterministic retain/monitor/resolve/achieve/demote/promote/replace dispositions; effective current conclusion collections; downstream refresh signals | New clinical conclusion generation; phase selection; readiness classification; treatment prioritization; continuity condition classification; clinician-facing prose |
| **`buildProgressionState`** | Current phase; active progression barriers and milestones derived from effective current evidence; regression risks; caregiver/environment scalar interpretation where currently assigned | Historical relevance decisions; preserving stale array members; deciding whether an old trigger remains valid solely because it once existed |
| **Progression readiness** | Current readiness classification from reconciled progression state and the latest event evidence; eligibility for evaluation of advancement | Autonomous advancement; lifecycle tracking; resolving barriers; treatment-direction decisions |
| **Operational prioritization** | Current operational emphasis; rationale; dominant barrier ranking; adjacent-priority ranking; treatment-focus implications | Historical validity; retaining old barriers merely for continuity; deciding whether evidence has resolved an old conclusion |
| **Continuity interpretation** | Current continuity condition, reassessment pressure, instability drivers, operational change classification, drift signals, and continuity alerts derived from reconciled state | Lifecycle mutation; barrier resolution; recommendation creation; overriding progression or prioritization authority |
| **Clinical attention** | What requires clinician attention now, using the latest event and reconciled state | Historical storage; recommendation generation; lifecycle status persistence |
| **Longitudinal event system** | Immutable record of what changed and the resulting snapshots at that event | Current-state authority; later mutation of prior events |
| **AI synthesis** | Compression, wording, readability, and generated-output communication within deterministic constraints | Reconciliation, lifecycle classification, readiness, prioritization authority, or autonomous progression |

### Boundary rule

If the question is **“Is this prior conclusion still allowed to influence current reasoning?”**, Continuity Reconciliation owns the answer.

If the question is **“Given the currently valid evidence, what is the phase, readiness, attention, priority, or continuity condition?”**, the existing authoritative subsystem owns the answer.

---

## Evidence and Transition Rules

### Evidence precedence

Use the following order when evidence conflicts:

1. explicit current Progression Check evidence;
2. updated structured current state or reassessment data;
3. deterministic current clinical decision output;
4. prior live current conclusion state;
5. historical snapshots, for context only.

Historical truth cannot override newer current truth.

### Minimum evidence rule

A transition out of active influence requires a deterministic reason:

| Transition | Minimum support |
|---|---|
| Active → monitoring | Improvement or correction evidence exists, but durability/consistency is not yet established |
| Active → resolved/achieved | Explicit correction or achievement, or current structured state no longer meets the deterministic rule that created the item |
| Active → superseded/replaced | A newer authoritative conclusion occupies the same clinical role and the old conclusion no longer represents the dominant/current role |
| Monitoring → active | Recurrence, inconsistency, deterioration, or unresolved evidence |
| Monitoring → resolved | Sustained confirmation or structured current-state correction |
| Any → unchanged | No sufficient contradictory or replacement evidence |

### Conservative fallback

When an old free-text conclusion cannot be mapped safely to a deterministic evidence key, retain it for the current cycle and flag it for deterministic normalization. Do not silently resolve it through approximate language matching.

---

## Lifecycle Model Table

The statuses below are conceptual dispositions. They do not require changing every public object into a status-bearing persisted object.

| Collection | Smallest viable lifecycle | Meaning and rule | Current output behavior |
|---|---|---|---|
| `reassessmentTriggers` | **active → cleared** | A trigger is active while its triggering condition is present or its required review remains outstanding. It is cleared when the condition is explicitly corrected, the required review is completed, or current deterministic evidence no longer satisfies the trigger rule. “Monitoring” is unnecessary because a trigger itself is already a watch/escalation condition. “Superseded” is unnecessary unless one trigger is replaced by a more specific trigger; in that case remove the old trigger and record replacement in the trace. | Only active triggers remain in `reassessmentTriggers`. Cleared/replaced triggers remain in event history, not the active array. |
| `regressionRisks` | **active ↔ monitoring → retired** | Active means current evidence materially raises decline/safety risk. Monitoring means the precipitating condition improved but durability is not established. Retired means current evidence and required confirmation no longer support ongoing influence. Use “retired,” not “resolved,” because risk can recur without making the historical risk incorrect. Supersession is not needed in the public model. | Active risks influence readiness and attention. Monitoring risks may influence observation/Next Action but should not carry the same blocking weight. Retired risks leave the current active array. |
| `activeBarriers` | **active → resolved** with optional **replaced** trace | A barrier remains active while it currently limits progression. It is resolved when explicit or structured evidence shows the limiting condition no longer applies. If a new barrier becomes the current expression of the same constraint, record the old barrier as replaced rather than clinically resolved. “Monitoring” is generally not a barrier state; once it no longer limits progression, any residual concern belongs in regression risk or attention monitoring. | Only current limiting barriers remain in `activeBarriers`. Resolved/replaced barriers are removed before progression and prioritization derivation. |
| `dominantBarriers` | **current → demoted/replaced** | This is a ranking role, not an independent clinical lifecycle. A dominant barrier remains current only while it has the highest operational weight among active barriers. It becomes demoted when still active but no longer dominant, or replaced when no longer active and another barrier becomes dominant. “Resolved” is inherited from the underlying barrier, not owned by this collection. | Re-rank from reconciled active barriers. Do not append historical dominant barriers. Demoted items may appear as adjacent/supporting barriers only if still active. |
| `activeMilestones` | **active → achieved** or **replaced** | A milestone is active while it is the current observable target. It becomes achieved through explicit milestone achievement or deterministic threshold evidence. It is replaced when progression changes make a different milestone the appropriate current target before achievement. “Monitoring” and “resolved” are not appropriate milestone terms. | Achieved/replaced milestones leave `activeMilestones`. Achievement may support readiness and Clinical Impact; replacement is supplied by existing progression derivation, not by reconciliation invention. |
| `adjacentOperationalPriorities` | **adjacent → promoted** or **retired** | This collection represents operational rank, not clinical truth. A priority is promoted when existing prioritization logic makes it the current emphasis. It is retired when its supporting barrier/constraint is resolved or it is no longer relevant. A separate monitoring state adds no value because “adjacent” already means relevant but non-dominant. | Re-rank from reconciled evidence. Promoted priority becomes current emphasis through operational prioritization; retired priorities leave the active adjacent list. |

### Why no universal lifecycle object

A single `active | monitoring | resolved | superseded` model would obscure clinically meaningful differences:

- milestones are achieved, not resolved;
- dominant barriers are demoted or replaced because dominance is a rank;
- adjacent priorities are promoted or retired because adjacency is an operational role;
- reassessment triggers are active or cleared because the trigger is already a monitoring construct.

The internal reconciliation trace may use a common disposition union for implementation convenience, but domain-specific labels should be retained in rules and explanations.

---

## Scalar Refresh Model Table

| Scalar | Evaluation timing | Mutation rule | Rationale |
|---|---|---|---|
| `advancementReadiness` | **Evaluate on every Progression Check** and every reassessment/regeneration from live state | Recalculate after lifecycle reconciliation and progression-state derivation. A change in readiness does not autonomously advance treatment; it changes eligibility/attention for clinician evaluation. | Readiness is highly sensitive to resolved barriers, achieved milestones, active regression risks, safety stability, caregiver feasibility, and environmental support. Waiting for regeneration preserves stale recommendations. |
| `caregiverDependencyState` | **Evaluate on every Progression Check**; obligatorily recompute when caregiver change, assistance level, carryover, training, or reliability evidence changes | Replace the scalar only from deterministic current evidence. If the event contains no caregiver evidence, current structured caregiver state remains authoritative and usually yields the same value. | Dependency is a current-state interpretation, not a historical lifecycle. Cheap deterministic evaluation avoids stale caregiver influence without inventing change from silence. |
| `environmentalLimitationState` | **Evaluate on every Progression Check**; obligatorily recompute when environmental change, equipment installation, hazard correction, access, or task-setting evidence changes | Replace from deterministic current environment plus normalized event evidence. Environmental correction must be able to remove prior blocking influence immediately. | Environmental constraints can change discretely. Regeneration-only refresh is unsafe after a modification is completed. |
| `currentOperationalEmphasis` | **Evaluate on every Progression Check; refresh only when a deterministic refresh signal is present** | Operational prioritization remains the owner. Refresh when reconciliation changes the dominant barrier, active safety/reassessment pressure, active milestone, priority rank, or treatment direction. Preserve wording/value when no clinically meaningful input changed. | This keeps Current Focus current without turning every visit into uncontrolled recommendation generation. Evaluation is unconditional; replacement is conditional and deterministic. |

### Significant-change rule

“Only on significant change” is appropriate as a **mutation condition**, not as an **evaluation schedule**. The system cannot know whether change is significant until it evaluates the new event against prior current state.

### Regeneration rule

Regeneration may recalculate all four scalars from live state, but it must not be the only refresh mechanism. Progression Check is the authoritative longitudinal update workflow and must be able to correct current interpretations before a full generated-output refresh.

---

## Event Processing Flow

### Required sequence

1. **Validate the Progression Check.** Normalize barrier, function, milestone, caregiver, environment, medical, safety, progression-status, and treatment-direction evidence.
2. **Create a candidate longitudinal event.** The event captures what the clinician reported; it is not yet the final persisted result snapshot.
3. **Update Current Longitudinal State.** Apply the event to the mutable current-state layer while preserving original baseline and prior events.
4. **Load prior live conclusions.** Read current progression state and operational prioritization from the live case, not from a historical generation selected for review.
5. **Run Continuity Reconciliation.** Compare prior lifecycle-bearing conclusions with the new event and updated current state. Produce effective active collections, collection-specific dispositions, and refresh signals.
6. **Build effective current clinical context.** Combine structured current state with reconciled collections. Resolved or replaced conclusions are excluded from current influence; monitoring risks are represented with reduced/non-blocking semantics defined by readiness and attention rules.
7. **Rebuild Progression State.** Existing progression logic derives current phase, barriers, milestones, risks, triggers, and current caregiver/environment interpretations from effective evidence.
8. **Rebuild Progression Readiness.** Readiness consumes the reconciled progression state and latest event. It may identify readiness for clinician evaluation but may not advance the patient autonomously.
9. **Build Clinical Attention.** Attention reflects current unresolved, monitored, or newly escalated evidence.
10. **Refresh Operational Prioritization when signaled.** Refresh when treatment direction changed **or** reconciliation materially changed the valid inputs to current emphasis. This closes the current gap where stale items can persist if the clinician reports improvement without selecting “treatment direction changed.”
11. **Build Continuity Interpretation.** Derive continuity condition, reassessment pressure, instability drivers, and alerts from reconciled state. Continuity interpretation does not perform reconciliation itself.
12. **Build downstream recommendation-facing projections.** Current Focus, Attention Required, Next Action, and Clinical Impact consume the existing authoritative outputs after reconciliation.
13. **Persist atomically where possible.** Persist updated live current state and generated live fields, then insert/finalize the immutable longitudinal event with snapshots of the resulting current state, clinical attention, and operational emphasis.
14. **Leave all prior snapshots untouched.** No previous event or generation is recalculated.

### Flow diagram

```text
Progression Check
        │
        ▼
Normalized Progression Event ───────────────┐
        │                                    │
        ▼                                    │
Mutable Current State                        │
        │                                    │
        ├──────── Prior Live Conclusions ◄───┘
        │
        ▼
Continuity Reconciliation
  ├─ effective lifecycle-bearing collections
  ├─ disposition trace
  └─ refresh signals
        │
        ▼
Progression State
        │
        ├─► Progression Readiness
        │
        ▼
Clinical Attention
        │
        ▼
Operational Prioritization
        │
        ▼
Continuity Interpretation
        │
        ├─► Current Focus / Attention Required / Next Action
        └─► Clinical Impact
        │
        ▼
Live Current-State Persistence
+ Immutable Event Snapshots
```

### Transaction safety

The target implementation should avoid a state where the event is persisted but current relevance refresh fails, or current output changes without the corresponding event record. If the current storage layer cannot provide a single database transaction across these writes, the implementation should use the existing safest ordering plus explicit failure handling and idempotency. This is an implementation concern, not justification for a schema migration.

---

## Recommendation Impact Without a Second Reasoning Engine

Reconciliation influences recommendation-facing surfaces only by changing the eligible current inputs consumed by existing builders.

| Surface | Effect of reconciled state | Authority remains with |
|---|---|---|
| **Current Focus** | Remove resolved barriers and cleared triggers from the focus context; allow the existing operational-prioritization logic to retain or select emphasis from current barriers, milestones, and constraints | Operational prioritization / current-focus projection |
| **Attention Required** | Show active risks, active triggers, unresolved barriers, and monitoring risks that require observation; do not continue escalating cleared triggers | Clinical attention and continuity interpretation |
| **Next Action** | Derive the next action from the refreshed readiness, current attention, and current operational emphasis; a resolved barrier may change the next action from containment to progression evaluation, but reconciliation does not author that action | Existing deterministic Next Action logic |
| **Continuity Interpretation** | Calculate reassessment pressure, instability drivers, drift, and alerts from current valid conclusions only; record meaningful resolution/replacement as an operational change when appropriate | Continuity interpretation |
| **Clinical Impact** | Explain the consequence of the event: what conclusion was confirmed, cleared, achieved, demoted, or replaced and what existing plan implication changed | Existing Clinical Impact derivation |

### Prohibited shortcut

Do not create reconciliation-specific recommendation templates such as “if barrier resolved, recommend X.” That would become a second prioritization engine.

The valid pattern is:

```text
Barrier resolved
→ barrier removed from effective current evidence
→ existing progression/readiness/prioritization logic recomputes
→ existing recommendation projections communicate the result
```

### Monitoring semantics

Monitoring must not equal active blocking influence.

- A monitoring regression risk may keep a safety observation visible.
- It should not automatically preserve low advancement readiness if the readiness rules require an active risk or instability signal.
- A monitoring item should affect downstream output only where the owning model explicitly defines that effect.

---

## Historical Preservation Example

### Visit 1 — high fall risk

Structured and deterministic evidence:

- recent fall history;
- unsafe or inconsistent transfers;
- high safety risk;
- transfer assistance requirement.

Live conclusions after Visit 1 may include:

```text
Progression phase: stabilization
Advancement readiness: low
Active barriers:
- transfer instability
Regression risks:
- recent fall history
- high safety risk
Reassessment triggers:
- fall history requires safety review
Current operational emphasis:
- stabilize transfer safety and reduce fall exposure
```

The Visit 1 longitudinal event and any Visit 1 generated snapshot preserve those conclusions permanently.

### Visits 2–4 — improvement under observation

Evidence may show improving transfer consistency without sufficient confirmation of durability.

Reconciliation may produce:

```text
transfer instability: active → active (improving but still limiting)
recent fall history risk: active → monitoring
fall-history trigger: active → active (required review not yet cleared)
```

The historical Visit 1 snapshot remains unchanged. Current state reflects the reduced but not eliminated concern.

### Visit 5 — consistent safe transfers

The Progression Check records:

- consistent safe transfers across relevant tasks;
- reduced assistance/cueing;
- no new falls;
- milestone achieved: safe transfer consistency;
- clinician-confirmed safety review/correction, when required by the trigger rule.

Reconciliation produces:

```text
transfer instability: active → resolved
recent fall history risk: monitoring → retired
fall-history reassessment trigger: active → cleared
safe transfer consistency milestone: active → achieved
```

Existing downstream builders then recalculate:

```text
Progression phase: derived from current remaining constraints
Advancement readiness: partial or high, according to all current signals
Active barriers: transfer instability removed
Regression risks: historical fall risk removed from active influence
Reassessment triggers: fall-history trigger removed
Current operational emphasis: refreshed from remaining current priorities
```

### Historical view after Visit 5

When the clinician opens the Visit 1 snapshot, the interface still shows:

```text
At Visit 1:
High fall risk
Transfer instability active
Advancement readiness low
Safety stabilization was the current focus
```

This is historically correct and immutable.

### Current view after Visit 5

The Command Center shows current operational truth:

```text
Current status:
Consistent safe transfers
Prior transfer instability resolved
No active fall-history reassessment trigger
Readiness refreshed from current safety, assistance, caregiver, environment, and remaining risk evidence
Current Focus based on remaining current constraints
```

The platform therefore preserves both truths:

- **Historical truth:** high fall risk was valid at Visit 1.
- **Current truth:** that historical conclusion no longer influences Visit 5 recommendations after deterministic resolution.

Restore behavior remains unchanged. If a historical snapshot is intentionally restored under existing governance, it becomes the adopted live state through the restore workflow; the historical record itself is still not mutated.

---

## Risk Assessment

| Risk | Severity | Why it matters | Mitigation |
|---|---|---|---|
| False resolution from incomplete Progression Check data | High | A clinically important risk or barrier could disappear because it was not mentioned | Absence-of-evidence rule; require explicit contradiction, corrected structured state, completed review, or authoritative replacement |
| Free-text identity mismatch | High | “Transfer instability” and “unsafe transfers” may be treated as different conclusions or incorrectly merged | Introduce stable internal evidence keys incrementally; use conservative retention for unmapped legacy strings; do not rely on fuzzy matching as authority |
| Reconciliation becomes a second reasoning engine | High | Duplicated rules could conflict with progression and prioritization | Limit output to dispositions, effective collections, and refresh signals; prohibit recommendation content and phase/priority selection |
| Stale structured case fields conflict with new event evidence | High | Baseline-oriented builders may recreate a barrier just resolved by the event | Define event/current-state precedence; build an effective current context before progression derivation; do not rebuild solely from unchanged intake fields |
| Monitoring items retain blocking weight | Medium–High | Improvement is recorded but readiness remains stale | Define explicit downstream semantics; only active risks block where current rules require active risk; monitoring drives observation, not automatic escalation |
| Over-refresh of Current Focus | Medium | Every visit could produce unnecessary focus churn | Evaluate every update but mutate only on deterministic material-change signals |
| Under-refresh when treatment direction is marked unchanged | High | Resolved constraints can remain in current recommendations | Operational refresh signal must include reconciled input changes, not only the existing treatment-direction flag |
| Historical/current authority confusion | High | Clinicians may mistake a prior risk for current truth | Preserve snapshot labeling and live-case authority; never merge historical arrays into live current arrays for display |
| Non-atomic persistence | Medium | Event history and live state could disagree after partial failure | Prefer transactional orchestration; otherwise add idempotent processing and explicit failure recovery without changing contracts prematurely |
| Lifecycle status proliferation | Medium | Complexity could exceed clinical value | Use collection-specific minimal transitions; keep dispositions internal and avoid a universal persisted lifecycle object in Phase 1 |
| Recurrent condition after resolution | Medium | A resolved risk may return later | A new event may reactivate/recreate the conclusion from current evidence; historical resolution remains valid for its time period |
| Output-contract drift | Medium | Existing UI and snapshots may fail | Preserve existing arrays/scalars and shapes; use reconciliation as an internal preprocessing result |

---

## Minimal Implementation Roadmap

### Phase 1 — Safety and stale-influence correction

**Goal:** Remove the highest-risk stale conclusions without changing storage or output contracts.

Implement:

1. a pure deterministic reconciliation function in the canonical continuity path;
2. reconciliation for `reassessmentTriggers` and `activeBarriers`;
3. unconditional advancement-readiness evaluation after reconciliation;
4. operational-prioritization refresh when reconciled barriers/triggers materially change, even if `treatmentDirectionChanged` is false;
5. deterministic disposition reasons included in the in-process result and immutable event snapshot where existing structures permit; and
6. tests for improvement, unchanged status, recurrence, incomplete evidence, environmental correction, and historical immutability.

Do not implement:

- database migration;
- public lifecycle-status objects;
- AI reconciliation;
- autonomous advancement;
- broad recommendation rewrites.

**Clinical value:** highest. It directly reduces stale reassessment and barrier influence.

**Architectural risk:** lowest. It is a preprocessing gate over existing deterministic systems.

### Phase 2 — Full lifecycle-bearing collection coverage

**Goal:** Reconcile all collections whose members can become stale.

Add:

1. `regressionRisks` active/monitoring/retired handling;
2. `activeMilestones` active/achieved/replaced handling;
3. `dominantBarriers` deterministic re-ranking from reconciled active barriers;
4. `adjacentOperationalPriorities` promoted/retired handling through existing prioritization; and
5. stable internal evidence keys for common deterministic conclusions while preserving current external strings and shapes.

Update Clinical Attention, Next Action, Continuity Interpretation, and Clinical Impact to consume the reconciled outputs through their existing contracts.

**Clinical value:** high. It closes the remaining stale-risk and stale-priority pathways.

**Architectural risk:** moderate. Identity normalization and monitoring semantics require careful tests.

### Phase 3 — Auditability and lifecycle hardening

**Goal:** Improve traceability only after the no-migration model is proven.

Add, if demonstrated necessary:

1. deterministic replay/idempotency validation across longitudinal events;
2. reconciliation diagnostics for unmapped legacy conclusions;
3. restore/regeneration consistency tests;
4. compact clinician-facing Clinical Impact wording for meaningful resolution or replacement, without exposing lifecycle internals; and
5. a separately approved persistence proposal only if immutable events and deterministic recomputation cannot satisfy audit requirements.

**Clinical value:** moderate. It improves trust, supportability, and auditability.

**Architectural risk:** controlled if persistence remains deferred pending evidence.

---

## Recommended First Implementation Target

Implement one vertical slice:

> **Progression Check resolves or retains reassessment triggers and active barriers, then refreshes advancement readiness and downstream current emphasis from the reconciled state.**

### Acceptance scenarios

The first slice should prove all of the following:

1. **Improvement with explicit resolution**
   A previously active transfer barrier is removed from current influence after structured evidence of consistent safe transfers.

2. **Improvement without sufficient confirmation**
   The barrier remains active or the associated risk moves to monitoring; it is not silently cleared.

3. **Environmental correction**
   A corrected environmental limitation no longer keeps an environmental barrier or trigger active.

4. **Caregiver improvement**
   Updated caregiver reliability/training evidence refreshes current dependency interpretation without rewriting old snapshots.

5. **No reported change**
   Prior conclusions remain stable and Current Focus does not churn.

6. **Recurrence**
   A previously resolved concern can become active again from new current evidence without altering the earlier resolution record.

7. **Historical preservation**
   Prior generation and event snapshots continue to display the original high-risk conclusion.

8. **No autonomous advancement**
   Improved readiness results in clinician evaluation/Next Action behavior through existing readiness logic, not automatic treatment advancement.

### Why this is first

- It directly addresses stale recommendation risk.
- It uses the existing Progression Check as the only mutation entry point.
- It preserves deterministic authority.
- It does not require generated-output contract changes.
- It does not require historical mutation.
- It establishes the reconciliation boundary before expanding lifecycle coverage.

---

## Governance Rules

1. Continuity Reconciliation must remain deterministic and explainable.
2. It must execute from current live authority, not a viewed historical snapshot.
3. It must not write or rewrite historical generations.
4. It must not independently generate a recommendation, phase, priority, or readiness result.
5. It must not infer resolution from omission alone.
6. It must preserve current output contracts unless separately approved.
7. It must not require a database migration for the initial implementation.
8. It must run as part of every Progression Check evaluation.
9. Existing builders must consume reconciled current evidence rather than accumulated historical arrays.
10. Clinician-facing UX should communicate changed implications, not expose internal reconciliation terminology.

---

## Final Architectural Position

Continuity Reconciliation is a narrow deterministic boundary between longitudinal evidence capture and current-state interpretation.

It exists to answer:

> Which prior conclusions remain eligible to influence the current case?

It does not answer:

> What new treatment plan should be generated?

With this boundary, the platform can preserve immutable historical truth while ensuring that current progression, attention, prioritization, continuity interpretation, and recommendation-facing surfaces operate on current—not merely accumulated—clinical conclusions.
