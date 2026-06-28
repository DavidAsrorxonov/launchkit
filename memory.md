# Memory - Phase 4 Generator Checkpoint

Last updated: 2026-06-28 23:33 JST

## What was built

- Completed Phase 4 Step 10 and updated `context/progress-tracker.md`.
- Marked Phase 4 as complete and Phase 5 as ready.
- Fixed built ESM package loading for `@launchkit/schema` and `@launchkit/generator`.
- Updated schema and generator package TypeScript configs to use `NodeNext` module and module resolution.
- Updated production relative imports/exports in schema and generator source to use `.js` specifiers.
- Confirmed generator tests live under `packages/generator/src/__tests__/`, matching the schema package test folder structure.

## Decisions made

- Generator package tests should remain in `packages/generator/src/__tests__/`.
- Schema and generator packages should emit Node-loadable ESM using NodeNext settings and explicit `.js` relative specifiers.
- Phase 4 remains limited to the generator core foundation; real templates, adapters, UI, and CLI work stay out of scope until later phases.

## Problems solved

- Direct Node import of `packages/generator/dist/index.js` originally failed because emitted ESM used extensionless relative imports.
- The failure was fixed by switching schema/generator builds to NodeNext and updating production relative import/export specifiers.
- Workspace build fails inside the sandbox because Next/Turbopack cannot create or bind its worker process there; rerunning the same build outside the sandbox passes.

## Current state

- Worktree was clean before saving this memory, except this new `memory.md` file.
- `context/progress-tracker.md` records Phase 4 Step 10 completion and Phase 4 completion.
- Verification passed:
  - `npm run typecheck`
  - `npm run test` with generator 87 tests and schema 72 tests
  - `npm run lint`
  - `npm run build` after elevated rerun outside the sandbox
  - Direct Node smoke import of `packages/generator/dist/index.js`
- The built generator smoke check generated placeholder files: `package.json`, `.env.example`, and `README.md`.
- No Phase 5 templates, output adapters, website UI, or CLI features have been added.

## Next session starts with

- Start Phase 5 Step 1 when prompted.
- Read `context/progress-tracker.md` and the relevant Phase 5 prompt before editing.
- Keep Phase 5 work scoped to template implementation unless the prompt explicitly expands scope.

## Open questions

- None currently documented.
