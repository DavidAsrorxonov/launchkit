# Memory - LaunchKit Phase 6 Website Wizard

Last updated: 2026-07-02 23:27 JST

## What was built

Phase 6 Website MVP wizard is complete through Step 8, Extras.

Completed recent steps:

- Step 6 ORM: added `apps/web/components/builder/steps/orm-step.tsx`, wired `orm: "none" | "prisma"` into `builder-shell.tsx`, and added ORM validation in `apps/web/lib/builder/validation.ts`.
- Step 7 Auth: added `apps/web/components/builder/steps/auth-step.tsx`, wired `auth: "none" | "authjs-credentials"` into `builder-shell.tsx`, and added Auth-step validation.
- Step 8 Extras: added `apps/web/components/builder/steps/extras-step.tsx`, wired `docker: "none" | "postgres"` into `builder-shell.tsx`, added Extras-step validation, and updated `apps/web/lib/builder/steps.ts`.
- `context/progress-tracker.md` is updated through Phase 6 Step 8 and says the next suggested step is Phase 6 Step 9: Create Preview step.

## Decisions made

- Website wizard steps use shared `@launchkit/schema` metadata and compatibility validation rather than duplicating compatibility rules in UI code.
- UI may use local affordances to disable invalid options, such as Prisma or PostgreSQL Docker Compose requiring PostgreSQL.
- Auth.js credentials is presented as a scaffold only and does not force database or ORM selections.
- Database selection still owns narrow dependent resets: selecting no database resets Prisma ORM and PostgreSQL Docker Compose to none.
- No generator logic, API route, zip creation, download flow, preview generation, or CLI functionality has been added to `apps/web` during these wizard option steps.

## Problems solved

- Turbopack builds consistently fail inside the sandbox because worker process or port binding is not permitted. The same `npm run build -w apps/web` and root `npm run build` pass when rerun with elevated permissions.
- `authMetadata` currently has no `recommended` property, so the Auth step guards optional recommended badge rendering instead of assuming the field exists.
- Extras and ORM steps show the valid effective selection as `none` when PostgreSQL is unavailable, while still preventing invalid state updates.

## Current state

- Current tracker status: Phase 6 in progress; Extras step complete; Preview step next.
- Modified/untracked working tree from the latest step includes:
  - `apps/web/components/builder/steps/extras-step.tsx`
  - `apps/web/components/builder/builder-shell.tsx`
  - `apps/web/lib/builder/steps.ts`
  - `apps/web/lib/builder/validation.ts`
  - `context/progress-tracker.md`
  - `.agents/prompts/phase-06/step-8.md` is untracked context input.
- Verification for Step 8 passed:
  - `npm run typecheck -w apps/web`
  - `npm run lint -w apps/web`
  - `npm run build -w apps/web` outside sandbox
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint`
  - `npm run build` outside sandbox
  - `git diff --check`
- No frontend component test setup exists in `apps/web`, so no new component test stack was added.

## Next session starts with

Implement Phase 6 Step 9: Create Preview step. Start by reading `context/progress-tracker.md` and the Step 9 prompt in `.agents/prompts/phase-06/` if present. Keep the same boundaries: no API generate route, zip download behavior, or CLI unless the Step 9 prompt explicitly says otherwise.

## Open questions

- The Preview step implementation details are not yet loaded. Need inspect the Step 9 prompt to determine whether preview is schema/metadata-derived only or whether it should use any existing generator preview helpers.
- Decide whether to keep using the current manual selectable-row pattern or introduce shared option-row components after the Preview/Download steps, if duplication becomes painful.
