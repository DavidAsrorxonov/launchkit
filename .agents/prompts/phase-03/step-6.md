# Phase 3 Step 6: Add Compatibility Rules

## Goal

Add cross-field compatibility rules to `packages/schema`.

These rules define which LaunchKit stack combinations are valid or invalid.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review previous Phase 3 work:

```txt
.agents/prompts/phase-03/step-1.md
.agents/prompts/phase-03/step-2.md
.agents/prompts/phase-03/step-3.md
.agents/prompts/phase-03/step-4.md
.agents/prompts/phase-03/step-5.md
```

## Scope

### You may

- Add compatibility rule types.
- Add compatibility validation functions.
- Add typed compatibility errors.
- Integrate compatibility checks with schema parsing if appropriate.
- Add Vitest tests for compatibility behavior.
- Update `progress-tracker.md`.

### You must not

- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.
- Add unsupported stack options.

## Required Compatibility Rules

Implement these MVP rules:

- Prisma requires PostgreSQL.
- Docker postgres requires PostgreSQL.
- Auth.js credentials scaffold may work without a database.
- Auth.js credentials scaffold with Prisma requires PostgreSQL and Prisma.
- `shadcn/ui` requires Tailwind CSS.

Because Tailwind is fixed in the MVP, the `shadcn/ui` rule may be simple for now, but keep it represented so future options can reuse it.

## Recommended Behavior

Compatibility validation should return useful errors instead of only returning `false`.

Recommended result shape:

```ts
export type CompatibilityIssue = {
  code: string;
  message: string;
  path?: string[];
};
```

Recommended helper:

```ts
export function validateCompatibility(
  config: LaunchKitConfig,
): CompatibilityIssue[] {
  // return issues
}
```

Optional helper:

```ts
export function assertCompatibleConfig(config: LaunchKitConfig): void {
  const issues = validateCompatibility(config);

  if (issues.length > 0) {
    throw new LaunchKitCompatibilityError(issues);
  }
}
```

Keep the implementation simple.

## Required Error Messages

Use clear, actionable messages.

Examples:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials with Prisma requires Prisma and PostgreSQL.
shadcn/ui requires Tailwind CSS.
```

## Suggested File Structure

```txt
packages/schema/src/
  compatibility.ts
  config.ts
  index.ts
  options.ts
  metadata.ts
```

## Tasks

1. Create `packages/schema/src/compatibility.ts`.
2. Add `CompatibilityIssue` type.
3. Add `validateCompatibility(config)`.
4. Add optional `assertCompatibleConfig(config)`.
5. Integrate compatibility checks with config parsing only if this fits the existing schema design.
6. Re-export compatibility exports from `packages/schema/src/index.ts`.
7. Add Vitest tests for compatibility rules.
8. Run relevant checks.
9. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Default config has no compatibility issues.
- Prisma with `database: "none"` returns an issue.
- Prisma with PostgreSQL returns no issue.
- Docker postgres with `database: "none"` returns an issue.
- Docker postgres with PostgreSQL returns no issue.
- Auth.js credentials without database returns no issue.
- Auth.js credentials with Prisma and PostgreSQL returns no issue.
- Auth.js credentials with Prisma but no PostgreSQL returns an issue.

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
- Compatibility rules added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- Compatibility rules exist.
- Compatibility issues have useful messages.
- Compatibility exports are available from `@launchkit/schema`.
- Vitest tests cover the required rules.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
