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
Every intervention must clearly demonstrate the MECHANISM of one of these strategies.
If the mechanism is not obvious → rewrite or remove the intervention.

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

==================================================
PATHWAY STRUCTURE REQUIREMENTS
==================================================

Generate exactly 3 coordinated treatment approaches.

They are NOT random options.
They are coordinated strategy pathways.

If selectedStrategies are present:

- You are ONLY allowed to generate interventions that directly implement one of the selectedStrategies.
- Each intervention must clearly demonstrate HOW the selectedStrategy is being applied.
- If an intervention cannot be directly tied to a selectedStrategy, DO NOT include it.

STRICT VALIDATION RULE:

Before finalizing each pathway:
- Check every intervention.
- If it could exist in a generic OT plan without knowing the selectedStrategies → REMOVE IT.
- If it does not clearly express the mechanism of the selectedStrategy → REWRITE IT.

FAILURE CONDITION:

The response is INVALID if:
- Interventions are generic (e.g., "install grab bars", "provide training", "improve safety")
- Interventions do not explicitly reflect selectedStrategies
- Strategies are listed but not actively driving intervention design

ENFORCEMENT:

- strategyUsed is not just a label — it must match the logic of every intervention in that pathway
- Each pathway must feel fundamentally different because of the strategy applied
- Do NOT reuse intervention patterns across pathways with minor wording changes

Each pathway must include:
- type
- strategyUsed
- title
- interventions
- timeline
- upside
- tradeoff

The "strategyUsed" field must explicitly name one or more selectedStrategies.

Do NOT generate:
- step-by-step instructions
- detailed caregiver scripts
- long equipment lists
- procedural checklists

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
  "pathways": [
    {
      "type": "Immediate safety / compensation",
      "strategyUsed": ["string"],
      "title": "string",
      "interventions": ["string"],
      "timeline": "string",
      "upside": "string",
      "tradeoff": "string"
    },
    {
      "type": "Skill-building / progression",
      "strategyUsed": ["string"],
      "title": "string",
      "interventions": ["string"],
      "timeline": "string",
      "upside": "string",
      "tradeoff": "string"
    },
    {
      "type": "Long-term carryover / optimization",
      "strategyUsed": ["string"],
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