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

// The Favourites-8 — Appendix B (FIFA ranking). Re-pin from the June 9, 2026
// ranking before opening Form 1 if the top 8 reshuffles.
window.FAVOURITES8 = [
  "France", "Spain", "Argentina", "England",
  "Portugal", "Brazil", "Netherlands", "Morocco",
];

// Derived: the other 40 teams (Dark Horse dropdown).
window.NON_FAVOURITES = window.TEAMS.filter((t) => !window.FAVOURITES8.includes(t));
