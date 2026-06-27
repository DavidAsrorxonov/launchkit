# LaunchKit Build Plan

## Purpose

This document defines the build phases for LaunchKit.

LaunchKit will start as a website-first project generator and later add CLI support.

The website will let developers choose a stack, preview the generated project, and download it as a zip file.

## Confirmed MVP Decisions

### LaunchKit Website

The LaunchKit website itself will use:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Minimal developer-tool UI
- Green accent theme inspired by tools like Supabase and Neon
- Theme tokens/CSS variables instead of hardcoded colors
- Step-by-step wizard
- Preview before download

### Generated Projects

Generated projects should use:

- Next.js
- TypeScript
- App Router
- No `src/` folder
- Tailwind CSS
- Optional shadcn/ui
- Optional PostgreSQL
- Optional Prisma
- Optional Auth.js credentials scaffold
- Optional Docker Compose for database
- `.env.example`
- README

### MVP Non-Goals

The MVP should not include:

- CLI generation
- Multiple frontend frameworks
- JavaScript output
- User accounts for LaunchKit itself
- Saved project presets
- GitHub auth provider generation
- Server-side dependency installation
- Running generated project code on the LaunchKit server
- Every possible database, ORM, auth provider, or UI library

## Phase 1: Product And Architecture Foundation

Goal: Finalize what LaunchKit is building and what the MVP includes.

### 1.1 Define Product Scope

Define LaunchKit as:

```txt
A website-first TypeScript project generator that later gains a CLI.
```

The real product is the reusable generator core.

The website is the first interface.

The CLI is a future second interface.

### 1.2 Define MVP Stack Options

Initial supported options:

```txt
Framework:
  - Next.js

Language:
  - TypeScript

Router:
  - App Router

Project structure:
  - No src folder

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
  - no
  - yes, for PostgreSQL development

Package manager:
  - npm
  - pnpm
```

### 1.3 Define Generated Project Requirements

Generated projects must include:

- Valid `package.json`
- Valid `tsconfig.json`
- App Router files
- No `src/` directory
- Tailwind setup
- Optional shadcn/ui setup
- Optional Prisma setup
- Optional database client file
- Optional Auth.js credentials scaffold
- Optional Docker Compose file
- `.env.example`
- `.gitignore`
- README with setup instructions

### 1.4 Define Website UX Requirements

The website must include:

- Step-by-step wizard
- Project name input
- Stack option steps
- Compatibility-aware option selection
- Preview step
- Download button
- Loading state while generating
- Error state when generation fails
- Success state after zip generation

Preview should include:

- Selected stack summary
- Generated dependencies
- Generated scripts
- Environment variables
- Generated file tree

Full file content preview is not required for MVP.

### 1.5 Define Architecture Boundaries

The website must not own generation logic.

The generator core must own:

- Template composition
- Feature resolution
- File tree creation
- Dependency merging
- Env generation
- Conflict detection

The website owns:

- UI
- Form state
- API route
- Download behavior

### Phase 1 Completion Criteria

Phase 1 is complete when:

- MVP scope is documented.
- Architecture is documented.
- Build plan is documented.
- Supported and unsupported features are clear.
- The first implementation target is unambiguous.

## Phase 2: Monorepo And Tooling Setup

Goal: Create the base workspace structure for website, generator, schema, templates, and shared utilities.

### 2.1 Initialize Workspace

Create the monorepo root with:

- `package.json`
- workspace configuration
- TypeScript base config
- formatting config
- linting config
- gitignore

Recommended package manager:

```txt
pnpm
```

### 2.2 Create App And Package Structure

Create:

```txt
apps/web
packages/schema
packages/generator
packages/templates
packages/shared
```

Leave room for:

```txt
packages/cli
```

but do not build the CLI yet.

### 2.3 Configure TypeScript

Add shared TypeScript configuration for:

- Next.js app
- Node packages
- Shared package exports
- Strict type checking

### 2.4 Configure Linting And Formatting

Add:

- ESLint
- Prettier or equivalent formatting
- TypeScript-aware linting

### 2.5 Configure Testing

Add a test runner for package-level tests.

Recommended focus:

- schema tests
- generator tests
- compatibility tests
- output snapshot tests

### Phase 2 Completion Criteria

Phase 2 is complete when:

- Workspace installs successfully.
- TypeScript can compile packages.
- Website app can start.
- Tests can run.
- Package imports work across the monorepo.

## Phase 3: Shared Schema And Compatibility Rules

Goal: Create the shared configuration contract used by the website, generator, and future CLI.

### 3.1 Define Config Schema

Create `LaunchKitConfig` with fields for:

- project name
- framework
- language
- router
- project structure
- styling
- UI library
- database
- ORM
- auth
- Docker
- package manager

### 3.2 Add Zod Validation

Use Zod to validate:

- required fields
- allowed option values
- project name format
- supported combinations

### 3.3 Add Default Config

Define default selections.

Recommended defaults:

```txt
framework: Next.js
language: TypeScript
router: App Router
project structure: no src
styling: Tailwind
ui: none
database: none
orm: none
auth: none
docker: no
package manager: pnpm
```

### 3.4 Define Option Metadata

Expose option metadata for the website.

Example metadata:

- label
- description
- category
- recommended flag
- disabled reason

### 3.5 Define Compatibility Rules

Initial rules:

- Prisma requires a database.
- PostgreSQL can use Prisma.
- Docker Compose is only useful when PostgreSQL is selected.
- shadcn/ui requires Tailwind CSS.
- Auth.js credentials scaffold can work without a provider.
- Auth.js with Prisma requires Prisma and database user model files.

### 3.6 Add Schema Tests

Test:

- valid minimal config
- valid full MVP config
- invalid Prisma without database
- invalid Docker without PostgreSQL
- invalid project name
- invalid unknown option values

### Phase 3 Completion Criteria

Phase 3 is complete when:

- Shared schema exists.
- Website can import options and defaults.
- Generator can validate config.
- Compatibility errors are typed and test-covered.

## Phase 4: Generator Core

Goal: Build the reusable TypeScript generator engine.

### 4.1 Define Generated File Tree Model

Create internal models:

```ts
type GeneratedProject = {
  name: string;
  files: GeneratedFile[];
  packageManager: PackageManager;
};

type GeneratedFile = {
  path: string;
  contents: string | Uint8Array;
};
```

### 4.2 Define Generation Plan Model

Create a planning step that resolves:

- base template
- selected features
- files to include
- dependencies
- dev dependencies
- scripts
- environment variables
- post-generation notes

### 4.3 Build Feature Registry

Create feature definitions for:

- Next.js base
- Tailwind
- shadcn/ui
- PostgreSQL
- Prisma
- Auth.js credentials scaffold
- Docker Compose

Each feature can contribute:

- files
- dependencies
- dev dependencies
- scripts
- env variables
- README instructions
- compatibility requirements

### 4.4 Build Template Loader

Load files from:

```txt
packages/templates/base
packages/templates/features
```

The loader should:

- read template files
- preserve paths
- support text and binary files
- apply placeholders

### 4.5 Build File Tree Merger

The merger should:

- combine base files and feature files
- normalize paths
- detect duplicate file conflicts
- allow intentional overrides only when explicitly configured

### 4.6 Build Package.json Merger

Merge:

- dependencies
- dev dependencies
- scripts
- package metadata

Detect conflicting script names when values differ.

### 4.7 Build Env Generator

Generate `.env.example` from selected features.

Example variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"
AUTH_SECRET="replace-me"
```

### 4.8 Build README Generator

Generate setup instructions based on selected features.

Examples:

- install dependencies
- copy `.env.example` to `.env`
- run Docker Compose when selected
- run Prisma generate/migrate when selected
- run dev server

### 4.9 Build Output Adapters

Add:

- zip adapter for website
- filesystem adapter for future CLI

The filesystem adapter can be implemented now or stubbed behind tests, but the architecture should include it.

### 4.10 Add Generator Tests

Test:

- minimal project generation
- full MVP project generation
- dependency merging
- env generation
- README generation
- file conflict handling
- generated file tree snapshot

### Phase 4 Completion Criteria

Phase 4 is complete when:

- `generateProject(config)` returns a valid file tree.
- Zip adapter can create a zip from the file tree.
- Generated project includes expected files.
- Main generator behavior is tested.

## Phase 5: Template Implementation

Goal: Create the actual templates used by the generator.

### 5.1 Create Base Next.js Template

Include:

- `app/layout.tsx`
- `app/page.tsx`
- `next.config.ts`
- `tsconfig.json`
- `package.json`
- `.gitignore`
- basic metadata

No `src/` folder.

### 5.2 Create Tailwind Template

Include:

- Tailwind config
- PostCSS config
- global CSS
- app layout import

### 5.3 Create shadcn/ui Template

Include:

- `components.json`
- `lib/utils.ts`
- `components/ui/button.tsx`
- required dependencies

### 5.4 Create PostgreSQL Template

Include:

- database environment variable
- database setup notes
- optional local Docker connection string

### 5.5 Create Prisma Template

Include:

- `prisma/schema.prisma`
- database client file
- Prisma scripts
- Prisma dependencies
- README instructions

### 5.6 Create Auth.js Credentials Scaffold

Include:

- auth configuration file
- auth route handler
- credentials provider placeholder
- environment variable requirements
- README notes explaining real password/user logic must be implemented by the developer

### 5.7 Create Docker Compose Template

Include:

- `docker-compose.yml`
- PostgreSQL service
- development database credentials
- README instructions

### 5.8 Validate Template Combinations

Manually verify:

- minimal project
- shadcn project
- PostgreSQL + Prisma project
- PostgreSQL + Prisma + Auth.js project
- PostgreSQL + Prisma + Auth.js + Docker project

### Phase 5 Completion Criteria

Phase 5 is complete when:

- Templates produce coherent generated projects.
- Generated projects have no missing required files.
- Important combinations can be unzipped and inspected.

## Phase 6: Website MVP

Goal: Build the LaunchKit website interface and connect it to the generator.

### 6.1 Create Website Foundation

Set up:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- global layout
- theme tokens
- green accent color system

Colors should use CSS variables/tokens, not repeated hardcoded values.

### 6.2 Build Wizard Shell

Create a step-by-step flow.

Suggested steps:

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

### 6.3 Build Project Step

Include:

- project name input
- package manager selector
- project name validation

### 6.4 Build Framework Step

For MVP, show:

- Next.js
- TypeScript
- App Router
- no `src/` folder

These can be shown as fixed selected choices.

### 6.5 Build Styling And UI Step

Include:

- Tailwind CSS fixed on
- shadcn/ui optional

### 6.6 Build Database Step

Include:

- none
- PostgreSQL

### 6.7 Build ORM Step

Include:

- none
- Prisma

Disable invalid choices based on selected database.

### 6.8 Build Auth Step

Include:

- none
- Auth.js credentials scaffold

Show clear wording that this is a scaffold, not a complete production user system.

### 6.9 Build Extras Step

Include:

- Docker Compose option
- README included by default
- `.env.example` included by default

Docker should only be selectable when PostgreSQL is selected.

### 6.10 Build Preview Step

Show:

- selected stack summary
- generated dependencies
- generated scripts
- generated env variables
- generated file tree

Preview can call a lightweight preview endpoint or compute the preview from schema/feature metadata.

For MVP, avoid showing full file contents.

### 6.11 Build Generate API Route

Create:

```txt
POST /api/generate
```

Route responsibilities:

- parse request JSON
- validate config
- call generator
- create zip
- return zip download
- handle typed errors

### 6.12 Connect Download Flow

The UI should:

- send config to API
- show loading state
- receive zip response
- trigger browser download
- show success state
- show friendly errors

### 6.13 Add Website Polish

Add:

- responsive layout
- keyboard-accessible controls
- disabled states
- loading indicators
- clear validation messages
- compact developer-tool styling

### Phase 6 Completion Criteria

Phase 6 is complete when:

- User can complete wizard.
- User can preview generated project.
- User can download a zip.
- Invalid combinations are prevented or clearly rejected.
- Website looks consistent with the LaunchKit visual direction.

## Phase 7: Testing, Validation, And Hardening

Goal: Make LaunchKit reliable enough to generate usable projects.

### 7.1 Add Schema Test Coverage

Cover:

- defaults
- valid configs
- invalid combinations
- project name validation
- Docker rules

### 7.2 Add Generator Test Coverage

Cover:

- minimal generation
- full MVP generation
- package merging
- env generation
- README generation
- duplicate file handling
- template placeholder replacement

### 7.3 Add Snapshot Tests

Snapshot file trees for:

- minimal project
- shadcn project
- PostgreSQL + Prisma project
- PostgreSQL + Prisma + Auth.js project
- full MVP stack

### 7.4 Add Smoke Tests

For key generated outputs, verify:

```bash
pnpm install
pnpm typecheck
pnpm build
```

These may be slower, so they can be separated from fast unit tests.

### 7.5 Harden API Route

Add:

- request body size limit
- project name sanitization
- typed error responses
- zip size awareness
- no execution of generated code
- no dependency installation on server

### 7.6 Harden File Safety

Ensure:

- no path traversal
- generated paths are normalized
- files cannot escape project root
- duplicate files are handled predictably

### 7.7 Manual QA

Manually test:

- desktop wizard
- mobile wizard
- preview step
- zip download
- unzip and run generated app
- invalid selection behavior
- API error behavior

### Phase 7 Completion Criteria

Phase 7 is complete when:

- Tests pass.
- Important generated stacks install and build.
- Website flow works end to end.
- API has basic safety protections.
- Generated projects are usable.

## Phase 8: Launch Preparation

Goal: Prepare the website MVP for public use.

### 8.1 Improve Landing Context Without Replacing The Tool

The first screen should remain the product experience.

Add only necessary context:

- product name
- short value proposition
- wizard entry point
- maybe a compact generated-stack summary

Avoid making a marketing-only landing page.

### 8.2 Add Documentation

Add docs for:

- what LaunchKit generates
- supported stack options
- generated project setup
- known limitations
- roadmap

### 8.3 Add Deployment Setup

Prepare:

- environment config
- build command
- deployment target
- production API constraints

### 8.4 Add Analytics Or Basic Telemetry Later

Optional after MVP:

- generation counts
- selected stack combinations
- failed generation events

Avoid tracking unnecessary personal data.

### 8.5 Final MVP Review

Review:

- architecture boundaries
- generated output quality
- website UX
- error handling
- deployment readiness

### Phase 8 Completion Criteria

Phase 8 is complete when:

- Website can be deployed.
- MVP docs are clear.
- The main generation flow is stable.
- Known limitations are documented.

## Phase 9: Future CLI

Goal: Add CLI support using the same generator core.

This phase should happen after the website MVP works.

### 9.1 Create CLI Package

Create:

```txt
packages/cli
```

Package name:

```txt
create-launchkit
```

### 9.2 Add CLI Entry

Support:

```bash
npx create-launchkit@latest
```

and eventually:

```bash
npm create launchkit@latest
pnpm create launchkit
```

### 9.3 Add Prompts

Prompt for:

- project name
- package manager
- UI library
- database
- ORM
- auth
- Docker

Framework, language, router, and project structure can start as fixed choices.

### 9.4 Add Flags

Possible flags:

```bash
create-launchkit my-app --db postgres --orm prisma --auth authjs --ui shadcn --docker
```

### 9.5 Reuse Schema And Generator

The CLI must use:

- `packages/schema`
- `packages/generator`
- filesystem adapter

### 9.6 Add Directory Handling

Handle:

- existing target folder
- empty folder
- non-empty folder
- overwrite confirmation
- invalid names

### 9.7 Add Optional Install

Ask:

```txt
Install dependencies now?
```

If yes, run the selected package manager.

### 9.8 Print Next Steps

Example:

```txt
Next steps:
  cd my-app
  pnpm install
  pnpm dev
```

### Phase 9 Completion Criteria

Phase 9 is complete when:

- CLI generates the same project structure as the website.
- CLI can write to local folders.
- CLI uses the same schema and generator.
- CLI package can be published.

## Recommended Build Order

The practical build order should be:

```txt
1. Monorepo setup
2. Schema package
3. Generator package
4. Templates
5. Zip adapter
6. Website UI
7. API route
8. Preview
9. Testing and hardening
10. Deployment
11. CLI later
```

Do not start with the CLI.

Do not add many stack options before the generator is stable.

## MVP Success Criteria

The MVP is successful when a developer can:

1. Open the LaunchKit website.
2. Complete the step-by-step wizard.
3. Preview the generated project structure.
4. Download a zip file.
5. Unzip the generated project.
6. Run install.
7. Start the app locally.

Example:

```bash
cd my-app
pnpm install
pnpm dev
```

The generated project should feel intentional, clean, and ready for real development.
