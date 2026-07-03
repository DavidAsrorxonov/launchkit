# Memory - Phase 6 Step 12 Website Polish

Last updated: 2026-07-03 14:44 JST

## What was built

Phase 6 Step 12 was implemented for the LaunchKit website MVP.

Responsive polish was applied across the wizard:

- `apps/web/components/builder/wizard-step-panel.tsx`: removed the extra dashed inner frame and tightened mobile header spacing.
- `apps/web/components/builder/wizard-progress.tsx`: progress cards now use short labels on mobile/tablet and full labels on large screens.
- `apps/web/components/builder/builder-shell.tsx`: improved project-name and current-selection wrapping.
- Preview components now wrap long names or scroll exact command text safely:
  - `dependency-list.tsx`
  - `env-var-list.tsx`
  - `script-list.tsx`
  - `stack-summary.tsx`
- Step option cards now wrap badges/radio indicators cleanly on narrow viewports:
  - `project-step.tsx`
  - `framework-step.tsx`
  - `styling-ui-step.tsx`
  - `database-step.tsx`
  - `orm-step.tsx`
  - `auth-step.tsx`
  - `extras-step.tsx`
- `apps/web/components/builder/steps/download-step.tsx`: project name and selected stack values wrap instead of truncating.

Added `apps/web/lib/builder/phase-6-verification.test.ts` with focused Vitest coverage for:

- required 9-step wizard order;
- supported MVP option values only;
- project-name validation;
- unsupported package manager rejection;
- Auth.js credentials compatibility without PostgreSQL;
- Prisma and Docker PostgreSQL rejection without PostgreSQL;
- preview data for selected stack, dependencies, dev dependencies, scripts, env vars, and file tree;
- unselected optional feature exclusion;
- `src/` path exclusion;
- full-stack preview additions for shadcn, PostgreSQL, Prisma, Auth.js credentials, and Docker.

Updated `context/progress-tracker.md` with the Step 12 change log, verification results, and manual-QA handoff.

## Decisions made

Phase 6 remains `In Progress` until manual browser/download QA is completed by the user. Step 12 code and automated verification are complete, but the phase should not be marked complete until the user confirms the website MVP works end to end in a real browser.

No CLI work was started. No new product options were added. Generator logic remains outside UI components.

The new verification test follows the current generator contract: Prisma scripts include `db:push`, not `db:migrate`.

## Problems solved

The first Step 12 web test run failed because the new verification test expected `db:migrate`; the generator currently exposes `db:push`. The test was corrected.

The first Step 12 web typecheck failed because an intentionally invalid `packageManager: "yarn"` test value needed to be cast through `unknown` before `LaunchKitConfig`. The test was corrected.

`npm run build -w apps/web` fails inside the sandbox because Turbopack cannot create/bind worker processes. Rerunning the web build with elevated permissions passed.

Browser QA could not be completed in-session:

- the in-app browser connector failed with an internal `sandbox-state-meta` Node REPL error;
- the workspace has no Playwright or `@playwright/test`;
- sandboxed localhost `curl` could not connect;
- elevated localhost `curl` was not allowed;
- elevated `npm run dev -w apps/web` found another Next dev server lock/process;
- the user said they will do manual browser/download QA themselves.

## Current state

Automated verification passed:

- `npm run test -w apps/web`: 4 files, 23 tests.
- `npm run typecheck -w apps/web`.
- `npm run lint -w apps/web`.
- `npm run build -w apps/web` passed when rerun elevated after the sandbox Turbopack failure.
- `npm run typecheck` across workspaces.
- `npm run test` across workspaces: web 23 tests, generator 111 tests, schema 73 tests, templates 51 tests.
- `npm run lint`.
- `git diff --check`.

The progress tracker says Phase 6 Step 12 responsive polish and automated verification are complete, but Phase 6 is still `In Progress` pending user-run manual browser/download QA.

At the time memory was saved, `git status --short` was clean before writing this memory file.

## Next session starts with

Wait for the user to report results from manual QA, or ask them to run the website flow at 375px, 768px, 1280px, and 1440px+ widths:

1. Enter a valid project name.
2. Choose npm or pnpm.
3. Walk through all 9 wizard steps.
4. Try invalid project names and blocked Prisma/Docker combinations.
5. Verify Preview content and no `src/` paths.
6. Click `Generate ZIP`.
7. Confirm the ZIP downloads, is named from the project name, contains a top-level folder, contains expected files, and excludes unsafe/`src/` paths.

If manual QA passes, update `context/progress-tracker.md` to mark Phase 6 complete. If QA finds issues, make focused fixes in `apps/web/` only.

## Open questions

Did the user-run browser/download QA pass on mobile, tablet, desktop, and wide desktop?

Should the repo add a browser automation dependency later for repeatable responsive/download QA, or keep this manual until Phase 7?
