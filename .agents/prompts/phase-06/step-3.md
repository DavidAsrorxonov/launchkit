# Phase 6 Step 3: Create Framework Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 2 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 4.
Do not implement styling/UI, database, ORM, auth, extras, preview, or download steps yet.
Do not add unsupported frameworks, languages, routers, or project structures.
Do not implement the API generate route yet.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Framework step in the LaunchKit website wizard.

For the MVP, this step should communicate and confirm the fixed technical foundation for generated projects:

```txt
framework: "next"
language: "typescript"
router: "app"
projectStructure: "no-src"
```

This step should not introduce unsupported choices.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/framework-step.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/steps.ts
apps/web/lib/builder/builder-state.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Display MVP Framework Choices

Show the current generated-project foundation:

```txt
Next.js
TypeScript
App Router
No src/ directory
```

Use metadata from:

```txt
@launchkit/schema
```

where available:

```txt
frameworkMetadata
languageMetadata
routerMetadata
projectStructureMetadata
```

Do not duplicate labels/descriptions manually if metadata is exported.

### 2. Keep Options Fixed

The MVP supports only:

```txt
frameworkOptions: ["next"]
languageOptions: ["typescript"]
routerOptions: ["app"]
projectStructureOptions: ["no-src"]
```

Do not add UI choices for:

```txt
React Router
Remix
Astro
Vue
Svelte
JavaScript
Pages Router
src/ folder
```

Because there is only one supported option in each category, this step may render them as selected fixed options rather than interactive controls.

### 3. State Consistency

Ensure the shared builder config state contains:

```ts
{
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src"
}
```

Do not let this step change those values to unsupported values.

If the state was initialized from `defaultLaunchKitConfig`, this should already be true.

### 4. Validation

Use:

```txt
LaunchKitConfigSchema
```

or exported schema helpers from:

```txt
@launchkit/schema
```

to ensure the current config remains valid.

This step should not introduce additional validation gates beyond confirming the current fixed framework values are valid.

### 5. Navigation Behavior

The user should be able to move Back and Next through this step if the config is valid.

Do not block navigation because the framework choices are fixed.

If the config somehow contains invalid framework values, show a concise error and prevent moving forward.

### 6. Visual Direction

Keep the UI compact and useful.

Recommended presentation:

- A concise stack summary.
- Four fixed selected rows or tiles.
- Small descriptions from schema metadata.
- A subtle note that more frameworks may come later, if appropriate.

Do not make this a marketing section.
Do not use a large hero.
Do not use decorative gradient blobs/orbs.

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

Use existing shadcn/ui components if available, if not add them and use:

```txt
Badge
Separator
Button
```

Do not nest cards inside cards.

### 7. Generator Boundary

Do not call:

```txt
@launchkit/generator
```

This step only renders and validates builder state.

The API route and generator integration belong to later Phase 6 steps.

## Tests

Use the test setup already present in the repo.

Add or update focused tests only if the app already has a frontend test pattern.

Possible tests:

- Framework step renders Next.js.
- Framework step renders TypeScript.
- Framework step renders App Router.
- Framework step renders no `src/` structure.
- Framework step does not render unsupported framework options.
- User can continue when the default config is valid.

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
Phase 6 Step 3 completed: Create framework step

Changes made:
- Added Framework step UI.
- Displayed fixed MVP framework foundation.
- Used @launchkit/schema metadata where available.
- Confirmed framework config remains Next.js, TypeScript, App Router, no-src.
- Confirmed unsupported framework choices are not exposed.

Files changed:
- apps/web/components/builder/steps/framework-step.tsx
- apps/web/components/builder/builder-shell.tsx
- apps/web/lib/builder/steps.ts, if changed
- apps/web/lib/builder/builder-state.ts, if changed
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 4: Create styling and UI step
```

## Completion Criteria

This step is complete when:

- Framework step renders in the wizard.
- The step shows Next.js.
- The step shows TypeScript.
- The step shows App Router.
- The step shows no `src/` project structure.
- Unsupported framework/language/router/structure choices are not exposed.
- Current config remains valid according to `@launchkit/schema`.
- User can continue with the default config.
- No generator logic is placed in `apps/web`.
- No API route or download flow is implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
