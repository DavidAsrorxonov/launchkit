# Phase 5 Step 1: Create Template Package Foundation

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 4 is complete and Phase 5 is ready.
4. Implement only this step.

Do not move to Phase 5 Step 2.
Do not create real Next.js template files yet.
Do not add feature templates yet.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Prepare `packages/templates` as the shared template package that will hold base templates and feature templates for generated LaunchKit projects.

This step creates the package foundation only. Real template content starts in later Phase 5 steps.

## Scope

Create or verify this structure:

```txt
packages/templates/
  package.json
  tsconfig.json
  src/
    index.ts
  base/
  features/
```

The package name must be:

```txt
@launchkit/templates
```

## Requirements

### 1. Package Setup

Create `packages/templates/package.json` if it does not already exist.

It should be a workspace package and should include:

```json
{
  "name": "@launchkit/templates",
  "version": "0.0.0",
  "private": true,
  "type": "module"
}
```

Add scripts consistent with the existing monorepo conventions, if they already exist for other packages.

Recommended scripts:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run"
}
```

Only add scripts that make sense with the current repo setup.

### 2. TypeScript Setup

Create `packages/templates/tsconfig.json` if it does not already exist.

It should extend the root TypeScript config if the repo has one, for example:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

Match the existing package TypeScript pattern used by `packages/schema` and `packages/generator`.

### 3. Public Entry Point

Create `packages/templates/src/index.ts`.

For now, add a small placeholder export:

```ts
export function templatesPackageReady() {
  return true;
}
```

Do not export real templates yet.

### 4. Template Directories

Create these directories if not present already:

```txt
packages/templates/base/
packages/templates/features/
```

For this step, they can be empty unless the repository requires placeholder files to keep empty directories tracked.

If placeholder files are needed, use `.gitkeep`.

### 5. Workspace Integration

Verify that the root `package.json` workspace configuration includes:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Do not change the workspace setup unless it is missing or incorrect.

### 6. No Generator Changes Unless Needed

Do not wire `@launchkit/templates` into `@launchkit/generator` yet unless the current codebase already expects the package to exist and fails without an import/export fix.

This step is only the package foundation.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
```

If the repo has package-specific commands, also run:

```bash
npm run typecheck -w @launchkit/templates
npm test -w @launchkit/templates
```

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 5 Step 1 completed: Create template package foundation

Changes made:
- Created or verified @launchkit/templates package.
- Created or verified package TypeScript config.
- Created or verified src/index.ts placeholder export.
- Created or verified base/ and features/ template directories.

Files changed:
- packages/templates/package.json
- packages/templates/tsconfig.json
- packages/templates/src/index.ts
- packages/templates/base/
- packages/templates/features/
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 2: Create base Next.js template
```

## Completion Criteria

This step is complete when:

- `packages/templates` exists.
- `@launchkit/templates` package exists.
- `packages/templates/src/index.ts` exports `templatesPackageReady`.
- `packages/templates/base/` exists.
- `packages/templates/features/` exists.
- Workspace configuration still includes `packages/*`.
- TypeScript checks pass, or failures are documented if unrelated.
- Tests pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
