# Phase 8 Step 1: Prepare Deployment and Production Readiness

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 is complete and Phase 8 is ready.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 8 Step 2.
Do not add CLI functionality.
Do not add new product options.
Do not add user accounts, saved presets, or analytics unless already planned.
Do not run generated project code on the LaunchKit server.
Do not install generated project dependencies from the website.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Prepare the LaunchKit website MVP for deployment and production use.

This step should verify and tighten the production build, environment assumptions, API safety, and deployment-facing configuration.

## Scope

Work mainly inside:

```txt
apps/web/
```

and root configuration files where needed:

```txt
package.json
package-lock.json
README.md, only if deployment notes already belong there
```

Do not perform broad refactors.

## Requirements

### 1. Production Build Readiness

Confirm the web app can build for production.

Run:

```bash
npm run build
```

or the app-specific equivalent:

```bash
npm run build -w apps/web
```

Fix in-scope production build issues.

Do not hide build errors by disabling useful checks unless there is a documented reason.

### 2. Runtime Boundary Check

Confirm the website does not accidentally put server-only code into client bundles.

Check especially:

```txt
@launchkit/generator
Node filesystem APIs
zip/server helpers
API route helpers
```

Generator logic should run server-side through:

```txt
POST /api/generate
```

or server-safe helpers only.

Client components should not import Node-only generator internals.

### 3. API Deployment Safety

Re-check the production API route:

```txt
apps/web/app/api/generate/route.ts
```

Confirm:

- request size limit exists
- schema validation runs
- compatibility validation runs
- generated paths are checked
- structured errors are returned
- no stack traces are leaked
- generated files are not written to disk
- generated code is not executed
- dependencies are not installed

Make only small production-readiness fixes here.

### 4. Environment Variables

Confirm whether the LaunchKit website itself requires environment variables.

For the MVP, it should ideally require none.

If environment variables are needed, add or update:

```txt
apps/web/.env.example
```

Do not add generated-project environment variables to the LaunchKit website environment unless the website itself needs them.

For example:

```txt
DATABASE_URL
AUTH_SECRET
```

belong to generated projects, not the LaunchKit website, unless the website itself uses a database or auth system.

### 5. Deployment Config

Review framework/deployment config:

```txt
next.config.ts
next.config.mjs
package.json scripts
```

Confirm scripts are clear:

```txt
dev
build
start
lint
typecheck
test
```

Only add missing scripts if they fit the current repo conventions.

Do not add provider-specific deployment files unless the project already targets a provider or the user explicitly requested one.

### 6. Static Assets and Metadata

Confirm the website has basic production metadata:

- page title
- description
- favicon or default icon state
- reasonable viewport behavior

Do not spend this step on marketing copy or a full landing page.

The first screen should remain the product builder, not a marketing-only homepage.

### 7. Dependency Review

Review app dependencies for obvious issues:

- zip library is in the correct workspace if used
- no unused heavy dependencies added during MVP work
- no CLI-only dependencies added to the web app
- no test-only dependencies in runtime dependencies if avoidable

Make small package cleanup only if clearly safe.

Do not perform broad dependency upgrades in this step.

### 8. Security Headers

Add minimal security headers only if the app already has a clear Next.js config pattern for headers.

Possible headers:

```txt
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Do not add a complex Content Security Policy unless it can be tested and maintained.

### 9. Deployment Notes

If the repo has a README or docs area for deployment notes, add concise deployment guidance:

```txt
npm install
npm run build
npm run start
```

Mention that the website MVP does not run generated projects server-side.

Do not write a full product documentation page in this step. Docs and supported stack belong to Phase 8 Step 2.

## Tests

Use Vitest only.

Add or update tests only if production-readiness fixes require them.

Possible tests:

- API route still rejects invalid configs.
- API route still rejects unsafe generated paths.
- Client error helpers still parse production error responses.

Do not create broad new test infrastructure in this step.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

App-specific if available:

```bash
npm run typecheck -w apps/web
npm test -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

Run smoke tests if available and reasonable:

```bash
npm run test:smoke
```

Use actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the app can run locally:

1. Start the production build if supported.
2. Open the website.
3. Complete the wizard with default options.
4. Preview output.
5. Download a zip.
6. Repeat with all compatible MVP features selected.
7. Confirm no server/runtime errors appear.

If local production startup is not possible, document why.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 8 Step 1 completed: Prepare deployment and production readiness

Changes made:
- Verified production build readiness.
- Verified client/server runtime boundaries.
- Verified API generation safety for deployment.
- Verified website environment variable requirements.
- Reviewed deployment scripts and Next.js config.
- Reviewed basic metadata/static asset readiness.
- Reviewed web app dependencies.
- Added small production-readiness fixes where needed.

Files changed:
- apps/web/..., if changed
- package.json, if scripts changed
- apps/web/package.json, if scripts/dependencies changed
- package-lock.json, if dependencies changed
- README.md or docs file, only if deployment notes were added
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Manual verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 8 Step 2: Add docs, supported stack, and limitations
```

## Completion Criteria

This step is complete when:

- Production build passes, or unrelated blockers are documented.
- Client/server runtime boundaries are verified.
- API generation route remains safe for deployment.
- Website environment requirements are documented.
- Deployment scripts are clear.
- Basic metadata is present.
- No generated project code is executed by the website.
- No generated project dependencies are installed by the website.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
