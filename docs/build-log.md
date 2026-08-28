# Build log: what actually works

An honest record of the app's state, so the README never overclaims. The
coaches in `skills/` are complete and in daily use; this file is about the app.

## Works today

- **The review screen.** Two-column workspace, dark theme, responsive down to
  the 800px breakpoint. Currently renders a fixed brief.
- **The experiment history.** 50 completed experiments for Ledgerline in
  `lib/data/corpus.ts`, spanning Jan 2024 to Aug 2026, with hypotheses in the
  team's own words, expected and actual lifts in percentage points, and read
  dates. Outcomes were assigned from a rule that is documented in the file and
  never placed in a prompt.
- **`experimentsAsOf(date)`** is the as-of filter the backtest depends on. A
  backtest that lets the coach see experiments that read out after the brief
  under review is not measuring anything.
- **`node scripts/check-corpus.mjs`** recomputes the separation the corpus
  claims, so the numbers in the header comment are checked rather than trusted.

## Not built yet

- **The objection engine.** The Review button still resolves on a timer. There
  is no model call, no API route, no key in play.
- **The ledger.** Nothing is persisted, so nothing can be scored. Every figure
  on the track-record panel is currently hardcoded in the page.
- **The backtest.** The as-of filter exists; the runner over it does not.
- **Webhook resolution.** No receiver, no signature check.
- **Evals.** No golden dataset, no judges.

## Deliberately not built

**Act three, the coach proposing experiments on its own.** A track record is
what earns the right to propose. Building the proposal loop before the
scoreboard has anything in it would invert the argument the product rests on,
so the UI will show it as locked with the reason on screen rather than shipping
a version of it.

**Document generation.** The coach teaches inside a live decision and does not
produce a polished artifact on request. It will be worse at writing a brief
than a tool that does nothing else, and that is the choice.
