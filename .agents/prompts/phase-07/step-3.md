# Phase 7 Step 3: Add Generator and Template Snapshot Tests

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Step 2 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 7 Step 4.
Do not add generated project smoke tests yet.
Do not harden the API route in this step unless a tiny fix is required by generator output tests.
Do not change supported product options.
Do not add CLI functionality.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add or strengthen generator and template tests that lock down the generated project output for supported MVP configurations.

This step should verify:

- The generator produces the expected files.
- Optional feature files appear only when selected.
- Unselected feature files do not appear.
- Generated file paths remain safe.
- Template output remains stable over time.

## Scope

Work primarily inside:

```txt
packages/generator/
packages/templates/
```

Recommended files:

```txt
packages/generator/src/generate-project.test.ts
packages/generator/src/feature-registry.test.ts
packages/generator/src/file-tree.test.ts
packages/generator/src/snapshots/...
packages/templates/src/templates.test.ts
```

Use the existing test structure if the repo already has one.

The current test file structure uses the `__tests__` folder structure.

Do not create unnecessary test files if one focused test file matches the current style.

## Requirements

### 1. Test Tooling

Use Vitest only:

```ts
import { describe, expect, it } from "vitest";
```

Do not use:

```txt
node:test
jest
mocha
```

If generator/template tests currently use Node's built-in test runner, migrate them to Vitest in this step.

### 2. Generated Output Test Matrix

Add tests for these configs:

```txt
default config
ui: "shadcn"
database: "postgres"
database: "postgres", orm: "prisma"
auth: "authjs-credentials"
database: "postgres", docker: "postgres"
all compatible MVP features selected together
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

Preserve all required fixed MVP values:

```txt
framework: "next"
language: "typescript"
router: "app"
projectStructure: "no-src"
styling: "tailwind"
```

### 3. Base Template Expectations

For the default config, verify generated files include:

```txt
app/layout.tsx
app/page.tsx
app/globals.css
package.json
tsconfig.json
next.config.ts or next.config.mjs
postcss.config.mjs
.gitignore
.env.example
README.md
```

Verify generated files do not include optional feature files:

```txt
components.json
components/ui/button.tsx
lib/utils.ts
DATABASE_URL in .env.example
prisma/schema.prisma
lib/db.ts
auth.ts
app/api/auth/[...nextauth]/route.ts
AUTH_SECRET in .env.example
docker-compose.yml
```

### 4. shadcn/ui Expectations

For `ui: "shadcn"`, verify generated files include:

```txt
components.json
lib/utils.ts
components/ui/button.tsx
```

Verify:

- shadcn dependencies are present in `package.json`.
- shadcn files are absent when `ui: "none"`.
- No backend files are added by shadcn.

### 5. PostgreSQL Expectations

For `database: "postgres"`, verify:

```txt
DATABASE_URL
```

appears in `.env.example`.

Verify:

- PostgreSQL README guidance is included if the generator outputs README feature notes.
- Prisma files are absent unless `orm: "prisma"`.
- Docker files are absent unless `docker: "postgres"`.
- Auth files are absent unless `auth: "authjs-credentials"`.

### 6. Prisma Expectations

For `database: "postgres", orm: "prisma"`, verify generated files include:

```txt
prisma/schema.prisma
lib/db.ts
```

Verify `package.json` includes:

```txt
@prisma/client
prisma
db:generate
db:push
db:studio
```

Verify Prisma files are absent when `orm: "none"`.

### 7. Auth.js Credentials Expectations

For `auth: "authjs-credentials"`, verify generated files include:

```txt
auth.ts
app/api/auth/[...nextauth]/route.ts
```

Verify `.env.example` includes:

```txt
AUTH_SECRET
```

Verify:

- Auth.js dependency is present in `package.json`.
- README includes scaffold/production-readiness warning if generator outputs README feature notes.
- Auth files are absent when `auth: "none"`.
- Auth.js credentials can generate without PostgreSQL.

### 8. Docker PostgreSQL Expectations

For `database: "postgres", docker: "postgres"`, verify generated files include:

```txt
docker-compose.yml
```

Verify:

- Docker Compose uses PostgreSQL.
- Docker does not add npm dependencies.
- Docker files are absent when `docker: "none"`.

### 9. Combined Feature Expectations

For all compatible MVP features selected together, verify output includes:

```txt
components.json
components/ui/button.tsx
lib/utils.ts
DATABASE_URL
prisma/schema.prisma
lib/db.ts
auth.ts
app/api/auth/[...nextauth]/route.ts
AUTH_SECRET
docker-compose.yml
```

Verify output still includes base files and no `src/` folder.

### 10. Package.json Tests

Parse generated `package.json` with `JSON.parse`.

Verify:

- It is valid JSON.
- It has the selected project/package name.
- Scripts are correct for selected features.
- Dependencies are correct for selected features.
- Dev dependencies are correct for selected features.
- Unselected feature dependencies are not included.

Do not test dependency versions too rigidly unless versions are part of a central contract.

### 11. Snapshot Tests

Add snapshots where useful.

Good candidates:

- Generated file path list for each matrix config.
- `package.json` for each matrix config.
- `.env.example` for each matrix config.
- `README.md` sections if stable.

Prefer targeted snapshots over huge full-project snapshots.

Avoid snapshots that are too noisy or brittle.

### 12. Path Safety Tests

Verify every generated file path:

- is relative
- does not start with `/`
- does not contain `..`
- does not contain empty path segments
- does not include `src/`

If path helper tests already exist, strengthen them with generated-project cases.

### 13. Incompatible Config Tests

Verify generator rejects or surfaces compatibility failures for:

```txt
database: "none", orm: "prisma"
database: "none", docker: "postgres"
```

Use the existing generator/schema error behavior.

Do not duplicate schema compatibility logic inside generator tests beyond verifying generator calls it.

## Implementation Notes

Create small helper functions for tests if useful:

```ts
function getFile(project, path) { ... }
function listPaths(project) { ... }
function parsePackageJson(project) { ... }
function getTextFile(project, path) { ... }
```

Keep helpers local to tests unless the repo already has shared test utilities.

Do not rewrite generator internals unless tests reveal a real Phase 4/5 contract bug.

If you find a real bug:

- Fix it narrowly.
- Add a regression test.
- Document it in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm test -w @launchkit/generator
npm test -w @launchkit/templates
npm run typecheck -w @launchkit/generator
npm run typecheck -w @launchkit/templates
npm test
npm run typecheck
```

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
Phase 7 Step 3 completed: Add generator and template snapshot tests

Changes made:
- Added or strengthened generator output tests.
- Added or strengthened template feature tests.
- Added generated file path list snapshots where useful.
- Added package.json/.env/README snapshots where useful.
- Added feature inclusion/exclusion tests.
- Added generated path safety tests.
- Confirmed Vitest is used for generator/template tests.
- Fixed any small in-scope generator/template bugs found by tests.

Files changed:
- packages/generator/src/..., test files
- packages/generator/src/..., only if a narrow fix was needed
- packages/templates/src/..., test files
- packages/templates/..., only if a narrow template fix was needed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 4: Add generated project smoke tests
```

## Completion Criteria

This step is complete when:

- Generator output is tested for the required config matrix.
- Base template output is covered.
- shadcn output is covered.
- PostgreSQL output is covered.
- Prisma output is covered.
- Auth.js credentials output is covered.
- Docker PostgreSQL output is covered.
- Combined feature output is covered.
- Optional feature files are tested for inclusion and exclusion.
- Generated `package.json` is parsed and verified.
- Targeted snapshots exist where useful.
- Generated path safety is tested.
- Incompatible configs are tested through generator behavior.
- Tests use Vitest.
- No Node built-in test runner usage is introduced.
- Generator/template tests pass, or unrelated failures are documented.
- TypeScript checks pass, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
