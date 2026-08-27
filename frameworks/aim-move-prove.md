# Aim · Move · Prove — distilled rules

Most dashboards measure everything and decide nothing. This hierarchy sorts numbers by the decision they change.

## The three-layer metric hierarchy

- **Aim** — the North Star: the single metric that captures value delivered to the user and links to the business model. Direction-setting, slow-moving.
- **Move** — leading indicators: metrics teams can shift this week that causally feed the Aim. This is where experiments run.
- **Prove** — lagging outcomes: conversion, retention, revenue. They confirm; they arrive too late to steer by.

Rules: every Move metric must have a stated causal link to the Aim (and that link is itself a hypothesis to check). Experiments run on Move; Prove gets its confirmatory read later. A team steering by Prove metrics alone is driving by the rear-view mirror.

## Leading vs lagging

A **leading** indicator changes early, is actionable this week, and predicts the outcome. A **lagging** indicator is the outcome. The test: if this number moved today, could the team have caused it this week? If not, it is lagging.

## The vanity screen

Before a metric earns a place on a dashboard, ask:

1. **What decision changes** if this number moves? No decision, no dashboard slot.
2. **Can it go up while the business gets worse?** (Total signups up while activation collapses; usage up on demo data.) If yes, it needs a companion metric or a denominator.
3. Is it a **ratio of the thing that matters**, or a cumulative count that can only ever rise?

## The three failure patterns

Diagnose a sick metric by its shape, and match the response to the shape:

- **Cliff** — sudden drop. Cause: a discrete recent event (release, pricing change, outage, tracking break). Response: find the event; check instrumentation before believing the product broke.
- **Slow Leak** — gradual decline across cohorts. Cause: compounding erosion (quality, competition, mix shift). Response: cohort analysis to find when the leak started and which segment leaks.
- **Ceiling** — flat despite sustained effort. Cause: the current mechanism is saturated. Response: **a new mechanism, not more tuning.** Optimization spends against a ceiling are the most common way growth teams waste a year.

A metric pinned inside a narrow band for many months, regardless of what moved around it, is a Ceiling even if the band is not literally flat.

## Correlation checks before belief

Before betting on "X drives Y", compute the correlation and look at it. Near-zero r between the supposed driver and the outcome kills the simple story and usually reveals a conjunction (X alone is not enough) or a confounder. And correlation that does exist still is not causation; it earns an experiment, not a roadmap.

## Recompute every number

Any number produced by an LLM, a dashboard aggregation, or someone's slide gets recomputed from raw data before it enters a deliverable or a decision. One wrong "roughly triples" that is actually 5.4x costs the room's trust in everything else. Check aggregation settings (SUM vs AVG on a rate) before comparing two charts.
