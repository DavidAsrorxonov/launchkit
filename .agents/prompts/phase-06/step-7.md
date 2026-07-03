# Phase 6 Step 7: Create Auth Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 6 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 8.
Do not implement extras, preview, or download steps yet.
Do not add unsupported auth providers.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Auth step in the LaunchKit website wizard.

Users should be able to choose:

```txt
auth: "none"
auth: "authjs-credentials"
```

The Auth.js credentials option is a scaffold only. The UI should not imply production-ready authentication.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/auth-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Add Auth Selector

Add a selector for:

```ts
config.auth;
```

Supported values:

```txt
none
authjs-credentials
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
authMetadata
```

Recommended UI:

- Segmented control
- Radio group
- Selectable option rows

Do not use a plain text input.

### 2. Auth.js Credentials Messaging

The Auth.js credentials option should clearly communicate that it is a scaffold.

It should not imply:

- Production-ready auth.
- Complete user management.
- Secure password verification out of the box.
- A complete sign-in UI.

Use concise wording such as:

```txt
Adds Auth.js credentials structure that you connect to your user model and password verification.
```

Do not over-explain implementation details in the UI.

### 3. State Updates

When the user changes the auth option:

- Update `config.auth`.
- Preserve all other builder config values.

Auth.js credentials may work without a database, so do not force PostgreSQL on when auth is selected.

Do not reset database or ORM when auth changes unless the current schema validation requires a narrow compatibility fix.

### 4. Compatibility

The schema should already represent these rules:

```txt
Auth.js credentials scaffold may work without a database.
Auth.js credentials scaffold with Prisma requires PostgreSQL and Prisma.
Prisma requires PostgreSQL.
```

Verify the UI allows:

```txt
auth: "authjs-credentials", database: "none", orm: "none"
auth: "authjs-credentials", database: "postgres", orm: "none"
auth: "authjs-credentials", database: "postgres", orm: "prisma"
```

Use schema helpers from:

```txt
@launchkit/schema
```

to validate compatibility if the builder shell already supports compatibility issue display.

Do not duplicate compatibility rules manually in UI code unless needed for a small UI affordance.

### 5. Do Not Implement Later Steps

Do not add controls for:

```txt
docker
preview
download
```

Those belong to later Phase 6 steps.

### 6. Navigation Behavior

The user should be able to move Back and Next when:

```txt
auth: "none"
```

or:

```txt
auth: "authjs-credentials"
```

as long as the full config is schema-compatible.

If the current config somehow violates compatibility, show a concise error and prevent moving forward.

### 7. Visual Direction

Keep the UI practical and compact.

Recommended presentation:

- Two selectable rows: "No auth" and "Auth.js credentials scaffold".
- Short descriptions from schema metadata.
- A small scaffold warning for Auth.js credentials.
- No marketing-style auth provider grid.

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
Alert
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

- Auth step renders `none` and `authjs-credentials` options.
- Selecting Auth.js credentials updates `config.auth`.
- Selecting no auth updates `config.auth`.
- Auth.js credentials can be selected without PostgreSQL.
- Auth.js credentials can be selected with PostgreSQL.
- Auth.js credentials can be selected with PostgreSQL and Prisma.
- Unsupported auth providers are not rendered.
- Auth.js option includes scaffold messaging.

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
Phase 6 Step 7 completed: Create auth step

Changes made:
- Added Auth step UI.
- Added auth selector for none and Auth.js credentials scaffold.
- Used @launchkit/schema metadata where available.
- Connected auth selection to shared builder config state.
- Confirmed Auth.js credentials can be selected without forcing a database.
- Added concise scaffold messaging.
- Confirmed unsupported auth providers are not exposed.

Files changed:
- apps/web/components/builder/steps/auth-step.tsx
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
- Phase 6 Step 8: Create extras step
```

## Completion Criteria

This step is complete when:

- Auth step renders in the wizard.
- Auth selector supports `none` and `authjs-credentials`.
- Selecting an auth option updates builder config state.
- Auth.js credentials can be selected without PostgreSQL.
- Auth.js credentials does not force database or ORM changes.
- Auth.js credentials option has clear scaffold messaging.
- Unsupported auth providers are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
