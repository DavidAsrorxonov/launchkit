# Phase 4 Step 3: Define Generation Plan Model

## Goal

Define the generation plan model in `packages/generator`.

The generation plan describes what the generator intends to create before files are actually produced.

This step should define types and lightweight helpers only. Do **not** implement the full generation pipeline yet.

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
```

## Scope

### You may

- Add generation plan TypeScript types.
- Add dependency/script/env contribution types.
- Add file reference types.
- Add simple plan creation helpers.
- Add Vitest tests for plan model helpers.
- Update `progress-tracker.md`.

### You must not

- Implement `generateProject`.
- Implement full feature resolution.
- Implement feature registry logic beyond types.
- Implement `package.json` merging.
- Implement template loading.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required Concepts

A generation plan should answer:

- Which config is being used?
- Which base template should be used?
- Which features are selected?
- Which files should be created?
- Which dependencies should be added?
- Which dev dependencies should be added?
- Which scripts should be added?
- Which environment variables should be included?
- Which notes should appear in the generated README or UI preview?

## Suggested File Structure

Use focused files inside `packages/generator/src`.

Example:

```txt
packages/generator/src/
  generation-plan.ts
  file-tree.ts
  index.ts
```

Re-export public types and helpers from:

```txt
packages/generator/src/index.ts
```

## Required Types

Create types similar to these:

```ts
import type { LaunchKitConfig } from "@launchkit/schema";

export type BaseTemplateId = "next";

export type FeatureId =
  | "next"
  | "tailwind"
  | "shadcn"
  | "postgres"
  | "prisma"
  | "authjs-credentials"
  | "docker-postgres";

export type DependencyMap = Record<string, string>;

export type ScriptMap = Record<string, string>;

export type EnvVarDefinition = {
  name: string;
  value: string;
  description?: string;
  required?: boolean;
};

export type TemplateFileReference = {
  sourcePath: string;
  targetPath: string;
};

export type GeneratedFileDefinition = {
  path: string;
  contents: string;
};

export type PackageJsonPatch = {
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
  scripts?: ScriptMap;
};

export type ResolvedFeature = {
  id: FeatureId;
  label: string;
};

export type GenerationPlan = {
  config: LaunchKitConfig;
  baseTemplate: BaseTemplateId;
  features: ResolvedFeature[];
  packageJson: PackageJsonPatch;
  env: EnvVarDefinition[];
  templateFiles: TemplateFileReference[];
  generatedFiles: GeneratedFileDefinition[];
  notes: string[];
};
```

Adjust exact names if the existing codebase has better naming, but keep the concepts.

## Required Helper

Add a helper like:

```ts
export function createEmptyGenerationPlan(
  config: LaunchKitConfig,
): GenerationPlan;
```

It should return a valid initial plan with:

```ts
{
  config,
  baseTemplate: "next",
  features: [],
  packageJson: {},
  env: [],
  templateFiles: [],
  generatedFiles: [],
  notes: [],
}
```

Do **not** resolve real features yet.

That belongs to the feature registry step.

## Path Safety

Any file-related paths in the plan should eventually be compatible with the file tree model from Step 2.

For this step:

- Use string types.
- Avoid writing path normalization twice.
- If path helpers already exist, use them for generated file definitions if practical.

## Tasks

1. Create `packages/generator/src/generation-plan.ts`.
2. Add base template, feature, dependency, script, env, file reference, and plan types.
3. Add `createEmptyGenerationPlan(config)`.
4. Re-export plan types and helper from `packages/generator/src/index.ts`.
5. Add Vitest tests for the empty plan helper.
6. Run relevant checks.
7. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- `createEmptyGenerationPlan` returns the provided config.
- Default `baseTemplate` is `"next"`.
- `features` array starts empty.
- Package patch starts empty.
- `env` array starts empty.
- Template files array starts empty.
- Generated files array starts empty.
- Notes array starts empty.

Use `defaultLaunchKitConfig` from `@launchkit/schema` if available.

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
- Generation plan types/helpers added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `GenerationPlan` exists.
- Plan-related supporting types exist.
- `createEmptyGenerationPlan` exists.
- Exports are available from `@launchkit/generator`.
- Vitest tests cover the empty plan helper.
- No real feature resolution is implemented yet.
- No generation pipeline is implemented yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
