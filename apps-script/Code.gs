/**
 * WC2026 Prediction Forms — Google Apps Script backend.
 *
 * Receives one submission (JSON) per POST and appends it as a row to the matching
 * tab of the bound Google Sheet. Column order is the contract from CLAUDE.md — do
 * not rename. Tabs and header rows are created automatically on first use.
 *
 * SETUP (5 min):
 *   1. Create a new Google Sheet.
 *   2. Extensions → Apps Script. Delete the sample, paste this whole file, Save.
 *   3. Deploy → New deployment → type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Deploy, authorise, and COPY the Web app URL (ends in /exec).
 *   4. Paste that URL into config/endpoint.js in the site.
 *   To update the script later: Deploy → Manage deployments → edit → New version.
 */

var TABS = {
  blind_bet: [
    "submitted_at", "player", "f1_champion", "f1_runnerup", "f1_third",
    "f1_boot", "f1_boot_other", "f1_glove", "f1_glove_other",
    "f1_darkhorse", "f1_firstout", "f1_totalgoals", "f1_joker",
  ],
  comeback: [
    "submitted_at", "player", "f2_semis", "f2_boot_swap", "f2_boot_swap_other", "f2_joker",
  ],
  final_whistle: [
    "submitted_at", "player", "f3_winner", "f3_score_a", "f3_score_b",
  ],
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialise appends so concurrent submits don't collide
  try {
    var data = JSON.parse(e.postData.contents);
    var form = data.form;
    var cols = TABS[form];
    if (!cols) throw new Error("Unknown form: " + form);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(form);
    if (!sheet) {
      sheet = ss.insertSheet(form);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(cols);
    }

    var now = new Date().toISOString();
    var row = cols.map(function (c) {
      if (c === "submitted_at") return now;
      return data[c] !== undefined && data[c] !== null ? data[c] : "";
    });
    sheet.appendRow(row);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("WC2026 forms endpoint is live.");
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
