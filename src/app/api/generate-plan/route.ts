import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "OPENAI_API_KEY is missing on the server.",
        }),
        { status: 500 }
      );
    }

    const body = await req.json();

    console.log("API received clinicalDecisionModel:", body?.clinicalDecisionModel);
    console.log(
      "Selected Strategies:",
      body?.clinicalDecisionModel?.selectedStrategies
    );

    const clinicalDecisionModel = body?.clinicalDecisionModel || null;

    const selectedStrategies: string[] = Array.isArray(
      clinicalDecisionModel?.selectedStrategies
    )
      ? clinicalDecisionModel.selectedStrategies
      : [];

    const executionFocus =
      body?.executionFocus ||
      body?.clinicalFocus ||
      body?.clinical_focus ||
      body?.case_classification?.clinical_focus ||
      "adl_home_safety";

    const hasSelectedStrategies = selectedStrategies.length > 0;

    const primaryControlLabel = hasSelectedStrategies
      ? selectedStrategies.join(", ")
      : executionFocus;

    const client = new OpenAI({ apiKey });

    const prompt = `
You are an experienced occupational therapist generating a structured clinical reasoning plan.

This system uses a deterministic clinical decision engine.

The AI is NOT the decision engine.
The AI is the execution layer.

==================================================
PRIMARY CONTROL LAYER — SELECTED STRATEGIES
==================================================

The following selectedStrategies are the PRIMARY authority for this plan:

${hasSelectedStrategies ? selectedStrategies.join(", ") : "No selectedStrategies provided."}

Rules:
- selectedStrategies define the intervention approach.
- selectedStrategies control the structure of the 3 pathways.
- Each pathway must clearly map to one or more selectedStrategies.
- Do NOT default to ADL/home safety unless selectedStrategies are missing.
- Do NOT let executionFocus, clinicalFocus, pathwayFocusRules, diagnosis, or legacy fields override selectedStrategies.

If selectedStrategies are present, they are the boss.

==================================================
STRATEGY DEFINITIONS — ENFORCEMENT LAYER
==================================================

You MUST interpret selectedStrategies using the following definitions:

Safety Containment:
- Goal: Immediately reduce risk of harm
- Includes:
  - restricting unsafe actions
  - blocking access to unsafe environments
  - enforcing supervision
  - simplifying or removing hazardous task components
- DOES NOT include:
  - skill training
  - gradual progression
  - optimization

Compensation:
- Goal: Work around physical limitations
- Includes:
  - modifying task setup
  - using positioning, sequencing, or environmental adjustments
  - reducing physical demand
- DOES NOT include:
  - caregiver-dependent solutions (unless paired with caregiver support)
  - pure safety restriction without task completion

Caregiver Support:
- Goal: Enable task completion through caregiver involvement
- Includes:
  - physical assistance
  - supervision
  - cueing
  - setup and breakdown
- MUST reflect:
  - supportLevel (e.g., intermittent = not constant presence)
- DOES NOT include:
  - fully independent solutions

STRICT RULE:
Every intervention must be consistent with one selectedStrategy mechanism, but the intervention sentence must NOT explain or name the mechanism.

The mechanism should be evident from the action itself.

Do NOT use phrases such as:
- "applying Compensation by"
- "implementing Caregiver Support through"
- "directly enforcing Safety Containment"
- "operationalizing"

If the strategy mechanism is not evident from the action itself, rewrite the action to be more specific rather than adding explanatory language.

==================================================
EXECUTION FOCUS — OUTPUT ROUTING ONLY
==================================================

executionFocus:
${executionFocus}

Rules:
- executionFocus describes WHERE the selected strategies should be applied.
- executionFocus may affect wording, examples, module emphasis, and output framing.
- executionFocus does NOT choose the intervention strategy.
- executionFocus does NOT override selectedStrategies.
- ADL, bathing, dressing, toileting, transfers, mobility, caregiver training, and home safety are application contexts only.

Example:
If selectedStrategies = Compensation + Caregiver Support
and executionFocus = adl_home_safety,
then the plan should be Compensation + Caregiver Support applied to ADL/home safety.

Do NOT create generic ADL pathways just because executionFocus references ADL.

==================================================
CLINICAL DECISION MODEL
==================================================

${JSON.stringify(clinicalDecisionModel || {}, null, 2)}

Use this model as the deterministic reasoning source.

Important:
- primaryStrategy matters.
- selectedStrategies matter most.
- dominantBarrier and secondaryBarrier explain why those strategies were selected.
- clinicalLens and environmentContext shape how the strategies are applied.
- safetyRiskLevel affects urgency and risk language.
- scoringNotes may explain strategy selection but should not be repeated mechanically.

==================================================
LEGACY / CASE CLASSIFICATION CONTEXT
==================================================

${JSON.stringify(body?.case_classification || {}, null, 2)}

Rules:
- This is secondary context.
- It may help explain patient population, setting, or risk.
- It must not override selectedStrategies.
- If this section contains ADL/home safety language, treat that as application context only.

==================================================
CORE CLINICAL REASONING MODEL
==================================================

Function = Person × Task × Environment × Behavior

Use:
- patient goal
- dominant barrier
- secondary barrier
- clinical lens
- environment context
- caregiver context
- assistance level
- safety risk

But always organize pathways around selectedStrategies when present.

The 3 pathways are NOT equally appropriate.

One pathway must clearly emerge as the BEST operational fit based on:
- safety risk
- caregiver feasibility
- environmental constraints
- transfer instability
- cognitive burden
- realistic implementation feasibility

The selected pathway should feel operationally superior for THIS patient under CURRENT conditions.

Alternative pathways should remain clinically reasonable BUT should clearly contain:
- greater operational limitations
- greater implementation risk
- weaker feasibility
- slower stabilization
- increased caregiver burden
OR reduced effectiveness for the current presentation.

==================================================
PATHWAY STRUCTURE REQUIREMENTS
==================================================

Generate exactly 3 coordinated treatment pathways.

They are NOT random treatment options.
They are DIFFERENT OPERATIONAL PRIORITIZATION MODELS for the same patient presentation.

One pathway must clearly emerge as the BEST operational fit based on:
- safety risk
- caregiver feasibility
- environmental constraints
- transfer instability
- cognitive burden
- realistic implementation feasibility

The selected pathway should feel operationally superior for the CURRENT presentation.

Alternative pathways should remain clinically reasonable BUT should clearly contain:
- greater operational limitations
- weaker feasibility
- slower stabilization
- increased residual risk
- greater caregiver dependence
OR
- weaker fit for current conditions

==================================================
PATHWAY DIFFERENTIATION RULES
==================================================

Pathway titles should contain 2-4 words maximum.

Titles should function like operational workflow labels.

GOOD:
- Safety Restriction
- Adaptive Participation
- Caregiver Support
- Environmental Compensation
- Guided Mobility

BAD:
- Physical and Environmental Modifications for Safer Task Performance
- Structured Caregiver Assistance and Supervision for ADL Safety

Pathways should differ primarily by:
- treatment priority
- sequencing philosophy
- risk tolerance
- caregiver dependency
- environmental reliance
- rehabilitation intensity
- operational assumptions

Pathways should NOT differ primarily by:
- superficial wording changes
- excessive narrative variation
- completely unrelated interventions

The same intervention category MAY appear across pathways IF:
- operational priority changes
- sequencing changes
- supervision requirements change
- environmental reliance changes
- implementation emphasis changes
- tradeoff structure changes

If multiple pathways address the same clinical issue:
- differentiate by implementation style and operational philosophy
- avoid repeated intervention phrasing

Pathway differentiation should be immediately obvious WITHOUT reading full intervention lists.

Pathway titles should be:
- short
- operational
- scan-friendly
- strategy-oriented

Avoid:
- report-style titles
- explanatory titles
- long narrative labels

==================================================
PATHWAY HIERARCHY RULES
==================================================

The selected pathway should feel:
- safer
- more operationally stable
- more feasible
- better matched to current patient risk

The selected pathway should feel decisively more operationally stable than alternative pathways for the CURRENT patient presentation.

Alternative pathways should feel:
- conditionally appropriate
- operationally weaker
- less stable for the current presentation

Alternative pathways should clearly communicate:
- why they were not selected
- what operational weaknesses exist
- what limitations reduce suitability
- what residual risks remain

Do NOT make all pathways feel equally complete or equally optimal.

==================================================
INTERVENTION COMPRESSION RULES
==================================================

If selectedStrategies are present:
- interventions MUST directly implement selectedStrategies
- strategyUsed must actively drive intervention design
- generic interventions are NOT allowed

STRICT VALIDATION:
If an intervention could exist in a generic OT plan without knowledge of the selectedStrategies:
- REMOVE IT
OR
- REWRITE IT

CRITICAL INTERVENTION COMPRESSION RULE:

Interventions must be SHORT operational actions.

Do NOT:
- explain WHY the intervention works
- explain WHICH strategy it represents
- narrate clinical reasoning
- describe implementation philosophy

GOOD:
- Block unsupervised shower access
- Add anti-slip treads to entry steps
- Schedule caregiver supervision during transfers

BAD:
- Block shower access to operationalize Safety Containment by reducing hazardous exposure

Limit interventions to:
- high-signal actions
- operationally distinctive actions
- sequencing-defining actions

Avoid:
- exhaustive intervention lists
- generic OT filler
- repeated safety language
- repeated caregiver education language
- long equipment lists
- procedural checklists

==================================================
PATHWAY CONTENT REQUIREMENTS
==================================================

Each pathway must include:
- selected
- type
- strategyUsed
- title
- primaryFocus
- prioritizes
- deprioritizes
- bestFitFor
- interventions
- timeline
- upside
- tradeoff
- operationalRisk

ONLY the selected pathway may include:
- selectionDrivers

Alternative pathways must NOT include:
- selectionDrivers

Alternative pathways should instead emphasize:
- notSelectedBecause
- operationalRisk
- tradeoff
- weaker operational fit

Tradeoffs must clearly describe:
- what the pathway sacrifices
- what operational limitation it accepts
- what downside may occur because of the prioritization model

Tradeoffs must feel:
- clinically meaningful
- operationally realistic

==================================================
SELECTED PATHWAY SUMMARY RULES
==================================================

HARD LIMIT:
selectedPathwaySummary must remain between 40-80 words.

If the summary exceeds 80 words:
- rewrite and compress it.

The summary should describe:
- why the selected pathway won
- the dominant operational tradeoff

The summary should NOT:
- explain all pathways
- narrate progression sequencing
- summarize the entire treatment model

selectedPathwaySummary must:
- remain under 80 words
- explain WHY the selected pathway won
- identify the dominant operational tradeoff
- remain concise, operational, and decisive

Do NOT describe what alternative pathways "follow" or contribute later.

The summary should focus almost entirely on:
- why the selected pathway won
- what operational tradeoff it accepts

Do NOT:
- summarize all pathways
- praise all pathways equally
- explain pathway hierarchy
- narrate treatment progression
- use academic synthesis language
- restate all pathway titles
- read like a comparison table in paragraph form

The selected pathway summary should feel like:
- a defensible operational recommendation
NOT:
- a balanced discussion of all options

The clinician should be able to immediately understand:
- why the selected pathway won
- what it prioritizes
- what tradeoff it accepts
- why alternatives were weaker initial fits

Avoid phrases such as:
- "follow in the hierarchy"
- "coordinated triad"
- "enhance function"
- "structured assistance"
- "treatment progression"

Use direct operational language instead.

==================================================
PATIENT SNAPSHOT
==================================================

Describe:
- what is happening functionally
- why performance is breaking down
- how the selectedStrategies apply
- how executionFocus frames the output context

==================================================
PLAN OVERVIEW
==================================================

Include:
- planSummary
- topRisks
- caregiverExpectations
- safetyLevel

==================================================
OUTPUT FORMAT — JSON ONLY
==================================================

Return valid JSON only.
No markdown.
No code fences.
No explanation outside JSON.

{
  "focusApplied": "${primaryControlLabel}",
  "executionFocus": "${executionFocus}",
  "selectedStrategiesApplied": [],
  "clinicalDecisionModelUsed": {
    "primaryStrategy": "string",
    "selectedStrategies": [],
    "dominantBarrier": "string",
    "secondaryBarrier": "string",
    "clinicalLens": [],
    "environmentContext": [],
    "safetyRiskLevel": "string"
  },
  "patientSnapshot": "string",
"patientSnapshot": "string",
"pathways": [
  {
    "selected": true,
    "selectionDrivers": ["string"],

    "type": "Safety Stabilization",
    "strategyUsed": ["string"],

    "primaryFocus": "string",
    "prioritizes": ["string"],
    "deprioritizes": ["string"],
    "bestFitFor": ["string"],
    "notSelectedBecause": ["string"],
    "operationalRisk": "string",

    "title": "string",
    "interventions": ["string"],
    "timeline": "string",
    "upside": "string",
    "tradeoff": "string"
  },
  {
    "selected": false,

    "type": "Functional Participation",
    "strategyUsed": ["string"],

    "primaryFocus": "string",
    "prioritizes": ["string"],
    "deprioritizes": ["string"],
    "bestFitFor": ["string"],
    "notSelectedBecause": ["string"],
    "operationalRisk": "string",

    "title": "string",
    "interventions": ["string"],
    "timeline": "string",
    "upside": "string",
    "tradeoff": "string"
  },
  {
    "selected": false,

    "type": "Caregiver-Guided Support",
    "strategyUsed": ["string"],

    "primaryFocus": "string",
    "prioritizes": ["string"],
    "deprioritizes": ["string"],
    "bestFitFor": ["string"],
    "notSelectedBecause": ["string"],
    "operationalRisk": "string",

    "title": "string",
    "interventions": ["string"],
    "timeline": "string",
    "upside": "string",
    "tradeoff": "string"
  }
],
"selectedPathwaySummary": "string",
  "summary": {
    "topRisks": ["string"],
    "planSummary": "string",
    "caregiverExpectations": ["string"],
    "safetyLevel": "low | medium | high"
  }
}

==================================================
CASE INPUT
==================================================

${JSON.stringify(body, null, 2)}
`;

    const openAiStart = performance.now();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    console.log(
      "OpenAI API time:",
      Math.round(performance.now() - openAiStart),
      "ms"
    );

    const outputText = response.output_text || "";
    console.log("RAW AI RESPONSE:", outputText);

    const cleaned = outputText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI returned invalid JSON.",
          raw: outputText,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: parsed,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}