# Experiment design — distilled rules

A test earns its cost only when the method fits the question and the read date is fixed before launch.

## Method selection

Judge every method on four trade-offs: **speed, precision, scale, randomization unit.** A standard A/B test is the baseline on all four; every advanced method sacrifices one to solve a specific problem. **If you don't have that problem, don't pay the price.** When a standard A/B test is enough, do not overcomplicate it.

- **A/B test** — default. One structural change vs control, user-level randomization, clean causal read.
- **Multi-armed bandit** — many variants, fast feedback signal, optimization goal. Wrong when the payoff arrives late (it shifts traffic on early signals before slow outcomes speak) or when you need a clean read, not real-time optimization.
- **Holdout** — answers "does the effect last?" A follow-up question: ship the winner to ~95% and keep a small long-term holdout.
- **Geo / switchback** — for when you cannot randomize individual users (marketplaces, network effects, ops changes). If you can randomize users, don't.

## Power math chooses the primary metric

Sample size per arm scales with the inverse square of the detectable effect relative to the baseline rate. Practical consequence: at typical volumes, a rare lagging outcome (conversion at 2%) needs months to power, while a common leading indicator (a first-session behavior at 20%) powers in weeks. **So the primary metric is the leading indicator you can afford to power in the window; the lagging outcome gets a separate, later, properly powered confirmatory read.** Always show the arithmetic: users per arm, monthly volume, weeks to enroll, for both candidate metrics. The comparison usually makes the decision by itself.

State the bridge: why moving the leading indicator should move the lagging one, in numbers (if all converts come through behavior X at rate r, then volume alone yields A, and quality must supply the rest). A 2x target that is asserted rather than derived will not survive review.

## The brief, minimum fields

Experiment name · objective (tied to the North Star) · current experience (control, described honestly) · the single change under test · target segment and randomization · hypothesis in IF/THEN/BECAUSE/MEASURED BY form · primary metric with baseline · success threshold set in advance · secondary metrics (watched, not decisive) · guardrails with numeric boundaries · read date · predicted outcome · what happens if successful · what happens if not.

## Guardrails

Every guardrail needs a **numeric boundary**, not a direction ("sign-up completion must not drop more than 2 points", not "watch sign-ups"). Guardrails that measure trust damage are monitored live, not just at the read.

## The four experiment killers

1. **Short run times / peeking** — fix the read date before launch; no early looks; significance reached early and acted on is a false positive machine.
2. **Seasonality** — the window must cover full natural cycles of the behavior.
3. **Imbalanced exposure** — check the split actually lands 50/50, weekly.
4. **Colliding tests** — freeze overlapping experiments on the same surface for the window.

## Reading results, four lenses

1. **Statistical** — is the effect real at the pre-set threshold, at the pre-set date?
2. **Practical** — is the size worth shipping and maintaining?
3. **Segments** — does the average hide a win in one segment and a loss in another? (Segment reads are exploratory unless pre-registered.)
4. **Guardrails** — did anything protected degrade? A primary win with a guardrail breach is not a win.

Messy outcomes have protocols: **flat** → check power and exposure before declaring the idea dead; **mixed** (primary up, guardrail down) → the guardrail wins; **invalid** (imbalance, instrumentation break) → the test reruns, it does not get "interpreted".

## After the read

Win: ship, keep a long-term holdout, name the next test. Loss: investigate before iterating (session recordings, step-level drop-off at the exact exit point); if the leading indicator moved and the lagging outcome still refuses, the problem is downstream of this experiment; say where the question moves.
