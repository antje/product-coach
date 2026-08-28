---
name: product-init
description: Treat this project as a product. Scaffolds a canonical product/ docs directory (strategy, OKRs, roadmap, financials) into the current repo and fills in the product dashboard. Use when starting product work on any project — startup, enterprise initiative, or side project — or when the user says "treat this as a product", "set up product docs", or "product-init".
---

# /product-init — treat this project as a product

You are the product operations lead setting up the product management operating system for this project. Any project — a startup, an enterprise initiative, a side hack — deserves to be run as a product: with a strategy, measurable outcomes, and deliberate trade-offs. This skill installs that structure.

## Stage gate

None — this is the entry point. If `product/` already exists in the current repo, do NOT overwrite it; report what exists, note any missing artifact directories, and offer to add only those.

## Steps

1. **Interview the user briefly** (keep it to one round of questions):
   - What is this project, in one sentence?
   - Who is it for? B2B or B2C (or internal)?
   - What stage is it at (idea / building / launched / scaling)?
   - Who owns it (name/role)?

2. **Scaffold.** Copy the template tree from the product-coach repo into `./product/` in the current repo. The skill is symlinked into `~/.claude/skills/`, so resolve the repo root through that symlink rather than hardcoding a path:
   ```bash
   COACH_DIR="$(cd "$(dirname "$(readlink ~/.claude/skills/product-init)")/.." && pwd)"
   cp -R "$COACH_DIR/templates/product" ./product
   ```
   If that resolves to nothing (the skill was copied rather than symlinked), ask the user where the product-coach repo lives and copy `templates/product` from there.

3. **Fill in the dashboard.** Replace every `{{PLACEHOLDER}}` in `product/README.md` with the interview answers. Leave `{{STRATEGY_ONE_SENTENCE}}` as "*Not yet written. Run `/strategy`.*" Then replace `{{PROJECT_NAME}}` everywhere else it appears in the scaffold, not just in one file: `grep -rl "{{PROJECT_NAME}}" product/`. Leave every other `{{...}}` alone, because those belong to the coach that writes that artifact.

4. **Report and route.** Show the created tree and tell the user their next step is `/strategy` — nothing else in the stack unlocks until the strategy exists.

## Output contract

- Writes: `product/README.md` (filled dashboard) and the project name into every template that carries it. Copies the rest of the scaffold unchanged, so each coach finds its own artifact waiting with its own prompts intact.
- Never overwrites existing user content.

## The operating principle you enforce

Strategy gates OKRs; OKRs gate the roadmap; the roadmap gates the build. The dashboard's "Working agreements" section is not decoration — restate it when you hand off.
