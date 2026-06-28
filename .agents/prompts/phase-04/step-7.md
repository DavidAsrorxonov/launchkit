# Phase 4 Step 7: Create Template Loader Interface

## Goal

Create the template loader interface in `packages/generator`.

This step defines how templates will be referenced and loaded later, but it should **not** add real LaunchKit templates yet.

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
.agents/prompts/phase-04/step-6.md
```

## Scope

### You may

- Add template loader types.
- Add template context types.
- Add placeholder or in-memory template loader implementation for tests.
- Add placeholder replacement helper.
- Add Vitest tests for template path and placeholder behavior.
- Update `progress-tracker.md`.

### You must not

- Add real Next.js templates.
- Add real feature templates.
- Implement full filesystem template loading unless already simple and scoped.
- Implement the full `generateProject` pipeline.
- Implement output adapters.
- Build website UI.
- Add CLI functionality.

## Required Concepts

LaunchKit templates will eventually live in:

```txt
packages/templates/base/
packages/templates/features/
```

The generator needs an interface that can load template files and return generated file definitions.

This step should define the interface before actual templates are implemented.

## Suggested File Structure

Use a focused file:

```txt
packages/generator/src/template-loader.ts
```

Or:

```txt
packages/generator/src/templates/template-loader.ts
```

Follow the existing repo style.

Re-export public types and helpers from:

```txt
packages/generator/src/index.ts
```

## Required Types

Create types similar to:

```ts
export type TemplateContext = {
  projectName: string;
  packageName: string;
};

export type TemplateFile = {
  sourcePath: string;
  targetPath: string;
  contents: string | Uint8Array;
};

export type TemplateLoader = {
  loadTemplateFiles(input: {
    templateId: string;
    context: TemplateContext;
  }): Promise<TemplateFile[]>;
};
```

You can adjust names if existing types from `generation-plan.ts` already cover some of this.

## Required Placeholder Helper

Add a helper for simple placeholder replacement.

Example:

```ts
export function applyTemplatePlaceholders(
  value: string,
  context: TemplateContext,
): string;
```

It should replace simple placeholders:

```txt
{{projectName}}
{{packageName}}
```

Example:

```txt
Welcome to {{projectName}}
```

Becomes:

```txt
Welcome to my-app
```

Do **not** implement complex template logic.

Avoid:

- Conditionals
- Loops
- Embedded JavaScript

## Path Handling

Template target paths should eventually become generated file paths.

For this step:

- Use existing generated path normalization helpers if available.
- Ensure unsafe target paths are rejected or normalized consistently.
- Path placeholders should be supported if practical.

Example:

```txt
{{projectName}}/README.md
```

If this adds too much complexity, limit placeholders to file contents for now and document the limitation in `progress-tracker.md`.

## Placeholder Behavior

Rules:

- Replace known placeholders.
- Leave unknown placeholders unchanged or throw, but choose one behavior and test it.
- Recommended behavior: leave unknown placeholders unchanged for now.
- Do not mutate the context object.

## Optional In-Memory Loader

For testing, add a simple in-memory loader.

Example:

```ts
export function createInMemoryTemplateLoader(
  templates: Record<string, TemplateFile[]>,
): TemplateLoader;
```

This allows tests and the future pipeline to exercise loader behavior before real filesystem templates exist.

## Tasks

1. Create a template loader file.
2. Add `TemplateContext`.
3. Add `TemplateFile`.
4. Add `TemplateLoader`.
5. Add `applyTemplatePlaceholders`.
6. Optionally add `createInMemoryTemplateLoader`.
7. Use existing path safety helpers where appropriate.
8. Re-export public helpers from `packages/generator/src/index.ts`.
9. Add Vitest tests for placeholder replacement and in-memory loading if implemented.
10. Run relevant checks.
11. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Known placeholders are replaced.
- Multiple placeholders are replaced.
- Repeated placeholders are replaced.
- Unknown placeholders behave consistently.
- Context object is not mutated.
- Binary file contents are preserved if using `TemplateFile`.
- In-memory loader returns files for known template ID if implemented.
- In-memory loader returns an empty array or throws for unknown template ID, but behavior must be tested.
- Unsafe target paths are rejected if path validation is implemented here.

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
- Template loader interface added
- Placeholder behavior chosen
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `TemplateLoader` interface exists.
- `TemplateContext` exists.
- Template placeholder helper exists.
- Placeholder behavior is tested.
- Public exports are available from `@launchkit/generator`.
- No real templates are added yet.
- No full generation pipeline is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
