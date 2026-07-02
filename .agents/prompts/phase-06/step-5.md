# Phase 6 Step 5: Create Database Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 4 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 6.
Do not implement ORM, auth, extras, preview, or download steps yet.
Do not add unsupported databases.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Database step in the LaunchKit website wizard.

Users should be able to choose:

```txt
database: "none"
database: "postgres"
```

This step should only select the database layer. Prisma, Auth.js, and Docker options are handled in later steps.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/database-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Add Database Selector

Add a selector for:

```ts
config.database;
```

Supported values:

```txt
none
postgres
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
databaseMetadata
```

Recommended UI:

- Segmented control
- Radio group
- Selectable option rows

Do not use a plain text input.

### 2. State Updates

When the user changes the database option:

- Update `config.database`.
- Preserve all other builder config values unless a dependent value would become invalid.

If changing from PostgreSQL to none would make existing selections invalid, apply the smallest clear reset needed.

Recommended behavior:

```txt
If database becomes "none":
  - set orm to "none" if it was "prisma"
  - set docker to "none" if it was "postgres"
  - keep auth unchanged, because authjs-credentials may work without a database
```

This preserves compatibility while avoiding hidden invalid config.

### 3. Compatibility Awareness

The schema should already have these compatibility rules:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
```

Use schema helpers from:

```txt
@launchkit/schema
```

to validate compatibility if the builder shell already supports compatibility issue display.

Do not duplicate compatibility rules manually in UI code unless needed for dependent-field reset behavior.

### 4. Do Not Implement Later Steps

Do not add controls for:

```txt
orm
auth
docker
```

Those belong to later Phase 6 steps.

This step may reset invalid dependent values when database changes, but it should not render the dependent controls.

### 5. Navigation Behavior

The user should be able to move Back and Next when:

```txt
database: "none" or "postgres"
```

If the current config somehow violates schema compatibility, show a concise error and prevent moving forward.

Do not add validation gates for future steps beyond compatibility issues caused by database selection.

### 6. Visual Direction

Keep the UI practical and compact.

Recommended presentation:

- Two selectable rows: "No database" and "PostgreSQL".
- Short descriptions from schema metadata.
- Recommended indicator for PostgreSQL if metadata marks it recommended.
- Optional small note that Prisma and Docker are configured later.

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

Avoid repeated hardcoded color utilities:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Use existing shadcn/ui components if available:

```txt
RadioGroup
Badge
Button
Separator
```

Do not nest cards inside cards.

### 7. Generator Boundary

Do not call:

```txt
@launchkit/generator
```

This step only renders and updates builder state.

The API route and generator integration belong to later Phase 6 steps.

## Tests

Use the test setup already present in the repo.

Add or update focused tests only if the app already has a frontend test pattern.

Possible tests:

- Database step renders `none` and `postgres` options.
- Selecting PostgreSQL updates `config.database`.
- Selecting no database updates `config.database`.
- Selecting no database resets Prisma ORM to none if previously selected.
- Selecting no database resets Docker PostgreSQL to none if previously selected.
- Selecting no database does not reset Auth.js credentials.
- Unsupported databases are not rendered.

If the repo does not yet have frontend component testing configured, do not add a large new test stack in this step. Document that in `progress-tracker.md`.

## Verification

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

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 6 Step 5 completed: Create database step

Changes made:
- Added Database step UI.
- Added database selector for none and PostgreSQL.
- Used @launchkit/schema metadata where available.
- Connected database selection to shared builder config state.
- Added dependent reset behavior for Prisma and Docker when PostgreSQL is disabled.
- Confirmed unsupported databases are not exposed.

Files changed:
- apps/web/components/builder/steps/database-step.tsx
- apps/web/components/builder/builder-shell.tsx
- apps/web/lib/builder/steps.ts, if changed
- apps/web/lib/builder/builder-state.ts, if changed
- apps/web/lib/builder/validation.ts, if changed
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 6: Create ORM step
```

## Completion Criteria

This step is complete when:

- Database step renders in the wizard.
- Database selector supports `none` and `postgres`.
- Selecting a database option updates builder config state.
- Selecting `database: "none"` resets incompatible Prisma and Docker selections.
- Selecting `database: "none"` does not reset Auth.js credentials.
- Unsupported databases are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
