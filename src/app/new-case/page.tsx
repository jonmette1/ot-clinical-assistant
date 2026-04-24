"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Pathway = {
  type: string;
  title: string;
  interventions: string[];
  timeline: string;
  upside: string;
  tradeoff: string;
};

type GeneratedPlan = {
  patientSnapshot: string;
  pathways: Pathway[];
  clinicalConsiderations: string[];
  firstSessionPriorities: string[];
  taskBreakdown?: string[];
  functionalProblemAreas?: string[];
};

export default function NewCasePage() {
  const [ageRange, setAgeRange] = useState("70-79");
  const router = useRouter();
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
 const [targetActivity, setTargetActivity] = useState("Bathing");
const [assistanceLevel, setAssistanceLevel] = useState("3");
const [adlAssistLevels, setAdlAssistLevels] = useState({
  bed_transfer: "3",
  toilet_transfer: "3",
  shower_transfer: "3",
});
const [primaryGoal, setPrimaryGoal] = useState("");
  const [keyBarriers, setKeyBarriers] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverRelationship, setCaregiverRelationship] = useState("");
  const [caregiverPhone, setCaregiverPhone] = useState("");
  const [caregiverAvailability, setCaregiverAvailability] = useState("");
const [caregiverPhysicalCapacity, setCaregiverPhysicalCapacity] = useState("");
const [caregiverTrainingLevel, setCaregiverTrainingLevel] = useState("");
const [caregiverConfidence, setCaregiverConfidence] = useState("");
const [caregiverPriorities, setCaregiverPriorities] = useState("");
const [caregiverIsPrimarySupport, setCaregiverIsPrimarySupport] = useState(false);
  const [caseType, setCaseType] = useState("geriatric");
  const [subcategory, setSubcategory] = useState("fall_prevention");
const [bathroomType, setBathroomType] = useState("tub_shower_combo");
const [stairsPresent, setStairsPresent] = useState("no");
const [spaceConstraints, setSpaceConstraints] = useState("moderate");
const [safetyHazards, setSafetyHazards] = useState<string[]>([]);
const [equipmentPresent, setEquipmentPresent] = useState<string[]>([]);
const [toiletSetup, setToiletSetup] = useState("standard");
const [transferSurface, setTransferSurface] = useState("tub_edge");
const [grabBarsStatus, setGrabBarsStatus] = useState("none");
const [handheldShowerStatus, setHandheldShowerStatus] = useState("no");
const [bathSeating, setBathSeating] = useState("none");
  const [otherTargetActivity, setOtherTargetActivity] = useState("");
  const [otherKeyBarriers, setOtherKeyBarriers] = useState("");
  const [otherSafetyHazards, setOtherSafetyHazards] = useState("");
  const [otherEquipmentPresent, setOtherEquipmentPresent] = useState("");
  const [bedType, setBedType] = useState("standard");
const [bedHeight, setBedHeight] = useState("");
const [bedRails, setBedRails] = useState("none");
const [bedClearance, setBedClearance] = useState("adequate");
const [bedHazards, setBedHazards] = useState("");
const [primarySeating, setPrimarySeating] = useState("chair");
const [seatHeight, setSeatHeight] = useState("standard");
const [armrestsPresent, setArmrestsPresent] = useState("yes");
const [surfaceFirmness, setSurfaceFirmness] = useState("firm");
const [sitToStandDifficulty, setSitToStandDifficulty] = useState("none");
const [transferDevice, setTransferDevice] = useState("");
const [mobilityDevice, setMobilityDevice] = useState("none");
const [indoorMobilityLevel, setIndoorMobilityLevel] = useState("independent");
const [mobilityEndurance, setMobilityEndurance] = useState("moderate");
const [recentFalls, setRecentFalls] = useState("no");
  // OUTSIDE / ENTRANCE ZONE STATE
const [drivewaySurface, setDrivewaySurface] = useState("smooth");
const [parkingType, setParkingType] = useState("driveway");
const [entryAccess, setEntryAccess] = useState("front");

const [stepsPresent, setStepsPresent] = useState("no");
const [numberOfSteps, setNumberOfSteps] = useState("");
const [stepHeight, setStepHeight] = useState("");
const [stepDepth, setStepDepth] = useState("");

const [railingsPresent, setRailingsPresent] = useState("no");

const [doorType, setDoorType] = useState("standard");
const [doorWidth, setDoorWidth] = useState("");

const [mailboxLocation, setMailboxLocation] = useState("porch");

const [exteriorHazards, setExteriorHazards] = useState<string[]>([]);
const [otherExteriorHazards, setOtherExteriorHazards] = useState("");
  const barriers = [
    "Balance",
    "Strength",
    "ROM",
    "Pain",
    "Endurance",
    "Cognition",
    "Sequencing",
    "Fear/Anxiety",
    "Environment",
  ];
const hazardOptions = [
  "Slippery surfaces",
  "Poor lighting",
  "Loose rugs",
  "Clutter",
  "No grab bars",
  "High tub wall",
];

const equipmentOptions = [
  "Grab bars",
  "Shower chair",
  "Tub bench",
  "Handheld shower",
  "Raised toilet seat",
  "Reacher",
];

const assistLevelOptions = [
  { value: "1", label: "1 - Total Assist" },
  { value: "2", label: "2 - Maximal Assist" },
  { value: "3", label: "3 - Moderate Assist" },
  { value: "4", label: "4 - Minimal Assist" },
  { value: "5", label: "5 - Supervision" },
  { value: "6", label: "6 - Modified Independence" },
  { value: "7", label: "7 - Total Independence" },
];

function getAssistSeverityScore(value: string) {
  switch (value) {
    case "1":
      return 5;
    case "2":
      return 4;
    case "3":
      return 3;
    case "4":
      return 2;
    case "5":
      return 1;
    case "6":
    case "7":
    default:
      return 0;
  }
}

function getPriorityLabel(score: number) {
  if (score >= 8) return "high";
  if (score >= 5) return "moderate";
  return "low";
}

function rankZones<T extends { zone: string; score: number; drivers: string[] }>(
  zones: T[]
) {
  return zones
    .map((zone) => ({
      ...zone,
      priority: getPriorityLabel(zone.score),
    }))
    .sort((a, b) => b.score - a.score);
}

function getAssistLevelLabel(value: string) {
  return (
    assistLevelOptions.find((option) => option.value === value)?.label || value
  );
}

function buildClinicalPrioritySummary() {
  const bathroomDrivers: string[] = [];
  let bathroomScore = 0;

  bathroomScore += Math.max(
    getAssistSeverityScore(adlAssistLevels.toilet_transfer),
    getAssistSeverityScore(adlAssistLevels.shower_transfer)
  );

  if (adlAssistLevels.shower_transfer <= "3") {
    bathroomDrivers.push("shower transfer limitation");
  }
  if (adlAssistLevels.toilet_transfer <= "3") {
    bathroomDrivers.push("toilet transfer limitation");
  }
  if (grabBarsStatus === "none") {
    bathroomScore += 2;
    bathroomDrivers.push("no grab bars");
  }
  if (spaceConstraints === "significant") {
    bathroomScore += 1;
    bathroomDrivers.push("significant space constraints");
  }
  if (bathroomType === "tub_shower_combo") {
    bathroomScore += 1;
    bathroomDrivers.push("tub/shower combo");
  }
  if (safetyHazards.length >= 2) {
    bathroomScore += 2;
    bathroomDrivers.push("multiple bathroom safety hazards");
  } else if (safetyHazards.length === 1) {
    bathroomScore += 1;
    bathroomDrivers.push("bathroom safety hazard present");
  }

  const entranceDrivers: string[] = [];
  let entranceScore = 0;

  if (stepsPresent === "yes") {
    entranceScore += 2;
    entranceDrivers.push("steps present at entry");
  }
  if (numberOfSteps.trim() !== "") {
    entranceScore += 1;
    entranceDrivers.push("entry stair negotiation required");
  }
  if (railingsPresent === "no" && stepsPresent === "yes") {
    entranceScore += 2;
    entranceDrivers.push("no railings at entry");
  }
  if (drivewaySurface === "rough" || drivewaySurface === "inclined") {
    entranceScore += 1;
    entranceDrivers.push("challenging driveway surface");
  }
  if (exteriorHazards.length >= 2) {
    entranceScore += 2;
    entranceDrivers.push("multiple exterior hazards");
  } else if (exteriorHazards.length === 1) {
    entranceScore += 1;
    entranceDrivers.push("exterior hazard present");
  }
  if (doorWidth.trim() !== "") {
    entranceDrivers.push("doorway access consideration");
  }

  const bedroomDrivers: string[] = [];
  let bedroomScore = 0;

  bedroomScore += getAssistSeverityScore(adlAssistLevels.bed_transfer);

  if (adlAssistLevels.bed_transfer <= "3") {
    bedroomDrivers.push("bed transfer limitation");
  }
  if (bedRails === "none") {
    bedroomScore += 1;
    bedroomDrivers.push("no bed rails");
  }
  if (bedClearance === "limited") {
    bedroomScore += 1;
    bedroomDrivers.push("limited bed clearance");
  }
  if (bedClearance === "very_limited") {
    bedroomScore += 2;
    bedroomDrivers.push("very limited bed clearance");
  }
  if (bedHeight.trim() !== "") {
    bedroomScore += 1;
    bedroomDrivers.push("bed height concern");
  }
  if (bedHazards.trim() !== "") {
    bedroomScore += 1;
    bedroomDrivers.push("nighttime or bedside hazards");
  }

  const transferDrivers: string[] = [];
  let transferScore = 0;

  if (sitToStandDifficulty === "mild") {
    transferScore += 1;
    transferDrivers.push("mild sit-to-stand difficulty");
  }
  if (sitToStandDifficulty === "moderate") {
    transferScore += 3;
    transferDrivers.push("moderate sit-to-stand difficulty");
  }
  if (sitToStandDifficulty === "severe") {
    transferScore += 4;
    transferDrivers.push("severe sit-to-stand difficulty");
  }
  if (seatHeight === "low") {
    transferScore += 2;
    transferDrivers.push("low seat height");
  }
  if (armrestsPresent === "no") {
    transferScore += 2;
    transferDrivers.push("no armrests");
  }
  if (surfaceFirmness === "soft") {
    transferScore += 1;
    transferDrivers.push("soft seating surface");
  }
  if (surfaceFirmness === "very_soft") {
    transferScore += 2;
    transferDrivers.push("very soft seating surface");
  }
  if (transferDevice.trim() !== "") {
    transferScore += 1;
    transferDrivers.push("assistive device needed for transfers");
  }
  if (mobilityEndurance === "low") {
  transferScore += 1;
  transferDrivers.push("low endurance impacting transfers");
}

if (recentFalls === "yes") {
  transferScore += 2;
  transferDrivers.push("recent fall history");
}

  return {
    ranked_zones: rankZones([
      {
        zone: "bathroom",
        score: bathroomScore,
        drivers: bathroomDrivers,
      },
      {
        zone: "outside_entrance",
        score: entranceScore,
        drivers: entranceDrivers,
      },
      {
        zone: "bedroom_bed_setup",
        score: bedroomScore,
        drivers: bedroomDrivers,
      },
      {
        zone: "transfer_surfaces",
        score: transferScore,
        drivers: transferDrivers,
      },
    ]),
  };
}

  function toggleBarrier(barrier: string) {
    setKeyBarriers((prev) =>
      prev.includes(barrier)
        ? prev.filter((item) => item !== barrier)
        : [...prev, barrier]
    );
  }
function toggleSafetyHazard(hazard: string) {
  setSafetyHazards((prev) =>
    prev.includes(hazard)
      ? prev.filter((item) => item !== hazard)
      : [...prev, hazard]
  );
}

function toggleEquipment(item: string) {
  setEquipmentPresent((prev) =>
    prev.includes(item)
      ? prev.filter((existing) => existing !== item)
      : [...prev, item]
  );
}

function updateAdlAssistLevel(
  field: "bed_transfer" | "toilet_transfer" | "shower_transfer",
  value: string
) {
  setAdlAssistLevels((prev) => ({
    ...prev,
    [field]: value,
  }));
}

async function generateLocalPlan() {
  setIsSaving(true);
  setSaveMessage("");

  const clinicalPrioritySummary = buildClinicalPrioritySummary();

const casePayload = {
  clientName,
  clientPhone,
  clientEmail,
  clientAddress,
  caregiverName,
  caregiverRelationship,
  caregiverPhone,
  caregiverSupport: {
  caregiver_name: caregiverName,
  relationship: caregiverRelationship,
  phone: caregiverPhone,
  availability: caregiverAvailability,
  physical_capacity: caregiverPhysicalCapacity,
  training_level: caregiverTrainingLevel,
  confidence: caregiverConfidence,
  priorities: caregiverPriorities,
  is_primary_support: caregiverIsPrimarySupport,
},
  caseType,
  subcategory,
  ageRange,
  primaryDiagnosis,
  targetActivity,
  assistanceLevel,
  adlAssistLevels,
  keyBarriers,
  primaryGoal,
  bathroomType,
  stairsPresent,
  spaceConstraints,
  safetyHazards,
  equipmentPresent,
  bathroomAssessment: {
    bathroom_type: bathroomType,
    space_constraints: spaceConstraints,
    toilet_setup: toiletSetup,
    transfer_surface: transferSurface,
    grab_bars_status: grabBarsStatus,
    handheld_shower_status: handheldShowerStatus,
    bath_seating: bathSeating,
    safety_hazards: safetyHazards,
    equipment_present: equipmentPresent,
    other_safety_hazards: otherSafetyHazards,
    other_equipment_present: otherEquipmentPresent,
  },
  otherTargetActivity,
  otherKeyBarriers,
  otherSafetyHazards,
  otherEquipmentPresent,
};


const aiResponse = await fetch("/api/generate-plan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(casePayload),
});

  const aiData = await aiResponse.json();

  if (!aiData.success || !aiData.plan) {
    setSaveMessage(
      `AI generation failed: ${aiData.error || "Unknown error"}`
    );
    setIsSaving(false);
    return;
  }

  const plan = aiData.plan;

  setGeneratedPlan(plan);

const insertStart = performance.now();

const { data: insertedCases, error } = await supabase
  .from("cases")
  .insert([
    {
      title: `${targetActivity} case - ${primaryDiagnosis || "Untitled"}`,
      setting: "home_health_ot",
      target_activities: [targetActivity],
      patient_profile: {
        age_range: ageRange,
        primary_diagnosis: primaryDiagnosis,
      },
    functional_status: {
  current_assistance_level: assistanceLevel,
  adl_assist_levels: adlAssistLevels,
  key_barriers: keyBarriers,
  other_key_barriers: otherKeyBarriers,

  clinical_priority_summary: clinicalPrioritySummary,
general_mobility_summary: {
  primary_mobility_device: mobilityDevice,
  indoor_mobility_level: indoorMobilityLevel,
  endurance: mobilityEndurance,
  recent_falls: recentFalls,
},
transfer_surface_summary: {
  primary_seating: primarySeating,
  seat_height: seatHeight,
  armrests_present: armrestsPresent,
  surface_firmness: surfaceFirmness,
  sit_to_stand_difficulty: sitToStandDifficulty,
  assistive_device_used: transferDevice,
},
},
environment: {
  bathroom_assessment: {
    bathroom_type: bathroomType,
    space_constraints: spaceConstraints,
    toilet_setup: toiletSetup,
    transfer_surface: transferSurface,
    grab_bars_status: grabBarsStatus,
    handheld_shower_status: handheldShowerStatus,
    bath_seating: bathSeating,
    safety_hazards: safetyHazards,
    equipment_present: equipmentPresent,
    other_safety_hazards: otherSafetyHazards,
    other_equipment_present: otherEquipmentPresent,
  },
  transfer_surfaces: {
  primary_seating: primarySeating,
  seat_height: seatHeight,
  armrests_present: armrestsPresent,
  surface_firmness: surfaceFirmness,
  sit_to_stand_difficulty: sitToStandDifficulty,
  assistive_device_used: transferDevice,
},
general_mobility: {
  primary_mobility_device: mobilityDevice,
  indoor_mobility_level: indoorMobilityLevel,
  endurance: mobilityEndurance,
  recent_falls: recentFalls,
},
    bedroom_bed_setup: {
    bed_type: bedType,
    bed_height: bedHeight,
    bed_rails: bedRails,
    bed_clearance: bedClearance,
    bedside_hazards: bedHazards,
  },

  outside_entrance: {
    driveway_surface: drivewaySurface,
    parking_type: parkingType,
    entry_access: entryAccess,

    steps_present: stepsPresent,
    number_of_steps: numberOfSteps,
    step_height: stepHeight,
    step_depth: stepDepth,

    railings_present: railingsPresent,

    door_type: doorType,
    door_width: doorWidth,

    mailbox_location: mailboxLocation,

    exterior_hazards: exteriorHazards,
    other_exterior_hazards: otherExteriorHazards,
  },
},
      goals_preferences: {
        primary_goal: primaryGoal,other_target_activity: otherTargetActivity,
      },
      clinical_constraints: {},
      client_info: {
        client_name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress,
      },

caregiver_info: {
  caregiver_name: caregiverName,
  relationship: caregiverRelationship,
  phone: caregiverPhone,
  availability: caregiverAvailability,
  physical_capacity: caregiverPhysicalCapacity,
  training_level: caregiverTrainingLevel,
  confidence: caregiverConfidence,
  priorities: caregiverPriorities,
  is_primary_support: caregiverIsPrimarySupport,
},

      case_classification: {
        case_type: caseType,
        subcategory: subcategory,
      },
      generated_output: plan,
    },
    ])
  .select("id");


 if (error) {
  setSaveMessage(
    `Case generated, but save failed: ${error.message || "Unknown error"}`
  );
} else {
  const insertedCaseId = insertedCases?.[0]?.id;

if (insertedCaseId) {
  await supabase.from("generations").insert([
    {
      case_id: insertedCaseId,
      prompt_version: "v1-ai",
      input_payload: casePayload,
      output_payload: plan,
    },
  ]);

  router.push(`/cases/${insertedCaseId}`);
  return;
}

setSaveMessage("Case generated with AI and saved successfully.");
}

  setIsSaving(false);
}
   
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">New OT Case</h1>
        <p className="text-gray-400 mb-8">
          Enter a few core details to generate structured OT intervention pathways.
        </p>

<form className="space-y-8">
  {/* CASE BASICS */}
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Case Basics</h2>

    <div>
      <h3 className="text-sm font-medium mb-2 text-gray-300">Client Info</h3>
      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <input
        type="text"
        placeholder="Phone"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <input
        type="text"
        placeholder="Email"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <input
        type="text"
        placeholder="Address"
        value={clientAddress}
        onChange={(e) => setClientAddress(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
    </div>

    <div>
      <h3 className="text-sm font-medium mb-2 text-gray-300">Caregiver</h3>
      <input
        type="text"
        placeholder="Caregiver Name"
        value={caregiverName}
        onChange={(e) => setCaregiverName(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <input
        type="text"
        placeholder="Relationship"
        value={caregiverRelationship}
        onChange={(e) => setCaregiverRelationship(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <input
        type="text"
        placeholder="Caregiver Phone"
        value={caregiverPhone}
        onChange={(e) => setCaregiverPhone(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
    </div>

    <select
  value={caregiverAvailability}
  onChange={(e) => setCaregiverAvailability(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 mt-2"
>
  <option value="">Caregiver Availability</option>
  <option value="full_time_available">Full-time available</option>
  <option value="part_time_available">Part-time available</option>
  <option value="intermittent_availability">Intermittent / limited availability</option>
  <option value="rarely_available">Rarely available</option>
  <option value="unknown">Unknown</option>
</select>

<select
  value={caregiverPhysicalCapacity}
  onChange={(e) => setCaregiverPhysicalCapacity(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 mt-2"
>
  <option value="">Caregiver Physical Capacity</option>
  <option value="cannot_provide_physical_assist">Cannot provide physical assist</option>
  <option value="light_assist_only">Light assist only</option>
  <option value="moderate_assist_possible">Moderate assist possible</option>
  <option value="substantial_assist_possible">Substantial assist possible</option>
  <option value="unknown">Unknown</option>
</select>

<select
  value={caregiverTrainingLevel}
  onChange={(e) => setCaregiverTrainingLevel(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 mt-2"
>
  <option value="">Caregiver Training Level</option>
  <option value="no_training">No training</option>
  <option value="minimal_familiarity">Minimal familiarity</option>
  <option value="some_experience">Some experience</option>
  <option value="well_trained">Well trained</option>
  <option value="unknown">Unknown</option>
</select>

<select
  value={caregiverConfidence}
  onChange={(e) => setCaregiverConfidence(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 mt-2"
>
  <option value="">Caregiver Confidence</option>
  <option value="low_confidence">Low confidence</option>
  <option value="moderate_confidence">Moderate confidence</option>
  <option value="high_confidence">High confidence</option>
  <option value="unknown">Unknown</option>
</select>

<textarea
  placeholder="Caregiver Priorities (optional)"
  value={caregiverPriorities}
  onChange={(e) => setCaregiverPriorities(e.target.value)}
  className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2 mt-2"
/>

<label className="flex items-center gap-2 mt-2 text-sm">
  <input
    type="checkbox"
    checked={caregiverIsPrimarySupport}
    onChange={(e) => setCaregiverIsPrimarySupport(e.target.checked)}
  />
  Primary caregiver
</label>

    <div>
      <h3 className="text-sm font-medium mb-2 text-gray-300">Case Classification</h3>
      <select
        value={caseType}
        onChange={(e) => setCaseType(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="geriatric">Geriatric</option>
        <option value="neurological">Neurological</option>
        <option value="physical_rehabilitation">Physical Rehab</option>
        <option value="pediatric">Pediatric</option>
      </select>

      <select
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="fall_prevention">Fall Prevention</option>
        <option value="home_modification">Home Modification</option>
        <option value="memory_support">Memory Support</option>
        <option value="bathing_safety">Bathing Safety</option>
        <option value="dressing_independence">Dressing Independence</option>
      </select>

      <label className="block text-sm font-medium mb-2 mt-4">Age Range</label>
      <select
        value={ageRange}
        onChange={(e) => setAgeRange(e.target.value)}
        className="w-full mb-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option>Under 18</option>
        <option>18-39</option>
        <option>40-49</option>
        <option>50-59</option>
        <option>60-69</option>
        <option>70-79</option>
        <option>80-89</option>
        <option>90+</option>
      </select>

      <input
        type="text"
        value={primaryDiagnosis}
        onChange={(e) => setPrimaryDiagnosis(e.target.value)}
        placeholder="Primary Diagnosis"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
    </div>
  </div>

  {/* OT FOCUS */}
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">OT Focus</h2>

    <div>
      <label className="block text-sm font-medium mb-2">Target Activity</label>
      <select
        value={targetActivity}
        onChange={(e) => setTargetActivity(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
      >
        <option>Bathing</option>
        <option>Dressing</option>
        <option>Bathing and Dressing</option>
        <option>Toileting</option>
        <option>Transfers</option>
        <option>Grooming</option>
        <option>Feeding</option>
        <option>Functional Mobility</option>
        <option>Kitchen Tasks</option>
        <option>Medication Management</option>
        <option>Home Safety</option>
        <option>Caregiver Training</option>
      </select>
      <input
        type="text"
        placeholder="Other target activity (optional)"
        value={otherTargetActivity}
        onChange={(e) => setOtherTargetActivity(e.target.value)}
        className="w-full mt-2 rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Primary Goal</label>
      <textarea
        value={primaryGoal}
        onChange={(e) => setPrimaryGoal(e.target.value)}
        placeholder="e.g. Independent shower transfer with improved safety"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 min-h-[120px]"
      />
    </div>
  </div>

  {/* FUNCTIONAL STATUS */}
  <div className="space-y-4">
    <h2 className="text-lg font-semibold mb-2">Functional Status</h2>

    <div>
      <label className="block text-sm font-medium mb-2">
        Current Assistance Level
      </label>
      <select
        value={assistanceLevel}
        onChange={(e) => setAssistanceLevel(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
      >
        {assistLevelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4">
      <h3 className="text-sm font-semibold mb-3">ADL Assist Levels</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-2">Bed Transfer</label>
          <select
            value={adlAssistLevels.bed_transfer}
            onChange={(e) => updateAdlAssistLevel("bed_transfer", e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
          >
            {assistLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Toilet Transfer</label>
          <select
            value={adlAssistLevels.toilet_transfer}
            onChange={(e) => updateAdlAssistLevel("toilet_transfer", e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
          >
            {assistLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Shower Transfer</label>
          <select
            value={adlAssistLevels.shower_transfer}
            onChange={(e) => updateAdlAssistLevel("shower_transfer", e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
          >
            {assistLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Key Barriers</label>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {barriers.map((barrier) => (
          <label
            key={barrier}
            className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
          >
            <input
              type="checkbox"
              checked={keyBarriers.includes(barrier)}
              onChange={() => toggleBarrier(barrier)}
            />
            <span>{barrier}</span>
          </label>
        ))}
      </div>
    </div>

    <input
      type="text"
      placeholder="Other key barriers (comma-separated, optional)"
      value={otherKeyBarriers}
      onChange={(e) => setOtherKeyBarriers(e.target.value)}
      className="w-full mt-3 rounded-lg bg-gray-900 border border-gray-700 px-4 py-3"
    />
  </div>

  {/* HOME ASSESSMENT */}
  <div className="space-y-6">
    <h2 className="text-lg font-semibold mb-2">Home Assessment</h2>

    <div className="border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Outside / Entrance</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Driveway Surface</label>
          <select
            value={drivewaySurface}
            onChange={(e) => setDrivewaySurface(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="smooth">Smooth</option>
            <option value="rough">Rough</option>
            <option value="inclined">Inclined</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Parking</label>
          <select
            value={parkingType}
            onChange={(e) => setParkingType(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="driveway">Driveway</option>
            <option value="garage">Garage</option>
            <option value="parking_lot">Parking lot</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Entry Access</label>
          <select
            value={entryAccess}
            onChange={(e) => setEntryAccess(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="front">Front</option>
            <option value="side">Side</option>
            <option value="garage">Garage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Steps Present</label>
          <select
            value={stepsPresent}
            onChange={(e) => setStepsPresent(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of Steps</label>
          <input
            type="text"
            value={numberOfSteps}
            onChange={(e) => setNumberOfSteps(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
            placeholder="e.g. 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Step Height</label>
          <input
            type="text"
            value={stepHeight}
            onChange={(e) => setStepHeight(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
            placeholder="e.g. 6 inches"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Step Depth</label>
          <input
            type="text"
            value={stepDepth}
            onChange={(e) => setStepDepth(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
            placeholder="e.g. 11 inches"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Railings</label>
          <select
            value={railingsPresent}
            onChange={(e) => setRailingsPresent(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="na">N/A</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Door Type</label>
          <select
            value={doorType}
            onChange={(e) => setDoorType(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="standard">Standard</option>
            <option value="sliding">Sliding</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Door Width</label>
          <input
            type="text"
            value={doorWidth}
            onChange={(e) => setDoorWidth(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
            placeholder="e.g. 32 inches"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mailbox Location</label>
          <select
            value={mailboxLocation}
            onChange={(e) => setMailboxLocation(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="porch">Porch</option>
            <option value="garage">Garage</option>
            <option value="driveway">Driveway</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Exterior Hazards</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { value: "cracks_in_pathways", label: "Cracks in pathways" },
              { value: "must_cross_grass", label: "Must cross grass" },
              { value: "must_cross_gravel", label: "Must cross gravel" },
            ].map((hazard) => (
              <label key={hazard.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exteriorHazards.includes(hazard.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setExteriorHazards([...exteriorHazards, hazard.value]);
                    } else {
                      setExteriorHazards(
                        exteriorHazards.filter((item) => item !== hazard.value)
                      );
                    }
                  }}
                />
                {hazard.label}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Other exterior hazards (optional)"
            value={otherExteriorHazards}
            onChange={(e) => setOtherExteriorHazards(e.target.value)}
            className="w-full mt-3 rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          />
        </div>
      </div>
    </div>

    <div className="border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Bathroom</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Bathroom Type</label>
          <select
            value={bathroomType}
            onChange={(e) => setBathroomType(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="tub_shower_combo">Tub/Shower Combo</option>
            <option value="walk_in_shower">Walk-In Shower</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Space Constraints</label>
          <select
            value={spaceConstraints}
            onChange={(e) => setSpaceConstraints(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="minimal">Minimal</option>
            <option value="moderate">Moderate</option>
            <option value="significant">Significant</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Toilet Setup</label>
          <select
            value={toiletSetup}
            onChange={(e) => setToiletSetup(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="standard">Standard toilet</option>
            <option value="comfort_height">Comfort-height toilet</option>
            <option value="raised_toilet_seat">Raised toilet seat</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bath Transfer Surface</label>
          <select
            value={transferSurface}
            onChange={(e) => setTransferSurface(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="tub_edge">Tub edge</option>
            <option value="walk_in_shower_threshold">Walk-in shower threshold</option>
            <option value="roll_in_shower">Roll-in shower</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Grab Bars</label>
          <select
            value={grabBarsStatus}
            onChange={(e) => setGrabBarsStatus(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="none">None</option>
            <option value="toilet_only">Toilet only</option>
            <option value="shower_only">Shower only</option>
            <option value="toilet_and_shower">Toilet and shower</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Handheld Shower</label>
          <select
            value={handheldShowerStatus}
            onChange={(e) => setHandheldShowerStatus(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Bath Seating</label>
          <select
            value={bathSeating}
            onChange={(e) => setBathSeating(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          >
            <option value="none">None</option>
            <option value="shower_chair">Shower chair</option>
            <option value="tub_bench">Tub bench</option>
            <option value="built_in_bench">Built-in bench</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Safety Hazards</label>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            {hazardOptions.map((hazard) => (
              <label
                key={hazard}
                className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={safetyHazards.includes(hazard)}
                  onChange={() => toggleSafetyHazard(hazard)}
                />
                <span>{hazard}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Other safety hazards (optional)"
            value={otherSafetyHazards}
            onChange={(e) => setOtherSafetyHazards(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Equipment Present</label>
          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            {equipmentOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={equipmentPresent.includes(item)}
                  onChange={() => toggleEquipment(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <input
            type="text"
            placeholder="Other equipment present (optional)"
            value={otherEquipmentPresent}
            onChange={(e) => setOtherEquipmentPresent(e.target.value)}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
          />
          <div className="border border-gray-700 rounded-xl p-6 mt-6">
  <h3 className="text-lg font-semibold mb-4">Bedroom / Bed Setup</h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium mb-2">Bed Type</label>
      <select
        value={bedType}
        onChange={(e) => setBedType(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="standard">Standard Bed</option>
        <option value="adjustable">Adjustable Bed</option>
        <option value="hospital">Hospital Bed</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Bed Height</label>
      <input
        type="text"
        value={bedHeight}
        onChange={(e) => setBedHeight(e.target.value)}
        placeholder="e.g. low, standard, high"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Bed Rails Present</label>
      <select
        value={bedRails}
        onChange={(e) => setBedRails(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="none">None</option>
        <option value="one_side">One side</option>
        <option value="both_sides">Both sides</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Clearance Around Bed</label>
      <select
        value={bedClearance}
        onChange={(e) => setBedClearance(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="adequate">Adequate</option>
        <option value="limited">Limited</option>
        <option value="very_limited">Very Limited</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-2">Nighttime / Bedside Hazards</label>
      <input
        type="text"
        value={bedHazards}
        onChange={(e) => setBedHazards(e.target.value)}
        placeholder="e.g. clutter, poor lighting, narrow path to bathroom"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      />
      <div className="border border-gray-700 rounded-xl p-6 mt-6">
  <h3 className="text-lg font-semibold mb-4">Transfer Surfaces</h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium mb-2">Primary Seating</label>
      <select
        value={primarySeating}
        onChange={(e) => setPrimarySeating(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="chair">Chair</option>
        <option value="recliner">Recliner</option>
        <option value="couch">Couch</option>
        <option value="wheelchair">Wheelchair</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Seat Height</label>
      <select
        value={seatHeight}
        onChange={(e) => setSeatHeight(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="low">Low</option>
        <option value="standard">Standard</option>
        <option value="high">High</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Armrests Present</label>
      <select
        value={armrestsPresent}
        onChange={(e) => setArmrestsPresent(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Surface Firmness</label>
      <select
        value={surfaceFirmness}
        onChange={(e) => setSurfaceFirmness(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="firm">Firm</option>
        <option value="soft">Soft</option>
        <option value="very_soft">Very Soft</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Sit-to-Stand Difficulty</label>
      <select
        value={sitToStandDifficulty}
        onChange={(e) => setSitToStandDifficulty(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="none">None</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-2">Assistive Device Used</label>
      <input
        type="text"
        value={transferDevice}
        onChange={(e) => setTransferDevice(e.target.value)}
        placeholder="e.g. walker, cane, none"
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
         />
         <div className="border border-gray-700 rounded-xl p-6 mt-6">
  <h3 className="text-lg font-semibold mb-4">General Mobility</h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div>
      <label className="block text-sm font-medium mb-2">Primary Mobility Device</label>
      <select
        value={mobilityDevice}
        onChange={(e) => setMobilityDevice(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="none">None</option>
        <option value="cane">Cane</option>
        <option value="walker">Walker</option>
        <option value="wheelchair">Wheelchair</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Indoor Mobility Level</label>
      <select
        value={indoorMobilityLevel}
        onChange={(e) => setIndoorMobilityLevel(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="independent">Independent</option>
        <option value="supervision">Supervision</option>
        <option value="assist">Assist</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Endurance</label>
      <select
        value={mobilityEndurance}
        onChange={(e) => setMobilityEndurance(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="good">Good</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Recent Falls</label>
      <select
        value={recentFalls}
        onChange={(e) => setRecentFalls(e.target.value)}
        className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-2"
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
    </div>
  </div>
</div>
    </div>
  </div>
</div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  </div>

  <button
    type="button"
    onClick={generateLocalPlan}
    disabled={isSaving}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-semibold"
  >
    {isSaving ? "Saving..." : "Generate Plan"}
  </button>
</form>

        {saveMessage && (
          <p className="mt-4 text-sm text-gray-300">{saveMessage}</p>
        )}

        <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold mb-4">Live Case Preview</h2>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Age Range:</strong> {ageRange}
            </p>
            <p>
              <strong>Primary Diagnosis:</strong> {primaryDiagnosis || "—"}
            </p>
            <p>
              <strong>Target Activity:</strong> {targetActivity}
            </p>
<p>
  <strong>Current Assistance Level:</strong> {getAssistLevelLabel(assistanceLevel)}
</p>
<p>
  <strong>Bed Transfer Assist:</strong> {getAssistLevelLabel(adlAssistLevels.bed_transfer)}
</p>
<p>
  <strong>Toilet Transfer Assist:</strong> {getAssistLevelLabel(adlAssistLevels.toilet_transfer)}
</p>
<p>
  <strong>Shower Transfer Assist:</strong> {getAssistLevelLabel(adlAssistLevels.shower_transfer)}
</p>
<p>
  <strong>Bathroom Type:</strong> {bathroomType}
</p>
<p>
  <strong>Toilet Setup:</strong> {toiletSetup}
</p>
<p>
  <strong>Bath Transfer Surface:</strong> {transferSurface}
</p>
<p>
  <strong>Grab Bars:</strong> {grabBarsStatus}
</p>
<p>
  <strong>Handheld Shower:</strong> {handheldShowerStatus}
</p>
<p>
  <strong>Bath Seating:</strong> {bathSeating}
</p>
<p>
  <strong>Key Barriers:</strong>{" "}
  {keyBarriers.length ? keyBarriers.join(", ") : "—"}
</p>
<p>
  <strong>Primary Goal:</strong> {primaryGoal || "—"}
</p>

<p>
  <strong>Caregiver Availability:</strong> {caregiverAvailability || "—"}
</p>
<p>
  <strong>Caregiver Physical Capacity:</strong> {caregiverPhysicalCapacity || "—"}
</p>
<p>
  <strong>Caregiver Confidence:</strong> {caregiverConfidence || "—"}
</p>
<p>
  <strong>Primary Seating:</strong> {primarySeating || "—"}
</p>
<p>
  <strong>Surface Firmness:</strong> {surfaceFirmness || "—"}
</p>
<p>
  <strong>Mobility Device:</strong> {mobilityDevice || "—"}
</p>
<p>
  <strong>Indoor Mobility:</strong> {indoorMobilityLevel || "—"}
</p>
<p>
  <strong>Endurance:</strong> {mobilityEndurance || "—"}
</p>
            
          </div>
        </div>
        {generatedPlan && (
          <div className="mt-10 space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-2xl font-semibold mb-4">Generated Plan</h2>
              <p className="text-gray-300">{generatedPlan.patientSnapshot}</p>
            </div>

        {generatedPlan.taskBreakdown && generatedPlan.taskBreakdown.length > 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-xl font-semibold mb-3">Task Breakdown</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
              {generatedPlan.taskBreakdown.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {generatedPlan.functionalProblemAreas &&
          generatedPlan.functionalProblemAreas.length > 0 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-xl font-semibold mb-3">
                Functional Problem Areas
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                {generatedPlan.functionalProblemAreas.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
            <div className="grid gap-6 md:grid-cols-3">
              {generatedPlan.pathways.map((pathway) => (
                <div
                  key={pathway.type}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                >
                  <p className="text-sm uppercase tracking-wide text-blue-400 mb-2">
                    {pathway.type}
                  </p>
                  <h3 className="text-lg font-semibold mb-3">{pathway.title}</h3>

                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300 mb-4">
                    {pathway.interventions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <p className="text-sm mb-2">
                    <strong>Timeline:</strong> {pathway.timeline}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Upside:</strong> {pathway.upside}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Tradeoff:</strong> {pathway.tradeoff}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-xl font-semibold mb-3">
                Clinical Considerations
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                {generatedPlan.clinicalConsiderations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-xl font-semibold mb-3">
                First Session Priorities
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
                {generatedPlan.firstSessionPriorities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}