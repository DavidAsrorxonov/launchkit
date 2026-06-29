# Phase 4 Step 4: Create Feature Definition And Registry

## Goal

Create the feature definition model and MVP feature registry in `packages/generator`.

The registry should describe the features LaunchKit can compose later, but this step should **not** implement the full generation pipeline yet.

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
```

## Scope

### You may

- Add `FeatureDefinition` types.
- Add MVP feature definitions.
- Add a feature registry.
- Add simple feature lookup helpers.
- Add basic feature selection helpers from config.
- Add Vitest tests for registry behavior.
- Update `progress-tracker.md`.

### You must not

- Implement the full `generateProject` pipeline.
- Implement template loading.
- Implement actual file creation from templates.
- Implement `package.json` merge utility.
- Implement env var merge utility.
- Add real templates.
- Build website UI.
- Add CLI functionality.

## Required MVP Features

Create registry entries for:

- `next`
- `tailwind`
- `shadcn`
- `postgres`
- `prisma`
- `authjs-credentials`
- `docker-postgres`

## Suggested File Structure

Use focused files inside `packages/generator/src`.

Example:

```txt
packages/generator/src/
  features/
    definitions.ts
    registry.ts
  generation-plan.ts
  file-tree.ts
  index.ts
```

If the project prefers flatter files, this is also acceptable:

```txt
packages/generator/src/
  feature-definition.ts
  feature-registry.ts
  index.ts
```

Follow the existing repo style.

## Required Types

Create a feature definition type similar to:

```ts
import type { LaunchKitConfig } from "@launchkit/schema";
import type {
  EnvVarDefinition,
  FeatureId,
  GeneratedFileDefinition,
  PackageJsonPatch,
  TemplateFileReference,
} from "../generation-plan";

export type FeatureDefinition = {
  id: FeatureId;
  label: string;
  description: string;
  requires?: FeatureId[];
  conflicts?: FeatureId[];
  packageJson?: PackageJsonPatch;
  env?: EnvVarDefinition[];
  templateFiles?: TemplateFileReference[];
  generatedFiles?: GeneratedFileDefinition[];
  notes?: string[];
  isEnabled?: (config: LaunchKitConfig) => boolean;
};
```

Keep feature definitions mostly declarative.

Do **not** add complex `apply()` behavior yet unless the existing architecture already requires it.

## Required Feature Contributions

Keep contributions lightweight for now.

### `next`

- Label: `Next.js`
- Description: `Base Next.js App Router project.`
- Enabled: always

### `tailwind`

- Label: `Tailwind CSS`
- Description: `Utility-first styling system.`
- Enabled: always

### `shadcn`

- Label: `shadcn/ui`
- Description: `Component system built on Tailwind CSS.`
- Enabled: `config.ui === "shadcn"`
- Requires: `tailwind`

### `postgres`

- Label: `PostgreSQL`
- Description: `Relational database configuration.`
- Enabled: `config.database === "postgres"`
- Env:
  - `DATABASE_URL`

### `prisma`

- Label: `Prisma`
- Description: `Type-safe ORM and migration toolkit.`
- Enabled: `config.orm === "prisma"`
- Requires: `postgres`
- Dependencies:
  - `@prisma/client`

- Dev dependencies:
  - `prisma`

- Scripts:
  - `db:generate`
  - `db:migrate`

### `authjs-credentials`

- Label: `Auth.js credentials scaffold`
- Description: `Credentials-ready Auth.js structure.`
- Enabled: `config.auth === "authjs-credentials"`
- Env:
  - `AUTH_SECRET`

- Notes:
  - `Real user lookup and password verification must be implemented by the developer.`

### `docker-postgres`

- Label: `PostgreSQL Docker Compose`
- Description: `Local PostgreSQL service for development.`
- Enabled: `config.docker === "postgres"`
- Requires: `postgres`

## Required Registry Exports

Export:

```ts
export const featureRegistry = ...
export function getFeatureDefinition(id: FeatureId): FeatureDefinition;
export function getEnabledFeatures(config: LaunchKitConfig): FeatureDefinition[];
```

`getEnabledFeatures` should return features based on the config.

For the MVP, it should always include:

- `next`
- `tailwind`

Then conditionally include:

- `shadcn`
- `postgres`
- `prisma`
- `authjs-credentials`
- `docker-postgres`

Do **not** perform compatibility validation here unless it is already centralized in `@launchkit/schema`.

The schema package should remain the source of compatibility rules.

## Tasks

1. Create feature definition types.
2. Create MVP feature definitions.
3. Create `featureRegistry`.
4. Add `getFeatureDefinition`.
5. Add `getEnabledFeatures`.
6. Re-export feature types and helpers from `packages/generator/src/index.ts`.
7. Add Vitest tests for registry and enabled features.
8. Run relevant checks.
9. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Registry contains all MVP feature IDs.
- `getFeatureDefinition("next")` returns the Next.js feature.
- Unknown feature IDs are handled predictably if runtime lookup accepts strings.
- Default config enables `next` and `tailwind`.
- Default config does not enable `shadcn`.
- Config with `ui: "shadcn"` enables `shadcn`.
- Config with `database: "postgres"` enables `postgres`.
- Config with `orm: "prisma"` enables `prisma`.
- Config with `auth: "authjs-credentials"` enables `authjs-credentials`.
- Config with `docker: "postgres"` enables `docker-postgres`.

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
- Feature definitions added
- Registry helpers added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- `FeatureDefinition` exists.
- MVP feature definitions exist.
- Feature registry exists.
- Enabled features can be derived from config.
- Feature exports are available from `@launchkit/generator`.
- Vitest tests cover registry behavior.
- No full generation pipeline is implemented yet.
- No real templates are added yet.
- Typecheck passes or unrelated failure is documented.
- `progress-tracker.md` is updated.
