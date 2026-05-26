# OT Clinical Reasoning Platform — Intake Form Structure

Source intake architecture derived from application intake form implementation. :contentReference[oaicite:0]{index=0}

---

# CRITICAL SYSTEM LOGIC

## Assistance Level Scale

IMPORTANT:
Lower numbers indicate HIGHER impairment severity.

| Value | Meaning |
|---|---|
| 1 | Total Assist |
| 2 | Maximal Assist |
| 3 | Moderate Assist |
| 4 | Minimal Assist |
| 5 | Supervision |
| 6 | Modified Independence |
| 7 | Total Independence |

Operational Importance:
- foundational severity signal
- affects prioritization weighting
- affects operational emphasis generation
- affects caregiver feasibility
- affects continuity progression logic

---

# SECTION 1 — CASE BASICS

## Client Info

### Client Name
- Type: text

### Phone
- Type: text

### Email
- Type: text

### Address
- Type: text

---

## Caregiver

### Caregiver Name
- Type: text

### Relationship
- Type: text

### Caregiver Phone
- Type: text

### Caregiver Availability
- Type: dropdown

Options:
- Full-time available
- Part-time available
- Intermittent / limited availability
- Rarely available
- Unknown

Operational Importance:
Strong caregiver feasibility signal.

---

### Caregiver Physical Capacity
- Type: dropdown

Options:
- Cannot provide physical assist
- Light assist only
- Moderate assist possible
- Substantial assist possible
- Unknown

Operational Importance:
Strong modifier for caregiver-assisted intervention realism.

---

### Caregiver Training Level
- Type: dropdown

Options:
- No training
- Minimal familiarity
- Some experience
- Well trained
- Unknown

---

### Caregiver Confidence
- Type: dropdown

Options:
- Low confidence
- Moderate confidence
- High confidence
- Unknown

Operational Importance:
Affects carryover reliability and intervention complexity tolerance.

---

### Caregiver Priorities
- Type: textarea

---

### Primary Caregiver
- Type: checkbox

---

## Case Classification

### Case Type
- Type: dropdown

Options:
- Geriatric
- Neurological
- Physical Rehab
- Pediatric

---

### Clinical Focus
- Type: dropdown

Options:
- ADL / Home Safety
- Transfers & Mobility
- Caregiver Training

Operational Importance:
Major operational weighting signal.

Affects:
- reasoning interpretation
- operational emphasis
- continuity progression
- caregiver strategy weighting

---

### Age Range
- Type: dropdown

Options:
- Under 18
- 18-39
- 40-49
- 50-59
- 60-69
- 70-79
- 80-89
- 90+

---

### Primary Diagnosis
- Type: text

---

# SECTION 2 — REAL-WORLD CONSTRAINTS

### Financial Constraint
- Type: dropdown

Options:
- Unknown
- Low
- Moderate
- High

---

### Environmental Constraint
- Type: dropdown

Options:
- Unknown
- Flexible
- Moderate
- Severe

Operational Importance:
Affects environmental modification realism.

---

### Equipment Access
- Type: dropdown

Options:
- Unknown
- Out of pocket
- Insurance / DME
- Borrowed
- Mixed

Operational Importance:
Affects feasibility of DME recommendations.

---

# SECTION 3 — OT FOCUS

### Target Activity
- Type: dropdown

Options:
- Bathing
- Dressing
- Bathing and Dressing
- Toileting
- Transfers
- Grooming
- Feeding
- Functional Mobility
- Kitchen Tasks
- Medication Management
- Home Safety
- Caregiver Training

---

### Other Target Activity
- Type: text

---

### Primary Goal
- Type: textarea

Example:
- Independent shower transfer with improved safety

---

# SECTION 4 — FUNCTIONAL STATUS

### Current Assistance Level
- Type: dropdown

Options:
- 1 - Total Assist
- 2 - Maximal Assist
- 3 - Moderate Assist
- 4 - Minimal Assist
- 5 - Supervision
- 6 - Modified Independence
- 7 - Total Independence

---

## ADL Assist Levels

### Bed Transfer
- Type: dropdown
- Uses Assistance Level Scale

Operational Importance:
Major weighting factor for bedroom/transfer prioritization.

---

### Toilet Transfer
- Type: dropdown
- Uses Assistance Level Scale

Operational Importance:
Major weighting factor for bathroom operational prioritization.

---

### Shower Transfer
- Type: dropdown
- Uses Assistance Level Scale

Operational Importance:
Major weighting factor for bathing operational prioritization.

---

## Key Barriers

### Key Barriers
- Type: multi-select checkbox

Options:
- Balance
- Strength
- ROM
- Pain
- Endurance
- Cognition
- Sequencing
- Fear/Anxiety
- Environment

Operational Importance:
Strong influence on dominant reasoning driver.

---

### Other Key Barriers
- Type: text

---

# SECTION 5 — HOME ASSESSMENT

# SUBSECTION — OUTSIDE / ENTRANCE

### Driveway Surface
- Type: dropdown

Options:
- Smooth
- Rough
- Inclined

---

### Parking
- Type: dropdown

Options:
- Driveway
- Garage
- Parking lot

---

### Entry Access
- Type: dropdown

Options:
- Front
- Side
- Garage

---

### Steps Present
- Type: dropdown

Options:
- No
- Yes

Conditional Logic:
If YES:
- Number of Steps
- Step Height
- Step Depth
- Railings

become operationally relevant.

---

### Number of Steps
- Type: text

---

### Step Height
- Type: dropdown

Options:
- Low
- High

---

### Step Depth
- Type: dropdown

Options:
- Deep
- Shallow

---

### Railings
- Type: dropdown

Options:
- No
- Yes
- N/A

Operational Importance:
Strong outside entrance safety weighting factor.

---

### Door Type
- Type: dropdown

Options:
- Standard
- Sliding

---

### Door Width
- Type: dropdown

Options:
- Narrow
- Standard
- Wide

---

### Mailbox Location
- Type: dropdown

Options:
- Porch
- Garage
- Driveway

---

## Exterior Hazards
- Type: multi-select checkbox

Options:
- Cracks in pathways
- Must cross grass
- Must cross gravel

---

### Other Exterior Hazards
- Type: text

---

# SUBSECTION — BATHROOM

### Bathroom Type
- Type: dropdown

Options:
- Tub/Shower Combo
- Walk-In Shower
- Unknown

Operational Importance:
Tub/shower combo increases bathing complexity weighting.

---

### Space Constraints
- Type: dropdown

Options:
- Minimal
- Moderate
- Significant

Operational Importance:
Major environmental feasibility signal.

---

### Toilet Setup
- Type: dropdown

Options:
- Standard toilet
- Comfort-height toilet
- Raised toilet seat
- Unknown

---

### Bath Transfer Surface
- Type: dropdown

Options:
- Tub edge
- Walk-in shower threshold
- Roll-in shower
- Unknown

---

### Grab Bars
- Type: dropdown

Options:
- None
- Toilet only
- Shower only
- Toilet and shower
- Unknown

Operational Importance:
Strong safety weighting factor.

---

### Handheld Shower
- Type: dropdown

Options:
- No
- Yes
- Unknown

---

### Bath Seating
- Type: dropdown

Options:
- None
- Shower chair
- Tub bench
- Built-in bench
- Unknown

---

## Safety Hazards
- Type: multi-select checkbox

Options:
- Slippery surfaces
- Poor lighting
- Loose rugs
- Clutter
- No grab bars
- High tub wall

Operational Importance:
Multiple hazards increase environmental safety weighting.

---

### Other Safety Hazards
- Type: text

---

## Equipment Present
- Type: multi-select checkbox

Options:
- Grab bars
- Shower chair
- Tub bench
- Handheld shower
- Raised toilet seat
- Reacher

---

### Other Equipment Present
- Type: text

---

# SUBSECTION — BEDROOM / BED SETUP

### Bed Type
- Type: dropdown

Options:
- Standard Bed
- Adjustable Bed
- Hospital Bed
- Unknown

---

### Bed Height
- Type: dropdown

Options:
- Low
- Standard
- High

---

### Bed Rails Present
- Type: dropdown

Options:
- None
- One side
- Both sides
- Unknown

---

### Clearance Around Bed
- Type: dropdown

Options:
- Adequate
- Limited
- Very Limited
- Unknown

Operational Importance:
Affects transfer feasibility and environmental mobility complexity.

---

## Nighttime / Bedside Hazards
- Type: multi-select checkbox

Options:
- Clutter
- Obstacles
- Poor lighting
- Narrow path
- Long path
- Stairs

---

# SUBSECTION — TRANSFER SURFACES

### Primary Seating
- Type: dropdown

Options:
- Chair
- Recliner
- Couch
- Wheelchair

---

### Seat Height
- Type: dropdown

Options:
- Low
- Standard
- High

Operational Importance:
Low surfaces increase sit-to-stand difficulty weighting.

---

### Armrests Present
- Type: dropdown

Options:
- Yes
- No

---

### Surface Firmness
- Type: dropdown

Options:
- Firm
- Soft
- Very Soft

Operational Importance:
Soft surfaces increase transfer difficulty weighting.

---

### Sit-to-Stand Difficulty
- Type: dropdown

Options:
- None
- Mild
- Moderate
- Severe

Operational Importance:
Major transfer prioritization signal.

---

# SUBSECTION — GENERAL MOBILITY

### Primary Mobility Device
- Type: dropdown

Options:
- None
- Cane
- Walker
- Wheelchair

---

### Indoor Mobility Level
- Type: dropdown

Options:
- Independent
- Supervision
- Assist

---

### Endurance
- Type: dropdown

Options:
- Low
- Moderate
- Good

Operational Importance:
Low endurance increases transfer and mobility burden weighting.

---

### Recent Falls
- Type: dropdown

Options:
- No
- Yes

Operational Importance:
Major fall-risk prioritization signal.

---

# OPERATIONAL PRIORITIZATION DRIVERS

The intake form structurally feeds these operational domains:

- bathroom
- outside_entrance
- bedroom_bed_setup
- transfer_surfaces
- general_mobility
- caregiver_capacity
- environmental_access
- balance_fall_risk
- strength_endurance
- cognitive_safety
- motor_planning_neurological
- sensory_behavioral

---

# MAJOR ARCHITECTURAL OBSERVATION

This intake form is NOT simply:
- demographic intake
- documentation support
- information collection

It is functioning as:
- a structured clinical reasoning ontology
- a deterministic operational weighting engine
- a continuity-aware prioritization framework
- an environmental feasibility mapping system
- a caregiver realism constraint system

The structure itself materially shapes:
- operational emphasis generation
- prioritization hierarchy
- continuity progression
- intervention feasibility
- caregiver implementation realism
- environmental adaptation weighting
