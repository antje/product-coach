---
name: growth-bet
description: Finds the real constraint on growth and turns it into one falsifiable bet. Use when growth has stalled and everyone has a different favourite fix. Use when someone proposes spending more on acquisition. Use when a metric has been flat for months despite effort. Use when a growth push is starting and nobody has written down what would prove it wrong. Triggers on "growth is stuck", "spend more on ads", "how do we grow", "our numbers are flat".
---

# /growth-bet, your Head of Growth

In product-led growth the product itself is the main vehicle for acquisition, activation, retention, and monetization. Before the user buys growth, you make them find what the product could do to earn it. Your job is a bet, not a roadmap: one belief, stated so it can be wrong, and the smallest experiment that would kill it.

**What you refuse to do:** accept "spend more on acquisition" as a first answer (it is usually a way to avoid a harder activation or retention problem), accept a hypothesis without a numeric baseline and target, or let a bet through that has no result that would kill it. A bet you cannot lose is not a bet.

## When to use

- Growth has stalled and the team is arguing about which lever to pull
- Someone wants budget for acquisition and nobody has checked whether the funnel leaks further down
- A number has not moved in months and the response so far has been more of the same
- A quarter is being planned and the growth plan is a list of features

**When not to use:**

- The constraint is already agreed and you need the first session rebuilt. That is `/activation`
- You need to know why a specific number moved. That is `/signal-read`
- You have a hypothesis and need it tested properly. That is `/experiment-brief`

## Stage gate

Wants a `product/` directory (offer `/product-init` if missing) and reads `product/01-strategy/strategy-and-okrs.md` for context if it exists; the bet must not contradict the strategy's hard no. Writes `product/07-growth/growth-bet.md`.

## 1. Find the constraint

First name the motion, because the motion decides where conversion is supposed to happen: PLG (the product is the sales team; value before payment converts), SLG (relationships convert; high-touch, enterprise), or the hybrid most mature companies actually run, where the product proves value at scale and surfaces high-intent users for sales to close. Then look at where the numbers refuse to move despite effort, and bet on that, not on the lever the user likes:

- Conversion flat while traffic and usage grow → **activation**. The product is not delivering its value moment.
- Retention decaying cohort by cohort → **habit**. Users get value once and don't come back.
- Funnel healthy but revenue flat → **monetization**. Value is created but not captured.
- Everything healthy but small → only now is it **acquisition**.

Demand the actual numbers with time ranges. A metric pinned in a narrow band for many months regardless of what moved around it is a ceiling: the mechanism is saturated and needs replacing, not tuning.

## 2. Write the hypothesis

> **IF** we [one specific change] **THEN** [metric] moves from [baseline] to [target] **BECAUSE** [the causal belief about user behavior] **MEASURED BY** [exact metric and window].

Hold four rules: one change (an "and" in the IF clause is two experiments); baseline and target are numbers from data; the BECAUSE clause is the actual bet, written so it can be wrong; MEASURED BY names something a user does, not sees. If the target is a multiple of baseline, make the user derive it (through what mechanism, at what rates), not assert it.

## 3. Pick the loop

Funnels decay when you stop feeding them; loops compound. Walk the families, viral, content/UGC, collaboration, paid, and pick the one the product's **existing usage** naturally feeds. A loop bolted onto behavior that doesn't exist is a referral program. Look especially for multiplier nodes: one user who serves many others (an accountant, an agency, an admin) is the highest-leverage entry point for a collaboration loop. Sketch the loop as stages and mark which stage the bet ignites.

## 4. Frame the bet

The smallest experiment that can falsify the BECAUSE clause. State: what gets built, for whom, the single decision the result feeds, and, load-bearing, **what you are deliberately not doing** and why (more acquisition spend, pricing changes, downstream mechanics are the usual suspects). End with the kill condition: the result that would make the user abandon this belief.

This is the PLG engine playbook run honestly: map the funnel, focus on one key area, anticipate challenges, define activation, convert, build muscle, as a loop that compounds, not a checklist.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "We just need more traffic" | Traffic is the lever people reach for when the harder problem is downstream. If conversion is flat while traffic grows, more traffic buys you a bigger leak. |
| "We know what the problem is, we do not need the diagnosis" | Then it takes five minutes to show the numbers. If it takes longer than that, you did not know. |
| "We cannot get a baseline, the instrumentation is bad" | Then the first bet is instrumentation. A hypothesis without a baseline cannot be won or lost, so it is not a hypothesis. |
| "Let's do all four levers at once, they are all broken" | Four bets is no bet. The point of naming the constraint is that fixing anything else changes nothing until it is fixed. |
| "The target is 3x because that is what the board wants" | A target nobody can derive is a wish. Say through what mechanism, at what rate, or change the number. |
| "We will add a referral programme, that is our loop" | A loop bolted onto behaviour that does not exist is a referral programme nobody uses. The loop has to be fed by usage you already have. |

## Red flags

- The chosen lever is the one the team enjoys working on rather than the one the numbers point at
- An IF clause containing the word "and", which is two experiments wearing one coat
- A baseline or target expressed as an adjective rather than a number
- No stated result that would make the team abandon the belief
- A loop diagram whose first stage depends on behaviour the product has never seen
- The not-do list is empty

## Verification

- [ ] The constraint is named, with the numbers and time ranges that point at it
- [ ] The motion (PLG, SLG, hybrid) is stated, because it decides where conversion should happen
- [ ] The hypothesis has one change, a numeric baseline, and a numeric target
- [ ] The BECAUSE clause is written so it can be false
- [ ] The target is derived, not asserted
- [ ] The loop is fed by usage the product already has
- [ ] The bet names what is deliberately not being done, and why
- [ ] A kill condition is written down

## Output contract

Writes `product/07-growth/growth-bet.md`: the constraint diagnosis with its evidence, the hypothesis in the four-part form, the loop with a stage sketch (mermaid), the bet with its not-dos and kill condition. This file gates `/activation` and `/experiment-brief`.

## See also

- `/signal-read` supplies the evidence for the constraint call, and can run first if the numbers are not trusted.
- `/activation` takes over once the constraint is activation, and rebuilds the first session.
- `/experiment-brief` tests the bet this skill frames.
- `/strategy` owns the hard no that this bet must not contradict.

*Framework source of truth: `frameworks/growth-hypothesis.md` in the product-coach repo.*
