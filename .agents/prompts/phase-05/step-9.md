# Phase 5 Step 9: Verify Phase 5 Completion

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Steps 1-8 are complete.
4. Read this step prompt.
5. Implement only this verification step.

Do not start Phase 6.
Do not add website UI.
Do not add CLI functionality.
Do not add new product options.
Do not introduce unsupported frameworks, routers, languages, databases, ORMs, auth providers, or UI libraries.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Verify that Phase 5 template implementation is complete and that LaunchKit can generate the MVP project files from the implemented template layers.

This step is about validation, small in-scope fixes, and progress tracking.

## Phase 5 Expected Output

Phase 5 should have implemented template support for:

```txt
base Next.js template
Tailwind template
shadcn/ui template
PostgreSQL template
Prisma template
Auth.js credentials template
Docker PostgreSQL template
```

Templates should live under:

```txt
packages/templates/base/
packages/templates/features/
```

Generated projects should use:

```txt
app/
components/
lib/
prisma/
```

Generated projects must not use:

```txt
src/
```

## Required Checklist

Verify all of the following.

### 1. Template Package

Confirm:

```txt
packages/templates/package.json
packages/templates/tsconfig.json
packages/templates/src/index.ts
packages/templates/base/
packages/templates/features/
```

Confirm package name:

```txt
@launchkit/templates
```

### 2. Base Next.js Template

Confirm generated projects can include:

```txt
app/layout.tsx
app/page.tsx
app/globals.css
package.json
tsconfig.json
next.config.ts or next.config.mjs
postcss.config.mjs
.gitignore
README.md
```

Confirm:

- Next.js App Router is used.
- TypeScript is used.
- No `src/` folder is generated.
- Optional backend or UI feature files are not included by the base template alone.

### 3. Tailwind Template

Confirm:

- Tailwind CSS setup exists.
- PostCSS config exists.
- Tailwind dependencies are contributed correctly.
- The Tailwind setup matches the Tailwind version used by generated projects.
- shadcn/ui files are not added by Tailwind alone.

### 4. shadcn/ui Template

Confirm generated projects with `ui: "shadcn"` include:

```txt
components.json
lib/utils.ts
components/ui/button.tsx
```

Confirm:

- shadcn dependency contributions are correct.
- CSS tokens are present and compatible with the selected Tailwind version.
- Generated projects with `ui: "none"` do not include shadcn files.

### 5. PostgreSQL Template

Confirm generated projects with `database: "postgres"` include:

```txt
DATABASE_URL
```

Confirm:

- PostgreSQL README guidance exists.
- Generated projects with `database: "none"` do not include `DATABASE_URL`.
- PostgreSQL alone does not add Prisma, Auth.js, or Docker files.

### 6. Prisma Template

Confirm generated projects with `orm: "prisma"` include:

```txt
prisma/schema.prisma
lib/db.ts
```

Confirm:

- Prisma dependencies are contributed correctly.
- Prisma scripts are contributed correctly.
- Prisma README guidance exists.
- Prisma without PostgreSQL is rejected.

### 7. Auth.js Credentials Template

Confirm generated projects with `auth: "authjs-credentials"` include:

```txt
auth.ts
app/api/auth/[...nextauth]/route.ts
AUTH_SECRET
```

Confirm:

- Auth.js dependency contribution is correct.
- Auth.js credentials without a database is allowed.
- Auth.js README guidance clearly says this is a scaffold and not production-complete.
- Generated projects with `auth: "none"` do not include Auth.js files.

### 8. Docker PostgreSQL Template

Confirm generated projects with `docker: "postgres"` include:

```txt
docker-compose.yml
```

Confirm:

- Docker PostgreSQL without PostgreSQL is rejected.
- Docker README guidance exists.
- Docker does not add npm dependencies.
- Docker alone does not add Prisma or Auth.js files.

### 9. Compatibility Rules

Confirm these rules still work:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
Auth.js credentials with Prisma requires Prisma and PostgreSQL.
shadcn/ui requires Tailwind CSS.
```

Do not broaden the MVP option set.

### 10. Generator Integration

Confirm the generator can produce files from the implemented templates.

At minimum, verify output for:

```txt
default config
ui: "shadcn"
database: "postgres"
database: "postgres", orm: "prisma"
auth: "authjs-credentials"
database: "postgres", docker: "postgres"
all compatible MVP features selected together
```

Confirm:

- File paths are normalized and safe.
- No generated file path starts with `/`.
- No generated file path contains `..`.
- No generated file path contains empty path segments.
- No generated project includes `src/`.

## Tests

Use Vitest only.

Add or update focused tests only where coverage is missing.

Recommended test coverage:

- Template package exports.
- Required template files exist.
- Feature-specific files appear only when selected.
- Feature-specific files do not appear when not selected.
- Combined compatible feature selections generate expected files.
- Incompatible selections fail with useful compatibility messages.
- Generated paths remain safe.
- No `node:test` imports exist.

Do not add broad new infrastructure unless needed for verification.

## Verification Commands

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run build
npm run lint
```

If package-specific commands exist, also run:

```bash
npm run typecheck -w @launchkit/schema
npm run typecheck -w @launchkit/generator
npm run typecheck -w @launchkit/templates
npm test -w @launchkit/schema
npm test -w @launchkit/generator
npm test -w @launchkit/templates
```

If a command does not exist, do not invent it. Record that clearly in `progress-tracker.md`.

If a check fails because of an in-scope Phase 5 issue, fix it.

If a check fails because of an unrelated existing issue, document it clearly and do not expand scope unnecessarily.

## Progress Tracker Update

After verification, update `progress-tracker.md`.

If Phase 5 is complete, mark:

```txt
Phase 5: Complete
Phase 6: Ready
```

Add an entry like:

```txt
Phase 5 Step 9 completed: Verify Phase 5 completion

Changes made:
- Verified template package foundation.
- Verified base Next.js template.
- Verified Tailwind template.
- Verified shadcn/ui template.
- Verified PostgreSQL template.
- Verified Prisma template.
- Verified Auth.js credentials template.
- Verified Docker PostgreSQL template.
- Verified generator output and compatibility behavior.
- Fixed any small in-scope issues found during verification.

Files changed:
- relevant test files, if changed
- relevant template or generator files, if small fixes were needed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 1: Create website wizard shell
```

If Phase 5 is not complete, do not mark it complete. Instead record:

```txt
Phase 5: In progress
Blocked/missing:
- ...

Next suggested step:
- Fix the listed Phase 5 blocker before starting Phase 6.
```

## Completion Criteria

This step is complete when:

- All Phase 5 template layers are verified.
- Generator output includes correct files for each selected MVP feature.
- Generator output excludes files for unselected optional features.
- Compatibility rules still behave correctly.
- No generated project includes a `src/` folder.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.
- Phase 5 is marked complete only if the checklist is genuinely satisfied.

Then stop.
