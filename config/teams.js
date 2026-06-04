// The 48 qualified teams — Appendix A of the spec (alphabetical).
window.TEAMS = [
  "Algeria", "Argentina", "Australia", "Austria", "Belgium",
  "Bosnia and Herzegovina", "Brazil", "Canada", "Cape Verde", "Colombia",
  "Croatia", "Curaçao", "Czechia", "DR Congo", "Ecuador",
  "Egypt", "England", "France", "Germany", "Ghana",
  "Haiti", "Iran", "Iraq", "Ivory Coast", "Japan",
  "Jordan", "Mexico", "Morocco", "Netherlands", "New Zealand",
  "Norway", "Panama", "Paraguay", "Portugal", "Qatar",
  "Saudi Arabia", "Scotland", "Senegal", "South Africa", "South Korea",
  "Spain", "Sweden", "Switzerland", "Tunisia", "Türkiye",
  "United States", "Uruguay", "Uzbekistan",
];

// The Favourites-8 (top 8 by FIFA ranking). Used for the "First favourite to be
// knocked out" pick. Re-pin from the June 9, 2026 ranking if the top 8 reshuffles.
window.FAVOURITES8 = [
  "France", "Spain", "Argentina", "England",
  "Portugal", "Brazil", "Netherlands", "Morocco",
];

// The Top-16 (by FIFA ranking) — these are EXCLUDED from the Dark Horse pool, so a
// dark horse must be a genuine outsider (ranked outside the top 16). This is the
// Favourites-8 plus the next 8 highest-ranked qualified teams. Edit the second row
// if you'd rank teams 9–16 differently; re-pin before opening Phase 1.
window.TOP16 = window.FAVOURITES8.concat([
  "Belgium", "Germany", "Croatia", "Colombia",
  "Uruguay", "United States", "Mexico", "Japan",
]);

// Derived: the 32 teams a Dark Horse can be picked from (everyone outside the top 16).
window.DARK_HORSE_POOL = window.TEAMS.filter((t) => window.TOP16.indexOf(t) === -1);
