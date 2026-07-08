# Phase 9 Step 8: Add Existing-Directory Safety

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 7 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 9.
Do not install generated project dependencies.
Do not run generated project code.
Do not duplicate generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add robust existing-directory safety to the LaunchKit CLI.

The CLI should protect users from accidentally overwriting files when generating into an existing directory.

This step should add clear behavior for:

- missing target directory
- existing empty target directory
- existing non-empty target directory
- current directory target
- `--yes` behavior
- user confirmation where appropriate

Dependency installation remains for Phase 9 Step 9.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/write-project.ts
packages/cli/src/write-project.test.ts
packages/cli/src/directory-safety.ts
packages/cli/src/directory-safety.test.ts
packages/cli/src/prompts.ts
packages/cli/src/index.ts
```

Adjust paths to match the existing CLI package structure.

## Requirements

### 1. Directory State Detection

Create or refine a helper that detects target directory state.

Recommended:

```ts
export type TargetDirectoryState =
  | { kind: "missing" }
  | { kind: "empty" }
  | { kind: "non-empty"; entries: string[] };

export async function getTargetDirectoryState(
  targetDir: string,
): Promise<TargetDirectoryState> {
  // ...
}
```

Ignore system noise files only if the project explicitly chooses to.

Recommended initially:

```txt
.DS_Store may be ignored on macOS
```

Be conservative with everything else.

### 2. Safe Default Behavior

Default behavior:

```txt
missing directory:
  create and write

existing empty directory:
  write

existing non-empty directory:
  stop and show a clear error
```

Do not overwrite existing user files by default.

### 3. Confirmation For Non-Empty Directory

If the CLI is interactive and the target directory is non-empty, ask for confirmation before continuing.

Prompt copy should be clear:

```txt
The target directory is not empty. Continue and add LaunchKit files?
```

Important:

- Even after confirmation, do not overwrite existing files unless an explicit overwrite strategy is implemented.
- If generated files would conflict with existing files, stop with a clear error.

Recommended behavior:

```txt
Non-empty directory + user confirms:
  only write if none of the generated target file paths already exist

Non-empty directory + conflicts:
  stop and list conflicting paths
```

### 4. `--yes` Behavior

When `--yes` is used:

- do not prompt
- allow missing directories
- allow existing empty directories
- reject existing non-empty directories by default

Rationale: `--yes` should not silently write into a non-empty directory.

If the project wants a future `--force`, that can be added later. Do not add `--force` in this step unless it was already planned.

### 5. Current Directory Target

Handle:

```bash
create-launchkit .
```

Conservative behavior:

- If current directory is empty: allow.
- If current directory is non-empty: require interactive confirmation.
- If `--yes` and current directory is non-empty: reject.
- Never overwrite conflicting files.

Print next steps appropriately:

```txt
npm install
npm run dev
```

without `cd .` if target is current directory.

### 6. Conflict Detection

Before writing, detect conflicts between generated files and existing files.

If any generated path already exists:

- stop before writing any files
- show a clear message
- list conflicting paths

Do not partially write files when conflicts exist.

Recommended helper:

```ts
export async function findConflictingGeneratedPaths(input: {
  targetDir: string;
  generatedPaths: string[];
}): Promise<string[]>;
```

### 7. Atomic-ish Write Behavior

Before writing files:

1. Validate all generated paths.
2. Check target directory state.
3. Check conflicts.
4. Only then write files.

This avoids partial writes when obvious conflicts exist.

Full transactional rollback is not required in this step.

### 8. User-Facing Errors

Errors should be concise and actionable.

Examples:

```txt
Target directory is not empty.
Refusing to overwrite existing files:
- package.json
- app/page.tsx
Choose an empty directory or remove the conflicting files.
```

Do not expose noisy stack traces in normal CLI output.

### 9. Prompt Testability

Do not make tests depend on real terminal interaction.

Structure confirmation prompts so they can be injected/mocked.

Recommended:

```ts
export type ConfirmFunction = (message: string) => Promise<boolean>;
```

### 10. Entry Flow

Update CLI entry flow so directory safety happens before writing:

1. Parse args.
2. Prompt/assemble config.
3. Validate config.
4. Generate project.
5. Resolve target directory.
6. Check directory safety.
7. Check conflicts.
8. Write files.
9. Print next steps.

Do not install dependencies.

## Tests

Use Vitest only.

Add tests for:

- missing target directory is allowed
- existing empty directory is allowed
- existing non-empty directory rejects with `--yes`
- existing non-empty directory prompts in interactive mode
- user declining confirmation stops
- user accepting confirmation continues only if no conflicts exist
- conflicting generated paths reject before writing
- no partial writes happen when conflicts exist
- current directory empty is allowed
- current directory non-empty rejects with `--yes`
- current directory non-empty prompts in interactive mode
- `.DS_Store` handling matches chosen policy
- next steps omit `cd .` for current directory
- errors list conflicting paths

Use temp directories.

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

If practical, manually run the built CLI in temp directories:

```bash
node packages/cli/dist/index.js my-app --yes
node packages/cli/dist/index.js existing-empty --yes
node packages/cli/dist/index.js existing-non-empty --yes
```

Verify:

- missing target writes successfully
- existing empty target writes successfully
- existing non-empty target rejects with `--yes`
- no dependencies are installed

Do not run generated project code.

Document manual verification in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 8 completed: Add existing-directory safety

Changes made:
- Added target directory state detection.
- Added non-empty directory safety checks.
- Added interactive confirmation for non-empty directories.
- Added --yes behavior for existing directories.
- Added current-directory target handling.
- Added conflict detection before writing.
- Added no-partial-write safety before conflicts.
- Added tests for existing-directory behavior.
- Confirmed dependency installation is not implemented yet.

Files changed:
- packages/cli/src/directory-safety.ts
- packages/cli/src/directory-safety.test.ts
- packages/cli/src/write-project.ts
- packages/cli/src/write-project.test.ts
- packages/cli/src/prompts.ts, if changed
- packages/cli/src/index.ts
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
- Phase 9 Step 9: Add optional dependency install prompt
```

## Completion Criteria

This step is complete when:

- Missing target directories are handled safely.
- Existing empty directories are handled safely.
- Existing non-empty directories do not overwrite by default.
- `--yes` rejects non-empty directories.
- Interactive mode can confirm non-empty directory use.
- Conflicting existing files are detected before writing.
- Conflicts stop before any files are written.
- Current directory target is handled safely.
- User-facing errors are clear.
- Directory safety behavior has Vitest coverage.
- No dependency installation is implemented yet.
- No generated project code is run.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
