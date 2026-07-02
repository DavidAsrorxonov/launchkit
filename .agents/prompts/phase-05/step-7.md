# Phase 5 Step 7: Create Auth.js Credentials Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 6 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 8.
Do not add Docker Compose files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the optional Auth.js credentials scaffold template layer for generated LaunchKit projects.

This step should make generated projects support:

```txt
auth: "authjs-credentials"
```

This is a scaffold only. It should give developers the structure needed to continue, but it must not pretend to provide complete production authentication.

## Scope

Add Auth.js credentials feature template files under:

```txt
packages/templates/features/authjs-credentials/
```

Recommended structure:

```txt
packages/templates/features/authjs-credentials/
  auth.ts
  app/
    api/
      auth/
        [...nextauth]/
          route.ts
  README.md
```

Optional, only if consistent with the existing generated app architecture:

```txt
packages/templates/features/authjs-credentials/
  middleware.ts
```

Do not add sign-in UI pages unless the existing product requirements explicitly call for them.

## Requirements

### 1. Auth.js Config

Generated projects with `auth: "authjs-credentials"` should include an Auth.js configuration file.

Recommended target file:

```txt
auth.ts
```

It should:

- Configure Auth.js for a Next.js App Router project.
- Use a credentials provider.
- Export handlers and helpers according to the Auth.js version used by the generated project.
- Include a clear placeholder `authorize` implementation.
- Avoid hardcoded real users, passwords, or secrets.
- Include comments warning developers to connect real user lookup and password verification.

The credentials scaffold may work without a database.

If Prisma is selected, it may be extended later to use Prisma-backed user lookup, but this step should not require Prisma for all Auth.js credentials projects.

### 2. Route Handler

Generated projects with Auth.js selected should include:

```txt
app/api/auth/[...nextauth]/route.ts
```

It should re-export the Auth.js route handlers from the generated auth config.

Example shape:

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

Adjust this to match the Auth.js version and generated config pattern used in the project.

### 3. Environment Variables

Generated projects with Auth.js selected should include:

```env
AUTH_SECRET="replace-me"
```

Use the existing env var merge utility.

Do not generate a real secret.

If the generated Auth.js setup requires additional environment variables, add only the minimum required ones and document them.

### 4. Package Metadata Contributions

Update the Auth.js credentials feature definition so generated projects receive the required auth dependency.

Expected dependency:

```json
{
  "dependencies": {
    "next-auth": "..."
  }
}
```

Use the version convention already present in the repo.

Do not hardcode versions inconsistently if the generator centralizes dependency versions.

Do not add Prisma dependencies in this step.

### 5. Prisma Compatibility

The schema should already have this rule:

```txt
Auth.js credentials scaffold may work without a database.
Auth.js credentials scaffold with Prisma requires PostgreSQL and Prisma.
```

Verify that these combinations behave correctly:

```txt
auth: "authjs-credentials", database: "none", orm: "none"
  allowed

auth: "authjs-credentials", database: "postgres", orm: "none"
  allowed

auth: "authjs-credentials", database: "postgres", orm: "prisma"
  allowed

auth: "authjs-credentials", database: "none", orm: "prisma"
  rejected because Prisma requires PostgreSQL
```

Only modify schema compatibility if earlier phases missed or broke this behavior.

### 6. README Guidance

Generated projects with Auth.js credentials selected should include concise README guidance explaining:

- Auth.js credentials scaffold was generated.
- `AUTH_SECRET` must be replaced.
- The default `authorize` logic is a placeholder.
- Developers must implement real user lookup.
- Developers must implement secure password hashing and verification.
- Credentials auth is intentionally not production-complete.
- Prisma integration, if selected, provides `lib/db.ts` but the developer still needs to connect auth logic to a user model.

Do not overstate security or production readiness.

### 7. No Docker

Do not add:

```txt
docker-compose.yml
```

Docker PostgreSQL belongs to Phase 5 Step 8.

## Tests

Use Vitest only.

Add or update narrow tests for Auth.js credentials template behavior.

Recommended tests:

- Auth.js credentials feature is enabled when `auth: "authjs-credentials"`.
- Auth.js credentials feature is not enabled when `auth: "none"`.
- Generated project output includes `auth.ts` when Auth.js credentials is selected.
- Generated project output includes `app/api/auth/[...nextauth]/route.ts` when Auth.js credentials is selected.
- Generated project output includes `AUTH_SECRET` when Auth.js credentials is selected.
- Generated project output does not include auth files when `auth: "none"` is selected.
- Auth.js credentials without database is allowed.
- Auth.js credentials with PostgreSQL and no Prisma is allowed.
- Auth.js credentials with PostgreSQL and Prisma is allowed.
- Auth.js feature does not add Docker Compose files.
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
Phase 5 Step 7 completed: Create Auth.js credentials template

Changes made:
- Created or verified Auth.js credentials feature template files.
- Added or verified auth.ts scaffold.
- Added or verified Auth.js route handler.
- Added or verified AUTH_SECRET env var contribution.
- Added or verified Auth.js dependency contribution.
- Added or verified README guidance and production-readiness warning.
- Confirmed Docker remains separate.

Files changed:
- packages/templates/features/authjs-credentials/auth.ts
- packages/templates/features/authjs-credentials/app/api/auth/[...nextauth]/route.ts
- packages/templates/features/authjs-credentials/README.md, if using template files
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
- Phase 5 Step 8: Create Docker PostgreSQL template
```

## Completion Criteria

This step is complete when:

- Auth.js credentials feature template/contribution exists.
- Generated projects with `auth: "authjs-credentials"` include `auth.ts`.
- Generated projects with `auth: "authjs-credentials"` include `app/api/auth/[...nextauth]/route.ts`.
- Generated projects with `auth: "authjs-credentials"` include `AUTH_SECRET`.
- Auth.js dependency contribution is correct.
- Generated projects with `auth: "none"` do not include Auth.js files.
- Auth.js credentials without a database is allowed.
- Auth.js README guidance clearly says the credentials logic is a scaffold and not production-complete.
- Docker Compose files are not added.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
