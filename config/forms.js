// Which form is currently open. The admin flips `open` to true/false to control
// the live link. The landing page reads this to decide where "Enter" sends people
// and each form page reads its own status for the "not open yet" screen.
//
// Forms 2 & 3 also gate on their dynamic data (survivors.js / finalists.js) — even
// if `open` is true, they stay closed until those lists are filled.
window.FORM_STATE = {
  blind_bet: {
    key: "blind_bet",
    round: "WMC Prediction League",
    name: "Phase 1",
    page: "blind-bet.html",
    open: true,
    status: "Open now",
    closes: "Closes June 10, 11:59 PM IST",
    blurb: "Pick the champion, podium, Golden Boot, Golden Glove, a dark horse, the first favourite out, and total goals.",
  },
  comeback: {
    key: "comeback",
    round: "WMC Prediction League",
    name: "Phase 2",
    page: "comeback.html",
    open: false,
    status: "Opens ~June 27",
    closes: "Closes before the Round of 32",
    blurb: "After the group stage, pick your 4 semi-finalists.",
  },
  final_whistle: {
    key: "final_whistle",
    round: "WMC Prediction League",
    name: "Phase 3",
    page: "final-whistle.html",
    open: false,
    status: "Opens July 18",
    closes: "Closes before the final",
    blurb: "Before the final, pick the winner and the exact score.",
  },
};
