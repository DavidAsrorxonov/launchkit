# Phase 3 Step 7: Add Schema Tests

## Goal

Expand schema package test coverage so Phase 3 behavior is well-covered.

This step should focus on complete test coverage for the schema package, not new product behavior.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review the current `packages/schema` implementation and all previous Phase 3 prompt files.

## Scope

### You may

- Add or improve Vitest tests in `packages/schema`.
- Refactor tests for clarity.
- Add test helpers if useful.
- Update `progress-tracker.md`.

### You must not

- Add new MVP options.
- Change schema behavior unless tests expose a bug.
- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.

## Required Test Coverage

Ensure tests cover the following areas.

## Option Exports

Tests should verify that:

- Every option array is exported.
- Option arrays contain exactly the confirmed MVP values.
- Option union types compile correctly where practical.

## Config Schema

Tests should verify that:

- Valid default config passes.
- Valid full config passes.
- Invalid project name fails.
- Unknown framework fails.
- Unknown UI option fails.
- Unknown database option fails.
- Unknown ORM option fails.
- Unknown auth option fails.
- Unknown Docker option fails.
- Unknown package manager fails.

## Default Config

Tests should verify that:

- Default config validates.
- Default config matches confirmed MVP defaults.

## Option Metadata

Tests should verify that:

- Every option value has metadata.
- Metadata values match option arrays exactly.
- Labels are non-empty.
- Descriptions are non-empty.

## Compatibility Rules

Tests should verify that:

- Default config has no compatibility issues.
- Prisma requires PostgreSQL.
- Docker postgres requires PostgreSQL.
- Auth.js credentials scaffold is allowed without a database.
- Auth.js credentials with Prisma requires a valid Prisma/PostgreSQL setup.
- `shadcn/ui` requires Tailwind CSS.

## Testing Tool

Use **Vitest only**.

Do **not** use:

- `node:test`
- Jest
- Mocha

Unless explicitly requested later.

## Suggested Test Structure

Use a structure like:

```txt
packages/schema/src/
  options.test.ts
  config.test.ts
  defaults.test.ts
  metadata.test.ts
  compatibility.test.ts
```

Or:

```txt
packages/schema/src/__tests__/
  options.test.ts
  config.test.ts
  defaults.test.ts
  metadata.test.ts
  compatibility.test.ts
```

Follow the existing repo pattern if one already exists.

## Tasks

1. Review current schema tests.
2. Add missing tests for options.
3. Add missing tests for config validation.
4. Add missing tests for defaults.
5. Add missing tests for metadata.
6. Add missing tests for compatibility rules.
7. Remove or replace any Node built-in test runner usage.
8. Run relevant checks.
9. Update `progress-tracker.md`.

## Verification

Run:

```bash
npm run test
npm run typecheck
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
- Test files added or updated
- Test coverage added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- Schema package tests use Vitest.
- Required test coverage exists.
- Tests pass or unrelated failures are documented.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
