# Phase 8 Step 2: Add Docs, Supported Stack, and Limitations

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 8 Step 1 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 8 Step 3.
Do not add CLI functionality.
Do not add new product options.
Do not add user accounts, saved presets, or marketing-only pages.
Do not change generator behavior unless a tiny docs-related fix reveals incorrect output.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Add concise documentation for the LaunchKit website MVP.

The docs should make clear:

- What LaunchKit does.
- Which stack options are supported.
- What the MVP intentionally does not support.
- How to use a downloaded generated project.
- What limitations users should understand before relying on the output.

The first website screen should remain the product builder, not a marketing-only homepage.

## Scope

Work in the repo areas that already hold docs or app content.

Likely files:

```txt
README.md
apps/web/README.md
apps/web/app/page.tsx
apps/web/components/...
apps/web/app/supported/page.tsx, only if the app already uses simple docs routes
apps/web/app/docs/page.tsx, only if appropriate
```

Prefer a small supported-stack section or page over a large documentation system.

Do not create a full docs platform.

## Requirements

### 1. README Overview

Update or create a concise README section explaining:

```txt
LaunchKit is a TypeScript-first developer project generator.
The MVP is a website-first generator.
Users configure a project, preview output, and download a zip.
The future CLI is deferred.
```

Do not claim the CLI exists yet.

### 2. Supported Stack Documentation

Document the exact MVP options:

```txt
Framework:
  - Next.js

Language:
  - TypeScript

Router:
  - App Router

Project structure:
  - No src/ folder

Styling:
  - Tailwind CSS

UI:
  - none
  - shadcn/ui

Database:
  - none
  - PostgreSQL

ORM:
  - none
  - Prisma

Auth:
  - none
  - Auth.js credentials scaffold

Docker:
  - none
  - PostgreSQL Docker Compose

Package manager:
  - npm
  - pnpm instructions/generated metadata where supported
```

Keep this consistent with `@launchkit/schema`.

Do not document unsupported options as available.

### 3. Limitations

Add a clear limitations section.

Include:

```txt
- CLI generation is not part of the MVP.
- Only Next.js is supported.
- Only TypeScript is supported.
- Only App Router is supported.
- Generated projects do not use src/.
- Only Tailwind CSS is supported.
- Auth.js credentials output is a scaffold, not production-ready auth.
- PostgreSQL Docker Compose is for local development only.
- LaunchKit does not install dependencies for generated projects.
- LaunchKit does not run generated project code on the server.
- Users must configure real secrets and production environment variables.
```

Do not make the limitations sound apologetic. Keep them precise.

### 4. Generated Project Usage

Document what users do after downloading a generated project.

Example:

```bash
unzip my-app.zip
cd my-app
npm install
npm run dev
```

Also include:

```bash
npm run typecheck
npm run build
```

If package manager is `pnpm`, mention equivalent instructions only if generated output already supports that.

### 5. Feature-Specific Notes

Document concise notes for optional features:

PostgreSQL:

```txt
Configure DATABASE_URL before using database-backed features.
```

Prisma:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

Auth.js credentials:

```txt
Replace AUTH_SECRET.
Implement real user lookup and secure password verification.
```

Docker PostgreSQL:

```bash
docker compose up -d
docker compose down
```

Make clear Docker is local development support.

### 6. Website Supported Stack Section

If appropriate, add a small in-app supported stack or limitations section.

Acceptable options:

- A compact section below the builder.
- A simple route linked from the builder footer/nav.
- A collapsible supported-stack panel near preview/download.

Do not replace the builder as the first screen.
Do not create a marketing landing page.
Do not add a large hero.

### 7. Visual Direction

If adding website docs UI, keep it:

- minimal
- dense but readable
- developer-tool focused
- consistent with existing builder UI

Use token-based classes:

```txt
bg-background
text-foreground
border-border
text-muted-foreground
bg-primary
text-primary-foreground
```

Avoid repeated hardcoded color utilities:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Do not use decorative gradient blobs/orbs.
Do not nest cards inside cards.

### 8. Keep Docs Accurate

Cross-check docs against:

```txt
@launchkit/schema
@launchkit/generator
packages/templates
```

If docs and implementation disagree, prefer fixing the docs unless the implementation is clearly wrong according to earlier phase contracts.

Do not expand implementation just to match aspirational docs.

## Tests

Use Vitest only.

Add or update tests only if docs changes affect rendered app behavior.

Possible tests:

- Supported stack section renders the current MVP options.
- Docs do not claim CLI availability.
- Limitations include Auth.js scaffold warning.

If there is no frontend test setup for docs UI, do not add a large test stack in this step. Document manual verification instead.

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

Use actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the app can run locally:

1. Open the website.
2. Confirm the first screen is still the builder.
3. Confirm supported stack docs are reachable or visible.
4. Confirm limitations are clear.
5. Confirm docs match the actual wizard options.
6. Confirm no unsupported options are advertised.

If local app startup is not possible, document why.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 8 Step 2 completed: Add docs, supported stack, and limitations

Changes made:
- Added or updated LaunchKit README/docs overview.
- Documented supported MVP stack.
- Documented MVP limitations.
- Documented generated project usage after download.
- Documented feature-specific setup notes.
- Added or updated website supported-stack/limitations UI if appropriate.
- Confirmed docs do not claim CLI availability.
- Confirmed docs match schema/generator/template behavior.

Files changed:
- README.md, if changed
- apps/web/README.md, if changed
- apps/web/app/..., if docs UI was added
- apps/web/components/..., if docs UI was added
- relevant test files, if added or changed
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
- Phase 8 Step 3: Final launch QA and Phase 8 verification
```

## Completion Criteria

This step is complete when:

- LaunchKit purpose is documented.
- Website-first MVP is documented.
- Future CLI is clearly deferred.
- Supported stack is documented accurately.
- MVP limitations are documented clearly.
- Generated project usage is documented.
- Optional feature setup notes are documented.
- Website builder remains the first screen.
- No unsupported options are advertised.
- Docs match schema/generator/template behavior.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
