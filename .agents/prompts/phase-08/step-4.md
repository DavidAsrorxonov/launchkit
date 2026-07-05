# Phase 8 Step 4: Create Dedicated Documentation Page

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 8 Step 3 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to final Phase 8 QA yet.
Do not add CLI functionality.
Do not claim the CLI is available unless it actually exists.
Do not add new product options.
Do not change generator behavior unless docs reveal a tiny factual mismatch that must be corrected.
Do not replace the landing page or builder.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create a dedicated documentation page for LaunchKit.

The documentation page should be thorough, structured, and practical. It should help developers understand:

- what LaunchKit is
- how to use the website builder
- what stack options are supported
- what files are generated
- how optional features work
- how to run a downloaded project
- what the MVP limitations are
- what is planned later, including the CLI

The docs page should be separate from:

```txt
/          landing page
/builder   website builder wizard
/docs      documentation page
```

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/app/docs/page.tsx
apps/web/components/docs/docs-page.tsx
apps/web/components/docs/docs-sidebar.tsx
apps/web/components/docs/docs-section.tsx
apps/web/components/docs/code-block.tsx
apps/web/components/docs/supported-stack-table.tsx
apps/web/components/docs/generated-files-section.tsx
apps/web/components/docs/feature-notes.tsx
```

Adjust paths to match the existing app structure and conventions.

## Documentation Information Architecture

Create a docs page with these sections, in this order:

```txt
1. Overview
2. Quick Start
3. Website Builder Flow
4. Supported Stack
5. Generated Project Structure
6. Optional Features
7. Environment Variables
8. Scripts
9. Downloaded Project Usage
10. Compatibility Rules
11. Limitations
12. Future CLI
13. Troubleshooting
```

Use a sidebar or sticky section nav on desktop if it fits the current design.

On mobile, the section nav should collapse or become a simple top list. It must not crowd the content.

## Content Requirements

### 1. Overview

Explain:

```txt
LaunchKit is a TypeScript-first developer project generator.
The MVP is website-first.
Users choose options, preview generated output, and download a zip.
The generated project is intended to be unzipped and edited locally.
The shared generator core is designed so a future CLI can reuse it.
```

Do not claim the CLI is already available.

### 2. Quick Start

Document the website-first flow:

```txt
1. Open the builder.
2. Enter a project name.
3. Choose supported options.
4. Preview the generated output.
5. Download the zip.
6. Unzip the project locally.
7. Install dependencies.
8. Start development.
```

Include commands:

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

If generated projects support pnpm instructions, include a clearly separated pnpm variant:

```bash
pnpm install
pnpm dev
```

Only include pnpm commands if the generated project output actually supports pnpm guidance.

### 3. Website Builder Flow

Document the wizard steps:

```txt
1. Project
2. Framework
3. Styling and UI
4. Database
5. ORM
6. Auth
7. Extras
8. Preview
9. Download
```

For each step, explain what it controls:

```txt
Project:
  name and package manager

Framework:
  fixed MVP foundation

Styling and UI:
  Tailwind and optional shadcn/ui

Database:
  none or PostgreSQL

ORM:
  none or Prisma

Auth:
  none or Auth.js credentials scaffold

Extras:
  optional PostgreSQL Docker Compose

Preview:
  stack, dependencies, env vars, scripts, file tree

Download:
  generated project zip
```

### 4. Supported Stack

Document the exact MVP options.

Use data from `@launchkit/schema` where practical so docs stay aligned with the product.

Supported options:

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
  - pnpm, if supported by generated project instructions
```

Do not document unsupported options as available.

Do not mention JavaScript output, Pages Router, `src/`, other databases, other ORMs, or other auth providers as supported.

### 5. Generated Project Structure

Document the expected base generated structure:

```txt
app/
  layout.tsx
  page.tsx
  globals.css
components/
lib/
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
.env.example
.gitignore
README.md
```

Make clear:

```txt
Generated projects do not use a src/ directory.
```

Also document optional generated files:

```txt
shadcn/ui:
  components.json
  lib/utils.ts
  components/ui/button.tsx

PostgreSQL:
  DATABASE_URL in .env.example

Prisma:
  prisma/schema.prisma
  lib/db.ts

Auth.js credentials:
  auth.ts
  app/api/auth/[...nextauth]/route.ts
  AUTH_SECRET in .env.example

Docker PostgreSQL:
  docker-compose.yml
```

### 6. Optional Features

Create subsections for each optional feature.

#### shadcn/ui

Explain:

- adds shadcn-compatible files
- depends on Tailwind CSS
- includes starter button component if implemented
- can be extended by the developer after download

#### PostgreSQL

Explain:

- adds `DATABASE_URL`
- does not create a hosted database
- user must provide a real connection string for production

#### Prisma

Explain:

- requires PostgreSQL
- adds Prisma schema and client helper
- includes Prisma scripts

Commands:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

Do not tell users to run database-changing commands blindly in production.

#### Auth.js Credentials

Explain:

- scaffold only
- not production-ready user management
- user must implement real user lookup
- user must implement secure password hashing and verification
- `AUTH_SECRET` must be replaced

Be explicit but concise.

#### Docker PostgreSQL

Explain:

- local development only
- requires PostgreSQL selection
- adds `docker-compose.yml`

Commands:

```bash
docker compose up -d
docker compose down
```

### 7. Environment Variables

Document generated env vars:

```txt
DATABASE_URL
AUTH_SECRET
```

Explain when each appears:

```txt
DATABASE_URL appears when PostgreSQL is selected.
AUTH_SECRET appears when Auth.js credentials is selected.
```

Make clear:

- `.env.example` is only an example
- secrets must be replaced
- production values should not be committed

### 8. Scripts

Document common generated scripts:

```txt
dev
build
start
typecheck
```

Document optional Prisma scripts:

```txt
db:generate
db:push
db:studio
```

Only document scripts that the generator actually produces.

### 9. Downloaded Project Usage

Explain the lifecycle after download:

```txt
download zip
unzip locally
install dependencies
copy .env.example to .env.local if needed
configure env vars
run dev server
run typecheck/build before deployment
```

Include commands:

```bash
cp .env.example .env.local
npm install
npm run dev
npm run typecheck
npm run build
```

Note that the exact env setup depends on selected features.

### 10. Compatibility Rules

Document rules clearly:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials can be generated without a database.
Auth.js credentials with Prisma requires the Prisma/PostgreSQL combination.
shadcn/ui requires Tailwind CSS.
```

Because Tailwind is fixed in the MVP, shadcn/ui is normally compatible.

### 11. Limitations

Document MVP limitations:

```txt
- CLI generation is planned but not part of the current MVP.
- Only Next.js is supported.
- Only TypeScript is supported.
- Only App Router is supported.
- Generated projects do not use src/.
- Only Tailwind CSS is supported.
- Only PostgreSQL is supported as a database option.
- Only Prisma is supported as an ORM option.
- Auth.js credentials is a scaffold, not complete production auth.
- LaunchKit does not host databases.
- LaunchKit does not install generated dependencies.
- LaunchKit does not run generated project code on the server.
- LaunchKit does not save project presets.
- LaunchKit does not provide user accounts in the MVP.
```

Keep limitations factual, not apologetic.

### 12. Future CLI

Document that CLI is planned later.

Show the intended command as future/planned:

```bash
npx create-launchkit@latest
```

Important:

- Label it as future CLI, planned CLI, or coming soon.
- Do not imply it works today unless package release is confirmed.
- Explain that the future CLI should reuse the same shared generator core as the website.

### 13. Troubleshooting

Add practical troubleshooting entries.

Suggested entries:

```txt
Invalid project name:
  Use lowercase letters, numbers, and hyphens only.

Prisma option is disabled:
  Select PostgreSQL first.

Docker PostgreSQL is disabled:
  Select PostgreSQL first.

Download failed:
  Check selected options and try again.

npm install fails:
  Check Node.js version and network access.

Build fails after download:
  Verify env vars and optional feature setup.

Auth does not work out of the box:
  Auth.js credentials output is a scaffold; implement real user lookup and password verification.
```

## Design Requirements

The docs page should feel like a focused developer documentation surface.

Use:

- clean typographic hierarchy
- readable line length
- sticky sidebar on desktop if practical
- section anchors
- code blocks for commands
- compact tables or structured lists
- token-based colors

Avoid:

- marketing hero layout
- decorative blobs/orbs
- oversized headings inside compact docs panels
- text overflow
- one-note color palette
- nested cards inside cards

Use token-based classes:

```txt
bg-background
text-foreground
border-border
text-muted-foreground
bg-muted
text-primary
ring-ring
```

## Navigation Requirements

Update navigation so users can move between:

```txt
Landing
Builder
Docs
```

Do not add broken links.

If the landing page has a Docs link, make sure it now points to:

```txt
/docs
```

The builder should remain available at:

```txt
/builder
```

or the existing builder route if a different route was intentionally chosen.

## Responsive Requirements

Verify at:

```txt
mobile: 375px wide
tablet: 768px wide
desktop: 1280px wide
wide desktop: 1440px+ wide
```

Requirements:

- docs content is readable on mobile
- code blocks scroll horizontally instead of overflowing the viewport
- sidebar does not crowd mobile layout
- section anchors/navigation remain usable
- tables or stack lists do not overflow
- no text overlaps controls

Do not scale font size with viewport width.
Do not use negative letter spacing.

## Accuracy Requirements

Cross-check docs against:

```txt
@launchkit/schema
@launchkit/generator
packages/templates
apps/web builder steps
```

If docs and implementation disagree:

- fix docs if docs are aspirational
- fix implementation only if it clearly violates completed phase requirements

Do not expand implementation just to match aspirational docs.

## Tests

Use Vitest only.

Add or update tests where the current setup supports it.

Possible tests:

- `/docs` renders.
- docs include supported MVP stack.
- docs include limitation that CLI is not currently part of MVP.
- docs include Auth.js scaffold warning.
- docs include no `src/` structure statement.
- landing page Docs link points to `/docs`.
- builder link still points to the builder route.

If frontend testing is not configured, document manual verification in `progress-tracker.md`.

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

1. Open `/docs`.
2. Confirm the docs page renders.
3. Confirm the docs are separate from the landing page.
4. Confirm the docs are separate from the builder.
5. Confirm Landing, Builder, and Docs navigation works.
6. Confirm docs match actual wizard options.
7. Confirm no unsupported options are advertised.
8. Confirm the CLI command is clearly labeled future/planned if shown.
9. Check mobile, tablet, desktop, and wide desktop layouts.
10. Confirm code blocks and tables do not overflow the viewport.

If local app startup is not possible, document why.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 8 Step 4 completed: Create dedicated documentation page

Changes made:
- Added dedicated /docs page.
- Added structured LaunchKit documentation.
- Documented website builder flow.
- Documented supported MVP stack.
- Documented generated project structure.
- Documented optional features.
- Documented environment variables and scripts.
- Documented downloaded project usage.
- Documented compatibility rules.
- Documented MVP limitations.
- Documented future CLI as planned/coming soon.
- Added troubleshooting guidance.
- Updated navigation between landing, builder, and docs.
- Verified docs responsiveness.

Files changed:
- apps/web/app/docs/page.tsx
- apps/web/components/docs/..., if added
- apps/web/components/landing/..., if navigation changed
- apps/web/app/page.tsx, if navigation changed
- relevant tests, if added or changed
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
- Phase 8 Step 5: Final launch QA and Phase 8 verification
```

## Completion Criteria

This step is complete when:

- Dedicated `/docs` page exists.
- Docs are separate from landing and builder.
- Docs have a clear section structure.
- Docs explain LaunchKit purpose.
- Docs explain the website builder flow.
- Docs list the exact supported MVP stack.
- Docs explain generated project structure.
- Docs explain optional features.
- Docs explain environment variables.
- Docs explain generated scripts.
- Docs explain downloaded project usage.
- Docs explain compatibility rules.
- Docs explain limitations.
- Future CLI is labeled as planned/coming soon if mentioned.
- Troubleshooting guidance exists.
- Navigation between landing, builder, and docs works.
- Docs are responsive.
- Code blocks and tables do not overflow.
- No unsupported options are advertised.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
