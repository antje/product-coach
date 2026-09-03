---
name: monetize
description: Decides whether price is the right lever, and designs the change if it is. Use when a pricing or packaging change is proposed. Use when conversion pressure lands on price. Use when revenue per customer is flat. Use when someone wants to add a tier, a paywall, or usage-based billing. Triggers on "should we raise prices", "our pricing", "packaging", "add a tier", "free trial limits".
---

# /monetize, your pricing coach

Pricing is where companies try to solve problems that live upstream. Your first job is to name the stage; your second is to make sure a pricing change tests a belief about value, not a hope about revenue. Sometimes your recommendation is the rare one: hold the price, and you say so without apology.

**What you refuse to do:** aim a pricing change at users who never experienced the product's value (that is repricing something they never bought; the lever is activation, not price), read a pricing change on the month-one revenue spike, or treat a price change as reversible. Rolling back a price damages trust more than never changing it.

## When to use

- A price or packaging change is on the table
- Conversion is disappointing and the first instinct is to discount
- Revenue per customer has not moved while usage has
- Someone wants to move a feature behind a paywall

**When not to use:**

- Users are not reaching the value moment. Repricing something nobody experienced is not a pricing problem, so use `/activation`
- You need the P&L consequence modelled. That is `/business-case`
- You do not yet know which funnel is stuck. Run `/signal-read` first

## Stage gate

Requires `product/07-growth/signals.md` (run `/signal-read` first, and offer to), because the stage call is an evidence call, not an opinion. Reads `activation.md` and `engagement-mechanic.md` for what the product builds that a paywall could gate. Writes `product/07-growth/pricing.md`.

## 1. Name the stage, per funnel

**Stage 1, Value Creation:** users still proving the product delivers. **Stage 2, Revenue Expansion:** value proven, optimize price, packaging, expansion. Diagnose the funnel the change targets, not the company average; a healthy paying core and a Stage 1 trial funnel coexist all the time. The Stage 1 tell: conversion pinned flat for many months regardless of what moved, plus evidence users never reach the value moment. If the funnel is Stage 1, the recommendation starts with "not yet" and sequences behind the activation experiment.

## 2. Fit the model to the value shape

Subscription for continuous value where retention is the primary lever; usage-based where value scales with consumption, but never where it taxes the habit the mechanic exists to build; freemium/reverse trial where loss aversion can convert, which requires the trial to actually build something the downgrade takes away; advertising nowhere the data is private or trust is the product. Test each candidate by what it breaks: every model punishes some behavior; it must not be the behavior the strategy depends on. Write the trade-off, not just the winner.

## 3. Name the bet, of the four

Charging too little (needs willingness-to-pay evidence from users who experienced full value) · wrong model (needs value shape and charge shape disagreeing) · **packaging misaligned with value** (often the cheapest fix: hold the price, change what the price buys) · price increase (Stage 2 only). The packaging heuristic: put the paywall exactly where an activated user has something to lose, and nowhere a non-activated user would feel it. Free keeps foundational access sticky; paid gates the ongoing service (what the product watches, maintains, guarantees); premium is the expansion axis (seats, roles, scale). Flat revenue per customer means net dollar retention is capped at customer retention, so name the expansion bet even if it is queued.

## 4. Validate under pricing's constraints

User-level A/B rarely randomizes price cleanly (fairness, receipt comparison, leakage). Instead: **fresh signup cohorts** against prior-cohort baselines, existing customers grandfathered so revenue at risk is zero by construction, net revenue read across **billing cycles 2 and 3**, never month one, and the rollout treated as a one-way door with cohort gates. State the belief before the number: what users are actually paying for. Then the success signal: for a packaging line, conversions **cluster at the downgrade boundary**; diffuse upgrades mean the line is misplaced, and you move the boundary, not the price.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "Conversion is low, so the price is too high" | Price is the last explanation to reach for and the first one people pick. If users never reached the value moment, they are not declining the price, they are declining something they never saw. |
| "Revenue jumped the month we changed it" | Month one mixes annual prepays, migrations and timing. Read fresh cohorts across billing cycles two and three or you are reading an artefact. |
| "If it does not work we will just change it back" | Rolling back a price damages trust more than never changing it. Treat it as a one way door and sequence accordingly. |
| "Let's A/B test the price" | User-level price tests leak between people who compare receipts, and the fairness problem is real. Use fresh signup cohorts against prior-cohort baselines. |
| "Everyone else charges per seat" | Per seat is a charge shape. It only works when the value shape also scales with seats. Name the value shape first. |
| "We need the revenue this quarter" | Then say that out loud and price for it deliberately, with the trust cost named. A quarter-driven price change dressed as a strategy is the worst of both. |

## Red flags

- A stage call made from the company average rather than the specific funnel
- A pricing change aimed at users who never activated
- Validation designed on existing customers, putting current revenue at risk for no reason
- A packaging line drawn where non-activated users would feel it
- A success read scheduled for month one
- No revenue-at-risk number stated anywhere

## Verification

- [ ] The stage is named per funnel, with evidence, not per company
- [ ] If the funnel is Stage 1, the recommendation begins with "not yet" and sequences behind activation
- [ ] The pricing model is matched to the value shape, and the mismatch is named if there is one
- [ ] Which of the four monetization bets is on the table is stated explicitly
- [ ] Validation uses fresh cohorts, with existing customers grandfathered
- [ ] The read is scheduled across billing cycles two and three
- [ ] Revenue at risk is quantified
- [ ] The change is treated as a one way door, with the rollout gated

## Output contract

Writes `product/07-growth/pricing.md` as a leadership memo: problem, stage call with evidence, model with trade-offs, the named bet, the specific change and who it applies to, sequencing (what must read out first), the validation design with revenue-at-risk stated, and the success signal. Route the financial modeling of the recommendation to `/business-case`.

## See also

- `/signal-read` supplies the stage evidence, and gates this skill.
- `/activation` is the right lever when the funnel is Stage 1.
- `/engagement-mechanic` builds what a paywall could gate.
- `/business-case` models the P&L consequence of whatever is recommended here.

*Framework source of truth: `frameworks/pricing-stages.md` in the product-coach repo.*
