# Phase 6 Step 4: Create Styling and UI Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 3 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 5.
Do not implement database, ORM, auth, extras, preview, or download steps yet.
Do not add unsupported styling systems or UI libraries.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Styling and UI step in the LaunchKit website wizard.

For the MVP, generated projects always use:

```txt
styling: "tailwind"
```

Users can choose:

```txt
ui: "none"
ui: "shadcn"
```

This step should let users decide whether to include shadcn/ui in the generated project.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/styling-ui-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
apps/web/lib/builder/validation.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Show Tailwind as Fixed Styling

Display Tailwind CSS as the fixed MVP styling choice:

```txt
styling: "tailwind"
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
stylingMetadata
```

Do not expose unsupported styling options such as:

```txt
CSS Modules
Sass
Styled Components
Panda CSS
UnoCSS
```

### 2. Add UI Library Selector

Add a selector for:

```ts
config.ui;
```

Supported values:

```txt
none
shadcn
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
uiMetadata
```

Recommended UI:

- Segmented control
- Radio group
- Selectable option rows

Do not use a plain text input.

### 3. State Updates

When the user changes the UI option:

- Update `config.ui`.
- Preserve all other builder config values.
- Keep `config.styling` as `"tailwind"`.

Do not write to local storage unless the existing UX plan already requires it.

### 4. Compatibility

The schema should already have this compatibility rule:

```txt
shadcn/ui requires Tailwind CSS.
```

Since Tailwind is fixed in the MVP, selecting shadcn should normally be valid.

Use schema helpers from:

```txt
@launchkit/schema
```

to validate the current config if the builder shell already supports validation.

Do not duplicate compatibility rules manually in UI code unless the existing architecture has a small UI helper for displaying schema issues.

### 5. Navigation Behavior

The user should be able to move Back and Next when:

```txt
styling: "tailwind"
ui: "none" or "shadcn"
```

If the current config somehow violates schema compatibility, show a concise error and prevent moving forward.

Do not add validation gates for future steps yet.

### 6. Visual Direction

Keep the UI compact and scannable.

Recommended presentation:

- A fixed Tailwind summary row.
- Two selectable UI rows: "No component library" and "shadcn/ui".
- Short descriptions from schema metadata.
- A recommended indicator for shadcn/ui if metadata marks it recommended.

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

- Styling/UI step renders Tailwind as fixed.
- Styling/UI step renders `none` and `shadcn` UI options.
- Selecting shadcn updates `config.ui`.
- Selecting none updates `config.ui`.
- Unsupported styling systems are not rendered.
- Unsupported UI libraries are not rendered.

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
Phase 6 Step 4 completed: Create styling and UI step

Changes made:
- Added Styling and UI step UI.
- Displayed Tailwind CSS as the fixed MVP styling choice.
- Added UI selector for none and shadcn/ui.
- Used @launchkit/schema metadata where available.
- Connected UI selection to shared builder config state.
- Confirmed unsupported styling systems and UI libraries are not exposed.

Files changed:
- apps/web/components/builder/steps/styling-ui-step.tsx
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
- Phase 6 Step 5: Create database step
```

## Completion Criteria

This step is complete when:

- Styling and UI step renders in the wizard.
- Tailwind CSS is shown as the fixed styling option.
- UI selector supports `none` and `shadcn`.
- Selecting a UI option updates builder config state.
- Unsupported styling systems are not exposed.
- Unsupported UI libraries are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
