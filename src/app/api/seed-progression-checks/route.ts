import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";
import { seedProgressionChecks } from "@/lib/testCases/seedProgressionChecks";

export async function GET() {
  return NextResponse.json({
    success: true,
    count: seedProgressionChecks.length,
    checks: seedProgressionChecks.map((check) => check.caseLabel),
  });
}

export async function POST() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const results = [];

  for (const check of seedProgressionChecks) {
    const { data: matchingCases, error: caseError } = await supabase
      .from("cases")
      .select("id, title")
      .ilike("title", `%${check.caseLabel}%`)
      .order("created_at", { ascending: false })
      .limit(1);

    if (caseError || !matchingCases || matchingCases.length === 0) {
      results.push({
        caseLabel: check.caseLabel,
        success: false,
        stage: "find-case",
        error: caseError?.message || "No matching case found.",
      });
      continue;
    }

    const matchedCase = matchingCases[0];

    const progressionResponse = await fetch(`${baseUrl}/api/progression-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId: matchedCase.id,
        functionalChanges: check.functionalChanges,
        currentDominantBarrier: check.currentLimitingFactor,
        secondaryBarrier: null,
        progressionStatus: check.progressionStatus,
        treatmentDirectionChanged: check.treatmentDirectionChanged,
        milestoneAchieved: check.milestoneAchieved,
        caregiverChange: null,
        environmentalChange: null,
        medicalChange: null,
        reasonTreatmentChanged: null,
      }),
    });

    const progressionData = await progressionResponse.json();
results.push({
  caseLabel: check.caseLabel,
  caseId: matchedCase.id,
  title: matchedCase.title,
  success: progressionData.success === true,
  progressionStatus:
    progressionData.current_longitudinal_state?.progressionStatus ?? null,
  dominantBarrier:
    progressionData.current_longitudinal_state?.currentDominantBarrier ?? null,
  milestoneAchieved:
    progressionData.current_longitudinal_state?.milestoneAchieved ?? null,
  attentionCategory:
    progressionData.clinical_attention_state?.category ?? null,
  attentionStatement:
    progressionData.clinical_attention_state?.attentionStatement ?? null,
  requiresOperationalReview:
    progressionData.clinical_attention_state?.requiresOperationalReview ?? null,
  reassessmentRecommended:
    progressionData.clinical_attention_state?.reassessmentRecommended ?? null,
  eventCount:
    progressionData.current_longitudinal_state?.eventCount ?? null,
  error: progressionData.error ?? null,
});
  }

  return NextResponse.json({
    success: results.every((item) => item.success),
    count: results.length,
    results,
  });
}