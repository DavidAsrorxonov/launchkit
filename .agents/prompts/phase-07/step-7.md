# Phase 7 Step 7: Verify Phase 7 Completion

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Steps 1-6 are complete.
4. Read this step prompt.
5. Implement only this verification step.

Do not start Phase 8.
Do not add CLI functionality.
Do not add new product options.
Do not perform broad refactors.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Verify that Phase 7 testing, validation, and hardening work is complete.

Phase 7 should only be marked complete if LaunchKit has meaningful coverage and safety checks across:

```txt
schema
generator
templates
generated project smoke tests
API safety
website failure states
download safety
```

## Required Checklist

### 1. Test Tooling

Confirm:

- Vitest is used.
- Node's built-in test runner is not used.
- Jest/Mocha were not introduced.
- Root and package test scripts are documented.
- Smoke tests are available through an explicit command if implemented.

Search for:

```txt
node:test
jest
mocha
```

Document any findings.

### 2. Schema Regression Coverage

Confirm tests cover:

- MVP option arrays.
- `LaunchKitConfigSchema`.
- Project name validation.
- Default config.
- Option metadata.
- Compatibility rules.
- Public schema exports where practical.

Required compatibility rules:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
Auth.js credentials with Prisma requires PostgreSQL and Prisma.
shadcn/ui requires Tailwind CSS.
```

### 3. Generator And Template Coverage

Confirm tests cover:

- Default generated output.
- shadcn/ui output.
- PostgreSQL output.
- Prisma output.
- Auth.js credentials output.
- Docker PostgreSQL output.
- All compatible MVP features selected together.
- Optional feature files appear only when selected.
- Generated `package.json` is valid.
- Generated `.env.example` is correct for selected features.
- Generated file paths are safe.
- Generated output does not include `src/`.

### 4. Snapshot Coverage

Confirm targeted snapshots exist where useful.

Good snapshot targets:

```txt
generated file path lists
package.json
.env.example
README sections, if stable
```

Snapshots should be focused and not overly noisy.

### 5. Generated Project Smoke Tests

Confirm smoke tests can generate and verify at least:

```txt
default config
all compatible MVP features selected together
```

Confirm smoke tests:

- Write generated projects only to temp directories.
- Check generated paths before writing.
- Run `npm install`.
- Run `npm run typecheck`.
- Run `npm run build`, unless an environment blocker is documented.
- Do not start Docker.
- Do not connect to a real database.
- Do not run generated app servers.

If smoke tests cannot complete due to network or environment limits, document exact commands and failure reasons.

### 6. API Hardening

Confirm `POST /api/generate`:

- Rejects non-JSON requests where practical.
- Rejects oversized requests.
- Handles malformed JSON safely.
- Validates config using `@launchkit/schema`.
- Validates compatibility using shared schema helpers.
- Returns structured schema errors.
- Returns structured compatibility errors.
- Handles generator failures without leaking stack traces.
- Validates generated output paths before response.
- Does not write generated project files to disk.
- Does not execute generated code.
- Does not install generated dependencies.

### 7. Website Failure States

Confirm the website has clear failure states for:

- Invalid project name.
- Incompatible selections.
- Preview errors.
- API validation errors.
- API compatibility errors.
- API unexpected failures.
- Download errors.
- Zip creation errors.

Confirm:

- User selections are not unnecessarily cleared by errors.
- Download can be retried after failure.
- Loading/success/error states are visible.
- Raw stack traces and internal filesystem paths are not shown to users.
- Basic error accessibility is handled where practical.

## Commands To Run

Run the full available verification suite.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Run package-level tests if available:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
npm test -w @launchkit/templates
npm run typecheck -w @launchkit/schema
npm run typecheck -w @launchkit/generator
npm run typecheck -w @launchkit/templates
npm run build -w apps/web
```

Run smoke tests if available:

```bash
npm run test:smoke
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the web app can run locally, manually verify:

1. Complete the wizard with default options.
2. Preview generated output.
3. Download the zip.
4. Inspect the zip contents.
5. Repeat with all compatible MVP features selected.
6. Confirm invalid combinations are prevented or clearly explained.
7. Confirm download error/retry behavior where practical.

If local app startup is not possible, document why.

## Fix Policy

If verification finds small in-scope issues from Phase 7 work:

- Fix them narrowly.
- Add or update tests if appropriate.
- Re-run the relevant checks.

If verification finds larger issues:

- Do not start broad refactors.
- Document the blocker clearly in `progress-tracker.md`.
- Do not mark Phase 7 complete.

## Progress Tracker Update

After verification, update `progress-tracker.md`.

If Phase 7 is complete, mark:

```txt
Phase 7: Complete
Phase 8: Ready
```

Add an entry like:

```txt
Phase 7 Step 7 completed: Verify Phase 7 completion

Changes made:
- Verified schema regression coverage.
- Verified generator and template coverage.
- Verified generated project smoke tests.
- Verified API validation and safety hardening.
- Verified user-facing failure states.
- Verified full test/typecheck/build/lint status.
- Fixed any small in-scope issues found during verification.

Files changed:
- relevant files, if small fixes were needed
- relevant test files, if changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Smoke test result:
- ...

Manual verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 8 Step 1: Begin launch preparation
```

If Phase 7 is not complete, do not mark it complete. Instead record:

```txt
Phase 7: In progress
Blocked/missing:
- ...

Next suggested step:
- Fix the listed Phase 7 blocker before starting Phase 8.
```

## Completion Criteria

This step is complete when:

- Schema regression coverage is verified.
- Generator/template coverage is verified.
- Smoke test coverage is verified or blockers are clearly documented.
- API hardening is verified.
- Website failure states are verified.
- Full available verification commands have been run.
- Any small in-scope issues found are fixed.
- No Node built-in test runner usage is introduced.
- `progress-tracker.md` is updated.
- Phase 7 is marked complete only if the checklist is genuinely satisfied.

Then stop.
