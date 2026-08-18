# Google Form spec — Field Notes in Medicine case submission

Build this once, in Google Forms, using the exact question titles below (they become the column headers in the response Sheet, which is what `js/config.js` reads). Where a type is suggested, use it — but the titles matter more than the exact widget.

Estimated build time: 15–20 minutes.

## Section 1 — Case classification

| # | Question title (use exactly) | Type | Options |
|---|---|---|---|
| 1 | Case Title | Short answer | — |
| 2 | Case Type | Dropdown | Rare disease / Rare presentation of a common disease / Social or systemic story / Public health lesson / Programme or innovation |
| 3 | Specialty | Dropdown | Medicine / Pediatrics / Surgery / Obstetrics & Gynaecology / Psychiatry / Dermatology / Orthopedics / ENT / Ophthalmology / Emergency/Critical care / Other |
| 4 | Age Group | Dropdown | Neonate / Infant / Child / Adolescent / Adult / Elderly |
| 5 | Sex | Dropdown | Male / Female / Intersex / Not specified |
| 6 | Care Setting | Dropdown | Home visit / Sub-centre/PHC / CHC / District hospital / Camp/Outreach / Other |
| 7 | Disease/Topic Tags | Short answer | Free text, comma-separated (e.g. "Tuberculosis, Malnutrition") — ask contributors to reuse existing tags where possible; see the Tag Vocabulary sheet |
| 8 | Social Determinant Tags | Checkboxes (allows multiple) | Delay in care-seeking / Cost barrier / Distance/Transport barrier / Gender-related barrier / Health literacy / Traditional belief/practice / None apparent |
| 9 | State | Short answer | — |
| 10 | District | Short answer | *Village/town level should NOT be collected — add helper text: "District level only, to protect patient identifiability."* |
| 11 | Outcome | Dropdown | Recovered / Referred / Lost to follow-up / Died / Ongoing |

## Section 2 — The case itself (CARE-based)

| # | Question title (use exactly) | Type |
|---|---|---|
| 12 | Presenting Complaint & History | Paragraph |
| 13 | Clinical & Social Context | Paragraph — helper text: "What made this a rural case — distance, delay, cost, local beliefs, health-seeking behaviour?" |
| 14 | Examination & Investigation Findings | Paragraph |
| 15 | Diagnosis | Paragraph |
| 16 | Management / Intervention | Paragraph |
| 17 | Outcome & Follow-up Detail | Paragraph |
| 18 | Discussion / Learning Point | Paragraph |
| 19 | Patient / Family Perspective | Paragraph (mark as optional) |

## Section 3 — Files & consent

| # | Question title (use exactly) | Type |
|---|---|---|
| 20 | Upload De-identified Images / Lab Reports | File upload |
| 21 | Upload Signed Consent Form (if applicable) | File upload — helper text: "Only editors can see this. Leave blank only if the case is fully de-identified and no identifiable material is included." |
| 22 | Consent Confirmation | Checkbox, required, single option: *"I confirm that written informed consent has been obtained for any identifiable information/images, OR that this case has been fully de-identified and no consent is required."* |

## Section 4 — Contributor

| # | Question title (use exactly) | Type |
|---|---|---|
| 23 | Contributor Name | Short answer |
| 24 | Contributor Email | Short answer, validated as email |

(Google Forms adds a "Timestamp" column to the response Sheet automatically — no need to add this as a question.)

## After building the form

1. In the Form editor, go to **Responses > the green Sheets icon > Create a new spreadsheet**. This creates the linked response Sheet.
2. Open that Sheet and add these columns manually at the end (editors fill these in, not contributors):
   - `Case ID` — assign sequentially, e.g. `RC-2026-001`
   - `Status` — `Draft` / `Published` (the site only shows rows marked `Published`)
   - `De-identification Checked` — editor tick, `Yes`/`No`
   - `Drive Case Folder Link` — link to the case's folder under **Field Notes in Medicine > Cases** in Drive, once you've moved the uploaded files there and set sharing appropriately
   - `Published Date`
3. Set the Sheet's sharing to **Anyone with the link — Viewer** (File > Share). Only do this once you're comfortable that every column an anonymous visitor could see contains nothing identifying — the site only *displays* rows marked Published, but the raw Sheet itself becomes link-readable to anyone who has the link.
4. Copy the Sheet's ID out of its URL and paste it into `SHEET_ID` in `js/config.js` (see the comments in that file for exactly how).
5. Move any uploaded consent-form files from the Form's auto-created upload folder into **Field Notes in Medicine > Consent Forms (Private – Editors Only)**, and restrict that folder's sharing to editors only. Move the de-identified images/case files into a per-case subfolder under **Field Notes in Medicine > Cases**, and share that subfolder as "Anyone with the link — Viewer" before pasting its link into the `Drive Case Folder Link` column.

## Reference: the tag vocabulary

Keep `Disease/Topic Tags` (a free-text field) consistent by having editors and contributors refer to `TAG_VOCABULARY.csv` in this folder, and add new terms there (and to `TAG_VOCAB` in `js/config.js`) rather than letting spelling variants pile up.
