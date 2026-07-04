# Phase 7 Step 1: Audit Test Coverage and Hardening Gaps

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 is complete and Phase 7 is ready.
4. Read this step prompt.
5. Implement only this audit step.

Do not move to Phase 7 Step 2.
Do not add broad new tests yet.
Do not refactor schema, generator, templates, API, or website code unless a tiny fix is needed to make the audit possible.
Do not add CLI functionality.
Do not add unsupported product options.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Audit the current LaunchKit test coverage, validation behavior, and hardening gaps before adding Phase 7 tests and safety improvements.

This step should produce a clear picture of:

- What tests already exist.
- What commands are available.
- Which supported option combinations are covered.
- Which safety behaviors are covered.
- What gaps should be addressed in the remaining Phase 7 steps.

## Scope

Review the current repo, especially:

```txt
packages/schema
packages/generator
packages/templates
apps/web
progress-tracker.md
package.json files
test config files
```

Do not make broad implementation changes in this step.

## Audit Checklist

### 1. Test Tooling

Confirm:

- Vitest is used.
- Node's built-in test runner is not used.
- Jest/Mocha are not introduced unless explicitly requested.
- Root and package-level test scripts are known.
- Typecheck, lint, and build scripts are known.

Search for unwanted test runner usage:

```txt
node:test
jest
mocha
```

Document any findings.

### 2. Schema Coverage

Review tests for:

- Option arrays.
- Option union types.
- `LaunchKitConfigSchema`.
- Project name validation.
- Default config.
- Option metadata.
- Compatibility rules.

Compatibility rules to verify:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
Auth.js credentials with Prisma requires PostgreSQL and Prisma.
shadcn/ui requires Tailwind CSS.
```

Do not add missing tests yet unless the repo already has an obvious small audit test pattern and the gap is trivial.

### 3. Generator Coverage

Review tests for:

- Generated file tree model.
- Path normalization.
- Unsafe path rejection.
- Generation plan model.
- Feature registry.
- Package.json merge utility.
- Env var merge utility.
- Template loader.
- `generateProject(config)` pipeline.
- Feature-specific generated files.

Safety cases to note:

```txt
absolute paths
.. traversal
empty path segments
src/ paths
conflicting package dependencies
conflicting scripts
conflicting env vars
```

### 4. Template Coverage

Review tests or snapshots for:

- Base Next.js template.
- Tailwind template.
- shadcn/ui template.
- PostgreSQL template.
- Prisma template.
- Auth.js credentials template.
- Docker PostgreSQL template.

Confirm whether tests verify:

- Required files exist.
- Optional feature files appear only when selected.
- Optional feature files do not appear when unselected.
- No generated `src/` folder.
- README and `.env.example` contents for selected features.

### 5. Generated Project Smoke Coverage

Check whether the repo has smoke tests that generate real projects and run commands such as:

```bash
npm install
npm run typecheck
npm run build
```

Document:

- Whether smoke tests exist.
- Which configs they cover.
- Whether they are fast enough for regular use.
- Whether they require network access.
- Whether they should be separated from normal unit tests.

Do not add smoke tests yet. That belongs to Phase 7 Step 4.

### 6. API Safety Coverage

Review tests and code for:

- Invalid JSON.
- Non-JSON requests.
- Oversized request bodies.
- Invalid configs.
- Compatibility failures.
- Unexpected generator failures.
- Structured error responses.
- No stack trace leaks.
- No generated code execution.
- No dependency installation.
- No server filesystem writes for generated projects.
- Generated path safety before response.

Document gaps.

### 7. Website Failure State Coverage

Review tests and behavior for:

- Project name validation.
- Dependent option disabling/reset behavior.
- Preview errors.
- Download API errors.
- Download zip creation errors.
- Loading states.
- Success states.
- Mobile responsiveness checks.

Document gaps.

## Commands To Run

Run the relevant read-only or verification commands available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Also inspect available scripts:

```bash
npm run
npm pkg get scripts
```

If package-specific commands exist, note them and run the useful ones:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
npm test -w @launchkit/templates
npm run build -w apps/web
```

Use actual workspace names and commands from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Deliverable

Update `progress-tracker.md` with a Phase 7 audit entry.

Include:

```txt
Phase 7 Step 1 completed: Audit test coverage and hardening gaps

Current test tooling:
- ...

Commands available:
- ...

Commands run:
- ...

Verification result:
- ...

Existing coverage:
- Schema: ...
- Generator: ...
- Templates: ...
- API: ...
- Website: ...
- Smoke tests: ...

Hardening gaps:
- ...

Recommended Phase 7 follow-up:
- Step 2: ...
- Step 3: ...
- Step 4: ...
- Step 5: ...
- Step 6: ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 2: Add schema and compatibility regression tests
```

## Completion Criteria

This step is complete when:

- Existing test tooling is documented.
- Available verification commands are documented.
- Existing schema coverage is documented.
- Existing generator coverage is documented.
- Existing template coverage is documented.
- Existing smoke-test coverage is documented.
- Existing API safety coverage is documented.
- Existing website failure-state coverage is documented.
- Hardening gaps are clearly listed.
- No broad implementation changes were made.
- `progress-tracker.md` is updated.

Then stop.
