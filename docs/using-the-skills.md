# Using the skills: a coaching staff for real product challenges

The skills are not report generators. Each one is a **coach**: it takes a real challenge from a real product, interviews you for the facts it needs, applies the frameworks by name, pushes back where the thinking is soft, and leaves a written artifact behind in your repo. You bring the product and the honesty; the coach brings the method.

## Getting started

1. Install once: run `bash setup` from the product-coach repo. Every skill is then available in any Claude Code session as `/skill-name`.
2. In the repo of the product you're working on, start with `/product-init`. It scaffolds a `product/` directory. That directory is the shared memory all coaches read and write, so your strategy, bets, and experiment results accumulate in one place instead of in chat scrollback.
3. Invoke a coach with a real situation, not an abstract question. "Our trial conversion has been flat at 2% for a year and marketing wants more ad budget" gets you a diagnosis; "tell me about growth loops" gets you a lecture you could have read anywhere.

## What a session with a coach looks like

Take `/growth-bet` as the example; they all follow the same shape:

1. **It asks before it advises.** Expect questions: which numbers refuse to move, over what period, what already got tried. Have data handy (exports, dashboard numbers with time ranges). A coach given no data will ask for it rather than invent it.
2. **It applies the framework by name.** The constraint diagnosis, the IF/THEN/BECAUSE/MEASURED BY hypothesis, the loop selection. You will see the framework working on your own product, named as it goes.
3. **It refuses things.** Every coach has a refusal (listed in the README table) and it is the point: `/experiment-brief` will not give you a brief without a read date; `/monetize` will not price a funnel that never delivered value. When a skill pushes back, that is the method doing its job.
4. **It writes the artifact.** Each session ends in a file under `product/07-growth/` (or `01-strategy/` etc. for the leadership chain). The artifact is the deliverable; the conversation was the working session.

## Which coach for which situation

| You're facing | Start with |
| --- | --- |
| Growth is stuck and everyone has a different favorite fix | `/growth-bet` |
| Signups arrive but don't convert; usage grows but revenue doesn't follow | `/activation` |
| Users try it once and never come back; someone proposed streaks or points | `/engagement-mechanic` |
| A dashboard full of numbers and no idea which ones matter, or a metric moved and nobody knows why | `/signal-read` |
| A change is ready and someone said "let's just ship it and see" (or "let's use a bandit") | `/experiment-brief` |
| Pressure to change pricing, or revenue per customer is flat | `/monetize` |
| No written strategy, or OKRs that are really a feature list | `/strategy`, then `/okr-review` |
| A plan that feels solid but has never been challenged | `/pressure-test` |
| Too many priorities, an unranked backlog | `/prioritize` |
| A bet needs funding or a financial model needs reading | `/business-case` |
| A stakeholder isn't moving, an exec narrative to write | `/influence` |
| Team friction, unclear ownership | `/team-charter` |

## The two chains

Run them in order when building from scratch. Jump in anywhere when you have a specific problem. Each skill checks for the artifacts it needs and routes you backward if one is missing. That is the stage gate doing its job, not bureaucracy.

- **Strategy chain:** `/product-init` → `/strategy` → `/okr-review` → `/pressure-test`, then `/prioritize` for the roadmap.
- **Growth chain:** `/growth-bet` → `/activation` → `/engagement-mechanic` → `/monetize`, with `/signal-read` feeding evidence to all of them and `/experiment-brief` testing the bet.

Two useful exceptions to the ordering:

- `/signal-read` has **no gate**. Run it first, run it often. It is the coach the others send you to for evidence, and the one to call before any number goes into any deliverable.
- `/pressure-test` works on anything written. Finish an artifact, then let the skeptic at it before you present it.

The chains meet twice: `/experiment-brief` tests what `/strategy` and `/growth-bet` claim, and `/monetize` hands its pricing recommendation to `/business-case` for the financial model.

## A worked example, end to end

A B2B SaaS with a free trial, flat conversion, decent traffic:

1. `/signal-read` on the product's data export → diagnosis: conversion is a Ceiling, not a Leak; feature usage is growing on demo data; the leading indicator worth watching is first-session data-connection.
2. `/growth-bet` → constraint is activation; hypothesis: focused first session doubles conversion because users who see value on their own data have something to lose; collaboration loop via the accountant who serves fifty clients.
3. `/activation` → the Aha defined as an event ("views insight generated from own imported data"), a five-screen shortest-path first session, baselines for the four health metrics.
4. `/experiment-brief` → A/B (bandit and holdout rejected by name), primary metric is chain completion because the power math says five weeks versus five months, guardrails with numeric boundaries, read date fixed.
5. `/engagement-mechanic` → the habit that keeps activated users: outcome-denominated reward, scored on the weighted scorecard against the current state.
6. `/monetize` → stage call says Value Creation, so: hold the price, redraw what the price buys, validate on fresh cohorts across billing cycles 2 and 3.
7. `/business-case` → the financial model and kill criterion for the whole bet.

Any product with a funnel and a database can run the same loop.

## Habits that make the coaching work

- **Bring numbers, not adjectives.** "Retention is bad" starts an interview; "40% at one year, flat for 13 months" starts a diagnosis.
- **Let the refusals stand.** When a coach won't accept your Aha definition or your missing baseline, the fastest path is to supply what it asked for, not to argue it into compliance.
- **Keep the artifacts in git.** The `product/` directory is designed to be committed; the history of your bets and reads is itself a product asset.
- **Edit frameworks, not skills, for rule changes.** `frameworks/*.md` is the source of truth; skills inline those rules for standalone use. Change the framework file, then update the skill to match, then re-run `setup` if you added a new skill directory.
