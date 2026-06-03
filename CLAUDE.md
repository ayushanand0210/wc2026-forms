# CLAUDE.md — WC2026 Prediction Forms

Web forms that collect World Cup 2026 prediction-league picks from 6 friends. Three forms open at three points in the tournament; each submission is stored as a row in a Google Sheet. That is the entire job.

---

## Scope — read this first

**In scope:** build, validate, and host 3 prediction forms; persist raw responses.

**Out of scope — do NOT build in this repo:** scoring, points, partial-credit logic, Joker resolution, finalist-bonus math, tiebreakers, leaderboards, or any Excel/spreadsheet generation. **Scoring is a separate, independent project.** This repo only *collects and stores raw picks*. If a request implies adding scoring or leaderboard logic here, stop and confirm before doing it.

## Authoritative field reference

`docs/FORM_BUILD_SPEC.md` is the source of truth for every field, option list, validation rule, and output column. Do not invent or rename fields. If this file and the spec disagree: the **spec wins on field detail**; **this file wins on architecture and conventions**.

## Stack (default — keep it minimal)

- Vanilla HTML + CSS + a little JS. No SPA framework — these are 3 static pages.
- Tailwind via CDN for styling. No build step required.
- **Mobile-first, always.** Every form is opened from a WhatsApp link on a phone. Design for ~380px first, scale up after. Large tap targets, native `<select>` dropdowns.
- **Backend:** a Google Apps Script Web App that appends one row per submission to a Google Sheet. Zero infra, free, and responses land in a Sheet the admin can export to CSV for the (separate) scorer.
- **Hosting:** static pages on Vercel, Netlify, or GitHub Pages.
- Acceptable alternatives if preferred: Supabase table, or Formspree. Pick one and commit — don't mix backends.

## Project structure

```
wc2026-forms/
  CLAUDE.md
  docs/
    FORM_BUILD_SPEC.md        # field-by-field spec (drop the spec file here)
  index.html                  # landing page; links to whichever form is open
  blind-bet.html              # Form 1 — locks June 10
  comeback.html               # Form 2 — opens ~June 27
  final-whistle.html          # Form 3 — opens after semis
  config/
    teams.js                  # 48 teams + favourites8; derive nonFavourites
    players.js                # the 6 player names
    candidates.js             # Golden Boot + Golden Glove shortlists
    survivors.js              # DYNAMIC: 32 R32 teams — empty until ~June 27
    finalists.js              # DYNAMIC: 2 finalists — empty until after semis
    endpoint.js               # Apps Script Web App URL — gitignored
  shared/
    submit.js                 # POST handler → backend
    styles.css
  apps-script/
    Code.gs                   # appends submission row to the Sheet
```

Each form page must be self-contained and work even if the other two aren't built yet.

## Config / data files

- `teams.js` — the 48 qualified teams (Appendix A of the spec) and a `favourites8` array (Appendix B). Derive `nonFavourites = teams − favourites8` (40 teams). **Pin `favourites8` from the June 9, 2026 FIFA ranking** before opening Form 1.
- `players.js` — 6 player names, used by the shared Player dropdown.
- `candidates.js` — striker and keeper shortlists (Appendices C/D), each ending with an "Other" option that reveals a text field.
- `survivors.js` / `finalists.js` — admin fills these right before opening Forms 2 and 3. Until filled, those forms stay closed.

## Output schema (this is a contract)

One Google Sheet, **three tabs**, one row per submission. Column names are a contract with the downstream separate scorer — **do not rename them.**

- **`blind_bet`**: `submitted_at, player, f1_champion, f1_runnerup, f1_third, f1_boot, f1_boot_other, f1_glove, f1_glove_other, f1_darkhorse, f1_firstout, f1_totalgoals, f1_joker`
- **`comeback`**: `submitted_at, player, f2_semis, f2_boot_swap, f2_boot_swap_other, f2_joker`
- **`final_whistle`**: `submitted_at, player, f3_winner, f3_score_a, f3_score_b`

`f2_semis` is a comma-separated list of exactly 4 team names. `submitted_at` is an ISO timestamp set server-side.

## Critical client-side validation (enforce, don't just hint)

- Podium picks (`champion`, `runnerup`, `third`) must be **3 distinct teams**.
- **Dark Horse** dropdown = `nonFavourites` only (40 teams). **First-Out** dropdown = `favourites8` only (8 teams).
- **Semi-finalists: exactly 4** selections — block submit otherwise.
- "Other" text fields appear only when "Other" is selected, and are required when shown.
- **Joker: exactly one** selection (Form 1 and Form 2 only; Form 3 has no Joker).
- Total goals: integer, 0–400.

## Admin workflow

1. Deploy. Pin `favourites8` (June 9 ranking). Share the blind-bet link in the group; deadline June 10, 23:59 IST.
2. ~June 27 (group stage ends): fill `survivors.js` with the 32 surviving teams, open the comeback form.
3. After the semis: fill `finalists.js` with the 2 finalists, open the final-whistle form.
4. After the final: export the Sheet tabs to CSV and hand them to the **separate** scoring workflow.

"Open/close a form" just means controlling which link is live (a flag in `index.html`, or simply sharing/unsharing the link).

## Conventions

- No secrets committed. The Apps Script URL lives in `config/endpoint.js` (gitignored) or an injected env value.
- Dependency-light. Avoid npm unless the chosen host needs it.
- Accessible labels tied to inputs; visible focus states; tap targets ≥ 44px.
- Keep copy short and friendly — these are casual prediction forms, not paperwork.

## Commands

Define once the stack is chosen, e.g.:
- Local preview: `npx serve .`
- Deploy: `vercel` or `netlify deploy --prod`
