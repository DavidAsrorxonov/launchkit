# Memory - Phase 7 Testing And Hardening

Last updated: 2026-07-04 16:55 JST

## What was built

Phase 7 Step 2 was completed earlier in this session:

- Strengthened schema regression tests in `packages/schema/src/__tests__/config.test.ts`.
- Strengthened metadata regression tests in `packages/schema/src/__tests__/metadata.test.ts`.
- Aligned compatibility tests in `packages/schema/src/__tests__/compatibility.test.ts` with the MVP-only Tailwind styling contract.
- Updated `context/progress-tracker.md` with Step 2 results.

Phase 7 Step 3 was completed:

- Added `packages/generator/src/__tests__/generated-output-snapshots.test.ts`.
- Added real-template generator output coverage for the required MVP matrix:
  - default config;
  - shadcn;
  - PostgreSQL;
  - PostgreSQL + Prisma;
  - Auth.js credentials without PostgreSQL;
  - PostgreSQL + Docker;
  - all compatible MVP features together.
- Added targeted inline snapshots for generated path lists, parsed `package.json`, and `.env.example` line output.
- Added generated-project path safety checks, feature inclusion/exclusion checks, selected/unselected dependency and script checks, and generator-boundary incompatible config checks.
- Added template file-list boundary snapshots in `packages/templates/src/__tests__/index.test.ts`.
- Updated `context/progress-tracker.md` with Step 3 results.

## Decisions made

Phase 7 work stayed narrow:

- No generated-project smoke tests were added yet.
- No API hardening was done.
- No supported product options were changed.
- No CLI functionality was added.
- Vitest remains the test runner for schema, generator, and template tests.

The Step 3 generator snapshots are intentionally targeted, not full-project snapshots. They lock file paths, package metadata, dependency/script/env output, and feature boundaries without snapshotting every file body.

Phase 6 remains `In Progress` because manual browser/download QA is still pending.

## Problems solved

The first generator snapshot run failed because multiline `.env.example` strings were represented differently in Vitest inline snapshots than expected. The snapshot summary now stores env output as `envLines`, which made the snapshot stable and readable.

Sandboxed `npm run build` still fails in `apps/web` because Next/Turbopack tries to create a process and bind to a port during CSS processing. Running the same build with escalation passed. This is an environment constraint, not a code failure.

## Current state

The latest recorded verification passed:

- `npm test -w @launchkit/schema`: 5 files, 87 tests.
- `npm run typecheck -w @launchkit/schema`.
- `npm test -w @launchkit/generator`: 11 files, 127 tests.
- `npm test -w @launchkit/templates`: 1 file, 52 tests.
- `npm run typecheck -w @launchkit/generator`.
- `npm run typecheck -w @launchkit/templates`.
- `npm test` across workspaces:
  - web: 4 files, 23 tests;
  - generator: 11 files, 127 tests;
  - schema: 5 files, 87 tests;
  - templates: 1 file, 52 tests.
- `npm run typecheck` across workspaces.
- `npm run lint`.
- `npm run build` passed when rerun elevated after the known Turbopack sandbox failure.

At memory-save time, `git status --short` showed only:

```txt
?? .agents/prompts/phase-07/step-4.md
```

The current progress tracker says Phase 7 Step 3 is complete and suggests Step 4 next.

## Next session starts with

Read `context/progress-tracker.md`, then implement `.agents/prompts/phase-07/step-4.md`.

Expected next work is Phase 7 Step 4: add generated project smoke tests. Keep it scoped to the Step 4 prompt. Do not start API hardening, CLI work, or product-option expansion unless that prompt explicitly requires it.

## Open questions

Phase 6 browser/download QA is still unresolved. The user may still need to manually verify the website wizard and ZIP download flow before Phase 6 can be marked complete.

Step 4 may require dependency installation or generated-project package-manager execution. If network or sandbox restrictions block those smoke tests, request escalation and document exactly what passed, failed, or was skipped in `context/progress-tracker.md`.
