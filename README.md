# 🏆 WC2026 Prediction League — Forms

Three mobile-first web forms that collect World Cup 2026 prediction picks from 6
friends. A clean landing page explains the league, players type their name, and the
round's form opens. Each submission is appended as a row to a Google Sheet, ready to
export for the (separate) scoring workflow.

**Stack:** plain HTML/CSS/JS · Google Apps Script → Google Sheet · static hosting.
No build step, no framework, no npm.

---

## What's here

```
index.html          Landing page — instructions + name entry
blind-bet.html      Round 1 form (open now → June 10)
comeback.html       Round 2 form (gated until survivors.js is filled, ~June 27)
final-whistle.html  Round 3 form (gated until finalists.js is filled, after semis)
config/             The data the forms render + the admin's open/close switches
shared/             styles.css, submit.js, form-helpers.js
apps-script/Code.gs  The Google Sheet backend
docs/               The original field spec
```

---

## Run it locally

It's static — just open `index.html`, or serve the folder:

```bash
cd wc2026-forms
python3 -m http.server 8000     # then visit http://localhost:8000
# or:  npx serve .
```

Without a Sheet endpoint configured, submissions save to the browser only (a
"saved locally" note shows on the success screen). Wire up the Sheet below to go live.

---

## Step 1 — Wire up the Google Sheet (~5 min)

1. Create a new **Google Sheet** (any name).
2. **Extensions → Apps Script.** Delete the sample code, paste all of
   `apps-script/Code.gs`, and **Save**.
3. **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - **Deploy**, authorise the permissions prompt, and **copy the Web app URL**
     (it ends in `/exec`).
4. Open `config/endpoint.js` and paste the URL:
   ```js
   window.SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
   ```

That's it — submissions now append to your Sheet (one tab per form, created
automatically: `blind_bet`, `comeback`, `final_whistle`).

> Updating the script later? **Deploy → Manage deployments → edit (✏️) → New version.**
> Reusing the same deployment keeps the URL stable.

---

## Step 2 — Host it for free

Pick **one**. All three are free and the site is plain static files.

- **Netlify Drop (easiest, no account needed to try):** go to
  [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `wc2026-forms`
  folder onto the page. You get a live URL instantly. Create a free account to keep it.
- **GitHub Pages:** push this folder to a GitHub repo → repo **Settings → Pages** →
  Source = `main` branch, `/root` → save. Live at `https://<user>.github.io/<repo>/`.
- **Vercel:** `npm i -g vercel` then `vercel` in this folder (or import the repo on
  vercel.com). Accept defaults — no framework, no build command.

Share the resulting link in the WhatsApp group.

---

## Step 3 — Admin workflow through the tournament

1. **Before June 10:** confirm `config/teams.js` `FAVOURITES8` against the June 9 FIFA
   ranking. Share the link. Round 1 is open.
2. **~June 27** (group stage ends): fill `config/survivors.js` with the 32 surviving
   teams, set `comeback.open = true` in `config/forms.js`, redeploy/re-upload. The
   Comeback form unlocks.
3. **After the semis:** fill `config/finalists.js` with the 2 finalists, set
   `final_whistle.open = true`, redeploy. The Final Whistle form unlocks.
4. **After the final:** in the Sheet, export each tab to CSV and hand them to the
   **separate** scoring workflow.

"Opening/closing a form" = flipping the `open` flag in `config/forms.js` (and, for
Rounds 2 & 3, filling the dynamic team list). Until then, those pages show a friendly
"not open yet" screen.

---

## Tweaks you might want

- **Lock names to a dropdown** (prevents typos, keeps names matching across rounds):
  put the 6 names in `config/players.js` → the landing page name box becomes a
  dropdown automatically.
- **Edit the player shortlists:** `config/candidates.js` (strikers / keepers).
- **Re-pin favourites:** `config/teams.js` → `FAVOURITES8`. `NON_FAVOURITES`
  (the Dark Horse list) is derived automatically.

---

## Scope note

This repo **only collects and stores raw picks.** Scoring, points, partial-credit,
Joker resolution, finalist bonuses, tiebreakers, and the leaderboard are a **separate,
independent project** (see `CLAUDE.md`). The Sheet's column names are a contract with
that downstream scorer — don't rename them.
