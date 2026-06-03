// Landing-page league terms (single source of truth). The split %, entry fee, and
// minimum players are shown at the top of the landing page. No pot amount is
// advertised — the pot depends on how many people register, so we show the rules,
// not a number. Change any value here and the landing page updates on next deploy.
window.LEAGUE = {
  currency: "₹",
  entryFee: 500,
  minPlayers: 5,
  split: { winner: 0.65, runnerUp: 0.35 }, // top-2 payout; must sum to 1
};
