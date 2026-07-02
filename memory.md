# Memory — LaunchKit Phase 6 Preview Step

Last updated: 2026-07-02 23:40 JST

## What was built

Phase 6 Website MVP wizard is complete through Step 9, Preview.

Completed this session:

- Added Preview step UI in `apps/web/components/builder/steps/preview-step.tsx`.
- Added preview rendering components under `apps/web/components/builder/preview/`:
  - `stack-summary.tsx`
  - `dependency-list.tsx`
  - `script-list.tsx`
  - `env-var-list.tsx`
  - `file-tree-preview.tsx`
- Added `apps/web/lib/builder/preview.ts` to derive preview data.
- Wired Preview into `apps/web/components/builder/builder-shell.tsx`.
- Added Preview-step validation in `apps/web/lib/builder/validation.ts`.
- Updated `apps/web/lib/builder/steps.ts` Preview placeholder.
- Added `@launchkit/generator` as an explicit `apps/web` dependency in `apps/web/package.json` and `package-lock.json`.
- Updated `context/progress-tracker.md` through Phase 6 Step 9. It now says the next suggested step is Phase 6 Step 10: Build generate API route.

## Decisions made

- Preview data uses `@launchkit/generator` `createGenerationPlan(config)` for dependencies, dev dependencies, scripts, environment variables, and selected optional feature file paths.
- Generator planning is isolated in `apps/web/lib/builder/preview.ts`; React components render data only.
- Selected stack labels use `@launchkit/schema` metadata instead of raw enum values where metadata exists.
- Environment variable preview shows names, descriptions, and required status only. It does not show generated placeholder values or imply production-ready secrets.
- Full file content preview remains out of scope for Step 9.
- No generate/download API route, zip download behavior, or CLI functionality was added.

## Problems solved

- Turbopack builds still fail inside the sandbox because worker process or port binding is not permitted. The same web and workspace builds pass when rerun with elevated permissions.
- The generator plan exposes selected feature file references but not a base template file manifest. `apps/web/lib/builder/preview.ts` currently keeps a small local list of MVP base Next.js file paths until the generator exports base template file references.
- Port 3000 was already occupied by a local Node process. A sandboxed attempt to start the dev server on port 3001 failed with `listen EPERM`; the user said they will run the dev server themselves.

## Current state

- Current tracker status: Phase 6 in progress; Preview step complete; Generate API route next.
- Step 9 verification passed:
  - `npm run typecheck -w apps/web`
  - `npm run lint -w apps/web`
  - `git diff --check`
  - `npm run build -w apps/web` outside sandbox
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint`
  - `npm run build` outside sandbox
- Workspace has uncommitted changes from recent Phase 6 work, including Step 8 and Step 9 files.
- `memory.md` is now saved for the next session.
- No local dev server is running from this session.

## Next session starts with

Implement Phase 6 Step 10: Build generate API route. Start by reading `context/progress-tracker.md` and the Step 10 prompt in `.agents/prompts/phase-06/` if present.

Keep the same boundaries unless Step 10 explicitly changes them: use `@launchkit/schema` for validation, call `@launchkit/generator` from server-side code, do not put generator logic in UI components, do not add CLI functionality, and keep zip/download behavior limited to the Step 10 prompt scope.

## Open questions

- The Step 10 prompt has not been loaded yet.
- Decide whether Step 10 should also improve generator base template manifest exposure, or leave the Preview helper's local base file list in place until a later generator cleanup step.
