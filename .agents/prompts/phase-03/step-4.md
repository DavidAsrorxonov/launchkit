# Phase 3 Step 4: Add Default Config

## Goal

Add the default LaunchKit configuration to `packages/schema`.

The default config will be used by the website wizard and future CLI as the starting project configuration.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review the previous Phase 3 work:

```txt
.agents/prompts/phase-03/step-1.md
.agents/prompts/phase-03/step-2.md
.agents/prompts/phase-03/step-3.md
```

## Scope

### You may

- Add a default config export in `packages/schema`.
- Add tests that verify the default config is valid.
- Add helper functions for creating or merging defaults if useful.
- Update `progress-tracker.md`.

### You must not

- Add option metadata.
- Add compatibility rules.
- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.
- Change the confirmed MVP options unless there is a clear documented inconsistency.

## Required Default Config

The default config should be:

```ts
export const defaultLaunchKitConfig = {
  name: "my-app",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "none",
  database: "none",
  orm: "none",
  auth: "none",
  docker: "none",
  packageManager: "npm",
} satisfies LaunchKitConfig;
```

Use `satisfies LaunchKitConfig` if the project TypeScript version supports it.

If not, type it explicitly:

```ts
export const defaultLaunchKitConfig: LaunchKitConfig = {
  name: "my-app",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "none",
  database: "none",
  orm: "none",
  auth: "none",
  docker: "none",
  packageManager: "npm",
};
```

## Suggested File Structure

Use one of these approaches:

```txt
packages/schema/src/
  config.ts
  defaults.ts
  index.ts
```

Or keep the default inside:

```txt
packages/schema/src/config.ts
```

Prefer a separate `defaults.ts` if the schema package is already organized into focused files.

## Optional Helper

If useful, add a helper like:

```ts
export function createDefaultLaunchKitConfig(
  overrides: Partial<LaunchKitConfig> = {},
): LaunchKitConfig {
  return LaunchKitConfigSchema.parse({
    ...defaultLaunchKitConfig,
    ...overrides,
  });
}
```

This helper is optional.

If added, it must validate the final result with `LaunchKitConfigSchema`.

## Tasks

1. Add `defaultLaunchKitConfig`.
2. Ensure it satisfies `LaunchKitConfig`.
3. Ensure it validates successfully with `LaunchKitConfigSchema`.
4. Re-export it from `packages/schema/src/index.ts`.
5. Add Vitest tests for the default config.
6. Run relevant checks.
7. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- `defaultLaunchKitConfig` parses successfully with `LaunchKitConfigSchema`.
- Default project name is `"my-app"`.
- Default framework is `"next"`.
- Default language is `"typescript"`.
- Default router is `"app"`.
- Default project structure is `"no-src"`.
- Default styling is `"tailwind"`.
- Default UI is `"none"`.
- Default database is `"none"`.
- Default ORM is `"none"`.
- Default auth is `"none"`.
- Default Docker option is `"none"`.
- Default package manager is `"npm"`.

If `createDefaultLaunchKitConfig` is added, test that:

- Overrides are applied.
- Invalid overrides fail validation.

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
- Default config added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `defaultLaunchKitConfig` exists.
- The default config matches the confirmed MVP defaults.
- The default config validates with `LaunchKitConfigSchema`.
- Default config exports are available from `@launchkit/schema`.
- Vitest tests cover the default config.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
