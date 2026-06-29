# Phase 4 Step 2: Define Generated File Tree Model

## Goal

Define the core generated project file tree model in `packages/generator`.

This model represents the generated project in memory before it is written as a zip file for the website or to the filesystem for the future CLI.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review the previous Phase 4 work:

```txt
.agents/prompts/phase-04/step-1.md
```

## Scope

### You may

- Add TypeScript types for generated files and generated projects.
- Add simple file tree helper functions.
- Add safe path normalization helpers.
- Add Vitest tests for file tree helpers.
- Update `progress-tracker.md`.

### You must not

- Implement `generateProject`.
- Implement generation planning.
- Implement feature registry logic.
- Implement `package.json` merging.
- Implement template loading.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required Concepts

The generator should produce an in-memory project representation.

Required model:

```ts
export type GeneratedFile = {
  path: string;
  contents: string | Uint8Array;
};

export type GeneratedProject = {
  name: string;
  files: GeneratedFile[];
  packageManager: "npm" | "pnpm";
};
```

The internal file paths should:

- Use POSIX-style `/` separators.
- Be relative to the generated project root.
- Never start with `/`.
- Never contain `..`.
- Never contain empty path segments.
- Never allow path traversal.

## Suggested File Structure

Use focused files inside `packages/generator/src`.

Example:

```txt
packages/generator/src/
  file-tree.ts
  index.ts
```

Re-export public types and helpers from:

```txt
packages/generator/src/index.ts
```

## Required Helpers

Add helpers similar to these:

```ts
export function normalizeGeneratedPath(path: string): string;

export function createGeneratedFile(
  path: string,
  contents: string | Uint8Array,
): GeneratedFile;

export function createGeneratedProject(input: {
  name: string;
  files?: GeneratedFile[];
  packageManager: "npm" | "pnpm";
}): GeneratedProject;
```

`normalizeGeneratedPath` should reject unsafe paths.

## Valid Path Examples

```txt
package.json
app/page.tsx
app/layout.tsx
lib/utils.ts
prisma/schema.prisma
```

## Invalid Path Examples

```txt
/package.json
../package.json
app/../package.json
app//page.tsx
""
.
..
```

## Error Handling

Use a typed or clearly named error for invalid generated paths.

Example:

```ts
export class InvalidGeneratedPathError extends Error {
  constructor(path: string) {
    super(`Invalid generated path: ${path}`);
    this.name = "InvalidGeneratedPathError";
  }
}
```

Keep this simple. More complete generator error types can come later.

## Tasks

1. Create `packages/generator/src/file-tree.ts`.
2. Add `GeneratedFile` and `GeneratedProject` types.
3. Add `normalizeGeneratedPath`.
4. Add `createGeneratedFile`.
5. Add `createGeneratedProject`.
6. Add invalid path error handling.
7. Re-export types and helpers from `packages/generator/src/index.ts`.
8. Add Vitest tests for valid and invalid paths.
9. Run relevant checks.
10. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Valid root file path is accepted.
- Valid nested file path is accepted.
- Windows-style backslashes are normalized or rejected consistently.
- Leading slash path is rejected.
- Path containing `..` is rejected.
- Path containing empty segment is rejected.
- Empty path is rejected.
- `createGeneratedFile` normalizes and stores path.
- `createGeneratedProject` returns files with valid paths.
- Invalid files in `createGeneratedProject` fail.

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
- File tree types/helpers added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `GeneratedFile` exists.
- `GeneratedProject` exists.
- Generated paths are normalized and validated.
- Unsafe paths are rejected.
- File tree helpers are exported from `@launchkit/generator`.
- Vitest tests cover path safety.
- No generation pipeline is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
