# Phase 7 Step 2: Add Schema and Compatibility Regression Tests

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Step 1 is complete.
4. Read the Phase 7 Step 1 audit notes.
5. Read this step prompt.
6. Implement only this step.

Do not move to Phase 7 Step 3.
Do not add generator snapshot tests yet.
Do not add generated project smoke tests yet.
Do not change supported product options.
Do not add CLI functionality.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add or strengthen regression tests for the shared schema package.

This step should make sure the MVP config shape, option metadata, defaults, project name validation, and compatibility rules stay stable as the project evolves.

## Scope

Work primarily inside:

```txt
packages/schema/
```

Recommended files:

```txt
packages/schema/src/index.test.ts
packages/schema/src/options.test.ts
packages/schema/src/config-schema.test.ts
packages/schema/src/default-config.test.ts
packages/schema/src/metadata.test.ts
packages/schema/src/compatibility.test.ts
```

Use the existing test file structure if the package already has one.

The current test file structure uses the `__tests__` folder structure.

Do not create unnecessary test files if one focused test file matches the current repo style.

## Requirements

### 1. Test Tooling

Use Vitest only:

```ts
import { describe, expect, it } from "vitest";
```

Do not use:

```txt
node:test
jest
mocha
```

If any schema tests currently use Node's built-in test runner, migrate them to Vitest in this step.

### 2. Option Array Tests

Test the exact MVP option arrays.

Expected values:

```ts
frameworkOptions = ["next"];
languageOptions = ["typescript"];
routerOptions = ["app"];
projectStructureOptions = ["no-src"];
stylingOptions = ["tailwind"];
uiOptions = ["none", "shadcn"];
databaseOptions = ["none", "postgres"];
ormOptions = ["none", "prisma"];
authOptions = ["none", "authjs-credentials"];
dockerOptions = ["none", "postgres"];
packageManagerOptions = ["npm", "pnpm"];
```

These tests should catch accidental option expansion or renaming.

### 3. Config Schema Tests

Test that `LaunchKitConfigSchema` accepts a valid MVP config.

Test that it rejects:

```txt
empty project name
project name with spaces
project name with uppercase letters
project name with path separators
project name with special characters
unsupported framework
unsupported language
unsupported router
unsupported project structure
unsupported styling
unsupported UI
unsupported database
unsupported ORM
unsupported auth
unsupported docker
unsupported package manager
```

Project name examples that should pass:

```txt
my-app
launchkit-demo
app123
```

Project name examples that should fail:

```txt
""
"My App"
"my app"
"../app"
"app/name"
"app_name"
"app!"
```

### 4. Default Config Tests

Test that `defaultLaunchKitConfig` exactly matches the MVP default:

```ts
{
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
}
```

If `createDefaultLaunchKitConfig` exists, test that:

- It returns a valid config.
- It applies valid overrides.
- It rejects invalid overrides.

### 5. Metadata Tests

Test that option metadata exists for every supported option.

Required metadata exports:

```txt
frameworkMetadata
languageMetadata
routerMetadata
projectStructureMetadata
stylingMetadata
uiMetadata
databaseMetadata
ormMetadata
authMetadata
dockerMetadata
packageManagerMetadata
```

For each metadata list, verify:

- Every supported option has metadata.
- Metadata values do not include unsupported options.
- Every metadata item has a non-empty label.
- Every metadata item has a non-empty description.
- `recommended`, if present, is a boolean.

Do not over-specify exact descriptions unless they are part of the product contract.

### 6. Compatibility Rule Tests

Add regression tests for these rules:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
Auth.js credentials scaffold with Prisma requires PostgreSQL and Prisma.
shadcn/ui requires Tailwind CSS.
```

Required test cases:

```txt
database: "none", orm: "prisma"
  invalid: Prisma requires PostgreSQL.

database: "postgres", orm: "prisma"
  valid

database: "none", docker: "postgres"
  invalid: PostgreSQL Docker Compose is only available when PostgreSQL is selected.

database: "postgres", docker: "postgres"
  valid

auth: "authjs-credentials", database: "none", orm: "none"
  valid

auth: "authjs-credentials", database: "postgres", orm: "none"
  valid

auth: "authjs-credentials", database: "postgres", orm: "prisma"
  valid

ui: "shadcn", styling: "tailwind"
  valid
```

If the schema currently allows only `styling: "tailwind"`, the shadcn compatibility rule may only need a positive regression test.

If a test for non-Tailwind styling would require adding unsupported schema values, do not add that unsupported value. Keep the test aligned with the MVP option set.

### 7. Compatibility Error Shape

If the schema exports:

```ts
type CompatibilityIssue = {
  code: string;
  message: string;
  path?: string[];
};
```

test that compatibility errors include:

- stable `code`
- useful `message`
- relevant `path` when implemented

Do not require exact internal object identity. Test meaningful public behavior.

### 8. Public Exports

Test that all public schema exports needed by the website and generator are available from the package entry point.

At minimum:

```txt
option arrays
option metadata
LaunchKitConfigSchema
LaunchKitConfig type, if testable through TypeScript
defaultLaunchKitConfig
createDefaultLaunchKitConfig, if present
validateCompatibility
assertCompatibleConfig, if present
```

## Implementation Notes

Prefer table-driven tests for option and compatibility cases.

Keep tests clear and stable.

Do not rewrite schema implementation unless a test reveals a real Phase 3 contract bug.

If you find a real bug in schema behavior:

- Fix it narrowly.
- Add a regression test.
- Document it in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm test -w @launchkit/schema
npm run typecheck -w @launchkit/schema
npm test
npm run typecheck
```

Also run if configured:

```bash
npm run lint
npm run build
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 7 Step 2 completed: Add schema and compatibility regression tests

Changes made:
- Added or strengthened schema option tests.
- Added or strengthened config schema validation tests.
- Added or strengthened default config tests.
- Added or strengthened option metadata tests.
- Added or strengthened compatibility rule tests.
- Confirmed Vitest is used for schema tests.
- Fixed any small in-scope schema bugs found by tests.

Files changed:
- packages/schema/src/..., test files
- packages/schema/src/..., only if a narrow schema fix was needed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 3: Add generator and template snapshot tests
```

## Completion Criteria

This step is complete when:

- Schema option arrays are covered by regression tests.
- `LaunchKitConfigSchema` valid and invalid cases are covered.
- Project name validation is covered.
- Default config is covered.
- Option metadata coverage is tested.
- Compatibility rules are covered.
- Public schema exports are covered where practical.
- Schema tests use Vitest.
- No Node built-in test runner usage is introduced.
- Schema package tests pass, or unrelated failures are documented.
- TypeScript checks pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
