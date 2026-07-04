# Phase 7 Step 4: Add Generated Project Smoke Tests

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Step 3 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 7 Step 5.
Do not harden the API route in this step unless a tiny fix is required by smoke tests.
Do not change supported product options.
Do not add CLI functionality.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add generated-project smoke tests that prove LaunchKit output can become a real working project.

These tests should generate projects for important MVP configs, write them to temporary directories, install dependencies where appropriate, and run project verification commands such as:

```bash
npm run typecheck
npm run build
```

Smoke tests may be slower than unit tests, so they should be easy to run intentionally.

## Scope

Work primarily in test infrastructure for:

```txt
packages/generator
packages/templates
```

or a repo-level smoke test location if one already exists.

Recommended locations:

```txt
packages/generator/src/smoke.test.ts
packages/generator/test/smoke/...
tests/smoke/generated-projects.test.ts
```

Follow the existing repo test structure.

## Requirements

### 1. Smoke Test Command

Add a script for smoke tests if one does not already exist.

Recommended root script:

```json
{
  "test:smoke": "vitest run --config vitest.smoke.config.ts"
}
```

or a package-level equivalent:

```json
{
  "test:smoke": "vitest run smoke"
}
```

Use the simplest approach that fits the current repo.

Do not make slow network-dependent smoke tests run as part of every fast unit test unless the repo already does that intentionally.

### 2. Temporary Project Writing

Create a test helper that:

1. Calls `generateProject(config)`.
2. Writes generated files to a temporary directory.
3. Preserves safe relative paths.
4. Rejects unsafe paths before writing.
5. Returns the generated project directory path.

Use OS temp directories or repo-local ignored temp directories.

Do not write generated smoke projects into tracked source directories.

Do not use destructive cleanup outside the temp directory.

### 3. Config Matrix

At minimum, smoke test these generated configs:

```txt
default config
all compatible MVP features selected together
```

Recommended additional configs if runtime is acceptable:

```txt
ui: "shadcn"
database: "postgres"
database: "postgres", orm: "prisma"
auth: "authjs-credentials"
database: "postgres", docker: "postgres"
```

All-compatible config means:

```ts
{
  ui: "shadcn",
  database: "postgres",
  orm: "prisma",
  auth: "authjs-credentials",
  docker: "postgres"
}
```

### 4. Commands To Run In Generated Projects

For generated projects, run:

```bash
npm install
npm run typecheck
npm run build
```

If build is too slow for all configs, run it for:

- default config
- all-compatible config

and document the tradeoff in `progress-tracker.md`.

For package manager behavior:

- Use npm for smoke execution because LaunchKit repo setup uses npm.
- It is enough to verify generated `pnpm` instructions/package manager metadata through unit tests unless smoke infrastructure explicitly supports pnpm.

### 5. Network Awareness

`npm install` requires network access unless dependencies are cached.

Make smoke tests opt-in if network access is needed.

Recommended behavior:

- Fast unit tests do not require network.
- Smoke tests can be run manually with `npm run test:smoke`.
- If CI is not ready for network smoke tests, document that they are local/manual for now.

Do not skip smoke-test implementation only because it may require network. Make it explicit and controlled.

### 6. Environment Safety

Smoke tests must not:

- connect to a real database
- start Docker containers
- run `docker compose up`
- run generated app servers
- execute arbitrary user input
- write outside temp directories

For Prisma configs, it is acceptable to run:

```bash
npm run typecheck
npm run build
```

Do not run:

```bash
npm run db:push
```

in smoke tests.

### 7. Path Safety

Before writing generated files to disk, verify:

- path is relative
- path does not start with `/`
- path does not contain `..`
- path does not contain empty segments
- path does not include `src/`

Use existing generator path helpers if available.

### 8. Test Timeouts

Set reasonable Vitest timeouts for smoke tests.

Example:

```ts
it("builds generated default project", async () => {
  ...
}, 120_000);
```

or configure smoke test timeout centrally.

Do not raise timeouts for normal unit tests unnecessarily.

### 9. Failure Output

When a generated project command fails, make the test output useful.

Include:

- config name
- command run
- exit code
- stdout
- stderr
- generated project directory path, if useful for debugging

Avoid hiding command output completely.

## Implementation Notes

Prefer Node standard library APIs for temp directories and process execution:

```txt
fs/promises
path
os
child_process
```

Use `execFile` or `spawn` with argument arrays instead of shell string concatenation where practical.

Do not use ad hoc shell commands that interpolate generated paths unsafely.

Keep smoke helpers focused and test-only.

## Verification

Run normal checks:

```bash
npm test -w @launchkit/generator
npm run typecheck -w @launchkit/generator
npm test
npm run typecheck
```

Run the smoke test command you add:

```bash
npm run test:smoke
```

If smoke tests cannot complete because network access is unavailable, dependency installation fails due to environment restrictions, or runtime is too long, document that clearly in `progress-tracker.md` with the exact command and failure reason.

Also run if configured:

```bash
npm run lint
npm run build
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 7 Step 4 completed: Add generated project smoke tests

Changes made:
- Added generated-project smoke test command.
- Added smoke helper to write generated projects to temp directories.
- Added smoke coverage for default config.
- Added smoke coverage for all-compatible MVP config.
- Added path safety checks before writing generated files.
- Confirmed smoke tests do not start Docker or connect to databases.
- Documented smoke test runtime/network expectations.

Files changed:
- package.json, if root smoke script was added
- packages/generator/package.json, if package smoke script was added
- packages/generator/src/..., smoke test files
- tests/smoke/..., if repo-level smoke tests were added
- relevant test helper files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Smoke test result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 5: Harden API validation and safety limits
```

## Completion Criteria

This step is complete when:

- A generated-project smoke test command exists.
- Smoke tests generate at least the default project.
- Smoke tests generate the all-compatible MVP project.
- Generated files are written only to temp directories.
- Generated file paths are checked before writing.
- Smoke tests run `npm install`.
- Smoke tests run `npm run typecheck`.
- Smoke tests run `npm run build` for at least default and all-compatible configs, unless an environment blocker is documented.
- Smoke tests do not start Docker.
- Smoke tests do not connect to a real database.
- Smoke tests do not run generated app servers.
- Normal tests still use Vitest.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Smoke test execution result is documented.
- `progress-tracker.md` is updated.

Then stop.
