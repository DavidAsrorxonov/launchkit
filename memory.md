# Memory - Phase 4 Generator Core Utilities

Last updated: 2026-06-28 22:06 JST

## What was built

Completed Phase 4 Steps 2 through 6 in `packages/generator` and updated `context/progress-tracker.md` after each step.

Added generated file tree modeling and path safety:

- `packages/generator/src/file-tree.ts`
- `packages/generator/src/file-tree.test.ts`

Added generation plan modeling:

- `packages/generator/src/generation-plan.ts`
- `packages/generator/src/generation-plan.test.ts`

Added MVP feature definitions and registry:

- `packages/generator/src/features/definitions.ts`
- `packages/generator/src/features/registry.ts`
- `packages/generator/src/features/registry.test.ts`

Added `package.json` patch merging:

- `packages/generator/src/package-json.ts`
- `packages/generator/src/package-json.test.ts`

Added env var merging and `.env.example` rendering:

- `packages/generator/src/env.ts`
- `packages/generator/src/env.test.ts`

Updated `packages/generator/src/index.ts` to re-export the new generator APIs.

## Decisions made

Generator paths are normalized and validated in `file-tree.ts`; plan and feature file path fields remain plain strings until later pipeline/file-tree integration.

Feature definitions are declarative only. No `apply()` behavior was added.

Feature enablement is config-based only. Compatibility validation remains centralized in `@launchkit/schema`, not in the generator feature registry.

`PackageJsonPatch` in `generation-plan.ts` is the shared package patch shape for plans, feature definitions, and merge utilities.

Env rendering only emits provided placeholder values. It does not generate secrets.

## Problems solved

The package merge utility initially failed generator typecheck/build because an internal merged object inferred as `{}` had no string index signature. Fixed by typing the merged map as `Record<string, string>`.

The known sandboxed `npm run build` failure still occurs because Next/Turbopack tries to create/bind worker processes. Rerunning `npm run build` with elevated permissions passes.

## Current state

Phase 4 is in progress through Step 6.

Working generator exports now include:

- `GeneratedFile`, `GeneratedProject`, `normalizeGeneratedPath()`, `createGeneratedFile()`, `createGeneratedProject()`
- `GenerationPlan`, supporting plan types, and `createEmptyGenerationPlan()`
- `FeatureDefinition`, MVP feature definitions, `featureRegistry`, `getFeatureDefinition()`, `getEnabledFeatures()`
- `mergePackageJsonPatches()` and `PackageJsonMergeConflictError`
- `mergeEnvVars()`, `EnvVarMergeConflictError`, and `renderEnvExample()`

The generator still does not implement:

- `generateProject`
- full generation pipeline
- template loading
- actual file creation from templates
- file output adapters
- real templates
- website UI
- CLI functionality

Verification passed after Step 6:

- `npm run typecheck -w packages/generator`
- `npm run test -w packages/generator` with 57 generator tests
- `npm run build -w packages/generator`
- `npm run typecheck`
- `npm run test` with 57 generator tests and 72 schema tests
- `npm run lint`
- `npm run build` after elevated rerun

Current untracked prompt files from this session are under `.agents/prompts/phase-04/`, including the latest `.agents/prompts/phase-04/step-6.md`. They were intentionally left untouched except for reading.

## Next session starts with

Read `context/progress-tracker.md` first, then implement the next Phase 4 prompt, likely `.agents/prompts/phase-04/step-7.md` if present.

Keep the next change scoped to the prompt. Do not implement `generateProject`, template loading, website integration, or CLI functionality unless the prompt explicitly asks for it.

## Open questions

None for Phase 4 Steps 2 through 6.
