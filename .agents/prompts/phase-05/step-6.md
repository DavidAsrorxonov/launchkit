# Phase 5 Step 6: Create Prisma Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 5 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 7.
Do not add Auth.js files.
Do not add Docker Compose files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the optional Prisma template layer for generated LaunchKit projects.

This step should make generated projects support:

```txt
orm: "prisma"
```

Prisma requires PostgreSQL, so generated Prisma output should assume:

```txt
database: "postgres"
```

The compatibility rule should already exist from Phase 3:

```txt
Prisma requires PostgreSQL.
```

## Scope

Add Prisma feature template files under:

```txt
packages/templates/features/prisma/
```

Recommended structure:

```txt
packages/templates/features/prisma/
  prisma/
    schema.prisma
  lib/
    db.ts
  README.md
```

If the existing generator/template architecture represents README notes through feature definitions instead of physical files, follow the existing pattern and keep this step focused on Prisma-only contributions.

## Requirements

### 1. Prisma Schema

Generated projects with `orm: "prisma"` should include:

```txt
prisma/schema.prisma
```

Use PostgreSQL as the datasource provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Add a minimal starter model only if the project plan already calls for one.

If adding a model, keep it generic and useful, for example:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Do not add Auth.js-specific fields in this step unless they are strictly generic and needed by Prisma itself.

### 2. Prisma Client Helper

Generated projects with Prisma selected should include:

```txt
lib/db.ts
```

It should create and export a Prisma client using a development-safe singleton pattern.

Example shape:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

### 3. Package Metadata Contributions

Update the Prisma feature definition so generated projects with `orm: "prisma"` receive required package contributions.

Expected dependencies:

```json
{
  "dependencies": {
    "@prisma/client": "..."
  },
  "devDependencies": {
    "prisma": "..."
  }
}
```

Expected scripts:

```json
{
  "db:generate": "prisma generate",
  "db:push": "prisma db push",
  "db:studio": "prisma studio"
}
```

Use version conventions already present in the repo.

Do not hardcode versions inconsistently if the generator centralizes dependency versions.

### 4. Environment Variable

Prisma uses:

```txt
DATABASE_URL
```

Do not add a duplicate conflicting `DATABASE_URL`.

Use the existing env var merge utility.

The PostgreSQL feature from Step 5 should provide `DATABASE_URL`.

If Prisma is selected, compatibility should require PostgreSQL rather than silently adding PostgreSQL.

### 5. README Guidance

Generated projects with Prisma selected should include concise README guidance for:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

If the selected package manager is `pnpm`, README output may include pnpm equivalents if the generator already supports package-manager-aware instructions.

Do not add Docker instructions in this step.

### 6. Compatibility

Verify existing schema compatibility rejects:

```txt
database: "none"
orm: "prisma"
```

Expected message:

```txt
Prisma requires PostgreSQL.
```

Only modify schema compatibility if it is missing or broken.

### 7. No Auth.js Or Docker

Do not add:

```txt
app/api/auth/[...nextauth]/route.ts
auth config files
AUTH_SECRET
docker-compose.yml
```

Those belong to later Phase 5 steps.

## Tests

Use Vitest only.

Add or update narrow tests for Prisma template behavior.

Recommended tests:

- Prisma feature is enabled when `orm: "prisma"`.
- Prisma feature is not enabled when `orm: "none"`.
- Generated project output includes `prisma/schema.prisma` when Prisma is selected.
- Generated project output includes `lib/db.ts` when Prisma is selected.
- Generated project output includes Prisma package contributions.
- Generated project output includes Prisma scripts.
- Prisma selection without PostgreSQL fails compatibility validation.
- Prisma feature does not add Auth.js files.
- Prisma feature does not add Docker Compose files.
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
Phase 5 Step 6 completed: Create Prisma template

Changes made:
- Created or verified Prisma feature template files.
- Added or verified prisma/schema.prisma.
- Added or verified lib/db.ts Prisma client helper.
- Added or verified Prisma dependency and script contributions.
- Added or verified Prisma README guidance.
- Confirmed Prisma requires PostgreSQL.
- Confirmed Auth.js and Docker remain separate.

Files changed:
- packages/templates/features/prisma/prisma/schema.prisma
- packages/templates/features/prisma/lib/db.ts
- packages/templates/features/prisma/README.md, if using template files
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
- Phase 5 Step 7: Create Auth.js credentials template
```

## Completion Criteria

This step is complete when:

- Prisma feature template/contribution exists.
- Generated projects with `orm: "prisma"` include `prisma/schema.prisma`.
- Generated projects with `orm: "prisma"` include `lib/db.ts`.
- Prisma dependencies are contributed correctly.
- Prisma scripts are contributed correctly.
- Prisma README guidance is included when Prisma is selected.
- Prisma without PostgreSQL is rejected by compatibility validation.
- Auth.js files are not added.
- Docker Compose files are not added.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
