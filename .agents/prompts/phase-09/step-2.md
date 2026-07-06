# Phase 9 Step 2: Create CLI Package Foundation

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 1 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 3.
Do not add argument parsing yet.
Do not add interactive prompts yet.
Do not connect to the generator yet.
Do not write generated files to disk yet.
Do not install generated project dependencies.
Do not duplicate schema or generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the CLI package foundation for LaunchKit.

This step should add a new workspace package for the future CLI with TypeScript, build/test scripts, a bin entry, and a minimal placeholder command.

The CLI package should be ready for later Phase 9 steps, but it should not implement real generation behavior yet.

## Scope

Create:

```txt
packages/cli/
```

Recommended structure:

```txt
packages/cli/
  package.json
  tsconfig.json
  src/
    index.ts
    index.test.ts
```

Optional if the repo uses this pattern:

```txt
packages/cli/
  src/
    cli.ts
```

Follow existing package conventions from:

```txt
packages/schema
packages/generator
packages/templates
```

## Requirements

### 1. Package Name

Use the package name confirmed in Phase 9 Step 1.

Recommended:

```txt
create-launchkit
```

Do not publish or configure release automation in this step.

### 2. Workspace Integration

Confirm root `package.json` includes:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Because `packages/cli` is under `packages/*`, it should automatically be part of the npm workspace.

Do not change workspace structure unless it is missing or incorrect.

### 3. CLI package.json

Create `packages/cli/package.json`.

Recommended shape:

```json
{
  "name": "create-launchkit",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "bin": {
    "create-launchkit": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@launchkit/schema": "workspace:*",
    "@launchkit/generator": "workspace:*"
  },
  "devDependencies": {}
}
```

Adjust dependency spec format to match existing npm workspace conventions.

If the repo does not use `workspace:*`, follow the existing local package dependency style.

Do not add prompt or argument parser dependencies yet unless Phase 9 Step 1 explicitly decided they should be installed during foundation.

### 4. TypeScript Config

Create `packages/cli/tsconfig.json`.

Recommended:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src"]
}
```

Match existing package TypeScript config style.

### 5. CLI Entry Point

Create:

```txt
packages/cli/src/index.ts
```

It should be executable after build.

Include a shebang:

```ts
#!/usr/bin/env node
```

Add minimal placeholder behavior only.

Recommended:

```ts
export function cliPackageReady() {
  return true;
}

export async function main() {
  console.log("LaunchKit CLI is not implemented yet.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
```

Adjust direct-execution detection if the repo has a preferred pattern.

Do not implement argument parsing.
Do not ask prompts.
Do not generate files.

### 6. Tests

Create a minimal Vitest test.

Example:

```ts
import { describe, expect, it } from "vitest";
import { cliPackageReady } from "./index";

describe("cli package", () => {
  it("is ready", () => {
    expect(cliPackageReady()).toBe(true);
  });
});
```

Do not test real CLI behavior yet.

### 7. Build Output

Ensure built files go to:

```txt
packages/cli/dist/
```

Confirm `dist` is ignored by git according to the root `.gitignore`.

Do not commit generated `dist` files unless the repo convention requires it.

### 8. No Real CLI Behavior Yet

This step must not implement:

```txt
argument parsing
interactive prompts
schema validation flow
generator integration
filesystem writes
existing directory checks
dependency installation
next-step output
publishing setup
```

Those belong to later Phase 9 steps.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run typecheck
npm test
```

Also run if configured:

```bash
npm run lint
npm run build
```

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

If dependencies need installation after adding the workspace package, run:

```bash
npm install
```

Do not use pnpm.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 2 completed: Create CLI package foundation

Changes made:
- Created packages/cli workspace package.
- Added create-launchkit package metadata.
- Added CLI bin entry.
- Added TypeScript config.
- Added minimal CLI entry point.
- Added minimal Vitest package test.
- Confirmed no real CLI generation behavior was added.

Files changed:
- packages/cli/package.json
- packages/cli/tsconfig.json
- packages/cli/src/index.ts
- packages/cli/src/index.test.ts
- package-lock.json, if npm install updated it
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 3: Add CLI argument parsing
```

## Completion Criteria

This step is complete when:

- `packages/cli` exists.
- CLI package has the confirmed package name.
- CLI package has a bin entry.
- CLI package has TypeScript config.
- CLI package has a minimal entry point.
- CLI package has a minimal Vitest test.
- CLI package can typecheck.
- CLI package tests pass.
- CLI package can build.
- No real CLI generation behavior is implemented yet.
- No Node built-in test runner usage is introduced.
- `progress-tracker.md` is updated.

Then stop.
