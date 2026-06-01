export type SeedProgressionCheck = {
  caseLabel: string;
  functionalChanges: string;
  currentLimitingFactor: string;
  progressionStatus: "Improving" | "Stable" | "Declining";
  milestoneAchieved: string;
  treatmentDirectionChanged: boolean;
};

export const seedProgressionChecks: SeedProgressionCheck[] = [
  {
    caseLabel: "Left CVA with Hemiparesis",
    functionalChanges:
      "Patient completed bed-to-chair transfer with slightly improved weight shift and fewer verbal cues. Still requires steadying assist.",
    currentLimitingFactor:
      "Balance during sit-to-stand and right-sided weight bearing",
    progressionStatus: "Improving",
    milestoneAchieved: "Safer assisted sit-to-stand setup",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Right TKA",
    functionalChanges:
      "Patient reports less pain during dressing and completed toilet transfer with improved control using raised toilet seat.",
    currentLimitingFactor: "Knee pain and limited ROM during lower-body ADLs",
    progressionStatus: "Improving",
    milestoneAchieved: "Toilet transfer improved to minimal assist",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Parkinson's Disease",
    functionalChanges:
      "No meaningful change this visit. Continued freezing during bathroom mobility despite cueing.",
    currentLimitingFactor: "Freezing and transfer sequencing",
    progressionStatus: "Stable",
    milestoneAchieved: "",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Dementia with Caregiver Strain",
    functionalChanges:
      "Caregiver used written cueing sequence during bathing routine with improved patient participation, but still needed frequent prompts.",
    currentLimitingFactor: "Caregiver cueing consistency",
    progressionStatus: "Improving",
    milestoneAchieved: "Caregiver followed structured cueing routine",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "COPD with Endurance Limitations",
    functionalChanges:
      "Patient completed seated bathing setup with fewer rest breaks but still fatigues after bathroom tasks.",
    currentLimitingFactor: "Endurance and pacing during bathing",
    progressionStatus: "Improving",
    milestoneAchieved: "Used seated rest break strategy during bathing",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Multiple Falls with Environmental Hazards",
    functionalChanges:
      "Family removed one loose rug and added night light near bathroom path. Patient still unsafe during shower transfer.",
    currentLimitingFactor: "Bathroom hazards and shower transfer safety",
    progressionStatus: "Improving",
    milestoneAchieved: "One environmental hazard removed",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Caregiver-Dependent Transfer Case",
    functionalChanges:
      "Caregiver practiced transfer setup but could not safely provide physical assist without therapist intervention.",
    currentLimitingFactor: "Caregiver physical capacity during transfers",
    progressionStatus: "Stable",
    milestoneAchieved: "Caregiver identified unsafe transfer setup",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "CHF with Functional Decline",
    functionalChanges:
      "Patient tolerated short ADL routine with pacing but required longer recovery after toileting and bathing prep.",
    currentLimitingFactor: "Fatigue and activity tolerance",
    progressionStatus: "Stable",
    milestoneAchieved: "Completed partial ADL routine with pacing",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Severe OA with Pain-Limited Function",
    functionalChanges:
      "Patient used armrests and slower pacing for toilet transfer with slightly less pain, but still avoids shower transfer.",
    currentLimitingFactor: "Pain during sit-to-stand and toilet transfer",
    progressionStatus: "Improving",
    milestoneAchieved: "Toilet transfer completed with improved mechanics",
    treatmentDirectionChanged: false,
  },
  {
    caseLabel: "Frail Elder Living Alone",
    functionalChanges:
      "Patient accepted walker path changes and removed clutter near bed, but remains unsafe with shower access.",
    currentLimitingFactor: "Environmental safety and limited support",
    progressionStatus: "Improving",
    milestoneAchieved: "Bedside path cleared for safer mobility",
    treatmentDirectionChanged: false,
  },
];