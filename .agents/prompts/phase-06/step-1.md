# Phase 6 Step 1: Create Website Wizard Shell

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 is complete and Phase 6 is ready.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 2.
Do not implement the individual wizard step forms yet.
Do not implement the preview step yet.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the website wizard shell for the LaunchKit MVP.

This step should establish the main builder interface, wizard navigation, shared page layout, and client-side selection state shape. The individual step contents will be implemented in later Phase 6 steps.

The first screen should be the product builder experience, not a marketing-only landing page.

## Scope

Work inside:

```txt
apps/web/
```

Create or update the app home page and supporting components for the wizard shell.

Recommended structure:

```txt
apps/web/
  app/
    page.tsx
  components/
    builder/
      builder-shell.tsx
      wizard-progress.tsx
      wizard-navigation.tsx
      wizard-step-panel.tsx
  lib/
    builder/
      steps.ts
      builder-state.ts
```

Adjust paths to match the existing app structure and conventions.

## Wizard Flow

The wizard should define these steps:

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

For this step, each step can render placeholder content only.

Do not implement real option controls yet.

## Requirements

### 1. Builder Shell

Create a main builder shell that includes:

- LaunchKit title or compact product identity.
- Step progress indicator.
- Current step panel.
- Back and Next navigation.
- Disabled Back button on the first step.
- Disabled Next button on the last step.
- Responsive layout for desktop and mobile.

Keep the UI practical and developer-tool focused.

Avoid a marketing hero.
Avoid oversized decorative sections.
Avoid decorative gradient blobs/orbs.

### 2. Step State

Create a client-side state shape for the selected LaunchKit config.

Use the schema/default config from:

```txt
@launchkit/schema
```

If the web app cannot yet import the package due to workspace config issues, fix the workspace/package wiring narrowly.

Do not duplicate the schema manually inside `apps/web`.

Recommended state:

```ts
LaunchKitConfig;
```

Initialize from:

```ts
defaultLaunchKitConfig;
```

### 3. Step Definitions

Create a shared step definition list.

Example:

```ts
export type BuilderStepId =
  | "project"
  | "framework"
  | "styling-ui"
  | "database"
  | "orm"
  | "auth"
  | "extras"
  | "preview"
  | "download";
```

Each step should have:

```txt
id
label
short label if useful
```

### 4. Placeholder Step Panels

For now, render clear placeholder panels for each step.

Examples:

```txt
Project step coming next.
Framework step coming next.
Preview step coming later.
```

Do not add visible instructional text about keyboard shortcuts or internal implementation details.

### 5. Visual Direction

Use the established LaunchKit UI direction:

- Minimal
- Fast to scan
- Practical
- Trustworthy
- Technical without clutter
- Green accent theme inspired by Supabase and Neon
- Token-based styling

Prefer token-based classes:

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

Avoid repeated one-off hardcoded color classes:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

### 6. shadcn/ui

Use existing shadcn/ui components if they already exist in `apps/web`.

Good candidates:

```txt
Button
Card only for actual framed tool panels if already used
Separator
Badge
Progress
```

Do not add new shadcn components unless needed and consistent with the existing app setup.

Do not nest cards inside cards.

### 7. Generator Boundary

Do not import generator logic into UI components yet unless the current architecture already requires it for type-only preview data.

This step should not call:

```txt
@launchkit/generator
```

The API route and generator integration belong to later Phase 6 steps.

## Tests

Use the test setup already present in the repo.

Add or update focused tests only if the app already has a frontend test pattern.

Possible tests:

- Wizard renders all step labels.
- Back button is disabled on the first step.
- Next button moves to the next step.
- Back button returns to the previous step.
- Last step disables Next.

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
Phase 6 Step 1 completed: Create website wizard shell

Changes made:
- Created or updated the LaunchKit builder home page.
- Added wizard shell layout.
- Added wizard step definitions.
- Added current-step navigation state.
- Initialized builder config from @launchkit/schema default config.
- Added placeholder panels for all wizard steps.

Files changed:
- apps/web/app/page.tsx
- apps/web/components/builder/builder-shell.tsx
- apps/web/components/builder/wizard-progress.tsx
- apps/web/components/builder/wizard-navigation.tsx
- apps/web/components/builder/wizard-step-panel.tsx
- apps/web/lib/builder/steps.ts
- apps/web/lib/builder/builder-state.ts
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 2: Create project step
```

## Completion Criteria

This step is complete when:

- The website home page shows the LaunchKit builder shell.
- The wizard has all 9 planned steps.
- Step progress is visible.
- Back/Next navigation works.
- Placeholder content renders for each step.
- Builder config state is initialized from `@launchkit/schema`.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
