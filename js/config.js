/*
  Field Notes in Medicine — site configuration
  -----------------------------------------------
  This is the ONE file you need to edit to connect the site to your real
  Google Sheet once your submission Google Form is set up (see
  /docs/GOOGLE_FORM_SPEC.md for how to build that form).

  HOW TO CONNECT YOUR REAL DATA:
  1. Build the Google Form using /docs/GOOGLE_FORM_SPEC.md. Google Forms will
     automatically create a linked "response" Google Sheet for you.
  2. Open that Sheet, add these editor-only columns at the end (if not already
     present): Case ID, Status, De-identification Checked, Consent Confirmed,
     Drive Case Folder Link, Published Date.
  3. In the Sheet, go to File > Share > Share with others, and set general
     access to "Anyone with the link" / "Viewer". (This only exposes rows you
     mark Status = Published, because the site filters on that column — but
     never put anything in the sheet you wouldn't want a stranger to read.)
  4. Copy the Sheet's ID from its URL:
     https://docs.google.com/spreadsheets/d/  >>>THIS PART<<<  /edit
  5. Paste it into SHEET_ID below. Leave SHEET_GID as "0" unless your case
     responses live on a tab other than the first one (check the "gid="
     number in the URL when that tab is open).
  6. Save this file and re-deploy (or just refresh, if using GitHub
     Pages/Netlify continuous deploy from a repo).

  Until SHEET_ID is filled in, the site runs on the sample/demo data in
  /data/sample-cases.csv so you can preview it right away.
*/

const CONFIG = {
  SITE_NAME: "Field Notes in Medicine",
  SITE_TAGLINE: "Cases and stories from rural practice — for reference, teaching, and advocacy.",

  // ---- Fill these in once your Google Form + Sheet are ready ----
  SHEET_ID: "1w1u2b6o7uAT-QAGk01SJYY2jWKproJ_xROUVkfW1xAs",     // e.g. "1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcd"
  SHEET_GID: "0",   // the tab (gid) holding case responses; "0" = first tab

  // Local fallback data used until SHEET_ID is set, or if the live fetch fails.
  SAMPLE_DATA_PATH: "data/sample-cases.csv",

  // Column headers exactly as they appear in the Sheet (i.e. exactly as you
  // titled the matching Form questions). If you rename a question in your
  // Form, update the matching line here — nothing else needs to change.
  COLUMNS: {
    TITLE: "Case Title",
    CASE_TYPE: "Case Type",
    SPECIALTY: "Specialty",
    AGE_GROUP: "Age Group",
    SEX: "Sex",
    CARE_SETTING: "Care Setting",
    DISEASE_TAGS: "Disease/Topic Tags",
    SOCIAL_TAGS: "Social Determinant Tags",
    STATE: "State",
    DISTRICT: "District",
    OUTCOME: "Outcome",
    HISTORY: "Presenting Complaint & History",
    CONTEXT: "Clinical & Social Context",
    FINDINGS: "Examination & Investigation Findings",
    DIAGNOSIS: "Diagnosis",
    MANAGEMENT: "Management / Intervention",
    FOLLOWUP: "Outcome & Follow-up Detail",
    DISCUSSION: "Discussion / Learning Point",
    PERSPECTIVE: "Patient / Family Perspective",
    MEDIA_LINK: "Drive Case Folder Link",
    CONTRIBUTOR: "Contributor Name",
    TIMESTAMP: "Timestamp",
    CASE_ID: "Case ID",
    STATUS: "Status",
    PUBLISHED_DATE: "Published Date"
  },

  // Controlled tag vocabulary — mirrors /docs/TAG_VOCABULARY.csv. Keeping it
  // here too means the filter sidebar always shows the full set of options
  // even before any cases using a given tag have been published.
  TAG_VOCAB: {
    "Case Type": [
      "Rare disease",
      "Rare presentation of a common disease",
      "Social or systemic story",
      "Public health lesson",
      "Programme or innovation"
    ],
    "Specialty": [
      "Medicine", "Pediatrics", "Surgery", "Obstetrics & Gynaecology",
      "Psychiatry", "Dermatology", "Orthopedics", "ENT", "Ophthalmology",
      "Emergency/Critical care", "Other"
    ],
    "Age Group": ["Neonate", "Infant", "Child", "Adolescent", "Adult", "Elderly"],
    "Care Setting": [
      "Home visit", "Sub-centre/PHC", "CHC", "District hospital",
      "Camp/Outreach", "Other"
    ],
    "Social Determinant Tags": [
      "Delay in care-seeking", "Cost barrier", "Distance/Transport barrier",
      "Gender-related barrier", "Health literacy", "Traditional belief/practice",
      "None apparent"
    ],
    "Outcome": ["Recovered", "Referred", "Lost to follow-up", "Died", "Ongoing"]
  }
};

function getCsvUrl() {
  if (CONFIG.SHEET_ID && CONFIG.SHEET_ID.trim() !== "") {
    return `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.SHEET_GID}`;
  }
  return CONFIG.SAMPLE_DATA_PATH;
}
