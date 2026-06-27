# Memory - Phase 2.5 Testing Setup

Last updated: 2026-06-27 20:19:22 JST

## What was built

Phase 2.5 from `context/build-plan.md` was implemented. Vitest is installed at the workspace root, `npm test` runs package-level tests across workspaces, and `@launchkit/schema` has its own `vitest run` script and Vitest config.

Files added or changed for this work:

- `package.json`
- `package-lock.json`
- `packages/schema/package.json`
- `packages/schema/tsconfig.json`
- `packages/schema/vitest.config.ts`
- `packages/schema/src/index.test.ts`
- `context/progress-tracker.md`

## Decisions made

Testing was added narrowly for Phase 2.5 only. The schema package still uses its placeholder export, and the initial test only verifies that current entry point so Phase 3 schema design is not started early.

Vitest is configured at the schema package level with Node test environment and `src/**/*.test.ts` as the test include pattern. Schema test files are excluded from package build output.

## Problems solved

The first `npm install` failed under sandboxed network restrictions with DNS resolution failure for `registry.npmjs.org`. It was rerun with approved network access and completed, updating `package-lock.json`.

The initial sandboxed `npm run build` hit a Turbopack process/port permission error. Running the build outside the sandbox showed the web app itself builds successfully.

## Current state

The worktree was clean when this memory was saved.

`npm test` passes and runs the schema Vitest suite successfully.

`npm run lint` passes.

`npm run typecheck` fails in `@launchkit/schema` because `packages/schema/tsconfig.json` contains `ignoreDeprecations: "6.0"`, which is invalid for the installed TypeScript version.

`npm run build` still fails at the same schema TypeScript config issue, although the web app build succeeds when allowed to run outside the sandbox.

`npm install` reported 2 moderate vulnerabilities in the current dependency graph.

## Next session starts with

Fix the schema package TypeScript config blocker in `packages/schema/tsconfig.json`, then rerun:

```bash
npm run typecheck
npm run build
npm test
```

After those pass, update `context/progress-tracker.md` and continue with the next Phase 2 tooling step instead of moving into Phase 3 prematurely.

## Open questions

- Should Phase 2 mark earlier setup checklist items as complete now that the repo already contains the app/package structure?
- Should the dependency audit vulnerabilities be addressed during Phase 2 tooling cleanup or deferred until later hardening?
