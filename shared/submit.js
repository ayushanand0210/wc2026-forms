// Sends one submission to the backend (Google Apps Script Web App) and always
// keeps a local copy as a safety net.
//
// Apps Script web apps can't set CORS headers, so we POST with mode:"no-cors"
// (fire-and-forget). The row still lands in the Sheet; we just can't read the
// response, so we treat a completed request as success. Good enough for 6 friends.

async function submitPicks(payload) {
  // 1) Always stash a local copy first (survives a flaky network / bad endpoint).
  try {
    const key = "wc2026_submissions";
    const all = JSON.parse(localStorage.getItem(key) || "[]");
    all.push({ ...payload, _savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(all));
  } catch (e) {
    /* localStorage unavailable — ignore */
  }

  const endpoint = (window.SUBMIT_ENDPOINT || "").trim();
  if (!endpoint) {
    // No backend wired yet — testing mode.
    return { ok: true, mode: "local" };
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { ok: true, mode: "remote" };
  } catch (e) {
    // Network failed, but we have the local copy. Surface it so the admin can recover.
    return { ok: false, mode: "error", error: String(e) };
  }
}

window.submitPicks = submitPicks;
