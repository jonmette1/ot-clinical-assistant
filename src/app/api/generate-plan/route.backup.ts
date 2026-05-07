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

console.log(
  "API received clinicalDecisionModel:",
  body?.clinicalDecisionModel
);

console.log(
  "Selected Strategies:",
  body?.clinicalDecisionModel?.selectedStrategies
);

const clinicalDecisionModel = body?.clinicalDecisionModel || null;

const selectedStrategies: string[] =
  Array.isArray(clinicalDecisionModel?.selectedStrategies)
    ? clinicalDecisionModel.selectedStrategies
    : [];

const legacyClinicalFocus =
  body?.clinical_focus ||
  body?.case_classification?.clinical_focus ||
  "adl_home_safety";

const primaryControlLabel =
  selectedStrategies.length > 0
    ? selectedStrategies.join(", ")
    : legacyClinicalFocus;

const strategyInstruction = `
PRIMARY CONTROL LAYER — CLINICAL DECISION MODEL

The deterministic clinicalDecisionModel is the authority for this plan.

Selected strategies:
${selectedStrategies.length > 0 ? selectedStrategies.join(", ") : "No selectedStrategies provided. Use legacy context only as fallback."}

Rules:
- If selectedStrategies are present, they MUST control the structure of the 3 treatment approaches.
- Each pathway must be built around one or more selectedStrategies.
- Do NOT default to adl_home_safety unless selectedStrategies are missing.
- clinicalFocus, pathwayFocusRules, case_classification, and legacy focus fields are secondary context only.
- Legacy clinical focus must NOT override selectedStrategies.
- The AI may use diagnosis, environment, caregiver, assistance level, and risks to shape details, but not to replace the selectedStrategies.
`;

const client = new OpenAI({ apiKey });

const prompt = `
${strategyInstruction}

You are an experienced occupational therapist.

Your job is to generate a structured OT clinical strategy based on real-world constraints.


This system prioritizes:
- safety
- feasibility
- consistency
- caregiver capacity
- environment

It does NOT prioritize ideal or perfect interventions.

--------------------------------------------------
CLINICAL REASONING PROFILE
--------------------------------------------------

${JSON.stringify(body?.case_classification?.clinical_reasoning_profile || {}, null, 2)}

Rules:
- populationType defines the population lens (pediatric, geriatric, neuro, etc.)
- dominantDriver defines the primary cause of breakdown
- focusInterpretation defines how to apply the selected clinical focus
- You MUST prioritize dominantDriver over all other impairments
- Do NOT treat all barriers equally

--------------------------------------------------
PRIMARY STRATEGY CONTROL
--------------------------------------------------

${primaryControlLabel}

Strategy rules:
- selectedStrategies determine the intervention approach.
- Legacy clinical focus is secondary context only.
- Do not let legacy focus labels override selectedStrategies.
- ADL = task completion, routine, setup, safety
- Transfers = movement, surfaces, fall risk
- Caregiver = support strategy, boundaries, training

--------------------------------------------------
CORE REASONING MODEL
--------------------------------------------------

Function = Person × Task × Environment × Behavior

You must:
1. Identify the breakdown in function
2. Identify what is limiting performance
3. Align all outputs to the dominantDriver
4. Respect environment and caregiver constraints

--------------------------------------------------
OUTPUT REQUIREMENTS
--------------------------------------------------

Generate:

1. Patient Snapshot
2. Plan Overview
3. 3 Coordinated Treatment Approaches

Do NOT generate:
- step-by-step instructions
- detailed caregiver scripts
- equipment lists
- procedural checklists

--------------------------------------------------
PATIENT SNAPSHOT
--------------------------------------------------

- Describe what is happening functionally
- Include environment, assistance level, and key limitation
- Reflect dominantDriver clearly

--------------------------------------------------
PLAN OVERVIEW
--------------------------------------------------

Include:

- planSummary:
  - top-level clinical decision
  - what should be prioritized immediately
  - must reflect dominantDriver

- topRisks:
  - 2–4 major risks (safety or performance)

- caregiverExpectations:
  - high-level only (no instructions)

- safetyLevel:
  - low | medium | high

--------------------------------------------------
TREATMENT APPROACHES
--------------------------------------------------

Generate exactly 3 approaches.

They are NOT options. They are coordinated strategies.

Structure:

1. Immediate safety / compensation
2. Skill-building / progression
3. Long-term carryover / optimization

Rules:

- All must align with the SAME constraints
- No contradictions between approaches
- No repetition
- Each must include:
  - title
  - interventions (max 4, short sentences)
  - timeline
  - upside
  - tradeoff

--------------------------------------------------
CRITICAL BEHAVIOR RULES
--------------------------------------------------

If dominantDriver = sensory_behavioral:
- emphasize routine, predictability, tolerance

If dominantDriver = cognitive_safety:
- emphasize cueing, sequencing, supervision

If dominantDriver = balance_fall_risk:
- emphasize stability, surfaces, fall prevention

If dominantDriver = strength_endurance:
- emphasize pacing, fatigue, effort reduction

If dominantDriver = environmental_access:
- emphasize layout, barriers, access

If dominantDriver = caregiver_capacity:
- emphasize realistic caregiver limits

If dominantDriver = motor_planning_neurological:
- emphasize positioning, repetition, coordination

--------------------------------------------------
OUTPUT FORMAT (JSON ONLY)
--------------------------------------------------

{
  "focusApplied": "${primaryControlLabel}",
  "clinicalReasoningProfile": {
    "populationType": "string",
    "dominantDriver": "string",
    "focusInterpretation": "string"
  },
  "patientSnapshot": "string",
  "pathways": [
    {
      "type": "string",
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

--------------------------------------------------
CASE INPUT
--------------------------------------------------

${JSON.stringify(body, null, 2)}
`;

const openAiStart = performance.now();

const response = await client.responses.create({
  model: "gpt-4.1-mini",
  input: prompt,
});

console.log("OpenAI API time:", Math.round(performance.now() - openAiStart), "ms");

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