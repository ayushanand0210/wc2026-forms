/**
 * WC2026 Prediction Forms — Google Apps Script backend (column-per-player layout).
 *
 * Each phase is its own tab. Inside a tab:
 *   • Column A = the pick labels (Champion, Runner-up, …)  [frozen]
 *   • Row 1    = player names across the top                [frozen]
 *   • Each player gets ONE column; re-submitting updates that same column in place.
 *
 * This is a human-readable view (friends can scan name-by-name). It deviates from
 * the original row-per-submission spec on purpose — for a friends-facing sheet.
 *
 * ── First-time setup ───────────────────────────────────────────────────────────
 *   1. Paste this whole file over the old Code.gs, then Save (💾).
 *   2. In the toolbar, pick the function `setup` from the dropdown and click ▶ Run.
 *      (Authorize again if asked.) This creates the three phase tabs and removes
 *      the default "Sheet1" + any old row-format tabs.
 *   3. Deploy → Manage deployments → ✏️ edit → Version: New version → Deploy.
 *      (Keeps the same /exec URL, so the website needs no change.)
 *   4. Submit once on the live form to see your column appear.
 */

var LAYOUTS = {
  blind_bet: {
    tab: "Bet (Phase 1)",
    rows: [
      { label: "Submitted", key: "submitted_at" },
      { label: "🏆 Champion", key: "f1_champion" },
      { label: "🥈 Runner-up", key: "f1_runnerup" },
      { label: "🥉 Third place", key: "f1_third" },
      { label: "⚽ Golden Boot", key: "f1_boot", other: "f1_boot_other" },
      { label: "🧤 Golden Glove", key: "f1_glove", other: "f1_glove_other" },
      { label: "🐴 Dark Horse", key: "f1_darkhorse" },
      { label: "💥 First favourite out", key: "f1_firstout" },
      { label: "🔢 Total goals", key: "f1_totalgoals" },
      { label: "🃏 Joker", key: "f1_joker" },
    ],
  },
  comeback: {
    tab: "Bet (Phase 2)",
    rows: [
      { label: "Submitted", key: "submitted_at" },
      { label: "Semi-finalists", key: "f2_semis" },
      { label: "⚽ Golden Boot swap", key: "f2_boot_swap", other: "f2_boot_swap_other" },
      { label: "🃏 Joker", key: "f2_joker" },
    ],
  },
  final_whistle: {
    tab: "Bet (Phase 3)",
    rows: [
      { label: "Submitted", key: "submitted_at" },
      { label: "🏆 Final winner", key: "f3_winner" },
      { label: "🔢 Predicted score", key: "__score" },
    ],
  },
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise writes so concurrent submits don't collide
  try {
    var data = JSON.parse(e.postData.contents);
    var layout = LAYOUTS[data.form];
    if (!layout) throw new Error("Unknown form: " + data.form);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(layout.tab) || ss.insertSheet(layout.tab);
    ensureLabels_(sheet, layout);

    // Build this player's column of values, aligned to the label rows.
    var tz = Session.getScriptTimeZone();
    var stamp = Utilities.formatDate(new Date(), tz, "dd MMM, HH:mm");
    var values = layout.rows.map(function (r) { return [displayValue_(r, data, stamp)]; });

    // Find the player's existing column (row 1), or use the next free column.
    var player = String(data.player || "(no name)").trim();
    var lastCol = Math.max(1, sheet.getLastColumn());
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var targetCol = -1;
    for (var c = 1; c < headers.length; c++) { // skip column A (labels)
      if (String(headers[c]).trim() === player) { targetCol = c + 1; break; }
    }
    if (targetCol === -1) targetCol = Math.max(2, lastCol + 1);

    sheet.getRange(1, targetCol).setValue(player).setFontWeight("bold");
    sheet.getRange(2, targetCol, values.length, 1).setValues(values);
    sheet.setColumnWidth(targetCol, 160);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("WC2026 forms endpoint is live.");
}

/** Run this once from the editor to (re)build tabs and clean up old ones. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Create / refresh the three phase tabs with their label columns.
  Object.keys(LAYOUTS).forEach(function (k) {
    var layout = LAYOUTS[k];
    var sheet = ss.getSheetByName(layout.tab) || ss.insertSheet(layout.tab);
    ensureLabels_(sheet, layout);
  });
  // Remove the default sheet and any leftover row-format tabs (test data only).
  ["Sheet1", "Sheet 1", "blind_bet", "comeback", "final_whistle"].forEach(function (name) {
    var s = ss.getSheetByName(name);
    if (s && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
}

// ── helpers ──────────────────────────────────────────────────────────────────

function ensureLabels_(sheet, layout) {
  sheet.getRange(1, 1).setValue("Pick \\ Player").setFontWeight("bold").setBackground("#f1f3f4");
  var labels = layout.rows.map(function (r) { return [r.label]; });
  sheet.getRange(2, 1, labels.length, 1).setValues(labels).setFontWeight("bold");
  sheet.setColumnWidth(1, 190);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
}

function displayValue_(r, data, stamp) {
  if (r.key === "submitted_at") return stamp;
  if (r.key === "__score") return val_(data.f3_score_a) + " – " + val_(data.f3_score_b);
  if (r.other && String(data[r.key]) === "Other") return val_(data[r.other]);
  return val_(data[r.key]);
}

function val_(x) { return (x === undefined || x === null) ? "" : x; }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
