/* Field Notes in Medicine — case detail page logic */

function col(row, key) {
  const name = CONFIG.COLUMNS[key];
  return (row[name] || "").toString().trim();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function paragraphs(text) {
  if (!text) return "<p class=\"muted\">Not recorded.</p>";
  return text.split(/\n+/).filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join("");
}

function splitMulti(value) {
  return (value || "").split(",").map(v => v.trim()).filter(Boolean);
}

async function loadAllCases() {
  const url = getCsvUrl();
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load case data (" + res.status + ")");
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return parsed.data.filter(row => col(row, "STATUS").toLowerCase() === "published");
}

function render(row) {
  const title = col(row, "TITLE") || "(untitled case)";
  document.title = `${title} — ${CONFIG.SITE_NAME}`;

  const tagChips = [
    col(row, "CASE_TYPE"), col(row, "SPECIALTY"), col(row, "AGE_GROUP"),
    col(row, "CARE_SETTING"), ...splitMulti(col(row, "SOCIAL_TAGS")),
    ...splitMulti(col(row, "DISEASE_TAGS"))
  ].filter(Boolean);

  const location = [col(row, "DISTRICT"), col(row, "STATE")].filter(Boolean).join(", ");
  const caseId = col(row, "CASE_ID");
  const year = (col(row, "PUBLISHED_DATE") || col(row, "TIMESTAMP") || "").slice(0, 4);
  const citeText = `${caseId || "Case ID pending"}. ${title}. Field Notes in Medicine, ${year || "n.d."}. ${window.location.href}`;

  document.getElementById("case-content").innerHTML = `
    <p class="back-link"><a href="index.html">&larr; Back to all cases</a></p>
    <div class="case-detail-tags">
      ${tagChips.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
    </div>
    <h1>${escapeHtml(title)}</h1>
    <p class="case-detail-meta">
      ${location ? escapeHtml(location) + " · " : ""}
      ${col(row, "OUTCOME") ? "Outcome: " + escapeHtml(col(row, "OUTCOME")) + " · " : ""}
      ${caseId ? "Case ID: " + escapeHtml(caseId) : ""}
    </p>

    <section><h2>Presenting complaint & history</h2>${paragraphs(col(row, "HISTORY"))}</section>
    <section><h2>Clinical & social context</h2>${paragraphs(col(row, "CONTEXT"))}</section>
    <section><h2>Examination & investigation findings</h2>${paragraphs(col(row, "FINDINGS"))}</section>
    <section><h2>Diagnosis</h2>${paragraphs(col(row, "DIAGNOSIS"))}</section>
    <section><h2>Management / intervention</h2>${paragraphs(col(row, "MANAGEMENT"))}</section>
    <section><h2>Outcome & follow-up</h2>${paragraphs(col(row, "FOLLOWUP"))}</section>
    <section><h2>Discussion & learning point</h2>${paragraphs(col(row, "DISCUSSION"))}</section>
    ${col(row, "PERSPECTIVE") ? `<section><h2>Patient / family perspective</h2>${paragraphs(col(row, "PERSPECTIVE"))}</section>` : ""}
    ${col(row, "MEDIA_LINK") ? `<section><h2>Images & supporting files</h2><p><a href="${escapeHtml(col(row, "MEDIA_LINK"))}" target="_blank" rel="noopener">View de-identified images / lab reports (Google Drive)</a></p></section>` : ""}

    <section class="cite-box">
      <h2>Cite this case</h2>
      <p><code>${escapeHtml(citeText)}</code></p>
      <p class="muted">Contributor: ${escapeHtml(col(row, "CONTRIBUTOR") || "Not specified")}</p>
    </section>
  `;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const contentEl = document.getElementById("case-content");
  if (!id) {
    contentEl.innerHTML = `<p class="empty-state">No case ID given. <a href="index.html">Browse all cases</a>.</p>`;
    return;
  }
  try {
    const cases = await loadAllCases();
    const row = cases.find(r => col(r, "CASE_ID") === id);
    if (!row) {
      contentEl.innerHTML = `<p class="empty-state">Case "${escapeHtml(id)}" was not found (it may be unpublished or the ID may be wrong). <a href="index.html">Browse all cases</a>.</p>`;
      return;
    }
    render(row);
  } catch (err) {
    contentEl.innerHTML = `<p class="empty-state">Could not load case data. (${escapeHtml(err.message)})</p>`;
  }
}

document.addEventListener("DOMContentLoaded", init);
