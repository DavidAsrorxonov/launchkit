# Phase 3 Step 1: Create Schema Package Foundation

## Goal

Prepare `packages/schema` as the shared schema package for LaunchKit.

This step should only verify and clean up the package foundation. Do not define the full LaunchKit config schema yet.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

## Scope

You may:

- Inspect `packages/schema`.
- Ensure the package has the correct structure.
- Ensure package exports work.
- Ensure TypeScript config is correct.
- Ensure Vitest is available for future tests.
- Add or adjust placeholder exports if needed.
- Update `progress-tracker.md`.

You must not:

- Define the full `LaunchKitConfigSchema`.
- Add compatibility rules.
- Add option metadata.
- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.

## Required Package Structure

Ensure `packages/schema` has:

```txt
packages/schema/
  package.json
  tsconfig.json
  src/
    index.ts
```

## Package Requirements

The package should be named:

```txt
@launchkit/schema
```

It should support:

```txt
npm run build
npm run typecheck
npm run test
```

Use Vitest for tests.

Do not use Node's built-in test runner.

## Placeholder Export

If needed, add a simple placeholder export:

```ts
export const schemaPackageReady = true;
```

Do not add real schema logic yet.

## Tasks

1. Review the current `packages/schema` structure.
2. Confirm `package.json` uses the correct package name.
3. Confirm TypeScript build/typecheck scripts exist.
4. Confirm the package exports from `src/index.ts`.
5. Confirm Vitest is configured or available for package tests.
6. Run relevant checks.
7. Update `progress-tracker.md`.

## Verification

Run:

```bash
npm run typecheck
npm run test
```

If available, also run:

```bash
npm run build
npm run lint
```

If a command fails, fix issues that are inside this step's scope. If the failure belongs to another phase or package, record it in `progress-tracker.md`.

## Progress Tracker Update

Update `progress-tracker.md` with:

- Step completed
- Files changed
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `packages/schema` has the correct foundation.
- `@launchkit/schema` exports successfully.
- Vitest is the expected test runner.
- Typecheck passes or any unrelated failure is documented.
- `progress-tracker.md` is updated.
