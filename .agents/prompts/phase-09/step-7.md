# Phase 9 Step 7: Add Filesystem Write Behavior

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 6 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 8.
Do not implement full existing-directory overwrite policy yet.
Do not install generated project dependencies.
Do not run generated project code.
Do not duplicate generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add filesystem write behavior to the LaunchKit CLI.

After the CLI validates config and generates an in-memory project, it should write generated files into a target directory safely.

This step should implement basic safe writes only. More detailed existing-directory safety belongs to Phase 9 Step 8.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/write-project.ts
packages/cli/src/write-project.test.ts
packages/cli/src/index.ts
packages/cli/src/generate.ts
```

Adjust paths to match the existing CLI package structure.

## Requirements

### 1. Target Directory Resolution

Determine the target directory from:

```txt
positional target directory
or config.name
```

Recommended behavior:

```txt
create-launchkit my-app
  writes to ./my-app

create-launchkit --name my-app
  writes to ./my-app
```

Do not write directly into the current working directory unless the user explicitly uses:

```txt
.
```

Full current-directory behavior and safety confirmation belongs to Phase 9 Step 8.

### 2. Write Helper

Create a helper:

```ts
export type WriteProjectInput = {
  project: GeneratedProject;
  targetDir: string;
  cwd?: string;
};

export async function writeGeneratedProject(
  input: WriteProjectInput,
): Promise<WriteProjectResult> {
  // ...
}
```

Recommended result:

```ts
export type WriteProjectResult = {
  targetDir: string;
  filesWritten: string[];
};
```

Exact names may vary based on repo style.

### 3. Path Safety

Before writing each file, verify generated file paths are safe.

Reject paths that:

```txt
start with /
contain ..
contain empty path segments
are "."
are ".."
escape the target directory after resolution
contain src/ as a path segment
```

Use existing generator path helpers if available.

Also verify resolved absolute output paths remain inside the resolved target directory.

### 4. Directory Creation

Create target directory and parent directories as needed.

For each generated file:

- create parent directories
- write file contents
- preserve UTF-8 string contents
- support `Uint8Array` contents if generator returns binary files

Do not write outside the target directory.

### 5. Existing Directory Basic Behavior

For this step, keep existing directory behavior conservative.

Recommended:

- If target directory does not exist: create it and write files.
- If target directory exists and is empty: write files.
- If target directory exists and is not empty: fail with a clear error.

More advanced behavior such as confirmation, overwrite prompts, or merge behavior belongs to Phase 9 Step 8.

### 6. Error Handling

Add CLI-friendly write errors.

Recommended error class:

```ts
export class ProjectWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectWriteError";
  }
}
```

Handle:

- unsafe generated path
- target directory exists and is not empty
- filesystem write failure
- target path escapes target directory

Do not expose noisy stack traces in normal CLI output.

### 7. Entry Flow

Update CLI entry flow:

1. Parse args.
2. Run prompts or `--yes` draft creation.
3. Validate config.
4. Generate project in memory.
5. Resolve target directory.
6. Write generated files safely.
7. Print a concise success message.

Example success:

```txt
Created my-app in ./my-app

Next steps:
  cd my-app
  npm install
  npm run dev
```

Do not install dependencies yet.

Dependency installation prompt belongs to Phase 9 Step 9.

### 8. Next Steps Output

Print next steps based on package manager:

For npm:

```txt
cd my-app
npm install
npm run dev
```

For pnpm:

```txt
cd my-app
pnpm install
pnpm dev
```

Only print commands. Do not execute them.

### 9. Tests

Use Vitest only.

Add tests for:

- writes generated files to a new temp directory
- creates nested directories
- writes string contents
- writes `Uint8Array` contents if supported
- rejects absolute generated paths
- rejects `..` traversal
- rejects empty path segments
- rejects paths escaping target directory
- rejects `src/` paths
- writes into existing empty directory
- fails on existing non-empty directory
- returns files written
- success output includes next steps
- no dependencies are installed

Use temp directories for tests.

Do not write test output into tracked source folders.

Do not use destructive cleanup outside temp directories.

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

## Manual Verification

If practical, manually run the built CLI in a temporary directory:

```bash
node packages/cli/dist/index.js my-app --yes
```

Then verify:

```txt
my-app/
  package.json
  app/
  README.md
```

Do not run `npm install` in the generated project during this step.

Document manual verification in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 7 completed: Add filesystem write behavior

Changes made:
- Added safe generated project write helper.
- Added target directory resolution.
- Added generated path safety checks before writing.
- Added directory creation and file writing.
- Added conservative existing-directory behavior.
- Added CLI success and next-steps output.
- Added tests for filesystem writes and unsafe paths.
- Confirmed dependency installation is not implemented yet.

Files changed:
- packages/cli/src/write-project.ts
- packages/cli/src/write-project.test.ts
- packages/cli/src/index.ts
- packages/cli/src/generate.ts, if changed
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Manual verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 8: Add existing-directory safety
```

## Completion Criteria

This step is complete when:

- CLI can write generated files to a target directory.
- Target directory resolution works.
- Nested directories are created.
- Generated file paths are checked before writing.
- Resolved output paths cannot escape target directory.
- Existing empty directory can be used.
- Existing non-empty directory fails safely.
- CLI prints next steps.
- CLI does not install dependencies.
- CLI does not run generated project code.
- Write behavior has Vitest coverage.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
