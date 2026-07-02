# Phase 5 Step 8: Create Docker PostgreSQL Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 7 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 9.
Do not add new Prisma behavior beyond compatibility with existing Prisma output.
Do not add new Auth.js behavior.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the optional Docker Compose template layer for local PostgreSQL development.

This step should make generated projects support:

```txt
docker: "postgres"
```

Docker PostgreSQL requires:

```txt
database: "postgres"
```

The compatibility rule should already exist from Phase 3:

```txt
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
```

## Scope

Add Docker PostgreSQL feature template files under:

```txt
packages/templates/features/docker-postgres/
```

Recommended structure:

```txt
packages/templates/features/docker-postgres/
  docker-compose.yml
  README.md
```

If the existing generator/template architecture represents README notes through feature definitions instead of physical files, follow the existing pattern and keep this step focused on Docker PostgreSQL-only contributions.

## Requirements

### 1. Docker Compose File

Generated projects with `docker: "postgres"` should include:

```txt
docker-compose.yml
```

It should define a PostgreSQL service suitable for local development.

Recommended service:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: { { packageName } }
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Use placeholders already supported by the Phase 4 template loader, such as:

```txt
{{projectName}}
{{packageName}}
```

Do not introduce new placeholder syntax unless the template loader already supports it.

### 2. Environment Variable Compatibility

Docker PostgreSQL should align with the PostgreSQL `DATABASE_URL` from Phase 5 Step 5:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{packageName}}"
```

Do not add a conflicting `DATABASE_URL`.

Use the existing env var merge utility.

If Docker PostgreSQL is selected, compatibility should require PostgreSQL rather than silently adding PostgreSQL.

### 3. README Guidance

Generated projects with Docker PostgreSQL selected should include concise README guidance for:

```bash
docker compose up -d
docker compose down
```

Also explain:

- This is intended for local development.
- The default username/password/database are development defaults.
- `DATABASE_URL` should match the Docker Compose service.
- Production database hosting should be configured separately.

If Prisma is also selected, the README may mention:

```bash
npm run db:push
```

but do not add new Prisma scripts or files in this step.

### 4. Package Metadata Contributions

Docker Compose does not require npm dependencies.

Do not add package dependencies for this feature unless the existing architecture explicitly requires a helper package, which is unlikely.

### 5. Compatibility

Verify existing schema compatibility rejects:

```txt
database: "none"
docker: "postgres"
```

Expected message:

```txt
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
```

Only modify schema compatibility if it is missing or broken.

### 6. No Auth.js Or New Prisma Behavior

Do not add:

```txt
auth.ts
app/api/auth/[...nextauth]/route.ts
AUTH_SECRET
prisma/schema.prisma
lib/db.ts
```

Those belong to earlier Phase 5 steps and should only be present when their own features are selected.

## Tests

Use Vitest only.

Add or update narrow tests for Docker PostgreSQL template behavior.

Recommended tests:

- Docker PostgreSQL feature is enabled when `docker: "postgres"`.
- Docker PostgreSQL feature is not enabled when `docker: "none"`.
- Generated project output includes `docker-compose.yml` when Docker PostgreSQL is selected.
- Generated project output does not include `docker-compose.yml` when Docker is not selected.
- Docker PostgreSQL selection without PostgreSQL fails compatibility validation.
- Docker PostgreSQL does not add Auth.js files.
- Docker PostgreSQL does not add Prisma files by itself.
- Docker PostgreSQL does not add npm dependencies.
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
Phase 5 Step 8 completed: Create Docker PostgreSQL template

Changes made:
- Created or verified Docker PostgreSQL feature template files.
- Added or verified docker-compose.yml.
- Added or verified Docker PostgreSQL README guidance.
- Confirmed Docker PostgreSQL requires PostgreSQL.
- Confirmed Docker does not add npm dependencies.
- Confirmed Auth.js and Prisma behavior remain separate.

Files changed:
- packages/templates/features/docker-postgres/docker-compose.yml
- packages/templates/features/docker-postgres/README.md, if using template files
- packages/templates/src/index.ts, if changed
- packages/generator/src/..., if feature metadata was updated
- packages/schema/src/..., only if compatibility was missing or broken
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 9: Verify Phase 5 completion
```

## Completion Criteria

This step is complete when:

- Docker PostgreSQL feature template/contribution exists.
- Generated projects with `docker: "postgres"` include `docker-compose.yml`.
- Generated projects with `docker: "none"` do not include `docker-compose.yml`.
- Docker PostgreSQL without PostgreSQL is rejected by compatibility validation.
- Docker README guidance is included when Docker PostgreSQL is selected.
- Docker PostgreSQL does not add npm dependencies.
- Auth.js files are not added by Docker.
- Prisma files are not added by Docker.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
