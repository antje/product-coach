# Roadmap: what is shipped and what is next

product-coach grows one coach at a time. This file tracks what each coach covers and what's queued.

## The ritual for adding a coach

1. **Distill the rules** → a file in `frameworks/*.md`: the rules and the tests, in your own words. Never verbatim source material.
2. **Build the coach** → `skills/<name>/SKILL.md`, with the framework rules inlined so the skill works standalone once symlinked.
3. **Add the deliverable format** → `templates/product/` so `/product-init` scaffolds it into new repos.
4. Re-run `./setup`, then update the README skill table and this file.

## Shipped

### Strategy chain

| Coach | Covers |
| --- | --- |
| `/product-init` | Scaffolds the `product/` directory and fills the dashboard. The entry point. |
| `/strategy` | Playing to Win cascade, the three vision tests, one hard no. |
| `/okr-review` | The OKR bridge; rejects outputs disguised as outcomes and KRs without baselines. |
| `/pressure-test` | Adversarial review: biggest wrong assumption, the unanswerable board question, attack on the hard no. |

### Execution set

| Coach | Covers |
| --- | --- |
| `/prioritize` | Rocks, Pebbles and Sand; framework selection; backlog audit; the Now/Next/Later outcome roadmap. |
| `/team-charter` | Two modes: diagnose a people situation (feedback, clarity, system, fit), or write the charter. |
| `/influence` | Power map, resistance types, the no that holds, the executive narrative, negotiation prep. |
| `/business-case` | Reading a model you did not build, the four-part case, kill criteria, the CFO stress test. |
| `/ai-leverage` | Where AI leads, where a human signs off, what is never handed over, the personal skill file. |

### Growth chain

| Coach | Covers |
| --- | --- |
| `/growth-bet` | Constraint diagnosis, IF/THEN/BECAUSE/MEASURED BY hypothesis, loop selection, the bet with not-dos and a kill condition. |
| `/activation` | Aha as a data event, the activation chain, shortest-path first session, four health metrics, communication plan. |
| `/engagement-mechanic` | Habit loop, before/after scorecard, reward-the-outcome rule, rejected alternatives, honesty ship-gates. |
| `/signal-read` | Aim·Move·Prove, vanity screen, Cliff/Slow Leak/Ceiling with matched responses, correlation checks, recompute every number. |
| `/experiment-brief` | Method by trade-off, power math picks the primary metric, full brief fields, four killers, four-lens reads. |
| `/monetize` | Stage before method, model fit, the four bets, the packaging heuristic, cohort and billing-cycle validation. |

Frameworks behind the growth chain: `growth-hypothesis.md`, `activation-and-habit.md`, `aim-move-prove.md`, `experiment-design.md`, `pricing-stages.md`. Its artifacts land in `templates/product/07-growth/`.

Gating: bet → activation → mechanic. `/signal-read` has no gate (diagnosis runs anytime) and feeds `/experiment-brief` (baselines) and `/monetize` (stage evidence). `/monetize` routes its financial model to `/business-case`, which is where the two chains meet.

Design note: `/roadmap-review`, `/exec-narrative` and `/stakeholder-map` were planned as separate coaches and merged into `/prioritize` and `/influence` instead. Each pair shares a stage gate and the same inputs, so splitting them would have meant re-reading the same artifacts twice.

## Queued

- `/jtbd`. Jobs-to-be-Done interviewer and synthesizer. The lens is already used inside `/strategy`. This would make it a coach of its own.
- `/product-status`. Dashboard health check: stale artifacts, unfilled gates, OKR progress.
- `/board-review`. Full-portfolio pressure test across every `product/` artifact, simulating a board meeting.
- `/decision`. Two-way and one-way door protocol for a single decision under ambiguity. The framework is already in `frameworks/playing-to-win.md`.
