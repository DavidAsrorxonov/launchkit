# Phase 3 Step 5: Add Option Metadata

## Goal

Add human-readable option metadata to `packages/schema`.

This metadata will be used by the website wizard to render labels, descriptions, categories, and recommended states without hardcoding option details in the UI.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review the previous Phase 3 work:

```txt
.agents/prompts/phase-03/step-1.md
.agents/prompts/phase-03/step-2.md
.agents/prompts/phase-03/step-3.md
.agents/prompts/phase-03/step-4.md
```

## Scope

### You may

- Add option metadata exports in `packages/schema`.
- Add TypeScript types for metadata.
- Add Vitest tests for metadata completeness.
- Update `progress-tracker.md`.

### You must not

- Add compatibility rules.
- Add generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.
- Change the confirmed MVP option values unless there is a clear documented inconsistency.

## Metadata Purpose

The website should be able to import metadata from `@launchkit/schema` and render the wizard choices.

This prevents duplicated labels and descriptions across:

- Website UI
- Generator preview
- Future CLI prompts

## Suggested File Structure

Use a focused file:

```txt
packages/schema/src/
  metadata.ts
```

Re-export metadata from:

```txt
packages/schema/src/index.ts
```

## Required Metadata Type

Create a general metadata type.

Example:

```ts
export type OptionMetadata<TValue extends string = string> = {
  value: TValue;
  label: string;
  description: string;
  recommended?: boolean;
};
```

If useful, add a category-aware type:

```ts
export type OptionCategoryMetadata<TValue extends string = string> = {
  label: string;
  description: string;
  options: OptionMetadata<TValue>[];
};
```

Keep this simple. Do **not** over-engineer it.

## Required Metadata Exports

Add metadata for every MVP option category:

- `frameworkMetadata`
- `languageMetadata`
- `routerMetadata`
- `projectStructureMetadata`
- `stylingMetadata`
- `uiMetadata`
- `databaseMetadata`
- `ormMetadata`
- `authMetadata`
- `dockerMetadata`
- `packageManagerMetadata`

Each metadata list should correspond exactly to the option arrays from Step 2.

## Suggested Labels And Descriptions

### Framework

#### `next`

- Label: `Next.js`
- Description: `React framework for full-stack applications.`
- Recommended: `true`

### Language

#### `typescript`

- Label: `TypeScript`
- Description: `Strongly typed JavaScript for safer application code.`
- Recommended: `true`

### Router

#### `app`

- Label: `App Router`
- Description: `Modern Next.js routing with layouts and server components.`
- Recommended: `true`

### Project Structure

#### `no-src`

- Label: `No src folder`
- Description: `Keep app, components, and lib folders at the project root.`
- Recommended: `true`

### Styling

#### `tailwind`

- Label: `Tailwind CSS`
- Description: `Utility-first styling with design tokens.`
- Recommended: `true`

### UI

#### `none`

- Label: `None`
- Description: `Start without a component library.`

#### `shadcn`

- Label: `shadcn/ui`
- Description: `Copy-paste component system built on Radix UI and Tailwind CSS.`
- Recommended: `true`

### Database

#### `none`

- Label: `None`
- Description: `Start without database setup.`

#### `postgres`

- Label: `PostgreSQL`
- Description: `Production-ready relational database.`
- Recommended: `true`

### ORM

#### `none`

- Label: `None`
- Description: `Start without an ORM.`

#### `prisma`

- Label: `Prisma`
- Description: `Type-safe ORM with schema migrations and generated client.`
- Recommended: `true`

### Auth

#### `none`

- Label: `None`
- Description: `Start without authentication.`

#### `authjs-credentials`

- Label: `Auth.js credentials scaffold`
- Description: `Adds Auth.js structure for credentials-based auth that you can connect to your user model.`

### Docker

#### `none`

- Label: `None`
- Description: `Do not include Docker files.`

#### `postgres`

- Label: `PostgreSQL Docker Compose`
- Description: `Add a local PostgreSQL service for development.`

### Package Manager

#### `npm`

- Label: `npm`
- Description: `Use npm commands in generated setup instructions.`
- Recommended: `true`

#### `pnpm`

- Label: `pnpm`
- Description: `Use pnpm commands in generated setup instructions.`

## Tasks

1. Create `packages/schema/src/metadata.ts`.
2. Add metadata types.
3. Add metadata arrays for every option category.
4. Ensure metadata values match the option arrays exactly.
5. Re-export metadata from `packages/schema/src/index.ts`.
6. Add Vitest tests for metadata completeness.
7. Run relevant checks.
8. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Test at least:

- Every option category has metadata.
- Every metadata value exists in the corresponding option array.
- Every option value has exactly one metadata entry.
- Every metadata item has a non-empty label.
- Every metadata item has a non-empty description.

Avoid snapshot-only tests for this step. Prefer explicit completeness checks.

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
- Metadata categories added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- Metadata exists for every MVP option category.
- Metadata values match supported option values exactly.
- Metadata is exported from `@launchkit/schema`.
- Vitest tests cover metadata completeness.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
