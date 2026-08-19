# gmsv-web

Marketing/site frontend plus the Sanity Studio that manages its content.

- `studio/` — Sanity Studio (content editor), deployed to Sanity Cloud.
- `web/` — React + Vite frontend that reads content from Sanity.

Sanity project: `aqo7zrnm` · dataset: `production`.

## Prerequisites

- **Node 22** (tested on v22.21.1) and npm.
- An `.env` in `web/` with the Sanity project credentials (see below).

### Install Node with nvm

If you don't already have Node 22, install [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# reload your shell (or open a new terminal) so nvm is on PATH
exec "$SHELL"      # or: source ~/.nvm/nvm.sh
```

Install Node 22 and use it:

```bash
nvm install 22
nvm use 22
node -v            # should print v22.x
```

## 1. Run the dev servers locally

The repo has two workspaces with separate `node_modules`. Install and run
each from its own directory.

### Frontend (`web/`)

```bash
cd web
cp .env.example .env   # if an example exists; otherwise create .env manually
npm install
npm run dev
```

`web/.env` must contain:

```
VITE_SANITY_PROJECT_ID=aqo7zrnm
VITE_SANITY_DATASET=production
```

Vite prints the local URL (default http://localhost:5173). In dev the Sanity
client bypasses the CDN so published edits appear immediately.

### Studio (`studio/`)

```bash
cd studio
npm install
npm run dev
```

Studio opens at http://localhost:3333. Log in with a Sanity account that has
access to project `aqo7zrnm`.

> Tip: run `web` and `studio` in two terminals so you can edit content in
> Studio and immediately see it on the site.

## 2. Update the schema in Studio and deploy

Schemas live in `studio/schemaTypes/*.ts` and are aggregated in
`studio/schemaTypes/index.ts`.

1. **Edit the schema.** Add or modify a type file in `studio/schemaTypes/`,
   then export it from `studio/schemaTypes/index.ts` (it's registered in
   `studio/sanity.config.ts` via the `schemaTypes` array).

2. **Regenerate types for the frontend.** From `studio/`:

   ```bash
   npm run typegen
   ```

   This extracts the schemas and writes `web/sanity.types.ts`, which the
   frontend imports for typed GROQ results. If the document shape changed,
   update the GROQ query in `web/src/sanity/queries.ts` and any components
   that consume it.

3. **Verify locally.** Start `studio` (`npm run dev`) and confirm the new
   fields appear and behave as expected. Run `cd web && npm run build` to
   make sure the regenerated types still satisfy the frontend.

4. **Deploy the Studio.** From `studio/`:

   ```bash
   npm run deploy
   ```

   This publishes the updated Studio to Sanity Cloud at the project's app URL
   (appId `kf2hpa96alo5ap3plotla591`). Auto-updates are enabled, so existing
   editors get the new Studio on next load.

## Project notes

- The frontend uses Tailwind v4, shadcn (base-nova style), and the `@/` alias
  for `src/`. Sanity image URLs are built with `@sanity/image-url` via
  `web/src/sanity/image.ts`.
- Studio prettier config: no semicolons, single quotes, 100 col width.
- See `AGENTS.md` for agent-oriented guidance and verification steps.
