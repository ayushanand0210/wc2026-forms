// Single source of truth for the money. The pot and prizes on the landing page
// are DERIVED from these values — change the count here and everything updates.
//
// How many are playing (5–8, or whatever it ends up being):
//   • If config/players.js lists names, the count is taken from that list.
//   • Otherwise (free-text name entry, the current default) set `playerCount` below.
//
// Math, for any N: pot = entryFee × N; winner = 65% of pot; runner-up = the rest.
// With entryFee 500 every payout is a whole rupee (winner = 325·N, runner-up = 175·N).
//
// Preview tip: append ?players=8 (or ?n=8) to the landing-page URL to see any
// count's pot/prizes instantly — no edit or deploy needed. It's display-only and
// resets on a normal visit. To make a count permanent, change `playerCount` here.
window.LEAGUE = {
  currency: "₹",
  entryFee: 500,
  playerCount: 6, // ← set this before June 10 (ignored if players.js has names)
  split: { winner: 0.65, runnerUp: 0.35 }, // top-2 payout; must sum to 1
};
