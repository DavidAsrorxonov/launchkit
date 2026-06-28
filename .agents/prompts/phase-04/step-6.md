# Phase 4 Step 6: Create Env Var Merge Utility

## Goal

Create a utility in `packages/generator` for merging environment variable definitions from selected features.

This utility will later be used to generate `.env.example` and preview the environment variables a generated project needs.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review previous Phase 4 work:

```txt
.agents/prompts/phase-04/step-1.md
.agents/prompts/phase-04/step-2.md
.agents/prompts/phase-04/step-3.md
.agents/prompts/phase-04/step-4.md
.agents/prompts/phase-04/step-5.md
```

## Scope

### You may

- Add env var merge helpers.
- Add conflict detection for incompatible env var definitions.
- Add `.env.example` rendering helper if useful.
- Add Vitest tests for env var merge behavior.
- Update `progress-tracker.md`.

### You must not

- Implement the full `generateProject` pipeline.
- Implement template loading.
- Implement file output adapters.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required Concepts

Feature definitions can contribute environment variables.

Examples:

```ts
{
  name: "DATABASE_URL",
  value: "postgresql://postgres:postgres@localhost:5432/my_app",
  description: "PostgreSQL connection string.",
  required: true
}
```

```ts
{
  name: "AUTH_SECRET",
  value: "replace-me",
  description: "Secret used by Auth.js.",
  required: true
}
```

The generator needs a predictable way to merge these definitions.

## Suggested File Structure

Use a focused file:

```txt
packages/generator/src/env.ts
```

Or:

```txt
packages/generator/src/utils/env.ts
```

Follow the existing repo style.

Re-export public types and helpers from:

```txt
packages/generator/src/index.ts
```

## Required Type

Reuse `EnvVarDefinition` from `generation-plan.ts` if it already exists.

Expected shape:

```ts
export type EnvVarDefinition = {
  name: string;
  value: string;
  description?: string;
  required?: boolean;
};
```

If this type already exists, do **not** duplicate it.

## Required Merge Function

Add a function similar to:

```ts
export function mergeEnvVars(groups: EnvVarDefinition[][]): EnvVarDefinition[];
```

It should merge multiple env var arrays into one array.

## Merge Rules

### Same Name, Same Value

If two env vars have the same name and same value, merge them.

Rules:

- If one has a description and the other does not, keep the description.
- If both have the same description, keep it.
- If either has `required: true`, final `required` should be `true`.

### Same Name, Different Value

If two env vars have the same name but different values, throw a conflict error.

Example conflict:

```txt
DATABASE_URL=postgresql://...
DATABASE_URL=mysql://...
```

### Same Name, Different Description

If two env vars have the same name and same value but different descriptions, do **not** throw.

Prefer the first description and keep the merge deterministic.

## Ordering

Keep output deterministic.

Recommended order:

```txt
first appearance wins
```

So if `DATABASE_URL` appears before `AUTH_SECRET`, keep that order.

## Error Handling

Add a clear error for conflicts.

Example:

```ts
export class EnvVarMergeConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvVarMergeConflictError";
  }
}
```

Error messages should be actionable.

Example:

```txt
Conflicting env var value for DATABASE_URL.
```

## Optional `.env.example` Renderer

If useful, add:

```ts
export function renderEnvExample(envVars: EnvVarDefinition[]): string;
```

Recommended output:

```env
# PostgreSQL connection string.
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"

# Secret used by Auth.js.
AUTH_SECRET="replace-me"
```

Rules:

- Include comments when descriptions exist.
- Quote values.
- Add a trailing newline.
- Keep ordering from merged env vars.
- Do not generate real secrets.

This helper is useful, but keep it simple.

## Tasks

1. Create an env utility file.
2. Reuse existing `EnvVarDefinition` type if available.
3. Add `mergeEnvVars`.
4. Add conflict error.
5. Optionally add `renderEnvExample`.
6. Re-export public helpers from `packages/generator/src/index.ts`.
7. Add Vitest tests for env merging.
8. Add Vitest tests for `.env.example` rendering if implemented.
9. Run relevant checks.
10. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Empty input returns empty array.
- Distinct env vars merge successfully.
- Duplicate env var with same value succeeds.
- Duplicate env var with different value throws.
- Duplicate env var keeps first description.
- Duplicate env var with one `required: true` returns `required: true`.
- Output order follows first appearance.
- Input arrays are not mutated.

If `renderEnvExample` is implemented, test:

- Comments are included for descriptions.
- Values are quoted.
- Output includes trailing newline.
- Ordering is preserved.
- No real secret is generated by the helper.

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
- Env var merge utility added
- Conflict behavior added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `mergeEnvVars` exists.
- Env var conflicts are detected.
- Conflict errors are clear.
- Helpers are exported from `@launchkit/generator`.
- Vitest tests cover merge and conflict behavior.
- `.env.example` rendering is tested if implemented.
- No full generation pipeline is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
