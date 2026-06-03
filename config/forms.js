// Which form is currently open. The admin flips `open` to true/false to control
// the live link. The landing page reads this to decide where "Enter" sends people
// and to show each round's status.
//
// Forms 2 & 3 also gate on their dynamic data (survivors.js / finalists.js) — even
// if `open` is true, they stay closed until those lists are filled.
window.FORM_STATE = {
  blind_bet: {
    key: "blind_bet",
    round: "Round 1",
    name: "The Blind Bet",
    page: "blind-bet.html",
    open: true,
    status: "Open now",
    closes: "Closes June 10, 11:59 PM IST",
    blurb: "Gut calls before a ball is kicked.",
  },
  comeback: {
    key: "comeback",
    round: "Round 2",
    name: "The Comeback",
    page: "comeback.html",
    open: false,
    status: "Opens ~June 27",
    closes: "Closes before the Round of 32",
    blurb: "Group stage done, 32 teams left — your second chance.",
  },
  final_whistle: {
    key: "final_whistle",
    round: "Round 3",
    name: "Final Whistle",
    page: "final-whistle.html",
    open: false,
    status: "Opens July 18",
    closes: "Closes before the final kicks off",
    blurb: "Two teams left. All drama.",
  },
};
