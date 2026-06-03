# WC2026 Prediction League — Form Build Spec

A build spec for the prediction forms. Three separate forms open at three points in the tournament. This doc defines every field, its type, options, validation, and the output data schema so responses feed cleanly into the scoring sheet.

---

## 1. Implementation notes (for whoever builds it)

- **Three independent forms**, opened/closed manually by the admin:
  - **Form 1 — The Blind Bet** → opens now, closes **June 10, 23:59 IST**
  - **Form 2 — The Comeback** → opens when group stage ends (~June 27), closes before Round of 32 kicks off (June 28)
  - **Form 3 — Final Whistle** → opens after semis, closes before the final (July 18)
- **Stack-agnostic.** A single static HTML page per form posting to a Google Sheet (via Apps Script or Formspree) and deployed on Vercel/Netlify/GitHub Pages is enough. No auth needed — it's 6 trusted people.
- **One shared identity field** on every form (player name dropdown) so the three forms can be joined per player during scoring. Keep the name strings identical across all forms.
- **Output = one row per submission.** Column names are defined per form below; match them exactly so the scoring sheet can ingest without remapping.
- **Form 2 and Form 3 have dynamic options** (the surviving teams / the two finalists). Those option lists must be updated by the admin before each form opens — placeholders are marked `[DYNAMIC]` below.

---

## 2. Shared field (all three forms)

| Field | Type | Options / Validation | Output column |
|---|---|---|---|
| Player | Single-select dropdown | The 6 player names (admin fills) | `player` |

Required on every form. No free text — fixed dropdown so names match across forms.

---

## 3. Form 1 — The Blind Bet

Locks by June 10. All dropdowns except the goals number. Should take under a minute.

| # | Question | Type | Options | Required | Output column |
|---|---|---|---|---|---|
| 1 | 🏆 Champion | single-select | 48 teams (Appendix A) | yes | `f1_champion` |
| 2 | 🥈 Runner-up | single-select | 48 teams | yes | `f1_runnerup` |
| 3 | 🥉 Third place | single-select | 48 teams | yes | `f1_third` |
| 4 | ⚽ Golden Boot (top scorer) | single-select | Striker shortlist (Appendix C) + "Other" | yes | `f1_boot` |
| 4b | If "Other", type player name | short text | shown only if Q4 = Other | conditional | `f1_boot_other` |
| 5 | 🧤 Golden Glove (best keeper) | single-select | Keeper shortlist (Appendix D) + "Other" | yes | `f1_glove` |
| 5b | If "Other", type keeper name | short text | shown only if Q5 = Other | conditional | `f1_glove_other` |
| 6 | 🐴 Dark Horse (reaches QF) | single-select | 40 teams = 48 minus the Favourites-8 (Appendix B) | yes | `f1_darkhorse` |
| 7 | 💥 First Favourite to crash out | single-select | The Favourites-8 only (Appendix B) | yes | `f1_firstout` |
| 8 | 🔢 Total goals in tournament | number | integer, min 0, max 400 | yes | `f1_totalgoals` |
| 9 | 🃏 Joker — double one pick | single-select | "Champion", "Runner-up", "Third", "Golden Boot", "Golden Glove", "Dark Horse", "First Out" | yes | `f1_joker` |

**Validation rules**
- Q1, Q2, Q3 must be three *different* teams (block duplicate podium picks).
- Q6 (Dark Horse) options must exclude the Favourites-8 — the dropdown is the other 40 teams only.
- Q7 (First Out) options are the Favourites-8 only.
- Q9 Joker: exactly one selection.

---

## 4. Form 2 — The Comeback

Opens ~June 27 once the 32 Round-of-32 teams are known. The semifinalist picks carry a finalist bonus automatically (no separate finalist question — the bonus is computed from these 4 picks during scoring).

| # | Question | Type | Options | Required | Output column |
|---|---|---|---|---|---|
| 1 | Pick your 4 semi-finalists | multi-select, **exactly 4** | `[DYNAMIC]` 32 surviving teams | yes | `f2_semis` (comma-separated) |
| 2 | Swap your Golden Boot pick? (optional) | single-select | Striker shortlist + "Keep my Round 1 pick" + "Other" | no (defaults to keep) | `f2_boot_swap` |
| 2b | If "Other", type player name | short text | shown only if Q2 = Other | conditional | `f2_boot_swap_other` |
| 3 | 🃏 Joker — double one semi-finalist pick | single-select | the 4 teams chosen in Q1 (or "None") | yes | `f2_joker` |

**Validation rules**
- Q1 must have exactly 4 selections — no more, no less.
- Q2 default = "Keep my Round 1 pick"; a swap *replaces* the Round 1 boot pick for final scoring (no extra points, just updates which pick is live).
- Q3 Joker applies only to one of the 4 semifinalist selections.

---

## 5. Form 3 — Final Whistle

Opens after the semis, once the two finalists are known. Two taps.

| # | Question | Type | Options | Required | Output column |
|---|---|---|---|---|---|
| 1 | Winner of the final | single-select | `[DYNAMIC]` the 2 finalists | yes | `f3_winner` |
| 2 | Predicted score — [Finalist A] | number | integer 0–15 | yes | `f3_score_a` |
| 3 | Predicted score — [Finalist B] | number | integer 0–15 | yes | `f3_score_b` |

(Finalist A / B labels filled dynamically with the two team names.)

---

## 6. Scoring reference (for the sheet, not the form)

The form only collects picks. Scoring is applied later in the sheet. Recorded here so the builder understands what the data feeds into.

| Pick | Exact | Partial |
|---|---|---|
| Champion | 25 | 8 (finishes 2nd/3rd) |
| Runner-up | 12 | 5 (finishes 1st/3rd) |
| Third | 8 | 3 (finishes 1st/2nd) |
| Golden Boot | 10 | — |
| Golden Glove | 6 | — |
| Dark Horse → QF | 8 | — |
| First Favourite out | 6 | — |
| Each correct semi-finalist | 6 (max 24) | — |
| Semi-finalist who reaches final | +5 each (max 10) | — |
| Final winner | 8 | — |
| Exact final scoreline | 6 | — |
| Total goals | tiebreaker only | — |

**Joker:** doubles the points of the one selected pick if it hits. No penalty if it misses. Applies in Form 1 and Form 2 only.

---

## Appendix A — The 48 qualified teams (full draw)

| Group | Teams |
|---|---|
| A | Mexico, South Africa, South Korea, Czechia |
| B | Canada, Bosnia and Herzegovina, Qatar, Switzerland |
| C | Brazil, Morocco, Haiti, Scotland |
| D | United States, Paraguay, Australia, Türkiye |
| E | Germany, Curaçao, Ivory Coast, Ecuador |
| F | Netherlands, Japan, Sweden, Tunisia |
| G | Belgium, Egypt, Iran, New Zealand |
| H | Spain, Cape Verde, Saudi Arabia, Uruguay |
| I | France, Senegal, Iraq, Norway |
| J | Argentina, Algeria, Austria, Jordan |
| K | Portugal, DR Congo, Uzbekistan, Colombia |
| L | England, Croatia, Ghana, Panama |

Flat list for the team dropdowns (alphabetical):
Algeria, Argentina, Australia, Austria, Belgium, Bosnia and Herzegovina, Brazil, Canada, Cape Verde, Colombia, Croatia, Curaçao, Czechia, DR Congo, Ecuador, Egypt, England, France, Germany, Ghana, Haiti, Iran, Iraq, Ivory Coast, Japan, Jordan, Mexico, Morocco, Netherlands, New Zealand, Norway, Panama, Paraguay, Portugal, Qatar, Saudi Arabia, Scotland, Senegal, South Africa, South Korea, Spain, Sweden, Switzerland, Tunisia, Türkiye, United States, Uruguay, Uzbekistan.

## Appendix B — Favourites-8 (FIFA ranking, April 1 2026)

France, Spain, Argentina, England, Portugal, Brazil, Netherlands, Morocco.

> Pin the final list on June 9, 2026 off the last pre-tournament ranking update, in case the top 8 reshuffles. Dark Horse dropdown = the other 40 teams. First-Out dropdown = these 8.

## Appendix C — Golden Boot shortlist (starter — edit freely)

Kylian Mbappé (France), Lamine Yamal (Spain), Harry Kane (England), Erling Haaland (Norway), Vinícius Júnior (Brazil), Raphinha (Brazil), Lionel Messi (Argentina), Julián Álvarez (Argentina), Lautaro Martínez (Argentina), Cristiano Ronaldo (Portugal), Cody Gakpo (Netherlands), Memphis Depay (Netherlands), Viktor Gyökeres (Sweden), Romelu Lukaku (Belgium), Mohamed Salah (Egypt), Youssef En-Nesyri (Morocco), Darwin Núñez (Uruguay), Son Heung-min (South Korea), Kane / striker of your choice… + **Other (type name)**.

## Appendix D — Golden Glove shortlist (starter — edit freely)

Emiliano Martínez (Argentina), Mike Maignan (France), Unai Simón (Spain), Jordan Pickford (England), Diogo Costa (Portugal), Alisson (Brazil), Bart Verbruggen (Netherlands), Yassine Bounou (Morocco), Thibaut Courtois (Belgium) + **Other (type name)**.

> Player shortlists are convenience only — confirm against final squads closer to kickoff. "Other" free-text is the safety net, but flag those for manual cleanup at scoring time since they'll be unstructured.
