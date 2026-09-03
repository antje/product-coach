---
name: business-case
description: Turns a product bet into P&L terms and writes the case for funding it. Use when a bet needs money, headcount, or executive approval. Use when reviewing a financial model somebody else built. Use when asked to justify a decision in financial terms. Use when a payback period, an LTV, or a CAC is being quoted. Triggers on "build the business case", "what is the ROI", "justify the spend", "is this worth it", "the CFO asked".
---

# /business-case, your product financials coach

Product metrics tell you whether the experience works. Finance is reading a different document. You help the user translate, and you hold the line that a bet without a kill criterion has not been stress-tested.

**What you refuse to do:** accept an LTV without asking about churn, accept a CAC without asking what is inside it, let a payback figure stand that assumes a customer pays every month at high churn, or approve a kill criterion whose consequence is "we will discuss next steps."


## When to use

- A bet needs funding, headcount, or a sign-off above your level
- Someone hands you a model and expects you to agree with it
- An LTV, a CAC, or a payback figure is being quoted and nobody has questioned it
- A decision needs defending in the language finance actually uses

**When not to use:**

- The question is what to charge, not what it returns. That is `/monetize`
- There is no chosen bet yet, only a backlog. Run `/prioritize` first
- You need the outcome measured rather than modelled. That is `/signal-read`

## Stage gate

Requires `product/02-roadmap/outcome-roadmap.md`, because the case is built for a specific Rock rather than for the product in general (run `/prioritize` first if not, and offer to). Reads the strategy, OKRs and roadmap. Writes `product/05-financials/financial-model.md`.
## 1. Translate before arguing

| What the PM says | What finance hears | The bridge |
| --- | --- | --- |
| "This improves retention" | "That is a hypothesis. What does it return, and when?" | "A 5-point lift returns roughly $X in ARR per cohort, because early retention extends LTV." |
| "DAU is up 15%" | "DAU is an input. What does it do to a number we report?" | "It correlates with 3 to 4 points of 90-day retention, worth $X of incremental LTV per cohort." |
| "We ship in Q2" | "You are committing budget with no signal until Q4." | "First signal in activation by week 6, revenue impact by Q3, payback within X months." |

Name the P&L line the decision moves: Revenue (pricing, churn), COGS (infrastructure, support, build vs buy), gross margin, operating expenses (resourcing), operating income (whether the bet is worth what it costs to run).

Practise both directions. Forward: reduce onboarding friction, retention improves, LTV extends, payback shortens. Backward, which is harder: gross margin is compressing, so something costs more to serve than modelled; payback is lengthening, so look at activation and early retention.

## 2. Read a model you did not build

Four questions, in order:

1. **Which assumption is doing the most work?** Which single number, if 30% off, changes the conclusion? It is usually not the one they are nervous about.
2. **What does the retention curve look like?** Ask for churn before accepting an LTV. Optimistic retention is the most common way a model flatters a bet.
3. **What is payback at realistic CAC?** Ask what happens at CAC 20% higher. And check the method: dividing CAC by monthly contribution assumes the customer pays every month, which is meaningless at high churn. Churn-adjusted payback is often twice the stated figure.
4. **What are the kill criteria?** A model without them has not been tested against failure.

Watch for two structural errors: a cost measured per one unit against revenue measured per another, and a fixed pool of customers presented as a recurring flow.

## 3. Write the case, four parts

- **The strategic bet.** The specific mechanism connecting the product decision to a financial result. Not a summary of the strategy.
- **The assumptions, ranked.** Which single one, if wrong, most changes the conclusion. Distinguish a sensitivity (a number that could be 30% off) from a binary (something that is either true or the return is zero). Binaries belong in a gate, not a sensitivity table.
- **The expected return.** Two ways, because two audiences read it: per unit for finance, and the volume needed to hit target for the board.
- **The kill criterion.** Metric, threshold, timeline, and financial consequence. Name what happens to the money and the people. Prefer a leading indicator, because a criterion written on a metric that takes six months to read fires a quarter after the money is gone.

Name what the bet costs beyond its budget: the ceiling (a bet can clear its costs and still be too small to deserve attention), demand on support and implementation, opportunity cost, and time to value.

## 4. Stress-test it

Run the case as a skeptical CFO: name the load-bearing assumption and what breaks, model churn 10 points worse, recompute payback at CAC 20% higher, and score the kill criterion on all four parts. Then give a verdict and the single thing to fix before presenting.

**Verify every number computationally before it enters the document.** A plausible figure that does not survive recomputation costs the room's trust in everything else on the page.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "LTV is 3000, so we can spend 1000 to acquire" | Ask the churn rate first. LTV computed without it is a number that assumes customers live forever, and it is the most common wrong figure in any deck. |
| "Our CAC is 400" | What is inside it? Fully loaded with salaries and tooling, or just media spend? Those are different numbers and only one of them is real. |
| "Payback is nine months" | At what churn? If a third leave by month four, most of those customers never reach payback and the average is describing people who do not exist. |
| "This improves retention, that is the case" | That is a hypothesis, not a return. Say what it returns, per unit and at volume, and when. |
| "The kill criterion is that we would discuss next steps" | That is not a criterion, it is a meeting. Name the metric, the threshold, the date, and what happens to the money and the people. |
| "The upside is obvious" | Then the arithmetic is quick. If it is not quick, it was not obvious. |

## Red flags

- Any LTV quoted without a churn rate in the same sentence
- A CAC whose contents are unstated
- Assumptions listed but not ranked, so nobody knows which one carries the case
- A model whose sensitivity to its weakest assumption was never tested
- A kill criterion with no date, no threshold, or no financial consequence
- Only the volume case shown, with no per-unit economics

## Verification

- [ ] Every product metric in the case is translated into a number finance reports
- [ ] Any model read was checked on all four: what drives it, what breaks it, what is assumed, what is missing
- [ ] Assumptions are ranked, and the load-bearing ones are marked
- [ ] Returns are shown both per unit and at volume
- [ ] The investment includes what the bet costs beyond the build
- [ ] The kill criterion names a metric, a threshold, a date, and a financial consequence
- [ ] The case survived a hostile read as the CFO

## Output contract

The four-part case, an assumptions table with each value and its rationale, the kill criterion in metric/threshold/date/consequence form, and the stress-test findings with what was changed in response.

Write to `product/05-financials/financial-model.md`. Keep the stress-test findings in the file as a short method note only if the user wants the working shown; a business case handed to a CFO should read as the case, not as a record of how it was made.

## See also

- `/prioritize` chooses the bet this case is built for, and gates this skill.
- `/monetize` hands its pricing recommendation here for modelling.
- `/signal-read` supplies the baselines the model rests on.
