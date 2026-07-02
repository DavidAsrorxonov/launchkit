# Phase 6 Step 2: Create Project Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 1 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 3.
Do not implement framework, styling/UI, database, ORM, auth, extras, preview, or download steps yet.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Project step in the LaunchKit website wizard.

This step should let users configure the generated project identity and package manager:

```txt
name
packageManager
```

Use the shared schema package for validation and metadata.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/project-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Project Name Input

Add a project name input for:

```ts
config.name;
```

Project name rules must match `@launchkit/schema`:

Allowed:

```txt
lowercase letters
numbers
hyphens
```

Examples:

```txt
my-app
launchkit-demo
app123
```

Disallowed:

```txt
empty string
spaces
uppercase letters
path separators
special characters
```

Do not duplicate validation rules manually if the schema exports a parser or validator.

Use:

```txt
LaunchKitConfigSchema
```

or another exported schema helper from:

```txt
@launchkit/schema
```

### 2. Validation UX

Show validation feedback near the input.

Requirements:

- Invalid project names should show a concise error.
- Valid project names should not show an error.
- The user should not be able to advance from the Project step with an invalid project name.
- Do not use blocking browser alerts.
- Do not show noisy validation before the field has been edited unless the initial default is invalid.

### 3. Package Manager Control

Add a package manager selector for:

```ts
config.packageManager;
```

Supported values:

```txt
npm
pnpm
```

Use metadata from `@launchkit/schema` if available.

Recommended UI:

- Segmented control
- Radio group
- Two-option toggle

Do not use a plain text input.

Remember:

- The LaunchKit repo itself uses npm.
- Generated projects may support npm and pnpm instructions.

### 4. State Updates

Update the shared builder config state created in Phase 6 Step 1.

When the user edits the project name or package manager:

- Update the current `LaunchKitConfig`.
- Preserve all other selected config values.
- Keep state local to the builder for now.

Do not write to local storage unless the existing UX plan already requires it.

### 5. Navigation Behavior

The Project step should gate the Next button.

If the Project step has validation errors:

- Disable Next, or
- Keep Next enabled but prevent navigation and show the error.

Prefer disabling Next when invalid.

Do not add validation gates for future steps yet.

### 6. Visual Direction

Keep the UI practical and compact.

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
Input
Label
Button
RadioGroup
Alert or small inline message
```

Do not nest cards inside cards.

### 7. Generator Boundary

Do not call:

```txt
@launchkit/generator
```

This step only updates website state and validation.

The API route and generator integration belong to later Phase 6 steps.

## Tests

Use the test setup already present in the repo.

Add or update focused tests only if the app already has a frontend test pattern.

Possible tests:

- Project step renders the default project name.
- Editing the project name updates state.
- Invalid names show validation feedback.
- Invalid names prevent moving to the next step.
- Package manager selector updates `packageManager`.
- Supported package manager options come from schema metadata if available.

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
Phase 6 Step 2 completed: Create project step

Changes made:
- Added Project step UI.
- Added project name input.
- Added project name validation using @launchkit/schema.
- Added package manager selector.
- Connected Project step to shared builder config state.
- Gated Next navigation when the Project step is invalid.

Files changed:
- apps/web/components/builder/steps/project-step.tsx
- apps/web/components/builder/builder-shell.tsx
- apps/web/lib/builder/builder-state.ts
- apps/web/lib/builder/validation.ts, if added
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 3: Create framework step
```

## Completion Criteria

This step is complete when:

- Project step renders in the wizard.
- Project name input is connected to builder config state.
- Project name validation uses `@launchkit/schema`.
- Invalid project names show useful feedback.
- Invalid project names prevent advancing from the Project step.
- Package manager selector supports `npm` and `pnpm`.
- Package manager selection updates builder config state.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
