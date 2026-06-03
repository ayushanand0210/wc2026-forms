// Small shared helpers used by all three form pages. No framework — just DOM.

// --- Player name (carried from the landing page) --------------------------
function getPlayerName() {
  const fromUrl = new URLSearchParams(location.search).get("name");
  if (fromUrl && fromUrl.trim()) {
    localStorage.setItem("wc2026_player", fromUrl.trim());
    return fromUrl.trim();
  }
  return (localStorage.getItem("wc2026_player") || "").trim();
}

// Forms require a name; if missing, bounce back to the landing page.
function requirePlayer() {
  const name = getPlayerName();
  if (!name) {
    location.replace("index.html");
    return "";
  }
  return name;
}

// --- DOM tiny utils -------------------------------------------------------
const $ = (sel, root = document) => root.querySelector(sel);

function fillSelect(selectEl, items, placeholder) {
  selectEl.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder || "Select…";
  ph.disabled = true;
  ph.selected = true;
  selectEl.appendChild(ph);
  items.forEach((it) => {
    const o = document.createElement("option");
    o.value = it;
    o.textContent = it;
    selectEl.appendChild(o);
  });
}

function setError(el, msg) {
  if (!el) return;
  el.textContent = msg || "";
}

// Scroll to the first invalid control and flag it.
function focusInvalid(controlEl) {
  if (!controlEl) return;
  controlEl.classList.add("bad");
  controlEl.scrollIntoView({ behavior: "smooth", block: "center" });
  if (typeof controlEl.focus === "function") {
    try { controlEl.focus({ preventScroll: true }); } catch (e) { controlEl.focus(); }
  }
}

function clearBad(root = document) {
  root.querySelectorAll(".bad").forEach((n) => n.classList.remove("bad"));
}

// --- Success screen -------------------------------------------------------
function showSuccess({ player, round, summaryHtml, mode }) {
  const note =
    mode === "local"
      ? `<p class="muted" style="font-size:13px;margin-top:14px">Saved locally on this device. (No Sheet endpoint is configured yet — the admin can wire it up so picks land in the shared sheet.)</p>`
      : `<p class="muted" style="font-size:13px;margin-top:14px">Your picks are in. You can close this page.</p>`;
  document.body.innerHTML = `
    <div class="wrap">
      <div class="card success">
        <div class="tick">✅</div>
        <h1 class="h1" style="font-size:26px;margin-top:10px">Locked in, ${escapeHtml(player)}!</h1>
        <p class="lede" style="margin-top:6px">${escapeHtml(round)} — your bet is placed.</p>
        ${summaryHtml ? `<div style="text-align:left;margin-top:18px">${summaryHtml}</div>` : ""}
        ${note}
        <a class="btn btn-ghost" style="margin-top:18px;text-decoration:none" href="index.html">← Back to the league</a>
      </div>
      <p class="foot">May the best gut win. ⚽</p>
    </div>`;
  window.scrollTo(0, 0);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// --- League terms (from config/league.js) ----------------------------------
// Entry fee, split percentages, and minimum players — shown on the landing page.
// No pot amount (it depends on how many register); we show the rules instead.
function leagueInfo() {
  const L = window.LEAGUE || {};
  const cur = L.currency || "₹";
  const fee = L.entryFee != null ? L.entryFee : 500;
  const wp = (L.split && L.split.winner != null) ? L.split.winner : 0.65;
  const rp = (L.split && L.split.runnerUp != null) ? L.split.runnerUp : 1 - wp;
  const pct = (x) => Math.round(x * 100) + "%";
  return {
    currency: cur,
    fee,
    feeLabel: cur + Number(fee).toLocaleString("en-IN"),
    winnerPct: pct(wp),
    runnerPct: pct(rp),
    minPlayers: L.minPlayers != null ? L.minPlayers : 5,
  };
}

// Build a "you picked" summary table from [label, value] pairs.
function summaryTable(rows) {
  const body = rows
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `<tr><td class="muted">${escapeHtml(k)}</td><td style="text-align:right;font-weight:600">${escapeHtml(v)}</td></tr>`)
    .join("");
  return `<table class="scoretable">${body}</table>`;
}

// --- Closed / not-open-yet screen (Forms 2 & 3 before their data is filled) ---
function showClosed({ round, name, status, blurb }) {
  document.body.innerHTML = `
    <div class="wrap">
      <div class="card" style="text-align:center">
        <div class="closed-emoji">🔒</div>
        <p class="eyebrow" style="margin-top:8px">${escapeHtml(round)}</p>
        <h1 class="h1" style="font-size:26px">${escapeHtml(name)}</h1>
        <p class="lede" style="margin-top:8px">${escapeHtml(blurb || "")}</p>
        <div class="chips" style="justify-content:center;margin-top:16px"><span class="chip">${escapeHtml(status)}</span></div>
        <a class="btn btn-ghost" style="margin-top:20px;text-decoration:none" href="index.html">← Back to the league</a>
      </div>
    </div>`;
}

window.WC = { getPlayerName, requirePlayer, $, fillSelect, setError, focusInvalid, clearBad, showSuccess, showClosed, summaryTable, escapeHtml, leagueInfo };
