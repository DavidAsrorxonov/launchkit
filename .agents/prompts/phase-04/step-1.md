# Phase 4 Step 1: Create Generator Package Foundation

## Goal

Prepare `packages/generator` as the reusable generator package for LaunchKit.

This step should only verify and clean up the package foundation. Do **not** implement the project generation engine yet.

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

### You may

- Inspect `packages/generator`.
- Ensure the package has the correct structure.
- Ensure package exports work.
- Ensure TypeScript config is correct.
- Ensure Vitest is available for future tests.
- Ensure the package can import from `@launchkit/schema`.
- Add or adjust placeholder exports if needed.
- Update `progress-tracker.md`.

### You must not

- Implement `generateProject`.
- Implement file tree logic.
- Implement feature registry logic.
- Implement `package.json` merging.
- Implement template loading.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required Package Structure

Ensure `packages/generator` has:

```txt
packages/generator/
  package.json
  tsconfig.json
  src/
    index.ts
```

## Package Requirements

The package should be named:

```txt
@launchkit/generator
```

It should support:

```bash
npm run build
npm run typecheck
npm run test
```

Use **Vitest** for tests.

Do **not** use Node's built-in test runner.

The package should depend on:

```txt
@launchkit/schema
```

The package should **not** depend on:

```txt
apps/web
packages/cli
```

## Placeholder Export

If needed, add a simple placeholder export:

```ts
export function generatorPackageReady() {
  return true;
}
```

Do **not** add real generator logic yet.

## Schema Dependency Check

Confirm `packages/generator` can import from `@launchkit/schema`.

Use a lightweight import only. Do **not** rely on schema internals.

Example:

```ts
import { defaultLaunchKitConfig } from "@launchkit/schema";

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
```

If `defaultLaunchKitConfig` does not exist yet, use an existing exported placeholder from `@launchkit/schema` and record the limitation in `progress-tracker.md`.

## Tasks

1. Review the current `packages/generator` structure.
2. Confirm `package.json` uses the correct package name.
3. Confirm TypeScript build/typecheck scripts exist.
4. Confirm Vitest test script exists.
5. Confirm `src/index.ts` exports a placeholder.
6. Confirm `@launchkit/generator` can import from `@launchkit/schema`.
7. Confirm `@launchkit/generator` does not import from `apps/web`.
8. Run relevant checks.
9. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Add a minimal test only if tests are already part of the repo pattern.

The test can verify:

```ts
expect(generatorPackageReady()).toBe(true);
```

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

If a command fails, fix issues that are inside this step’s scope.

If the failure belongs to another phase or package, record it in `progress-tracker.md`.

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

- `packages/generator` has the correct foundation.
- `@launchkit/generator` exports successfully.
- `@launchkit/generator` can import from `@launchkit/schema`.
- Vitest is the expected test runner.
- No real generator logic is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
