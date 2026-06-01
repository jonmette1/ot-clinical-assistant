import { NextResponse } from "next/server";
import { seedPatientCases } from "@/lib/testCases/seedPatientCases";
import { buildClinicalDecisionInputFromCase } from "@/lib/buildClinicalDecisionInput";
import { buildClinicalDecisionModel } from "@/lib/clinicalDecisionEngine";
import { buildProgressionState } from "@/lib/buildProgressionState";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

function buildSeedCasePreview(seedCase: (typeof seedPatientCases)[number]) {
  const clinicalDecisionInput = buildClinicalDecisionInputFromCase(seedCase);

  const clinicalDecisionModel = buildClinicalDecisionModel({
    goalCategory: (clinicalDecisionInput.goalCategory || "Safety") as any,
    dominantBarrier: (clinicalDecisionInput.dominantBarrier || "Physical") as any,
    dominantBarrierSeverity:
      (clinicalDecisionInput.dominantBarrierSeverity as 1 | 2 | 3) || 2,
    secondaryBarrier: clinicalDecisionInput.secondaryBarrier as any,
    secondaryBarrierSeverity:
      (clinicalDecisionInput.secondaryBarrierSeverity as 1 | 2 | 3) || undefined,
    safetyRiskLevel: (clinicalDecisionInput.safetyRiskLevel || "medium") as any,
    supportLevel:
      (clinicalDecisionInput.supportLevel || "Intermittent Support") as any,
    clinicalLens:
      clinicalDecisionInput.clinicalLens?.length > 0
        ? (clinicalDecisionInput.clinicalLens as any)
        : ["Cognitive"],
    environmentContext:
      clinicalDecisionInput.environmentContext?.length > 0
        ? (clinicalDecisionInput.environmentContext as any)
        : ["Home – General Mobility"],
  });

  const canonicalPayloadForProgression = {
    ...seedCase,
    clinicalDecisionInput,
    clinicalDecisionModel,
    clinical_focus:
      seedCase.case_classification?.clinical_focus || "adl_home_safety",
    executionFocus:
      seedCase.case_classification?.clinical_focus || "adl_home_safety",
  };

  const progressionState = buildProgressionState({
    canonicalCasePayload: canonicalPayloadForProgression,
  });

  return {
    label: seedCase.label,
    seedCase,
    clinicalDecisionInput,
    clinicalDecisionModel,
    progressionState,
  };
}

export async function GET() {
  const preview = seedPatientCases.map(buildSeedCasePreview);

  return NextResponse.json({
    success: true,
    method: "GET",
    count: preview.length,
    preview,
  });
}

export async function POST() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const results = [];

  for (const seedCase of seedPatientCases) {
    const preview = buildSeedCasePreview(seedCase);

    const planInput = {
      case_classification: seedCase.case_classification,
      clinicalDecisionModel: preview.clinicalDecisionModel,
      patient_profile: seedCase.patient_profile,
      target_activities: seedCase.target_activities,
      goals_preferences: seedCase.goals_preferences,
      functional_status: seedCase.functional_status,
      environment: seedCase.environment,
      caregiverSupport: seedCase.caregiverSupport,
      feasibility_context: seedCase.feasibility_context,
      progression_state: preview.progressionState,
    };

    const aiResponse = await fetch(`${baseUrl}/api/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planInput),
    });

    const aiData = await aiResponse.json();

    if (!aiData.success || !aiData.plan) {
      results.push({
        label: preview.label,
        success: false,
        stage: "generate-plan",
        error: aiData.error || "Plan generation failed.",
      });
      continue;
    }

    const plan = {
      ...aiData.plan,
      progression_state: preview.progressionState,
    };

    const { data: insertedCase, error: caseError } = await supabase
      .from("cases")
      .insert([
        {
          title: `TEST CASE - ${preview.label}`,
          setting: "home_health_ot",
          target_activities: seedCase.target_activities,
          patient_profile: seedCase.patient_profile,
          functional_status: seedCase.functional_status,
          environment: seedCase.environment,
          goals_preferences: seedCase.goals_preferences,
          feasibility_context: seedCase.feasibility_context,
          clinical_constraints: {},
          clinical_decision_input: preview.clinicalDecisionInput,
          caregiver_info: seedCase.caregiverSupport,
          generated_output: plan,
        },
      ])
      .select("id, title")
      .single();

    if (caseError || !insertedCase) {
      results.push({
        label: preview.label,
        success: false,
        stage: "insert-case",
        error: caseError?.message || "Case insert failed.",
      });
      continue;
    }

    const { error: generationError } = await supabase.from("generations").insert([
      {
        case_id: insertedCase.id,
        prompt_version: "v1-seed-test-case",
        input_payload: planInput,
        output_payload: plan,
      },
    ]);

    results.push({
      label: preview.label,
      success: !generationError,
      id: insertedCase.id,
      title: insertedCase.title,
      generationError: generationError?.message ?? null,
    });
  }

  return NextResponse.json({
    success: results.every((item) => item.success),
    count: results.length,
    results,
  });
}