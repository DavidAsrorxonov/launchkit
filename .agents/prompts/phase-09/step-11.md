# Phase 9 Step 11: Verify Phase 9 Completion

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 Steps 1-10 are complete.
4. Read this step prompt.
5. Implement only this final verification step.

Do not add new product options.
Do not publish the CLI package.
Do not start a new phase.
Do not perform broad refactors.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Verify that Phase 9 CLI work is complete and that the LaunchKit CLI is ready for local use and future publishing preparation.

Phase 9 should only be marked complete if the CLI:

- parses arguments
- supports interactive prompts
- validates with shared schema
- uses the shared generator
- writes generated files safely
- protects existing directories
- optionally installs dependencies when explicitly chosen
- has meaningful tests and smoke checks

Do not publish the package in this step.

## Required Checklist

### 1. Package Foundation

Confirm:

```txt
packages/cli/
  package.json
  tsconfig.json
  src/
```

Confirm package metadata:

```txt
package name: create-launchkit
bin name: create-launchkit
type: module
workspace package
```

Confirm the CLI builds to:

```txt
packages/cli/dist/
```

Do not commit `dist` unless repo convention requires it.

### 2. Argument Parsing

Confirm CLI supports:

```txt
positional target directory
--name
--package-manager <npm|pnpm>
--ui <none|shadcn>
--database <none|postgres>
--orm <none|prisma>
--auth <none|authjs-credentials>
--docker <none|postgres>
--yes
--install, if implemented
--no-install, if implemented
--help
--version
```

Confirm:

- unknown flags fail clearly
- invalid values fail clearly
- help text is accurate
- help text does not advertise unsupported options

### 3. Interactive Prompts

Confirm prompts collect:

```txt
project name
package manager
UI option
database option
ORM option
auth option
Docker option
dependency install choice, if interactive install prompt exists
```

Confirm:

- fixed MVP values are not prompted as unsupported choices
- Prisma is unavailable or reset without PostgreSQL
- Docker PostgreSQL is unavailable or reset without PostgreSQL
- Auth.js credentials does not force PostgreSQL
- `--yes` skips prompts and uses defaults/flags

### 4. Schema Validation

Confirm CLI validates with:

```txt
@launchkit/schema
```

Confirm:

- invalid project names fail
- unsupported values fail
- Prisma without PostgreSQL fails
- Docker PostgreSQL without PostgreSQL fails
- Auth.js credentials without database passes
- errors are CLI-friendly

Do not duplicate schema logic in the CLI.

### 5. Generator Integration

Confirm CLI uses:

```txt
@launchkit/generator
```

Confirm:

- validated config is passed to generator
- generator output is used directly
- generator logic is not duplicated
- generator errors are handled clearly
- generated paths are checked before writing

### 6. Filesystem Writes

Confirm CLI can:

- resolve target directory
- write generated files
- create nested directories
- write string contents
- write binary contents if supported by generator
- reject unsafe paths
- prevent path traversal
- prevent writes outside target directory
- reject generated `src/` paths

### 7. Existing Directory Safety

Confirm:

- missing target directory works
- existing empty directory works
- existing non-empty directory does not overwrite by default
- `--yes` rejects existing non-empty directories
- interactive mode can confirm non-empty directory use
- conflicting files are detected before writing
- conflicts stop before partial writes
- current directory target is handled safely

### 8. Optional Dependency Installation

Confirm:

- dependency install is optional
- `--yes` does not install by default
- `--install` behavior works if implemented
- `--no-install` behavior works if implemented
- npm projects use `npm install`
- pnpm projects use `pnpm install`
- install runs in generated project directory
- install failures are clear
- generated files remain if install fails

Confirm CLI does not:

- run `npm run dev`
- run `npm run build`
- run Prisma commands
- run Docker commands
- start servers
- connect to databases

### 9. Next Steps Output

Confirm output is useful after generation.

If dependencies were not installed:

```txt
cd my-app
npm install
npm run dev
```

If dependencies were installed:

```txt
cd my-app
npm run dev
```

For pnpm:

```txt
pnpm install
pnpm dev
```

For current-directory target, omit:

```txt
cd .
```

### 10. Tests And Smoke Checks

Confirm tests cover:

- args parsing
- prompt/config flow
- schema validation
- generator connection
- filesystem writing
- existing-directory safety
- optional install behavior
- next-step output

Confirm smoke checks cover:

```txt
default config
all compatible MVP features selected together
```

Confirm smoke checks:

- run built CLI locally with `node`
- generate into temp directories
- verify expected files
- verify no `src/`
- do not publish package
- do not run generated app code
- do not install dependencies by default
- do not start Docker
- do not connect to databases

### 11. Documentation Accuracy

Update docs only if needed.

Now that the CLI exists locally, docs may mention:

```bash
npx create-launchkit@latest
```

only if the package is actually published or release prep clearly supports it.

If not published, docs should say:

```txt
CLI package exists in the repo but has not been published yet.
```

or:

```txt
Future publish command: npx create-launchkit@latest
```

Do not claim public availability before publishing.

## Verification Commands

Run the full available verification suite.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run test:smoke -w create-launchkit
npm run typecheck
npm test
npm run lint
npm run build
```

Also run package tests if relevant:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
npm test -w @launchkit/templates
```

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

If smoke checks cannot run due to environment limits, document the exact command and reason.

## Manual Verification

If practical, manually run the built CLI in a temporary directory:

```bash
node packages/cli/dist/index.js my-app --yes
node packages/cli/dist/index.js full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Verify:

- generated directories are created
- expected files exist
- no `src/` folder exists
- existing non-empty directory rejects with `--yes`
- dependencies are not installed by default
- next steps are printed

If `--install` exists, manually verify command behavior only if network access is acceptable.

Do not run generated app code unless a separate smoke test explicitly covers generated project build behavior.

## Fix Policy

If verification finds small in-scope CLI issues:

- fix them narrowly
- add/update tests
- rerun relevant checks

If verification finds large issues:

- do not mark Phase 9 complete
- document blockers clearly
- suggest the exact next fix step

## Progress Tracker Update

After verification, update `progress-tracker.md`.

If Phase 9 is complete, mark:

```txt
Phase 9: Complete
CLI MVP: Ready for local use
Publishing: Not performed
```

Add an entry like:

```txt
Phase 9 Step 11 completed: Verify Phase 9 completion

Changes made:
- Verified CLI package foundation.
- Verified argument parsing.
- Verified interactive prompts.
- Verified schema validation.
- Verified generator integration.
- Verified filesystem write behavior.
- Verified existing-directory safety.
- Verified optional dependency install behavior.
- Verified CLI tests and smoke checks.
- Verified docs accuracy around CLI availability.
- Fixed any small in-scope CLI issues found during verification.

Files changed:
- relevant CLI files, if small fixes were needed
- relevant tests, if changed
- docs files, if CLI availability wording changed
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
- Prepare publishing/release workflow only when the user explicitly asks.
```

If Phase 9 is not complete, record:

```txt
Phase 9: In progress
Blocked/missing:
- ...

Next suggested step:
- Fix the listed CLI blocker before marking Phase 9 complete.
```

## Completion Criteria

This step is complete when:

- CLI package foundation is verified.
- Argument parsing is verified.
- Interactive prompts are verified.
- Schema validation is verified.
- Generator integration is verified.
- Filesystem writes are verified.
- Existing-directory safety is verified.
- Optional dependency install behavior is verified.
- Tests pass, or unrelated failures are documented.
- Smoke checks pass, or environment blockers are documented.
- TypeScript checks pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- Docs do not falsely claim public CLI availability.
- Package is not published in this step.
- `progress-tracker.md` is updated.
- Phase 9 is marked complete only if the CLI MVP genuinely works locally.

Then stop.
