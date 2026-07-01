# Phase 5 Step 5: Create PostgreSQL Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 4 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 6.
Do not add Prisma files.
Do not add Auth.js files.
Do not add Docker Compose files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the optional PostgreSQL template layer for generated LaunchKit projects.

This step should make generated projects support:

```txt
database: "postgres"
```

PostgreSQL in this step means environment variable setup, README guidance, and any minimal package/config contributions needed for a PostgreSQL-ready project.

Prisma integration belongs to Phase 5 Step 6.
Docker Compose belongs to Phase 5 Step 8.

## Scope

Add PostgreSQL feature template files under:

```txt
packages/templates/features/postgres/
```

Recommended structure:

```txt
packages/templates/features/postgres/
  .env.example
  README.md
```

If the existing generator/template architecture represents env vars and README notes through feature definitions rather than physical template files, follow the existing pattern and keep this step focused on PostgreSQL-only contributions.

## Requirements

### 1. Environment Variable Contribution

Generated projects with `database: "postgres"` should include:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{packageName}}"
```

Use the existing env var merge utility from Phase 4 if available.

Do not generate real secrets.
Do not add `AUTH_SECRET`.

### 2. README Guidance

Generated projects with PostgreSQL selected should include README guidance explaining:

- The project expects a PostgreSQL database.
- `DATABASE_URL` must be configured.
- The local example connection string is only a development default.
- Docker Compose support is optional and belongs to the Docker PostgreSQL feature.
- Prisma setup is optional and belongs to the Prisma feature.

Keep this guidance concise and practical.

### 3. Package Metadata Contributions

Do not add Prisma packages in this step.

Only add a direct PostgreSQL client dependency if the generated project includes code that imports it.

If this step only adds `DATABASE_URL` and README guidance, no package dependency is required.

Do not add:

```txt
prisma
@prisma/client
next-auth
@auth/core
```

### 4. Template Files

If using template files, keep them PostgreSQL-specific only.

Allowed:

```txt
.env.example fragment or template
README fragment or template
```

Do not add:

```txt
prisma/schema.prisma
lib/db.ts
app/api/auth/[...nextauth]/route.ts
docker-compose.yml
```

### 5. Generator Integration

If Phase 4 already has a feature registry, update the PostgreSQL feature definition so it contributes:

- `DATABASE_URL` env var
- README note, generated file, or template reference according to the existing architecture

The PostgreSQL feature should be enabled when:

```ts
config.database === "postgres";
```

Do not change compatibility rules unless the existing schema is missing required Phase 3 behavior.

## Tests

Use Vitest only.

Add or update narrow tests for PostgreSQL template behavior.

Recommended tests:

- PostgreSQL feature contributes `DATABASE_URL`.
- PostgreSQL feature is enabled when `database: "postgres"`.
- PostgreSQL feature is not enabled when `database: "none"`.
- Generated project output includes `DATABASE_URL` when PostgreSQL is selected.
- Generated project output does not include `DATABASE_URL` when PostgreSQL is not selected.
- PostgreSQL feature does not add Prisma files.
- PostgreSQL feature does not add Auth.js files.
- PostgreSQL feature does not add Docker Compose files.
- No `src/` directory is introduced.

If existing generator tests already cover feature output, update those tests narrowly.

Do not add expensive generated-project smoke tests unless the repo already has a smoke-test harness.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
```

If package-specific commands exist, also run:

```bash
npm run typecheck -w @launchkit/templates
npm test -w @launchkit/templates
npm test -w @launchkit/generator
npm test -w @launchkit/schema
```

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 5 Step 5 completed: Create PostgreSQL template

Changes made:
- Created or verified PostgreSQL feature template contributions.
- Added or verified DATABASE_URL env var contribution.
- Added or verified PostgreSQL README guidance.
- Confirmed Prisma, Auth.js, and Docker remain separate.

Files changed:
- packages/templates/features/postgres/.env.example, if using template files
- packages/templates/features/postgres/README.md, if using template files
- packages/templates/src/index.ts, if changed
- packages/generator/src/..., if feature metadata was updated
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 6: Create Prisma template
```

## Completion Criteria

This step is complete when:

- PostgreSQL feature template/contribution exists.
- Generated projects with `database: "postgres"` include `DATABASE_URL`.
- Generated projects with `database: "none"` do not include `DATABASE_URL`.
- PostgreSQL README guidance is included when PostgreSQL is selected.
- Prisma files are not added.
- Auth.js files are not added.
- Docker Compose files are not added.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
