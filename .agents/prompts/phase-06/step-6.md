# Phase 6 Step 6: Create ORM Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 5 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 7.
Do not implement auth, extras, preview, or download steps yet.
Do not add unsupported ORMs.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the ORM step in the LaunchKit website wizard.

Users should be able to choose:

```txt
orm: "none"
orm: "prisma"
```

Prisma should only be available when:

```txt
database: "postgres"
```

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/orm-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Add ORM Selector

Add a selector for:

```ts
config.orm;
```

Supported values:

```txt
none
prisma
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
ormMetadata
```

Recommended UI:

- Segmented control
- Radio group
- Selectable option rows

Do not use a plain text input.

### 2. PostgreSQL Dependency

Prisma requires PostgreSQL.

If:

```txt
config.database !== "postgres"
```

then the Prisma option should be disabled or unavailable.

Recommended behavior:

- Show `No ORM` as selected.
- Show Prisma as disabled with a concise reason: `Requires PostgreSQL`.
- Keep `config.orm` as `"none"`.

Do not silently enable PostgreSQL when Prisma is selected.

### 3. State Updates

When the user changes the ORM option:

- Update `config.orm`.
- Preserve all other builder config values.

If selecting Prisma:

- Only allow it when `config.database === "postgres"`.
- Keep `database` unchanged.

If selecting none:

- Set `config.orm` to `"none"`.
- Preserve database, auth, and docker selections unless the existing validation helper requires a narrow compatibility fix.

### 4. Compatibility

The schema should already have this compatibility rule:

```txt
Prisma requires PostgreSQL.
```

Use schema helpers from:

```txt
@launchkit/schema
```

to validate compatibility if the builder shell already supports compatibility issue display.

Do not duplicate compatibility rules manually except for UI affordances such as disabling the Prisma option when PostgreSQL is not selected.

### 5. Do Not Implement Later Steps

Do not add controls for:

```txt
auth
docker
preview
download
```

Those belong to later Phase 6 steps.

### 6. Navigation Behavior

The user should be able to move Back and Next when:

```txt
orm: "none"
```

or:

```txt
database: "postgres"
orm: "prisma"
```

If the current config somehow has:

```txt
database: "none"
orm: "prisma"
```

show a concise error and prevent moving forward.

### 7. Visual Direction

Keep the UI practical and compact.

Recommended presentation:

- Two selectable rows: "No ORM" and "Prisma".
- Short descriptions from schema metadata.
- Recommended indicator for Prisma if metadata marks it recommended.
- Disabled state for Prisma when PostgreSQL is not selected.

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

### 8. Generator Boundary

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

- ORM step renders `none` and `prisma` options.
- Prisma option is disabled when database is `none`.
- Prisma option is enabled when database is `postgres`.
- Selecting Prisma updates `config.orm` only when PostgreSQL is selected.
- Selecting no ORM updates `config.orm`.
- Unsupported ORMs are not rendered.
- Invalid config with Prisma and no PostgreSQL prevents moving forward.

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
Phase 6 Step 6 completed: Create ORM step

Changes made:
- Added ORM step UI.
- Added ORM selector for none and Prisma.
- Used @launchkit/schema metadata where available.
- Connected ORM selection to shared builder config state.
- Disabled Prisma unless PostgreSQL is selected.
- Confirmed unsupported ORMs are not exposed.

Files changed:
- apps/web/components/builder/steps/orm-step.tsx
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
- Phase 6 Step 7: Create auth step
```

## Completion Criteria

This step is complete when:

- ORM step renders in the wizard.
- ORM selector supports `none` and `prisma`.
- Prisma is disabled or unavailable when PostgreSQL is not selected.
- Prisma can be selected when PostgreSQL is selected.
- Selecting an ORM option updates builder config state.
- Unsupported ORMs are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
