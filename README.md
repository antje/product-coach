# product-coach

**Turn Claude Code into your virtual product leadership team.**

product-coach gives any project a virtual *product* team: a strategy coach, a skeptical Chief Strategy Officer, an OKR reviewer, and a full growth team — rooted in the fundamentals product leaders actually use (Playing to Win, Rumelt's kernel, JTBD, OKRs, hard trade-offs, growth loops, Aim·Move·Prove, experiment design). Each coach is a Claude Code skill you invoke by name.

The premise: **every project deserves to be treated as a product** — a startup, an enterprise initiative, a side hack. That means a written strategy, measurable outcomes, and deliberate trade-offs, before (and while) you build.

## Install

```bash
cd /path/to/product-coach && bash setup
```

`setup` symlinks each skill into `~/.claude/skills/`, so the source of truth stays here and every skill updates with zero drift. Re-run `setup` after adding new skills.

**New here? Read [docs/using-the-skills.md](docs/using-the-skills.md)** — the skills are coaches, not report generators: bring a real product challenge with real numbers, expect to be interviewed, expect pushback, and get a written artifact in your repo's `product/` directory at the end. The guide has a which-coach-for-which-situation table and a worked end-to-end example.

## The skills

### The strategy chain

| Skill | Persona | What it does |
| --- | --- | --- |
| `/product-init` | Product ops lead | Scaffolds a canonical `product/` docs directory into any repo and fills the dashboard. The entry point. |
| `/strategy` | CPO strategy coach | Walks the Playing to Win five-choice cascade, applies the three vision tests, demands one hard no. |
| `/okr-review` | OKR coach | Builds/reviews the OKR bridge. Rejects outputs disguised as outcomes and KRs without baselines. |
| `/pressure-test` | Skeptical CSO | Adversarial review: biggest wrong assumption, the unanswerable board question, attack on the hard no, strategy-or-wishlist verdict. |

### The execution set

| Skill | Persona | What it does |
| --- | --- | --- |
| `/prioritize` | Prioritization coach | Rocks, Pebbles and Sand; picks the right scoring framework; forces three Rocks and defensible hard nos; turns them into a Now/Next/Later outcome roadmap. |
| `/team-charter` | Team leadership coach | The four-type diagnosis (feedback, clarity, system, fit), SBI feedback, and a charter whose ownership and decision rights can settle a real dispute. |
| `/influence` | Executive influence coach | Formal versus informal power, why one person is not moving, a no that holds, an executive narrative with the ask first, negotiation around interests. |
| `/business-case` | Product finance coach | Translates outcomes into P&L terms, reads a model you did not build, writes a case with ranked assumptions and a kill criterion with a financial consequence. |
| `/ai-leverage` | AI leverage coach | Where AI leads, where a human signs off, what is never handed over, and how to build a personal leadership skill file. |

### The growth chain

| Skill | Persona | What it does |
| --- | --- | --- |
| `/growth-bet` | Head of Growth | Diagnoses the real constraint (acquisition, activation, habit, monetization), writes the IF/THEN/BECAUSE/MEASURED BY hypothesis, picks the growth loop, frames the smallest bet that can kill the belief. |
| `/activation` | Activation coach | Defines the Aha moment as a queryable data event traced from data, designs the first session as the shortest path to it, sets the four onboarding health metrics. |
| `/engagement-mechanic` | Retention coach | Builds the habit loop (trigger, action, reward, investment), scores it on an engagement scorecard against the current state, rewards outcomes over activity, forces rejected alternatives. |
| `/signal-read` | Analytics coach | Aim·Move·Prove hierarchy, vanity screen, shape diagnosis (Cliff / Slow Leak / Ceiling) with the matched response, and recomputes every number before it is believed. |
| `/experiment-brief` | Experimentation coach | Picks the method on the speed/precision/scale/randomization trade-offs, lets power math choose the primary metric, writes the full brief with guardrail boundaries and a fixed read date, reads results through four lenses. |
| `/monetize` | Pricing coach | Names the stage before the method (Value Creation vs Revenue Expansion), fits the model to the value shape, names which of the four monetization bets is on the table, designs pricing validation on cohorts and billing-cycle reads. |

Each skill names something it refuses to do, because the refusal is what makes it behave differently rather than merely know things. `/business-case` will not accept an LTV without a churn rate. `/influence` will not let you argue before you know what the other person is protecting. `/signal-read` will not put a number in a deliverable without recomputing it. `/experiment-brief` will not write a brief without a read date fixed before launch. `/monetize` will not aim a pricing change at users who never experienced the product's value.

## How the skills chain (stage gates)

```
/product-init  →  /strategy  →  /okr-review  →  /pressure-test
   scaffolds       writes         writes OKRs      appends log,
   product/        cascade +      section          user changes
                   hard no                         or defends
```

```
/growth-bet  →  /activation  →  /engagement-mechanic  →  /monetize
   constraint +     Aha + first       habit loop +           stage call +
   hypothesis +     session +         scorecard              model + bet +
   loop + bet       health metrics                           validation
        ↘                ↘                                  ↗
          /signal-read (no gate — evidence for everything)
                         ↘
                           /experiment-brief (tests the bet)
```

Strategy gates OKRs; OKRs gate the roadmap; the roadmap gates the build. On the growth side: the bet gates activation, activation gates the mechanic, and signals gate pricing — `/monetize` will not price a funnel whose stage nobody has diagnosed. Each skill checks its gate and routes you backward if the prerequisite artifact doesn't exist. All skills read/write the same `product/` directory in *your* repo — that's the shared memory. The two chains meet twice: `/experiment-brief` tests what `/strategy` and `/growth-bet` claim, and `/monetize` hands its recommendation to `/business-case` for the financial model.

## Repo layout

```
skills/       one directory per skill (SKILL.md) — symlinked into ~/.claude/skills/
frameworks/   distilled framework rules — the editable source of truth skills inline
templates/    the product/ scaffold that /product-init copies into target repos
docs/         using-the-skills.md — the user guide · roadmap.md — what's shipped and what's next
```

**Convention:** skills are self-contained (framework rules inlined) so they work standalone once symlinked; `frameworks/` is where the rules get edited, then re-inlined into skills. Every skill declares a persona, what it refuses to do, a stage gate, and an input/output contract on `product/` files.

## How it grows

New coaching material lands in three places, in this order — see [docs/roadmap.md](docs/roadmap.md) for what's shipped and what's queued. Rules distilled into `frameworks/`, then a coach built on top in `skills/`, then any new deliverable format added to `templates/product/`.

## Status

Personal toolkit. Fifteen skills across three chains: strategy, execution, and growth. Not packaged for public release.
