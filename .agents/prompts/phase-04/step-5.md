# Phase 4 Step 5: Create Package.json Merge Utility

## Goal

Create a utility in `packages/generator` for merging `package.json` contributions from selected features.

This utility will later be used by the generation pipeline to combine dependencies, dev dependencies, scripts, and package metadata into one final `package.json`.

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
```

## Scope

### You may

- Add `package.json`-related types.
- Add merge helpers for `package.json` patches.
- Add conflict detection for incompatible script or dependency values.
- Add Vitest tests for package merge behavior.
- Update `progress-tracker.md`.

### You must not

- Implement the full `generateProject` pipeline.
- Implement template loading.
- Implement file output adapters.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required Concepts

Feature definitions can contribute to `package.json`.

Example:

```ts
{
  dependencies: {
    "@prisma/client": "latest"
  },
  devDependencies: {
    "prisma": "latest"
  },
  scripts: {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}
```

The generator needs a predictable way to merge those contributions.

## Suggested File Structure

Use a focused file:

```txt
packages/generator/src/
  package-json.ts
```

Or:

```txt
packages/generator/src/utils/package-json.ts
```

Follow the existing repo style.

Re-export public types and helpers from:

```txt
packages/generator/src/index.ts
```

## Required Types

Create or reuse types similar to:

```ts
export type DependencyMap = Record<string, string>;

export type ScriptMap = Record<string, string>;

export type PackageJsonPatch = {
  name?: string;
  version?: string;
  private?: boolean;
  type?: string;
  scripts?: ScriptMap;
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
};
```

If `PackageJsonPatch`, `DependencyMap`, and `ScriptMap` already exist in `generation-plan.ts`, reuse them instead of duplicating.

## Required Merge Function

Add a function similar to:

```ts
export function mergePackageJsonPatches(
  patches: PackageJsonPatch[],
): PackageJsonPatch;
```

It should merge:

- `name`
- `version`
- `private`
- `type`
- `scripts`
- `dependencies`
- `devDependencies`

## Merge Rules

### Dependencies

If two patches define the same dependency with the same version, keep one.

If two patches define the same dependency with different versions, throw a conflict error.

Example conflict:

```txt
react: "^19.0.0"
react: "^18.0.0"
```

### Dev Dependencies

Use the same rules as dependencies.

### Scripts

If two patches define the same script with the same command, keep one.

If two patches define the same script with different commands, throw a conflict error.

Example conflict:

```txt
"dev": "next dev"
"dev": "vite dev"
```

### Metadata

For fields like `name`, `version`, `private`, and `type`:

- Ignore `undefined`.
- Allow identical values.
- Throw if two patches provide different defined values.

## Error Handling

Add a clear error for conflicts.

Example:

```ts
export class PackageJsonMergeConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageJsonMergeConflictError";
  }
}
```

Error messages should be actionable.

Examples:

```txt
Conflicting dependency version for react: ^19.0.0 vs ^18.0.0.
Conflicting script command for dev: next dev vs vite dev.
Conflicting package.json field "type": module vs commonjs.
```

## Optional Helper

If useful, add:

```ts
export function createBasePackageJsonPatch(input: {
  name: string;
  packageManager: "npm" | "pnpm";
}): PackageJsonPatch;
```

This is optional.

Do **not** overbuild package manager-specific behavior yet.

## Tasks

1. Create a `package.json` merge utility file.
2. Reuse existing package patch types if available.
3. Add the merge function.
4. Add the conflict error.
5. Add tests for dependency merging.
6. Add tests for dev dependency merging.
7. Add tests for script merging.
8. Add tests for metadata conflicts.
9. Re-export public helpers from `packages/generator/src/index.ts`.
10. Run relevant checks.
11. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Empty patch list returns an empty patch.
- Dependencies merge successfully.
- Duplicate dependency with the same version succeeds.
- Duplicate dependency with a different version throws.
- Dev dependencies merge successfully.
- Duplicate dev dependency with a different version throws.
- Scripts merge successfully.
- Duplicate script with the same command succeeds.
- Duplicate script with a different command throws.
- Identical metadata fields merge successfully.
- Conflicting metadata fields throw.
- Input patches are not mutated.

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
- `package.json` merge utility added
- Conflict behavior added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `mergePackageJsonPatches` exists.
- `package.json` patch conflicts are detected.
- Conflict errors are clear.
- Helpers are exported from `@launchkit/generator`.
- Vitest tests cover merge and conflict behavior.
- No full generation pipeline is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
