/* Field Notes in Medicine — home/browse page logic */

const state = {
  allCases: [],
  filters: {
    "Case Type": new Set(),
    "Specialty": new Set(),
    "Age Group": new Set(),
    "Care Setting": new Set(),
    "Social Determinant Tags": new Set(),
    "Outcome": new Set()
  },
  search: ""
};

function col(row, key) {
  const name = CONFIG.COLUMNS[key];
  return (row[name] || "").toString().trim();
}

function splitMulti(value) {
  return value.split(",").map(v => v.trim()).filter(Boolean);
}

async function loadCases() {
  const url = getCsvUrl();
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load case data (" + res.status + ")");
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return parsed.data.filter(row => col(row, "STATUS").toLowerCase() === "published");
}

function matchesFilters(row) {
  for (const category of Object.keys(state.filters)) {
    const chosen = state.filters[category];
    if (chosen.size === 0) continue;
    const rowKey = category === "Case Type" ? "CASE_TYPE"
      : category === "Specialty" ? "SPECIALTY"
      : category === "Age Group" ? "AGE_GROUP"
      : category === "Care Setting" ? "CARE_SETTING"
      : category === "Social Determinant Tags" ? "SOCIAL_TAGS"
      : "OUTCOME";
    const rowValues = category === "Social Determinant Tags"
      ? splitMulti(col(row, rowKey))
      : [col(row, rowKey)];
    const overlap = rowValues.some(v => chosen.has(v));
    if (!overlap) return false;
  }
  if (state.search.trim() !== "") {
    const q = state.search.trim().toLowerCase();
    const haystack = [
      col(row, "TITLE"), col(row, "DISEASE_TAGS"), col(row, "DISCUSSION"),
      col(row, "STATE"), col(row, "DISTRICT"), col(row, "CASE_ID")
    ].join(" ").toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function renderFilterSidebar() {
  const container = document.getElementById("filters");
  container.innerHTML = "";
  for (const category of Object.keys(CONFIG.TAG_VOCAB)) {
    const group = document.createElement("div");
    group.className = "filter-group";
    const heading = document.createElement("h3");
    heading.textContent = category;
    group.appendChild(heading);
    CONFIG.TAG_VOCAB[category].forEach(value => {
      const id = `filter-${category}-${value}`.replace(/\s+/g, "-");
      const label = document.createElement("label");
      label.className = "filter-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) state.filters[category].add(value);
        else state.filters[category].delete(value);
        renderResults();
      });
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + value));
      group.appendChild(label);
    });
    container.appendChild(group);
  }
}

function caseTypeSlot(type) {
  const order = CONFIG.TAG_VOCAB["Case Type"];
  const i = order.indexOf(type);
  return i === -1 ? null : (i % 5) + 1;
}

function outcomeStatus(outcome) {
  if (outcome === "Recovered") return "good";
  if (outcome === "Died") return "critical";
  if (outcome === "Lost to follow-up") return "serious";
  return null; // Referred / Ongoing — neutral, no status color
}

function cardHtml(row) {
  const title = col(row, "TITLE") || "(untitled case)";
  const caseId = col(row, "CASE_ID");
  const type = col(row, "CASE_TYPE");
  const specialty = col(row, "SPECIALTY");
  const state_ = col(row, "STATE");
  const district = col(row, "DISTRICT");
  const outcome = col(row, "OUTCOME");
  const snippet = col(row, "DISCUSSION") || col(row, "HISTORY");
  const tags = splitMulti(col(row, "DISEASE_TAGS"));
  const location = [district, state_].filter(Boolean).join(", ");
  const typeSlot = caseTypeSlot(type);
  const status = outcomeStatus(outcome);

  return `
    <a class="case-card" href="case.html?id=${encodeURIComponent(caseId)}">
      <div class="case-card-badges">
        ${type ? `<span class="badge badge-type"${typeSlot ? ` data-cat="${typeSlot}"` : ""}>${escapeHtml(type)}</span>` : ""}
        ${specialty ? `<span class="badge">${escapeHtml(specialty)}</span>` : ""}
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p class="case-card-snippet">${escapeHtml(truncate(snippet, 160))}</p>
      <div class="case-card-tags">
        ${tags.slice(0, 4).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="case-card-meta">
        <span>${escapeHtml(location || "Location not specified")}</span>
        ${outcome ? `<span class="badge badge-outcome"${status ? ` data-status="${status}"` : ""}>${escapeHtml(outcome)}</span>` : ""}
        ${caseId ? `<span class="case-id">${escapeHtml(caseId)}</span>` : ""}
      </div>
    </a>`;
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n).trim() + "…" : str;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderResults() {
  const grid = document.getElementById("case-grid");
  const countEl = document.getElementById("result-count");
  const filtered = state.allCases.filter(matchesFilters);
  countEl.textContent = `${filtered.length} case${filtered.length === 1 ? "" : "s"}`;
  grid.innerHTML = filtered.length
    ? filtered.map(cardHtml).join("")
    : `<p class="empty-state">No cases match these filters yet.</p>`;
}

async function init() {
  renderFilterSidebar();
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    renderResults();
  });
  document.getElementById("clear-filters").addEventListener("click", () => {
    Object.values(state.filters).forEach(s => s.clear());
    state.search = "";
    searchInput.value = "";
    document.querySelectorAll("#filters input[type=checkbox]").forEach(cb => cb.checked = false);
    renderResults();
  });

  const statusEl = document.getElementById("load-status");
  try {
    state.allCases = await loadCases();
    statusEl.remove();
    renderResults();
  } catch (err) {
    statusEl.textContent = "Could not load case data. Check your SHEET_ID / sharing settings in js/config.js. (" + err.message + ")";
    statusEl.classList.add("error");
  }
}

document.addEventListener("DOMContentLoaded", init);
