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
- **The preflight checks.** The four refusals as arithmetic, in
  `lib/coach/preflight.ts`. A brief with no read date, no numeric guardrail
  boundary, an underived target, or a metric the weekly volume cannot power
  inside the planned window is refused before any model is called. The power
  check shows its working so the reader can check it.
- **The objection engine**, in `lib/coach/review.ts` and `POST /api/review`.
  Structured output against a schema, the whole history in a cached prefix,
  citations dropped if they do not resolve to a real experiment. Written and
  typechecked but not yet run against a live key, so treat it as unproven until
  the first real review lands.
- **CI and deployment.** GitHub Actions runs typecheck, the corpus check and a
  full build on every push. `/api/health` reports whether a deployment has its
  keys. See [deploy.md](deploy.md).

## Not built yet

- **The UI is still on a timer.** `app/page.tsx` renders a fixed brief and a
  canned objection. Nothing on screen calls `/api/review` yet, and the brief
  is not editable.
- **The ledger.** Nothing is persisted, so nothing can be scored. Every figure
  on the track-record panel is hardcoded in the page.
- **The backtest.** The as-of filter exists. The runner over it does not.
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
