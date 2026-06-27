# Phase 3 Step 3: Create LaunchKit Config Schema

## Goal

Create the main `LaunchKitConfigSchema` in `packages/schema`.

This schema defines the shape of a valid LaunchKit project configuration and will be shared by the website, generator, and future CLI.

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
```

## Scope

### You may

- Add Zod to `packages/schema` if it is not already installed.
- Create the main config schema.
- Export the inferred TypeScript config type.
- Add schema parsing helpers if useful.
- Add Vitest tests for valid and invalid config shape.
- Update `progress-tracker.md`.

### You must not

- Add default config.
- Add option metadata.
- Add compatibility rules beyond basic enum validation.
- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.

## Required Config Shape

Create a schema for this config shape:

```ts
type LaunchKitConfig = {
  name: string;
  framework: "next";
  language: "typescript";
  router: "app";
  projectStructure: "no-src";
  styling: "tailwind";
  ui: "none" | "shadcn";
  database: "none" | "postgres";
  orm: "none" | "prisma";
  auth: "none" | "authjs-credentials";
  docker: "none" | "postgres";
  packageManager: "npm" | "pnpm";
};
```

## Validation Requirements

The schema should validate:

- `name` is required.
- `name` is a non-empty string.
- `name` should be suitable as a package/project folder name.
- Every option field must match the supported MVP option values.
- Unknown enum values should fail validation.

## Recommended Project Name Rules

For this step, project names should follow these rules.

### Allowed

- Lowercase letters
- Numbers
- Hyphens

### Valid examples

```txt
my-app
launchkit-demo
app123
```

### Disallowed

- Empty string
- Spaces
- Uppercase letters
- Path separators
- Special characters

Do **not** add cross-field compatibility rules in this step.

For example, this step does **not** need to reject Prisma without PostgreSQL yet. That belongs to the compatibility rules step.

## Suggested File Structure

Use focused files inside `packages/schema/src`.

Example:

```txt
packages/schema/src/
  config.ts
  index.ts
  options.ts
```

## Expected `config.ts` Exports

`config.ts` should export:

```ts
export const LaunchKitConfigSchema = ...
export type LaunchKitConfig = ...
```

Optionally export a helper:

```ts
export function parseLaunchKitConfig(input: unknown): LaunchKitConfig {
  return LaunchKitConfigSchema.parse(input);
}
```

## Zod Usage

Use Zod.

The schema should be built from the option values created in Step 2 where practical.

Example pattern:

```ts
import { z } from "zod";
import { frameworkOptions } from "./options";

const frameworkSchema = z.enum(frameworkOptions);
```

Do **not** duplicate option values unnecessarily.

## Tasks

1. Install or confirm `zod` is available for `packages/schema`.
2. Create `packages/schema/src/config.ts`.
3. Define `LaunchKitConfigSchema`.
4. Export `LaunchKitConfig`.
5. Optionally export `parseLaunchKitConfig`.
6. Re-export config exports from `packages/schema/src/index.ts`.
7. Add Vitest tests for basic schema validation.
8. Run relevant checks.
9. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Valid minimal MVP config passes.
- Valid full MVP config passes.
- Empty project name fails.
- Project name with spaces fails.
- Uppercase project name fails.
- Unknown framework fails.
- Unknown database fails.
- Unknown package manager fails.

Do **not** test compatibility rules yet.

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
- Schema fields added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `LaunchKitConfigSchema` exists.
- `LaunchKitConfig` type is exported.
- Schema uses supported MVP option values.
- Basic shape validation works.
- No cross-field compatibility rules are added yet.
- Vitest tests cover basic valid and invalid configs.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
