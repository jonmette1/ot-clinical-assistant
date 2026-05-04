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
    const { type, caseData, generatedPlan } = body;

    const client = new OpenAI({ apiKey });

    let prompt = "";

    if (type === "caregiver_script") {
      prompt = `
You are an experienced occupational therapist creating a caregiver communication script for a specific home health situation.

Your job is NOT to create a new treatment plan.
Your job is NOT to explain transfer setup, equipment setup, or ADL technique in detail.
Your job is to help the caregiver know what to say, how to say it, and when to adjust their tone during care.

Return valid JSON only. Do not use markdown.

Output format:

{
  "conversationGoal": "string",
  "beforeTaskScript": "string",
  "duringTaskScript": "string",
  "ifPatientStruggles": "string",
  "ifPatientResists": "string",
  "reassuranceLanguage": "string",
  "whenToBeFirm": "string"
}

Rules:
- Focus on communication, tone, pacing, reassurance, consent, and emotional regulation
- Do NOT use any names from the case data (patient, caregiver, or family members). Always use role-based language only: "the patient", "the caregiver", or "family member"
- Do NOT turn this into a transfer checklist
- Do NOT include detailed equipment setup, surface setup, home modification, or ADL technique
- Do NOT repeat the plan overview
- Use everyday language a family member could actually say
- Include exact phrases the caregiver can use
- Keep each field 1–3 sentences max
- Be specific to this patient, caregiver situation, safety risk, and task context
- Each field should reference the specific task context when possible, such as standing, walking to the bathroom, shower transfer, toilet transfer, dressing, or bathing, without explaining the full physical setup
- If the patient is fearful, hesitant, confused, embarrassed, frustrated, or resistant, explain how the caregiver should respond verbally
- Use supportive language first, but include direct safety language when there is immediate fall risk or unsafe movement
- Do not use therapy jargon
- Do not create new goals
- Do not recommend unsafe lifting

Field guidance:

conversationGoal:
- Explain the overall communication goal for the caregiver
- Focus on helping the patient feel prepared, respected, and safe without taking over

beforeTaskScript:
- Give exact words the caregiver can say before starting
- Preview what will happen, ask if the patient is ready, and set a calm pace
- This is about preparing the person emotionally and cognitively, not setting up the room

duringTaskScript:
- Give short phrases the caregiver can say during the task
- Include simple cueing, pacing, and encouragement
- Use one-step directions, not long explanations

ifPatientStruggles:
- Give language for hesitation, fatigue, confusion, fear, or difficulty following steps
- Include when to pause, simplify the instruction, or offer reassurance

ifPatientResists:
- Give language for refusal, frustration, embarrassment, or emotional pushback
- Respect the patient’s control while gently re-engaging them if the task is still needed

reassuranceLanguage:
- Give phrases that preserve dignity and confidence
- Avoid talking down to the patient or sounding rushed

whenToBeFirm:
- Give exact words the caregiver can use when safety is at risk
- The tone should be calm, brief, and direct
- Examples may include stopping unsafe movement, asking the patient to pause, or preventing rushing

Case Data:
${JSON.stringify(caseData, null, 2)}

Generated Plan:
${JSON.stringify(generatedPlan, null, 2)}
`;
    } else if (type === "transfer_mobility_details") {
      prompt = `
You are an occupational therapist generating highly practical transfer and mobility instructions for a home health case.

Your job is NOT to create a new plan.
Your job is to translate the existing OT plan into specific transfer setup, cueing, surface variation, and stop-rule details.

Return valid JSON only. Do not use markdown.

Output format:

{
  "setupAdjustments": ["string"],
  "transferCues": ["string"],
  "surfaceVariations": ["string"],
  "stopRules": ["string"]
}

Rules:
- Each array must contain 3–5 short, specific items
- Do NOT use any names from the case data. Use role-based language only: "the patient", "the caregiver", or "family member"
- Focus on real-world execution in THIS home, not general advice

- You MUST ground instructions in:
  - specific surfaces (bed, couch, chair, toilet, shower, recliner)
  - the patient’s limitations (balance, strength, fatigue, cognition)
  - the caregiver’s role and positioning

- For setupAdjustments:
  - Be surface-specific (e.g., couch vs toilet vs shower)
  - Include height, firmness, armrests, support surfaces, and pathway setup
  - Do NOT assume new equipment; prioritize what exists in the home

- For transferCues:
  - Use clear step-by-step sequencing:
    1. patient positioning
    2. weight shift (lean forward, foot placement)
    3. push/stand
    4. stabilize
  - Include caregiver cueing AND when to wait vs step in
  - Include at least one example of exact cueing language the caregiver can say (short phrases only)

- For surfaceVariations:
  - Explain how transfers differ across surfaces
  - Examples:
    - soft couch vs firm chair
    - low toilet vs higher surface
    - shower entry vs bed transfer
  - Make differences practical and actionable

- For stopRules:
  - Include specific STOP conditions
  - Include both physical AND behavioral signs:
    - loss of balance
    - poor foot placement
    - fatigue
    - confusion
    - rushing
  - Make it clear when to stop vs continue with cues

- Include caregiver positioning when relevant:
  - where to stand (side, behind, weaker side)
  - when to provide light guidance vs hands-on support

- Avoid generic phrases like:
  - "assist as needed"
  - "ensure safety"
  - "provide support"
  (replace with exact actions)

- Do NOT recommend unsafe lifting
- Do NOT turn this into a full care plan
- Do NOT repeat the Plan Overview
- Write in language a clinician could realistically explain to a caregiver

Case Data:
${JSON.stringify(caseData, null, 2)}

Generated Plan:
${JSON.stringify(generatedPlan, null, 2)}
`;
    } else if (type === "adl_privacy_support") {
      prompt = `
You are an occupational therapist generating practical ADL privacy and dignity support instructions for a home health case.

Your job is NOT to create a new plan.
Your job is to help the clinician explain how caregivers can support bathing, toileting, dressing, grooming, or hygiene tasks while protecting privacy, consent, dignity, and safety.

Return valid JSON only. Do not use markdown.

Output format:

{
  "privacySetup": ["string"],
  "respectfulCueing": ["string"],
  "whenToStepIn": ["string"],
  "whenToStepBack": ["string"],
  "dignityWarnings": ["string"]
}

Rules:
- Each array must contain 3–5 short, specific items
- Do NOT use any names from the case data. Use role-based language only: "the patient", "the caregiver", or "family member"
- Focus only on privacy, dignity, consent, emotional comfort, and caregiver boundaries during ADLs
- Do NOT turn this into a transfer guide, equipment setup guide, or full ADL technique plan
- Do NOT repeat the Plan Overview
- Use everyday language a family member could actually use
- Include exact caregiver phrases when helpful
- Be specific to the patient’s actual task context from the case, such as bathing, toileting, dressing, grooming, hygiene, or showering
- When possible, name the actual ADL task and likely emotional concern, such as embarrassment during bathing, frustration with dressing, fear of falling during toileting, or loss of confidence with hygiene
- For privacySetup:
  - Focus on how the caregiver protects privacy before the task begins
  - Include practical boundaries such as closing doors, covering body areas not being washed, asking who should be present, and explaining what will happen before starting
  - Do NOT focus on equipment placement or transfer setup

- For respectfulCueing:
  - Include exact phrases that preserve dignity and control
  - Cue one step at a time without sounding impatient, childish, or bossy
  - Include consent before touch or hands-on help

- For whenToStepIn:
  - Explain when the caregiver should become more involved for safety, hygiene, confusion, fatigue, or inability to sequence the task
  - Include how to step in verbally before touching whenever possible

- For whenToStepBack:
  - Explain when the caregiver should give space while still remaining close enough for safety
  - Emphasize independence, modesty, and giving the patient time to complete parts they can still do

- For dignityWarnings:
  - Identify caregiver behaviors that can embarrass, shame, rush, or remove control from the patient
  - Include warnings against talking over the patient, exposing them unnecessarily, rushing private care, or touching without warning

- Account for emotional responses:
  - embarrassment
  - frustration
  - fear
  - refusal
  - loss of confidence

- Use supportive language first
- Use calm, direct language only when safety or hygiene requires immediate action
- Avoid vague phrases like "respect privacy" unless you explain exactly how
- Do not create new goals
- Do not recommend unsafe lifting
- Write instructions a clinician could explain to family or caregivers

Case Data:
${JSON.stringify(caseData, null, 2)}

Generated Plan:
${JSON.stringify(generatedPlan, null, 2)}
`;
    } else if (type === "equipment_feasibility_plan") {
      prompt = `
You are an occupational therapist generating a practical equipment and feasibility plan for a home health case.

Your job is NOT to create a new clinical plan.
Your job is to help the clinician understand what equipment or setup changes are realistic, affordable, and feasible in this specific home situation.

CRITICAL MAPPING RULES (MUST FOLLOW):

You MUST directly map the following inputs from caseData.feasibility_context:

- If financial_constraint = "high"
  → financialFeasibility MUST be "low"

- If financial_constraint = "moderate"
  → financialFeasibility MUST be "moderate"

- If financial_constraint = "low"
  → financialFeasibility MUST be "high"

- If environmental_constraint = "severe"
  → environmentalFeasibility MUST be "low"

- If environmental_constraint = "moderate"
  → environmentalFeasibility MUST be "moderate"

- If environmental_constraint = "flexible"
  → environmentalFeasibility MUST be "high"

- equipment_access MUST influence:
  - access
  - coverageNotes
  - lowerCostAlternative
  - contingencyPlan

You are NOT allowed to invent feasibility levels.
You are NOT allowed to default to "low".
You MUST reflect the input values above exactly.

Return valid JSON only. Do not use markdown.

Output format:

{
  "feasibilitySnapshot": {
    "financialFeasibility": "low | moderate | high | unknown",
    "environmentalFeasibility": "low | moderate | high | unknown",
    "caregiverFlexibility": "low | moderate | high | unknown",
    "mainConstraint": "string"
  },
  "equipmentPlan": [
    {
      "item": "string",
      "reason": "string",
      "priority": "high | medium | low",
      "urgency": "immediate | short_term | optional",
      "costRange": "string",
      "access": "string",
      "coverageNotes": "string",
    "immediateWorkaround": "string",
"relativeCost": "low | moderate | high",
"costComparisonNote": "string",
"idealSetup": "string",
"idealEstimatedCost": "string",
"feasibleEstimatedCost": "string",
"clinicalDecision": "string"
    }
  ]
}

Rules:

- You MUST generate 3–5 feasibility entries
- Do NOT return the schema or template
- Do NOT leave any field empty
- Every field must contain case-specific, concrete content
- If data is missing, infer cautiously based on available context (do not say "unknown" unless unavoidable)
- Each entry must reflect REAL constraints from feasibility_context

- Include 3–6 items
- Focus on the most impactful safety and function changes
- Do NOT assume ideal conditions, unlimited budget, or full caregiver support

For each item:
- Provide a clear reason tied to risk or function
- Include realistic access and cost guidance
For immediateWorkaround:
- Describe what can be done TODAY using items already in the home, simple setup changes, or caregiver assistance
- This should be a temporary but SAFE solution
- Do NOT suggest unstable substitutes or unsafe setups
- Do NOT repeat the main equipment recommendation
- This should bridge the gap until the preferred setup is in place

Cost comparison rules:

- Compare the preferred or ideal solution against the feasible recommendation for this case
- Assign relativeCost:
  - low = minimal cost difference
  - moderate = noticeable but manageable cost difference
  - high = significant cost difference

- costComparisonNote:
  - Write 1 sentence explaining whether the ideal option is worth pursuing now
  - Reference the real-world constraint when relevant: budget, home setup, equipment access, or caregiver support
  - Make the sentence useful for clinician decision-making
  - Do NOT simply repeat the costRange
  - costComparisonNote must be concise (max 1 sentence, <20 words)
  - immediateWorkaround must describe a physical action or setup change
- costComparisonNote must describe a decision (whether to pursue ideal vs feasible)
- Do not overlap content between these two fields

Ideal vs Feasible comparison rules:

- idealSetup:
  - Describe the best-case equipment or setup if constraints were not limiting
  - Be specific (e.g., “wall-mounted grab bars with professional installation”)

- idealEstimatedCost:
  - Provide a realistic estimated range for the ideal setup

- feasibleEstimatedCost:
  - Reflect the costRange already provided for the feasible recommendation

- clinicalDecision:
  - 1 sentence: Should the clinician pursue the ideal setup now, later, or not at all?
  - Must reference feasibility constraints (budget, environment, caregiver, access)
  - Must clearly favor the feasible plan when constraints are high
  - Should sound like a clinical judgment, not a description

Use role-based language only:
- "the patient", "the caregiver", "family member"

Feasibility Context Rules:
- You MUST read caseData.feasibility_context.
- Map financial_constraint directly into feasibilitySnapshot.financialFeasibility.
- Map environmental_constraint directly into feasibilitySnapshot.environmentalFeasibility.
- Map equipment_access into access, coverageNotes, lowerCostAlternative, and contingencyPlan.
- Do not default any feasibilitySnapshot value to "low" unless the case data clearly supports "low".
- If the value is "unknown", return "unknown" and explain the uncertainty in mainConstraint.

Feasibility Context (authoritative inputs):
${JSON.stringify(caseData?.feasibility_context || {}, null, 2)}

Case Data:
${JSON.stringify(caseData, null, 2)}

Generated Plan:
${JSON.stringify(generatedPlan, null, 2)}

Now generate the feasibility plan using the required format. Do NOT repeat the template. Fill it with real content based on the case.
`;

    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unsupported detail module type.",
        }),
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const outputText = response.output_text || "";

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
        data: parsed,
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