# Activation & habit — distilled rules

Acquisition is rented; activation and habit are owned. These rules define the Aha moment as data and the habit loop as design.

## The Aha moment

- The Aha moment is the first time the user **experiences the product's core value on their own data or situation** — not a tour, not a feature list, not demo content.
- Define it as a **data event**: an action the user takes, with a name you can query. "User sees value" is not measurable; "user views a cash-flow insight generated from their own imported transactions" is.
- Trace it from data, don't declare it from opinion: find the early action that separates users who convert/retain from users who don't, then check the direction of causation before building on it.
- Beware demo-data engagement: usage produced on sample content can grow forever without a single user experiencing real value. Split every activation metric by real-data vs demo.

## The activation chain: Set up → Aha → Habit

- The frame: **activation is a chain, not a moment.** Set up (the user gives the product what it needs) → Aha (first value experienced) → Habit (the value moment repeats). Each link can break independently; instrument each link.
- The chain is often a **conjunction**: the user must do A **and** B in sequence (connect data AND see an insight from it). Measure the conjunction, not either half — the halves can each look healthy while the chain is broken (near-zero correlation between one half and conversion is the tell).
- Design the first session as the **shortest path to Aha**: cut every step that is not on the path, defer every ask (permissions, profile, team invites) until after the value moment.
- Effort asks come after value hints, not before. Ask for the bank connection after showing what the connection buys.

## Onboarding health metrics

Four numbers, watched together: **completion rate** of the flow, **time-to-value** (signup to Aha), **step-level drop-off** (where exactly they leave), and **day-1 return rate**. A flow can raise completion while lengthening time-to-value; watch both.

## Acquisition levers

Choose channels in order: **goal → channel → experiment** — the acquisition goal picks the channel, and every channel gets treated as an experiment with a metric, not a line item. Organic levers (SEO, content, community, referrals) compound slowly and cheaply; paid levers buy speed and rent volume. Build the ideal customer profile **from behavior** — who activates and retains — not from firmographics alone.

## High vs low intent

High-intent arrivals (search, referral from a user) can take a steeper ask early. Low-intent arrivals (ads, curiosity) need value shown before any ask. One onboarding for both usually means the low-intent majority hits a wall built for the high-intent few. Intent shapes how much you ask, and when.

## The habit loop

**Trigger → action → reward → investment.** The habit forms when the reward is variable enough to stay interesting and the investment (data added, artifacts built, people invited) makes the next trigger more valuable.

- **Reward the outcome, not the activity.** A mechanic that rewards opens, streaks, or points manufactures engagement without value and decays into annoyance. Reward the thing the user actually came for (money recovered, problem resolved, decision made).
- The reward must be **honest**: attribute only what the product genuinely caused. Inflated credit is discovered exactly once.
- The investment stage is what compounds: each use should leave an artifact that makes leaving costlier and returning more valuable.

## The engagement scorecard (one number, three dimensions)

Combine multiple engagement metrics into a single weighted KPI:

1. **Identify key metrics** representing the three dimensions: **depth** (session duration, actions per session), **breadth** (feature adoption), **frequency** (DAU/MAU, return rate).
2. **Assign weights by priority** — weight each metric by how strongly it correlates with long-term retention in this product. Not all signals carry equal weight.
3. **Calculate the weighted score** — multiply, sum, one KPI.
4. **Interpret and iterate** — track the trend; adjust weights as priorities shift. A scorecard that never updates is just a snapshot.

Score the current state and the proposed mechanic on the same scorecard; if the proposal doesn't clearly move the number, it is decoration.

## From signal to intervention (reactive to proactive)

Most teams read churn at month end, when users are already gone. The proactive workflow: **automate the monitoring** (watch login frequency, feature adoption, session duration; alert when a cohort crosses a churn-risk threshold), **diagnose with AI** (price churn or value churn? which behavior dropped first?), **design the intervention experiment** with a holdout, because the holdout tells you whether the intervention worked or the users would have returned anyway. Calibrate the threshold from the last churned cohort's behavioral pattern.

## Rejected alternatives are part of the design

Name the mechanics you considered and rejected (daily streaks, leaderboards, badges) and the reason each one fails this product's users. A mechanic chosen without rejecting anything was not chosen.
