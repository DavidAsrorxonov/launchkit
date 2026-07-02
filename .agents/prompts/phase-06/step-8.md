# Phase 6 Step 8: Create Extras Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 7 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 9.
Do not implement preview or download steps yet.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add unsupported extras.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Extras step in the LaunchKit website wizard.

For the MVP, Extras controls the optional Docker Compose setup for local PostgreSQL development:

```txt
docker: "none"
docker: "postgres"
```

Docker PostgreSQL should only be available when:

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
apps/web/components/builder/steps/extras-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Add Docker Selector

Add a selector for:

```ts
config.docker;
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
dockerMetadata
```

Recommended UI:

- Segmented control
- Radio group
- Selectable option rows
- Toggle with clear label

Do not use a plain text input.

### 2. PostgreSQL Dependency

Docker PostgreSQL requires PostgreSQL.

If:

```txt
config.database !== "postgres"
```

then the Docker PostgreSQL option should be disabled or unavailable.

Recommended behavior:

- Show `No Docker setup` as selected.
- Show Docker PostgreSQL as disabled with a concise reason: `Requires PostgreSQL`.
- Keep `config.docker` as `"none"`.

Do not silently enable PostgreSQL when Docker PostgreSQL is selected.

### 3. State Updates

When the user changes the Docker option:

- Update `config.docker`.
- Preserve all other builder config values.

If selecting Docker PostgreSQL:

- Only allow it when `config.database === "postgres"`.
- Keep `database` unchanged.

If selecting none:

- Set `config.docker` to `"none"`.
- Preserve database, ORM, auth, and UI selections.

### 4. Compatibility

The schema should already have this compatibility rule:

```txt
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
```

Use schema helpers from:

```txt
@launchkit/schema
```

to validate compatibility if the builder shell already supports compatibility issue display.

Do not duplicate compatibility rules manually except for UI affordances such as disabling Docker PostgreSQL when PostgreSQL is not selected.

### 5. Do Not Implement Later Steps

Do not add:

```txt
preview generation
download generation
API route
zip creation
```

Those belong to later Phase 6 steps.

### 6. Navigation Behavior

The user should be able to move Back and Next when:

```txt
docker: "none"
```

or:

```txt
database: "postgres"
docker: "postgres"
```

If the current config somehow has:

```txt
database: "none"
docker: "postgres"
```

show a concise error and prevent moving forward.

### 7. Visual Direction

Keep the UI practical and compact.

Recommended presentation:

- Two selectable rows: "No Docker setup" and "PostgreSQL Docker Compose".
- Short descriptions from schema metadata.
- Disabled state for Docker PostgreSQL when PostgreSQL is not selected.
- Small note that Docker Compose is for local development.

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
Switch
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

- Extras step renders `none` and Docker PostgreSQL options.
- Docker PostgreSQL option is disabled when database is `none`.
- Docker PostgreSQL option is enabled when database is `postgres`.
- Selecting Docker PostgreSQL updates `config.docker` only when PostgreSQL is selected.
- Selecting no Docker updates `config.docker`.
- Unsupported extras are not rendered.
- Invalid config with Docker PostgreSQL and no PostgreSQL prevents moving forward.

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
Phase 6 Step 8 completed: Create extras step

Changes made:
- Added Extras step UI.
- Added Docker selector for none and PostgreSQL Docker Compose.
- Used @launchkit/schema metadata where available.
- Connected Docker selection to shared builder config state.
- Disabled Docker PostgreSQL unless PostgreSQL is selected.
- Confirmed unsupported extras are not exposed.

Files changed:
- apps/web/components/builder/steps/extras-step.tsx
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
- Phase 6 Step 9: Create preview step
```

## Completion Criteria

This step is complete when:

- Extras step renders in the wizard.
- Docker selector supports `none` and `postgres`.
- Docker PostgreSQL is disabled or unavailable when PostgreSQL is not selected.
- Docker PostgreSQL can be selected when PostgreSQL is selected.
- Selecting a Docker option updates builder config state.
- Unsupported extras are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
