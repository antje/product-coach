# Deploying

The repo connects to Vercel directly through GitHub. There is no v0 in the
loop. Every push to `main` becomes a production deployment, and every pull
request gets its own preview URL, with no extra configuration.

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
   Variables. Add each one to Production, Preview and Development:

   | Variable | Needed for |
   | --- | --- |
   | `ANTHROPIC_API_KEY` | Running a review. Without it the app loads but every review returns a 503. |
   | `DATABASE_URL` | The ledger. Not needed until that lands. |
   | `WEBHOOK_SIGNING_SECRET` | Verifying experiment-result webhooks. Not needed yet. |

   `.env.example` lists the same set with notes.

3. **Confirm it took.** Open `/api/health` on the deployed URL. It reports
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
