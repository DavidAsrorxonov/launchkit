# Memory - Phase 3 Schema Compatibility

Last updated: 2026-06-28 00:08:37 JST

## What was built

Completed Phase 3 Step 6: Add Compatibility Rules.

Created `packages/schema/src/compatibility.ts` with:

- `CompatibilityIssue`
- `LaunchKitCompatibilityError`
- `validateCompatibility(config)`
- `assertCompatibleConfig(config)`

Updated `packages/schema/src/index.ts` to re-export compatibility exports.

Expanded `packages/schema/src/index.test.ts` with compatibility tests covering:

- default config has no compatibility issues
- Prisma without PostgreSQL returns an issue
- Prisma with PostgreSQL returns no issue
- PostgreSQL Docker Compose without PostgreSQL returns an issue
- PostgreSQL Docker Compose with PostgreSQL returns no issue
- Auth.js credentials without a database returns no issue
- Auth.js credentials with Prisma and PostgreSQL returns no issue
- Auth.js credentials with Prisma but no PostgreSQL returns an issue
- shadcn/ui with Tailwind returns no issue
- `assertCompatibleConfig` throws `LaunchKitCompatibilityError` for incompatible configs

Updated `context/progress-tracker.md` to mark Phase 3 Step 6 complete and Phase 3 complete.

## Decisions made

Compatibility validation is a separate schema package API. `parseLaunchKitConfig` and `LaunchKitConfigSchema` remain focused on config shape and enum validation.

Compatibility issues use stable machine-readable `code` values, actionable `message` values, and optional `path` arrays for future UI and generator error handling.

Auth.js credentials without a database is valid. Auth.js credentials with Prisma requires PostgreSQL because Prisma itself requires PostgreSQL in the MVP.

The `shadcn/ui` requires Tailwind rule is represented even though Tailwind is currently the only supported styling option, so future styling options can reuse the same compatibility layer.

## Problems solved

The schema package now owns cross-field compatibility rules instead of leaving that logic for the future website, generator, or CLI to duplicate.

The known sandboxed Turbopack build failure still occurs when `npm run build` is run inside the sandbox because Next/Turbopack tries to create a worker process and bind a local port. Running the same command with elevated permissions passes.

## Current state

Working tree includes the Phase 3 Step 6 implementation:

- modified `context/progress-tracker.md`
- modified `packages/schema/src/index.test.ts`
- modified `packages/schema/src/index.ts`
- new `packages/schema/src/compatibility.ts`

There is also an existing untracked prompt file: `.agents/prompts/phase-03/step-6.md`.

Verification passed:

- `npm run typecheck -w packages/schema`
- `npm run test -w packages/schema` with 76 tests
- `npm run typecheck`
- `npm run test`
- `npm run lint`
- `npm run build` after elevated rerun

## Next session starts with

Proceed to Phase 4: build the reusable generator core when prompted.

Start by reading `context/progress-tracker.md`, `context/project-overview.md`, `context/architecture.md`, `context/build-plan.md`, and the relevant Phase 4 prompt. Keep the next implementation scoped to generator core work unless the prompt says otherwise.

## Open questions

None for Phase 3 Step 6.
