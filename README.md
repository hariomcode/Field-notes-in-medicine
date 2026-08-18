# Field Notes in Medicine

A small, free, static website for publishing rural-practice medical cases and stories — rare diseases, rare presentations of common disease, and the social stories behind them. Built as "Tier 2" from the original plan: a static HTML/CSS/JS front end, with Google Sheets (fed by a Google Form) and Google Drive as the entire backend. No server, no database, no hosting bill.

This is a working name — nothing below depends on it, so it's easy to rename later (just edit `SITE_NAME` in `js/config.js` and the `<title>` tags).

## What's in this folder

```
index.html                  Home / browse page with tag filters + search
case.html                   Individual case detail page (reads ?id=CASE_ID)
about.html                  Aims & scope, editorial board, license
submission-guidelines.html  How to submit a case (link to your Google Form)
ethics-consent.html         Consent & de-identification policy
css/styles.css              All styling
js/config.js                *** The one file you edit to go live ***
js/app.js                   Browse page logic (fetch, filter, render)
js/case.js                  Case detail page logic
data/sample-cases.csv       Demo data so the site works before you connect a real Sheet
docs/GOOGLE_FORM_SPEC.md    Exact spec for building the submission Google Form
docs/TAG_VOCABULARY.csv     The controlled tag list, for reference/import into Sheets
```

## How it works

Contributors submit cases through a Google Form (you build this once, using `docs/GOOGLE_FORM_SPEC.md` — there's no API available to build it automatically, so this is a 15-20 minute manual step). Google Forms automatically creates a linked Google Sheet (one row per submission) and a Drive folder for uploaded files. An editor reviews each row, marks it `Published` when ready, and the website — which fetches that Sheet as CSV on every page load — picks it up automatically. No manual site editing needed to publish a case.

## Setup steps

1. **Build the Google Form.** Follow `docs/GOOGLE_FORM_SPEC.md` exactly — question titles become the Sheet's column headers, which the site's code looks for by name.
2. **Add editor columns to the response Sheet**: `Case ID`, `Status`, `De-identification Checked`, `Drive Case Folder Link`, `Published Date` (details in the spec doc).
3. **Share the Sheet** as "Anyone with the link — Viewer" (File > Share in Google Sheets).
4. **Connect the site**: open `js/config.js`, paste the Sheet's ID into `SHEET_ID` (full instructions are in the comments at the top of that file).
5. **Preview locally** (optional): from this folder, run `python3 -m http.server 8000` and open `http://localhost:8000` — opening `index.html` directly by double-clicking it won't work, because browsers block the `fetch()` calls this site relies on when there's no local server.
6. **Deploy for free** — see below.

Until step 4 is done, the site runs on the three sample cases in `data/sample-cases.csv` so you can see exactly how it will look and behave.

## Deploying for free

Two solid free options, both with a free subdomain to start:

**Netlify (easiest — no account needed to try it first):**
Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this entire folder into the browser window. It deploys instantly to a `your-site-name.netlify.app` address. Create a free account to keep it live long-term and get auto-deploys if you later connect it to a GitHub repo.

**GitHub Pages (if you're comfortable with GitHub, or plan to invite other contributors to edit the code):**
Push this folder to a new GitHub repository, then in the repo's Settings > Pages, set the source to the `main` branch / root folder. It deploys to `your-username.github.io/repo-name`.

Either way, when you're ready for a real domain name (recommended once the site has content you're citing in grants or policy documents — see the original plan document for why), buy a `.org` or `.in` domain for roughly $8–15/year from a registrar like Namecheap or Porkbun, and attach it in your host's domain settings. Free custom-domain services (the old Freenom-style options) are no longer reliable and can hurt credibility, so this is the one place worth spending a small amount of money.

## A note on the Google Drive folders already created for you

While building this, I created the following structure in your connected Google Drive, inside the existing shared folder:

- **Field Notes in Medicine** (root)
  - **Cases** — one subfolder per case, for de-identified images/lab reports, linked from each case's `Drive Case Folder Link`
  - **Consent Forms (Private – Editors Only)** — signed consent forms; keep this folder's sharing restricted to editors, never public
  - **Backups** — for periodic exports of the case Sheet
  - **Quarterly Issue Archives** — for the optional quarterly PDF digest described in the original plan

I wasn't able to create the Tag Vocabulary Google Sheet directly in that Drive — the connected account doesn't have permission to create non-folder files there (folder creation worked; file creation, of any type, was blocked). `docs/TAG_VOCABULARY.csv` has the same content — you can create a blank Sheet in the **Field Notes in Medicine** folder yourself and use File > Import to bring that CSV in, which takes about a minute.

## Growing beyond this

If the project outgrows a single Sheet (multiple contributing sites, a larger editorial team, need for real version history), the natural next step is moving case content into Markdown files in a Git repository, still hosted free on the same platforms — see the original plan document, section 5.5.
