# Memory - LaunchKit Phase 5 Templates

Last updated: 2026-07-02 11:57 JST

## What was built

- Completed Phase 5 Step 5: PostgreSQL template contribution.
  - Added `packages/templates/features/postgres/.env.example`.
  - Added `packages/templates/features/postgres/README.md`.
  - Added `postgresTemplateId`.
  - PostgreSQL feature contributes `DATABASE_URL` and README notes.
  - Env values now support template placeholders before `.env.example` rendering.
- Completed Phase 5 Step 6: Prisma template contribution.
  - Added `packages/templates/features/prisma/prisma/schema.prisma`.
  - Added `packages/templates/features/prisma/lib/db.ts`.
  - Added `packages/templates/features/prisma/README.md`.
  - Added `packages/templates/features/prisma/prisma.config.ts` during the Prisma v7 correction.
  - Added `prismaTemplateId`.
  - Prisma feature contributes dependencies, scripts, template file references, and README notes.
- Updated Prisma template to Prisma v7.
  - `schema.prisma` no longer contains datasource `url`.
  - `schema.prisma` uses `provider = "prisma-client"` and `output = "../lib/generated/prisma"`.
  - `prisma.config.ts` loads `DATABASE_URL` through Prisma Config.
  - `lib/db.ts` imports generated Prisma Client and uses `@prisma/adapter-pg`.
  - Generator emits `type: "module"` in generated `package.json` when Prisma is selected.
  - Prisma package contributions now include `@prisma/client`, `@prisma/adapter-pg`, `dotenv`, and dev dependency `prisma`.
- Tests were updated across templates and generator to cover PostgreSQL, Prisma, and Prisma v7 behavior.
- `context/progress-tracker.md` was updated through Phase 5 Step 6 before the Prisma v7 correction. It does not yet record the follow-up Prisma v7 fix.

## Decisions made

- Keep Prisma root README guidance generated from feature notes rather than copying `packages/templates/features/prisma/README.md` into generated project root, to avoid colliding with the generated root `README.md`.
- Use Prisma v7 instead of pinning Prisma to v6 because generator metadata uses `latest`.
- Use `@prisma/adapter-pg` for direct PostgreSQL runtime connections.
- Do not add a separate `pg` dependency because npm metadata for `@prisma/adapter-pg@latest` shows it already depends on `pg`, `@types/pg`, `postgres-array`, and Prisma driver adapter utilities.
- Keep Prisma compatibility in schema unchanged; existing tests already enforce `Prisma requires PostgreSQL.`.

## Problems solved

- Opening `packages/templates/features/prisma/prisma/schema.prisma` showed a Prisma v7 validation error because datasource `url` is no longer supported in Prisma schema files. Fixed by moving URL config to `prisma.config.ts`.
- Prisma v7 requires the generated client output path and ESM-compatible package metadata. Fixed with `output = "../lib/generated/prisma"` and generated `package.json` `type: "module"` when Prisma is selected.
- Prisma v7 direct database connections require a driver adapter. Fixed `lib/db.ts` to use `@prisma/adapter-pg`.
- Workspace build still fails inside the sandbox due Turbopack trying to create/bind a worker process. Rerunning `npm run build` with elevated permissions passes.

## Current state

- Working tree at the time of saving shows only untracked `.agents/prompts/phase-05/step-7.md`.
- Prisma v7 code changes and tests had passed before saving:
  - `npm run typecheck -w @launchkit/templates`
  - `npm test -w @launchkit/templates`
  - `npm run typecheck -w @launchkit/generator`
  - `npm test -w @launchkit/generator`
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint`
  - `git diff --check`
  - `npm run build` passed when rerun outside the sandbox after the known Turbopack sandbox failure.
- `progress-tracker.md` currently says Phase 5 Step 6 is complete and recommends Phase 5 Step 7.
- The Prisma v7 follow-up was completed after the Step 6 tracker entry, so the tracker should be updated if strict historical tracking is required before moving on.

## Next session starts with

Read `context/progress-tracker.md` and `.agents/prompts/phase-05/step-7.md`, then implement Phase 5 Step 7: Create Auth.js credentials template. Before implementation, decide whether to first add a brief progress-tracker note for the Prisma v7 correction.

## Open questions

- Should `context/progress-tracker.md` get an explicit follow-up entry for the Prisma v7 correction before starting Step 7?
- When Auth.js template work starts, check whether Auth.js should integrate with the generic Prisma `User` model or keep Auth.js data model additions isolated to the Auth.js feature template.
