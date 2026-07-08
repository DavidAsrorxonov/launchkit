# Phase 9 Step 10: Add CLI Tests and Smoke Checks

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Step 9 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 9 Step 11.
Do not add new CLI features.
Do not change supported product options.
Do not publish the CLI package.
Do not run generated project code.
Do not start dev servers.
Do not start Docker containers.
Do not connect to databases.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add comprehensive CLI tests and smoke checks for the LaunchKit CLI.

This step should prove that the CLI can:

- parse arguments
- collect or default options
- validate config
- call the generator
- write generated files safely
- protect existing directories
- optionally construct dependency install commands
- print useful next steps

Smoke checks should exercise the built CLI in temporary directories without publishing the package.

## Scope

Work inside:

```txt
packages/cli/
```

and repo-level test scripts if needed:

```txt
package.json
```

Recommended files:

```txt
packages/cli/src/*.test.ts
packages/cli/src/smoke.test.ts
packages/cli/test/...
packages/cli/package.json
package.json, if adding a root CLI smoke script
```

Follow the existing test structure. Create `__tests__` folder and place all the test files in `packages/cli` into that folder to organize it.

## Requirements

### 1. Unit Test Coverage

Review and strengthen tests for:

```txt
args parsing
interactive prompt config assembly
schema validation
generator connection
filesystem write behavior
existing-directory safety
optional dependency install behavior
next-step output
```

Use Vitest only.

Do not use real terminal prompts in tests.
Do not run real package manager installs in unit tests.

### 2. Argument Parsing Tests

Confirm coverage for:

```txt
empty args
positional project name
--name
--package-manager npm
--package-manager pnpm
--ui shadcn
--database postgres
--orm prisma
--auth authjs-credentials
--docker postgres
--yes
--install, if implemented
--no-install, if implemented
--help
--version
unknown flags
invalid option values
```

### 3. Config Flow Tests

Confirm coverage for:

- `--yes` uses defaults for missing values.
- positional target directory becomes default project name.
- `--name` overrides positional project name for config name.
- fixed MVP values are preserved.
- Prisma requires PostgreSQL.
- Docker PostgreSQL requires PostgreSQL.
- Auth.js credentials does not require PostgreSQL.
- validation errors are CLI-friendly.

### 4. Generator Integration Tests

Confirm coverage for:

- validated config is passed to `@launchkit/generator`
- generated project summary is printed
- generator failures become CLI-friendly errors
- unsafe generated paths are rejected before writing

Mock generator where needed for error and unsafe path cases.

Use the real generator in at least one integration-style test if it is fast and stable.

### 5. Filesystem Safety Tests

Confirm coverage for:

- writes generated files to a missing target directory
- writes into an existing empty directory
- rejects existing non-empty directory with `--yes`
- prompts for non-empty directory in interactive mode
- detects conflicting existing files before writing
- avoids partial writes when conflicts exist
- rejects path traversal
- rejects absolute generated paths
- rejects `src/` paths
- handles current directory target safely

Use temp directories only.

Do not write test output into tracked source folders.

### 6. Install Behavior Tests

Confirm coverage for:

- dependency install is skipped by default
- `--yes` does not install by default
- `--install` runs install command if implemented
- `--no-install` skips install if implemented
- npm project constructs `npm install`
- pnpm project constructs `pnpm install`
- install command uses generated project directory as `cwd`
- install failure is reported clearly
- next steps include install command when install is skipped
- next steps omit install command when install succeeds

Mock command execution.

Do not run real `npm install` or `pnpm install` in unit tests.

### 7. CLI Smoke Checks

Add an opt-in smoke test command if one does not exist.

Recommended package script:

```json
{
  "test:smoke": "vitest run --config vitest.smoke.config.ts"
}
```

or simpler package-level equivalent:

```json
{
  "test:smoke": "vitest run smoke"
}
```

Use the simplest approach that fits the repo.

Smoke checks should:

1. Build the CLI.
2. Run the built CLI with `node`.
3. Generate into a temporary directory.
4. Verify expected files exist.
5. Verify no `src/` folder exists.
6. Verify existing non-empty directory safety.
7. Verify `--yes` skips install by default.

Example command under test:

```bash
node packages/cli/dist/index.js my-app --yes
```

Do not publish the package.
Do not use `npx create-launchkit@latest` in local smoke tests.

### 8. Smoke Config Matrix

At minimum, smoke check:

```txt
default --yes config
all compatible MVP features with --yes
```

All-compatible config:

```bash
node packages/cli/dist/index.js full-app \
  --yes \
  --ui shadcn \
  --database postgres \
  --orm prisma \
  --auth authjs-credentials \
  --docker postgres
```

Expected generated files for all-compatible config include:

```txt
components.json
components/ui/button.tsx
lib/utils.ts
prisma/schema.prisma
lib/db.ts
auth.ts
app/api/auth/[...nextauth]/route.ts
docker-compose.yml
.env.example
package.json
README.md
```

### 9. Smoke Safety Boundaries

Smoke tests must not:

- run real package manager installs unless explicitly separated into a manual/network smoke command
- run generated project code
- start Next.js dev server
- run Prisma commands
- start Docker
- connect to databases
- write outside temp directories

### 10. Test Output

When CLI smoke checks fail, output should make debugging practical.

Include:

- command run
- exit code
- stdout
- stderr
- temp directory path

Avoid hiding useful CLI output.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run test:smoke -w create-launchkit
npm run typecheck
npm test
```

Also run if configured:

```bash
npm run lint
npm run build
```

If a root smoke command is added:

```bash
npm run test:cli-smoke
```

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

If smoke tests cannot run due to environment limits, document the exact command and reason.

## Manual Verification

If practical, manually run the built CLI in a temp directory:

```bash
node packages/cli/dist/index.js my-app --yes
node packages/cli/dist/index.js full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Verify:

- generated directories are created
- expected files exist
- no `src/` folder exists
- existing non-empty directory is rejected with `--yes`
- dependencies are not installed by default
- next steps are printed

Do not run generated app code.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 9 Step 10 completed: Add CLI tests and smoke checks

Changes made:
- Strengthened CLI unit tests.
- Added or verified argument parsing coverage.
- Added or verified config validation coverage.
- Added or verified generator integration coverage.
- Added or verified filesystem safety coverage.
- Added or verified dependency install behavior coverage.
- Added CLI smoke checks for default config.
- Added CLI smoke checks for all-compatible MVP config.
- Confirmed smoke checks do not run generated app code.

Files changed:
- packages/cli/src/..., test files
- packages/cli/src/smoke.test.ts, if added
- packages/cli/package.json, if scripts changed
- package.json, if root smoke script changed
- relevant smoke config files, if added
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Smoke check result:
- ...

Manual verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 11: Verify Phase 9 completion
```

## Completion Criteria

This step is complete when:

- CLI unit tests cover argument parsing.
- CLI unit tests cover prompt/config flow.
- CLI unit tests cover schema validation.
- CLI unit tests cover generator connection.
- CLI unit tests cover filesystem write behavior.
- CLI unit tests cover existing-directory safety.
- CLI unit tests cover optional install behavior.
- CLI smoke checks exist.
- Smoke checks cover default config.
- Smoke checks cover all-compatible MVP config.
- Smoke checks verify expected generated files.
- Smoke checks verify no `src/` folder is generated.
- Smoke checks do not run generated app code.
- Smoke checks do not install dependencies by default.
- Vitest is used.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Smoke checks pass, or environment blockers are documented.
- `progress-tracker.md` is updated.

Then stop.
