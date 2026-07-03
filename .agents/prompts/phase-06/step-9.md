# Phase 6 Step 9: Create Preview Step

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 8 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 10.
Do not implement the API generate route yet unless the existing architecture already exposes a safe server-side preview helper.
Do not implement zip download behavior yet.
Do not add CLI functionality.
Do not put generator logic directly in UI components.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the Preview step in the LaunchKit website wizard.

The Preview step should help users inspect what will be generated before download.

It should show:

```txt
Selected stack summary
Dependencies
Dev dependencies
Scripts
Environment variables
Generated file tree
```

Full file content preview is optional later and should not be implemented in this step unless the existing generator already makes it trivial.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/preview-step.tsx
apps/web/components/builder/preview/stack-summary.tsx
apps/web/components/builder/preview/dependency-list.tsx
apps/web/components/builder/preview/script-list.tsx
apps/web/components/builder/preview/env-var-list.tsx
apps/web/components/builder/preview/file-tree-preview.tsx
apps/web/components/builder/builder-shell.tsx
apps/web/lib/builder/preview.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Selected Stack Summary

Show a compact summary of the current builder config:

```txt
Project name
Framework
Language
Router
Project structure
Styling
UI
Database
ORM
Auth
Docker
Package manager
```

Use labels from `@launchkit/schema` metadata where available.

Do not expose raw enum values as the primary display text if metadata labels exist.

### 2. Dependencies and Dev Dependencies

Show dependencies that will be included in the generated project.

Preferred source:

```txt
@launchkit/generator
```

If the generator exports a safe planning helper such as:

```ts
createGenerationPlan(config);
```

or similar, use it to derive dependencies and dev dependencies.

Do not duplicate package dependency logic manually in `apps/web` if generator plan data exists.

If the current generator only exposes async generation, do not call it directly from a client component if it depends on server-only APIs. In that case, create a small server-safe preview helper or defer full generator integration to Step 10 and show a schema-based selected stack summary only, documenting the limitation in `progress-tracker.md`.

### 3. Scripts

Show generated `package.json` scripts.

Examples:

```txt
dev
build
start
typecheck
db:generate
db:push
db:studio
```

Only show scripts that are actually contributed by the selected config.

Use generator plan data if available.

### 4. Environment Variables

Show generated environment variables.

Examples:

```txt
DATABASE_URL
AUTH_SECRET
```

Do not display real secrets.

Do not imply generated secrets are production-ready.

Use generator plan data if available.

### 5. Generated File Tree

Show a generated file tree preview.

Examples:

```txt
app/layout.tsx
app/page.tsx
app/globals.css
components/ui/button.tsx
lib/utils.ts
lib/db.ts
prisma/schema.prisma
docker-compose.yml
package.json
.env.example
README.md
```

Only show files that match the selected config.

Do not show files for unselected optional features.

No generated file tree should include:

```txt
src/
```

### 6. Compatibility and Errors

Before showing the preview, validate the current config with:

```txt
@launchkit/schema
```

If there are schema or compatibility errors:

- Show concise errors.
- Disable moving to the Download step.
- Do not attempt generation.

### 7. Client/Server Boundary

Do not place Node-only generator logic in client components.

Acceptable approaches:

- Use pure exported generator planning helpers if they are browser-safe.
- Use a server component wrapper if the route architecture supports it.
- Use a server action or API route only if it already exists and is in scope.

Do not create the final generate/download API route in this step. That belongs to Step 10.

### 8. Visual Direction

Keep the preview dense, structured, and scannable.

Recommended presentation:

- Stack summary section.
- Dependencies and dev dependencies in compact lists.
- Scripts in a compact list.
- Environment variables in a compact list.
- File tree in a monospace block or structured tree.

Do not use a marketing layout.
Do not use a large hero.
Do not use decorative gradient blobs/orbs.
Do not nest cards inside cards.

Use token-based classes:

```txt
bg-background
text-foreground
bg-primary
text-primary-foreground
border-border
text-muted-foreground
ring-ring
bg-accent
```

Avoid repeated hardcoded color utilities:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Use existing shadcn/ui components if available:

```txt
Tabs
Badge
Separator
ScrollArea
Alert
```

## Tests

Use the test setup already present in the repo.

Add or update focused tests only if the app already has a frontend test pattern.

Possible tests:

- Preview step renders selected stack summary.
- Preview step uses schema metadata labels where available.
- Preview step shows dependencies for selected features.
- Preview step shows env vars for PostgreSQL/Auth.js selections.
- Preview step shows Prisma files only when Prisma is selected.
- Preview step shows Docker files only when Docker PostgreSQL is selected.
- Preview step does not show `src/`.
- Invalid config prevents moving to Download.

If the repo does not yet have frontend component testing configured, do not add a large new test stack in this step. Document that in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

If app-specific commands exist, also run:

```bash
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 6 Step 9 completed: Create preview step

Changes made:
- Added Preview step UI.
- Added selected stack summary.
- Added dependencies/dev dependencies preview.
- Added scripts preview.
- Added environment variables preview.
- Added generated file tree preview.
- Added compatibility/error display for preview.
- Confirmed preview does not implement download behavior.

Files changed:
- apps/web/components/builder/steps/preview-step.tsx
- apps/web/components/builder/preview/stack-summary.tsx
- apps/web/components/builder/preview/dependency-list.tsx
- apps/web/components/builder/preview/script-list.tsx
- apps/web/components/builder/preview/env-var-list.tsx
- apps/web/components/builder/preview/file-tree-preview.tsx
- apps/web/components/builder/builder-shell.tsx
- apps/web/lib/builder/preview.ts
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 10: Create API generate route
```

## Completion Criteria

This step is complete when:

- Preview step renders in the wizard.
- Preview shows selected stack summary.
- Preview shows dependencies and dev dependencies when available.
- Preview shows scripts when available.
- Preview shows environment variables when available.
- Preview shows generated file tree.
- Preview excludes unselected optional feature files.
- Preview does not show any `src/` path.
- Invalid config shows concise errors and prevents moving to Download.
- Generator logic is not placed directly in client UI components.
- Final API generate route is not implemented yet.
- Zip download behavior is not implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
