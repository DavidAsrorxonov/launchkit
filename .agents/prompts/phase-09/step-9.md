# Phase 9 Step 9: Add Optional Dependency Install Prompt

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 8 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 10.
Do not run generated project code.
Do not start dev servers.
Do not start Docker containers.
Do not connect to databases.
Do not duplicate generator logic.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add an optional dependency installation prompt to the LaunchKit CLI.

After generating and writing the project, the CLI should ask whether to install dependencies.

If the user agrees, it should run the selected package manager's install command inside the generated project directory.

If the user declines, it should print next steps.

## Scope

Work inside:

```txt
packages/cli/
```

Recommended files:

```txt
packages/cli/src/install.ts
packages/cli/src/install.test.ts
packages/cli/src/prompts.ts
packages/cli/src/index.ts
packages/cli/src/write-project.ts, if next-step output changes
```

Adjust paths to match the existing CLI package structure.

## Requirements

### 1. Install Prompt

In interactive mode, after files are written successfully, ask:

```txt
Install dependencies now?
```

Default:

```txt
No
```

because installation may take time and requires network access.

Do not ask this prompt before files are safely written.

### 2. `--yes` Behavior

Define and implement safe `--yes` behavior.

Recommended:

```txt
--yes does not install dependencies by default.
```

Reason:

- `--yes` should skip prompts
- dependency installation can be slow and network-dependent
- users should opt in explicitly

If adding an install flag, use:

```txt
--install
```

and optionally:

```txt
--no-install
```

Do not silently install dependencies just because `--yes` was passed.

### 3. Install Flags

Add optional install flags if they fit the existing argument parser:

```txt
--install
--no-install
```

Behavior:

```txt
--install:
  install dependencies after writing files

--no-install:
  skip dependency installation

neither flag:
  prompt in interactive mode, skip in --yes/non-interactive mode
```

If adding both flags complicates the parser, add only `--install` and document the decision.

### 4. Package Manager Commands

Use the generated project's selected package manager:

For npm:

```bash
npm install
```

For pnpm:

```bash
pnpm install
```

Run the command in the generated project directory.

Do not install dependencies in the LaunchKit repo root.

### 5. Process Execution

Use safe process execution:

- use `spawn` or `execFile` with argument arrays
- set `cwd` to the generated project directory
- inherit stdio if appropriate for install progress
- do not pass user input through a shell string

Recommended helper:

```ts
export type InstallDependenciesInput = {
  targetDir: string;
  packageManager: "npm" | "pnpm";
};

export async function installDependencies(
  input: InstallDependenciesInput,
): Promise<void> {
  // ...
}
```

### 6. Error Handling

If installation fails:

- show a clear error
- do not delete generated files
- print manual install command
- exit with non-zero status, or report failure while keeping generated files

Recommended message:

```txt
Project files were created, but dependency installation failed.
Run this manually:
  npm install
```

Do not hide the failure.

### 7. Next Steps Output

If dependencies are installed successfully:

Print:

```txt
Next steps:
  cd my-app
  npm run dev
```

If dependencies were not installed:

Print:

```txt
Next steps:
  cd my-app
  npm install
  npm run dev
```

For pnpm:

```txt
pnpm install
pnpm dev
```

If target is current directory:

- omit `cd .`
- print commands directly

### 8. Safety Boundaries

This step must not:

- run `npm run dev`
- run `npm run build`
- run generated project code
- run Prisma commands
- run Docker commands
- connect to databases

Only package manager install is allowed when explicitly chosen.

### 9. Testability

Do not make tests run real `npm install` or `pnpm install`.

Structure process execution so it can be mocked.

Recommended:

```ts
export type CommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string },
) => Promise<void>;
```

Tests should assert command construction and cwd.

### 10. Tests

Use Vitest only.

Add tests for:

- interactive mode asks install prompt after files are written
- default prompt answer skips install
- `--yes` skips install by default
- `--install` runs install without prompt
- `--no-install` skips install without prompt, if implemented
- npm config runs `npm install`
- pnpm config runs `pnpm install`
- install command uses generated project directory as cwd
- install failure reports clear message and keeps next steps
- next steps include install command when install skipped
- next steps omit install command when install succeeded
- current directory target omits `cd .`
- no generated app commands are run

Do not run real package manager installs in tests.

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

Confirm:

- project files are created
- dependencies are not installed by default with `--yes`
- next steps include install command

If `--install` is implemented, only run it if network access is acceptable:

```bash
node packages/cli/dist/index.js my-app --yes --install
```

Document whether this was run or skipped.

Do not run generated app code.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 9 completed: Add optional dependency install prompt

Changes made:
- Added optional dependency install prompt.
- Added install command helper.
- Added install flag behavior, if implemented.
- Added package-manager-aware install commands.
- Added install success/failure handling.
- Updated next-steps output based on install status.
- Added tests for install prompt and command behavior.
- Confirmed generated app code is not run.

Files changed:
- packages/cli/src/install.ts
- packages/cli/src/install.test.ts
- packages/cli/src/prompts.ts
- packages/cli/src/args.ts, if install flags were added
- packages/cli/src/index.ts
- packages/cli/src/write-project.ts, if next steps changed
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
- Phase 9 Step 10: Add CLI tests and smoke checks
```

## Completion Criteria

This step is complete when:

- CLI can ask whether to install dependencies after writing files.
- `--yes` does not install dependencies by default.
- Optional install flag behavior is implemented or explicitly deferred.
- npm install command is constructed correctly.
- pnpm install command is constructed correctly.
- install runs in the generated project directory.
- install failures are reported clearly.
- generated files are kept if install fails.
- next steps reflect whether install ran.
- tests do not run real package manager installs.
- generated app code is not run.
- Docker/Prisma/database commands are not run.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
