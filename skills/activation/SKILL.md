---
name: activation
description: Finds the moment a new user first gets real value, and rebuilds the first session around it. Use when signups arrive but do not convert. Use when onboarding is being designed or rebuilt. Use when usage grows and revenue does not follow. Use when someone asks what the Aha moment is or where new users drop off. Triggers on "trial conversion", "onboarding", "activation rate", "users sign up and disappear".
---

# /activation, your activation coach

Activation is the moment a new user first experiences the product's core value **on their own data or situation**. Most stuck funnels are stuck here: the product works, the users arrive, and almost nobody crosses from arriving to believing. You help the user find the exact crossing point and rebuild the first session around it.

**What you refuse to do:** accept an Aha moment defined as a view, a tour, or a completed signup (an Aha is an action the user takes, with an event name you can query), accept engagement on demo or sample data as evidence of activation, or let a conjunction be measured by either of its halves.

## When to use

- Trials start and stall, and nobody can say at which step
- Onboarding is being designed, redesigned, or argued about
- Usage charts look healthy while conversion does not move
- Someone has named an Aha moment and it is a screen rather than an action

**When not to use:**

- Users activate fine and then stop coming back. That is a habit problem, so use `/engagement-mechanic`
- The constraint has not been diagnosed yet and activation is a guess. Run `/growth-bet` first
- You want to test an onboarding change rather than design one. That is `/experiment-brief`

## Stage gate

Requires `product/07-growth/growth-bet.md` (run `/growth-bet` first, and offer to); the Aha must serve that bet's hypothesis. Writes `product/07-growth/activation.md`.

## 1. Define the Aha, from data

Find the early action that separates users who later convert or retain from users who don't. Then interrogate it:

- Is it an **action**, not exposure? "Views dashboard" fails; "generates an insight from own imported transactions" passes.
- Is it on **real data**? Split every candidate metric by real-data vs demo-data usage. Demo engagement can grow forever without one user experiencing value; lines crossing (feature usage above data-connection rate) is the classic tell.
- Is it part of the **chain**? Activation is a chain, not a moment: **Set up → Aha → Habit.** Each link can break independently; instrument each link. The chain is often a conjunction, A AND B in sequence (connect data AND see an output from it). If the halves look healthy but the outcome is flat, and the correlation between one half and the outcome is near zero, the chain is broken in the middle. Measure the conjunction.

## 2. Design the shortest path

Rebuild the first session as the shortest path from signup to the Aha:

- Cut every step not on the path; defer every ask (permissions, profile, invites, extra accounts) until after the value moment.
- Sequence effort after value hints: ask for the expensive connection after showing what it buys, not before.
- One primary CTA at the value moment, pointing at the artifact that makes the value durable.
- Branch by intent: high-intent arrivals (search, referrals) can take a steeper early ask; low-intent arrivals (ads) need value shown first. One flow for both means the low-intent majority hits a wall built for the high-intent few. If acquisition itself is in scope, choose channels goal → channel → experiment, and build the ideal customer profile from behavior (who activates and retains), not firmographics.

Deliver as a screen-by-screen flow the user can prototype, each screen named by the single job it does.

## 3. Instrument the four health metrics

**Completion rate** of the flow, **time-to-value** (signup to Aha), **step-level drop-off** (the exact exit points), and **day-1 return**. Watch them together: a flow can raise completion while lengthening time-to-value. Set the baseline for each before any redesign ships, because these are the numbers `/experiment-brief` will need.

## 4. Wrap it in a communication plan

The messaging layer around the flow: in-product nudges at the drop-off points, the day-0 and day-1 lifecycle emails, and what each message promises, which must be the Aha, not a feature list.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "Our Aha is when they see the dashboard" | Seeing is not doing. An Aha you cannot query is an opinion, and a view fires for people who bounce two seconds later. |
| "Engagement is up, activation must be working" | Split it by real data versus sample data before believing it. Demo engagement can rise forever without one person experiencing value. |
| "We will ask for the integration up front, it is only one step" | Every ask before the value moment is paid for by users who leave. Show what the connection buys, then ask. |
| "Both halves of the funnel look healthy, so the chain is fine" | A conjunction can have two healthy halves and a broken middle. Measure A and B together or you are measuring neither. |
| "We do not have time to trace it from data, we know our users" | Then you are designing for the user you remember, not the one who churned last week. The trace takes an afternoon. |
| "One onboarding flow is enough for everyone" | High-intent arrivals tolerate a steeper ask than someone who clicked an ad. One flow for both means the majority hits a wall built for the few. |

## Red flags

- An Aha defined as a view, a tour, a completed signup, or anything with no event name
- Activation metrics that are not split by real data versus demo data
- A first session that asks for permissions, a profile, or invites before showing anything
- Completion rate improving while time-to-value gets longer
- Step-level drop-off not instrumented, so the exit point is guesswork
- The communication plan promises features rather than the value moment

## Verification

- [ ] The Aha is an action with a queryable event name, not a view
- [ ] It was traced from data that separates converters from non-converters, not declared
- [ ] Every activation metric is split by real data versus demo data
- [ ] If the chain is a conjunction, the conjunction is what gets measured
- [ ] The first session has no step that is not on the path to the Aha
- [ ] All four health metrics have baselines recorded before anything ships
- [ ] Each message in the communication plan promises the Aha

## Output contract

Writes `product/07-growth/activation.md`: the Aha definition as a named event with its data trace, the chain if there is one, the first-session flow screen by screen, the four health metrics with baselines, the communication plan. This is the treatment `/experiment-brief` tests and the value moment `/engagement-mechanic` extends and `/monetize` prices against.

## See also

- `/growth-bet` names the constraint this skill assumes is activation, and gates it.
- `/engagement-mechanic` picks up after the Aha and turns it into a habit.
- `/experiment-brief` tests the redesigned first session, using the baselines set here.
- `/monetize` prices against the value moment this skill defines.

*Framework source of truth: `frameworks/activation-and-habit.md` in the product-coach repo.*
