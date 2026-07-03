# Phase 6 Step 12: Responsive UI Polish and Phase 6 Verification

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Steps 1-11 are complete.
4. Read this step prompt.
5. Implement only this verification and polish step.

Do not start Phase 7.
Do not add CLI functionality.
Do not add new product options.
Do not add unsupported frameworks, databases, ORMs, auth providers, UI libraries, or package managers.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Polish and verify the complete LaunchKit website MVP wizard.

This step should make sure the website flow is usable, responsive, visually consistent, and correctly connected to schema, generator, preview, API generation, and download behavior.

Phase 6 should only be marked complete if the website MVP genuinely works.

## Scope

Work inside:

```txt
apps/web/
```

Make small, focused fixes across the Phase 6 website files as needed.

Do not perform unrelated refactors.

## Required User Flow

Verify the full website flow:

```txt
1. Project
2. Framework
3. Styling and UI
4. Database
5. ORM
6. Auth
7. Extras
8. Preview
9. Download
```

The user should be able to:

1. Open the website.
2. Enter a valid project name.
3. Choose package manager.
4. Review fixed framework choices.
5. Choose UI option.
6. Choose database option.
7. Choose ORM option.
8. Choose auth option.
9. Choose Docker option.
10. Preview generated output.
11. Download a zip.

## Verification Checklist

### 1. Wizard Navigation

Confirm:

- All 9 steps render.
- Back and Next work.
- Back is disabled on the first step.
- Next is disabled or replaced appropriately on the last step.
- Step progress updates correctly.
- Invalid current-step config prevents advancing.
- Users can return to previous steps without losing selections.

### 2. Project Step

Confirm:

- Project name input works.
- Project name validation matches `@launchkit/schema`.
- Invalid names show concise errors.
- Invalid names prevent advancing.
- Package manager selector supports `npm` and `pnpm`.

### 3. Framework Step

Confirm:

- Next.js is shown.
- TypeScript is shown.
- App Router is shown.
- No `src/` structure is shown.
- Unsupported framework choices are not exposed.

### 4. Styling and UI Step

Confirm:

- Tailwind CSS is shown as fixed.
- UI selector supports `none` and `shadcn`.
- Unsupported styling systems and UI libraries are not exposed.
- shadcn selection remains compatible with Tailwind.

### 5. Database Step

Confirm:

- Database selector supports `none` and `postgres`.
- Selecting `database: "none"` resets incompatible Prisma and Docker selections.
- Selecting `database: "none"` does not reset Auth.js credentials.
- Unsupported databases are not exposed.

### 6. ORM Step

Confirm:

- ORM selector supports `none` and `prisma`.
- Prisma is disabled or unavailable unless PostgreSQL is selected.
- Prisma can be selected when PostgreSQL is selected.
- Unsupported ORMs are not exposed.

### 7. Auth Step

Confirm:

- Auth selector supports `none` and `authjs-credentials`.
- Auth.js credentials can be selected without PostgreSQL.
- Auth.js credentials does not force database or ORM changes.
- Auth.js credentials is clearly described as a scaffold.
- Unsupported auth providers are not exposed.

### 8. Extras Step

Confirm:

- Docker selector supports `none` and `postgres`.
- Docker PostgreSQL is disabled or unavailable unless PostgreSQL is selected.
- Docker PostgreSQL can be selected when PostgreSQL is selected.
- Unsupported extras are not exposed.

### 9. Preview Step

Confirm preview shows:

```txt
Selected stack summary
Dependencies
Dev dependencies
Scripts
Environment variables
Generated file tree
```

Confirm:

- Preview matches selected options.
- Preview excludes unselected optional feature files.
- Preview does not show `src/`.
- Invalid config shows concise errors.

### 10. API Generate Route

Confirm:

- `POST /api/generate` validates config with `@launchkit/schema`.
- Compatibility validation runs server-side.
- The route calls `@launchkit/generator`.
- Invalid config returns structured errors.
- Incompatible config returns structured errors.
- The route does not execute generated code.
- The route does not install generated dependencies.
- The route does not write generated project files to disk.
- Generated paths are safe before response.

### 11. Download Flow

Confirm:

- Download button calls the API route.
- Loading state appears while generating.
- Errors are displayed clearly.
- A zip downloads on success.
- Zip file is named from the project name.
- Zip contains a top-level project folder.
- Zip contains expected generated files.
- Zip does not include `src/`.
- Zip does not include unsafe paths.

## Responsive UI Polish

Verify and polish the UI at common viewport sizes:

```txt
mobile: 375px wide
tablet: 768px wide
desktop: 1280px wide
wide desktop: 1440px+ wide
```

Fix issues such as:

- Text overflow.
- Button labels wrapping badly.
- Step navigation crowding.
- Panels becoming too narrow.
- File tree overflowing without scroll handling.
- Preview lists becoming unreadable.
- Download state layout breaking.
- Touch targets being too small on mobile.

Use stable dimensions and responsive constraints where needed.

Do not use viewport-width-based font sizing.
Do not use negative letter spacing.
Do not add decorative gradient blobs/orbs.
Do not nest cards inside cards.

## Visual Consistency

Confirm the website still feels like a focused developer tool:

- Minimal
- Fast to scan
- Practical
- Trustworthy
- Technical without clutter

Use token-based classes:

```txt
bg-background
text-foreground
bg-primary
text-primary-foreground
border-border
text-muted-foreground
ring-ring
bg-accent
```

Remove repeated one-off hardcoded color utilities where practical:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Do not redesign the whole app. Make focused polish fixes only.

## Tests

Use Vitest only.

Add or update focused tests where the current test setup supports it.

Recommended coverage:

- Wizard navigation.
- Project name validation.
- Dependent option behavior.
- Preview excludes unselected features.
- API route validation.
- Download zip path safety helper.

Do not introduce a large new frontend test stack in this final verification step unless the repo already has the foundation for it.

## Verification Commands

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

If app-specific commands exist, also run:

```bash
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

If schema/generator packages may be affected, run:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the web app can run locally, manually verify:

1. Start the web app.
2. Complete the wizard with default options.
3. Preview the generated output.
4. Download the zip.
5. Inspect the zip contents.
6. Repeat with all compatible MVP features selected:
   - shadcn/ui
   - PostgreSQL
   - Prisma
   - Auth.js credentials
   - Docker PostgreSQL
7. Confirm invalid combinations are prevented or explained.
8. Check mobile, tablet, and desktop widths.

If local app startup is not possible, document why in `progress-tracker.md`.

## Progress Tracker Update

After verification, update `progress-tracker.md`.

If Phase 6 is complete, mark:

```txt
Phase 6: Complete
Phase 7: Ready
```

Add an entry like:

```txt
Phase 6 Step 12 completed: Responsive UI polish and Phase 6 verification

Changes made:
- Verified full website wizard flow.
- Verified all Phase 6 steps.
- Polished responsive layout issues.
- Verified API generation route.
- Verified download flow.
- Verified generated zip contents.
- Fixed any small in-scope issues found during verification.

Files changed:
- apps/web/..., if polish fixes were needed
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Manual verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 1: Begin testing, validation, and hardening
```

If Phase 6 is not complete, do not mark it complete. Instead record:

```txt
Phase 6: In progress
Blocked/missing:
- ...

Next suggested step:
- Fix the listed Phase 6 blocker before starting Phase 7.
```

## Completion Criteria

This step is complete when:

- All 9 wizard steps work.
- Builder state persists while navigating between steps.
- Schema validation works in the UI.
- Compatibility behavior works in the UI.
- Preview accurately reflects selected options.
- API generation route works.
- Download flow produces a zip.
- Zip contents are correct and safe.
- No generated project contains `src/`.
- The website is usable on mobile, tablet, and desktop.
- No generator logic is duplicated in UI components.
- No generated code is executed or installed by the website.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.
- Phase 6 is marked complete only if the website MVP genuinely works.

Then stop.
