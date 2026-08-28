# Deploying

The repo connects to Vercel directly through GitHub. There is no v0 in the
loop. Every push to `main` becomes a production deployment, and every pull
request gets its own preview URL, with no extra configuration.

> **Before putting a live key on a deployment that has no login.** Set
> `DEMO_REVIEWS_PER_SESSION` and `DEMO_DAILY_COST_CEILING_USD`. Both are
> checked before the model is called, so a blocked request costs nothing.
> `/api/health` reports whether they are set, and both showing `null` on a
> reachable deployment means `/api/review` is uncapped.
>
> The counters are in memory, so they reset on redeploy and are per instance.
> They are a speed bump sized to a demo, not a defence. Deployment Protection
> and a spend-capped key are what actually keep a stranger from costing you
> money.

## Why not v0

v0 is worth keeping when you want its UI generation and live preview, or its
environment and domain setup as a starting scaffold. Once development moves to
a real editor, it becomes a second copy of the project to keep in sync for no
added benefit. Vercel hosts a GitHub repo just as happily.

## One-time setup

Two of these steps need access to the Vercel account, so they are done by hand.

1. **Import the repo.** In Vercel, choose Add New, then Project, then import
   `antje/product-coach`. Vercel detects Next.js on its own. Leave the root
   directory as the repo root, because that is where the app lives.

2. **Add the environment variables** under Settings, then Environment
   Variables. Scope matters, so set them per environment rather than ticking
   all three boxes:

   | Variable | Production | Preview | Development |
   | --- | --- | --- | --- |
   | `ANTHROPIC_API_KEY` | yes | leave unset, or a separate spend-capped key | leave unset |
   | `DATABASE_URL` | yes, when the ledger lands | a separate database, never production | leave unset |
   | `WEBHOOK_SIGNING_SECRET` | yes, when webhooks land | a different value | leave unset |

   `.env.example` lists the same set with notes.

   **Why not all three.** Every branch and pull request gets its own preview
   deployment, and those URLs are reachable by anyone holding the link unless
   Deployment Protection is on. A production key sitting in Preview means an
   unlisted URL can spend real money. The Development scope exists so
   `vercel env pull` can write values into `.env.local`; skip it and keep the
   key in your own `.env`, which is already gitignored, so it lives on one
   fewer machine.

   With no key set, the app still builds and loads. Reviews return 503 and say
   why. That is the correct behaviour for a preview.

   If you do want live reviews in previews, make a second key in the Anthropic
   Console under its own workspace with a spend limit, and use that one. Then a
   leaked preview URL costs a capped amount and can be revoked without touching
   production.

3. **Turn on Deployment Protection** under Settings, then Deployment
   Protection, so preview URLs require a login. Worth doing whether or not a
   key is set, because previews of this app show a real experiment history.

4. **Turn on Web Analytics** under the project's Analytics tab. The
   `@vercel/analytics` package is already installed and `<Analytics />` is
   already mounted in `app/layout.tsx`, but the package collects nothing until
   the feature is enabled for the project. Page views start arriving within
   about 30 seconds of the next visit.

   Two things suppress the data and are easy to mistake for a broken setup.
   Deployment Protection means only logged-in visits are ever counted, so
   volume stays near zero while the deployment is private. And the component is
   wrapped in a `NODE_ENV === 'production'` check, so nothing is sent from
   `pnpm dev`. Both are intended.

5. **Confirm it took.** Open `/api/health` on the deployed URL. It reports
   which variables are present, how many experiments loaded, and the commit
   that is live. It never returns a value, only whether one is set.

## What happens on every commit

- Push to `main`. GitHub Actions runs typecheck, the corpus check, and a full
  build. Vercel builds and promotes the same commit to production.
- Open a pull request. Vercel posts a preview URL on the PR, so a change can be
  looked at before it reaches production.

CI and Vercel build independently, so a red CI run does not block a deploy.
Turning on "Only deploy when CI passes" in the Vercel Git settings makes CI the
gate, which is worth doing once the app has real users.

## No vercel.json

A standard Next.js app needs no `vercel.json`. Framework, build command, output
directory and routing are all detected. Adding one that restates the defaults
is a file to maintain for no gain, so there isn't one here. Add it only when
there is something real to say, such as a region pin or a custom header.

## The old deployment

`product-coach.vercel.app` was created by v0 and points at the v0 project, not
at this repo. After importing the repo as its own Vercel project, either move
the domain across in Settings, then Domains, or let the new project keep its
generated URL and delete the old project once nothing links to it.
