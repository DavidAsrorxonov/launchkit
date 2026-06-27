# LaunchKit Project Overview

## Purpose

LaunchKit is a developer tool for generating ready-to-use project starters.

The first product surface will be a website where developers choose a stack, click a button, and download a generated project as a zip file. Later, LaunchKit should also support a CLI experience such as:

```bash
npx create-launchkit@latest
```

or:

```bash
npm create launchkit@latest
```

The long-term goal is that both the website and CLI produce the same kind of generated project from the same shared generator logic.

## Core Idea

LaunchKit should not be built as only a website that happens to generate files.

It should be built as a shared project-generation engine with multiple interfaces:

```txt
Website UI        CLI UI
   |                |
   v                v
Shared Generator Core
   |
   v
Templates + Feature Modules
   |
   v
Generated project
```

The website and CLI are only different ways to collect configuration and deliver output.

The generator core is the real product.

## TypeScript-First Direction

LaunchKit should be TypeScript-first.

That means:

- The website should be written in TypeScript.
- The shared generator package should be written in TypeScript.
- The future CLI should be written in TypeScript.
- The configuration schema should be strongly typed.
- Generated projects should default to TypeScript.

JavaScript output can be added later, but it should not be part of the first version.

## Recommended Monorepo Structure

LaunchKit should start as a monorepo so the website, generator, shared schema, templates, and future CLI can live together cleanly.

Recommended structure:

```txt
launchkit/
  apps/
    web/
      # Website for selecting options and downloading generated projects

  packages/
    generator/
      # Core project generation engine

    schema/
      # Shared config schema and types

    templates/
      # Base templates and feature templates

    shared/
      # Shared constants, helpers, and utility types

    cli/
      # Future CLI package: create-launchkit
```

The most important package is:

```txt
packages/generator
```

The website and CLI should both call this package.

## High-Level Architecture

LaunchKit should have four main layers.

### 1. User Interfaces

These are the entry points for users.

For the first version:

```txt
apps/web
```

Later:

```txt
packages/cli
```

The website collects user choices through a form.

The CLI will collect user choices through terminal prompts.

Neither should contain the core generation logic.

### 2. Shared Schema

The schema defines which project options exist and which combinations are valid.

Example options:

- Project name
- Framework
- Database
- ORM
- Auth provider
- UI library
- Styling system
- Package manager
- Optional tooling

The schema should be shared between the website, CLI, and generator.

Example:

```ts
const LaunchKitConfigSchema = z.object({
  name: z.string().min(1),
  framework: z.enum(["next"]),
  language: z.enum(["typescript"]),
  styling: z.enum(["tailwind"]),
  ui: z.enum(["none", "shadcn"]),
  database: z.enum(["none", "postgres"]),
  orm: z.enum(["none", "prisma", "drizzle"]),
  auth: z.enum(["none", "authjs", "clerk"]),
  packageManager: z.enum(["npm", "pnpm", "yarn", "bun"]),
});
```

Using a shared schema prevents the website, CLI, and generator from disagreeing about what is valid.

### 3. Generator Core

The generator core receives a validated config and creates a project.

Example:

```ts
await generateProject({
  name: "my-app",
  framework: "next",
  language: "typescript",
  styling: "tailwind",
  ui: "shadcn",
  database: "postgres",
  orm: "prisma",
  auth: "authjs",
  packageManager: "pnpm",
});
```

The generator should be responsible for:

- Validating the selected stack
- Resolving required features
- Detecting conflicts
- Copying base template files
- Applying feature templates
- Creating config files
- Creating environment examples
- Creating database/auth files
- Updating `package.json`
- Adding scripts
- Adding dependencies and dev dependencies
- Producing a final project file tree

The generator should not care whether the output is used by the website or CLI.

### 4. Output Adapters

The generator should produce a project representation that can be written in different ways.

For the website:

```txt
Generated file tree -> zip file -> browser download
```

For the CLI:

```txt
Generated file tree -> local folder on disk
```

This means zip generation and filesystem writing should be output adapters, not the generator itself.

## Website Flow

The website MVP should work like this:

```txt
User opens LaunchKit
  -> chooses project options
  -> clicks Generate
  -> frontend sends config to API route
  -> API validates config
  -> API calls generator core
  -> generator builds project
  -> API returns zip file
  -> user downloads and unzips project
```

Example API route:

```txt
POST /api/generate
```

Example request:

```json
{
  "name": "my-app",
  "framework": "next",
  "language": "typescript",
  "styling": "tailwind",
  "ui": "shadcn",
  "database": "postgres",
  "orm": "prisma",
  "auth": "authjs",
  "packageManager": "pnpm"
}
```

Example response:

```txt
my-app.zip
```

## Future CLI Flow

The CLI should use the same schema and generator.

Example flow:

```txt
npx create-launchkit@latest
  -> ask project name
  -> ask framework
  -> ask database
  -> ask ORM
  -> ask auth provider
  -> ask UI library
  -> validate choices
  -> call generator core
  -> write files to local folder
  -> print next steps
```

Example output:

```txt
Creating my-app...

Project generated successfully.

Next steps:
  cd my-app
  pnpm install
  pnpm dev
```

The CLI should mostly handle:

- Terminal prompts
- Command flags
- Local folder output
- Optional dependency installation
- Next-step instructions

It should not duplicate the generator logic from the website.

## Generator Pipeline

A good generator pipeline should look like this:

```txt
1. Receive config
2. Validate config with shared schema
3. Resolve selected features
4. Check required dependencies between features
5. Check conflicts between features
6. Load base template
7. Apply feature templates
8. Merge package.json dependencies, scripts, and metadata
9. Generate config files
10. Generate env files
11. Format or normalize output
12. Return generated file tree
```

The output can then be passed to a zip adapter or filesystem adapter.

## Feature Module System

Each selectable option should eventually become a feature module.

For example:

```txt
features/
  framework/
    next/

  styling/
    tailwind/

  ui/
    shadcn/

  database/
    postgres/
    sqlite/

  orm/
    prisma/
    drizzle/

  auth/
    authjs/
    clerk/
```

Each feature module should describe what it contributes.

Example:

```ts
export const prismaFeature = {
  id: "prisma",
  label: "Prisma",
  requires: ["database"],
  conflicts: [],
  dependencies: ["@prisma/client"],
  devDependencies: ["prisma"],
  scripts: {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
  },
  env: ["DATABASE_URL"],
  files: ["prisma/schema.prisma", "src/lib/db.ts"],
};
```

This keeps the generator modular.

Adding a new option later should mean adding or updating a feature module, not rewriting the whole generator.

## Compatibility Rules

LaunchKit needs compatibility rules because not all stack combinations make sense.

Examples:

- Prisma requires a database.
- Drizzle requires a database.
- PostgreSQL should generate a `DATABASE_URL`.
- Auth.js may require auth routes, secrets, and provider environment variables.
- shadcn/ui requires Tailwind.
- Some auth providers may require a specific framework.
- Some features may not work with all routers or runtimes.

These rules should live near the schema or feature definitions, not only in the UI.

The website can use the rules to disable invalid options.

The generator must also enforce the rules because the API and CLI cannot trust UI state alone.

## Template Strategy

LaunchKit should separate base templates from feature templates.

Base template:

```txt
templates/base/next-app/
```

Feature templates:

```txt
templates/features/prisma/
templates/features/authjs/
templates/features/shadcn/
```

The base template creates the minimum working app.

Feature templates add files and modify config for selected options.

This avoids creating a separate full template for every possible combination.

Avoid this:

```txt
next-prisma-authjs-shadcn-template/
next-prisma-clerk-shadcn-template/
next-drizzle-authjs-shadcn-template/
next-drizzle-clerk-shadcn-template/
```

That approach becomes difficult to maintain as options increase.

Prefer this:

```txt
base template + selected feature modules
```

## Package.json Merging

Feature modules should be able to contribute to `package.json`.

For example:

```ts
{
  dependencies: {
    "@prisma/client": "latest"
  },
  devDependencies: {
    "prisma": "latest"
  },
  scripts: {
    "db:generate": "prisma generate"
  }
}
```

The generator should merge all selected feature contributions into one final `package.json`.

It should also prevent duplicate or conflicting scripts where possible.

## Environment Files

Generated projects should include safe example environment files.

For example:

```txt
.env.example
```

Possible values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/my_app"
AUTH_SECRET="replace-me"
```

The generator should usually avoid generating real secrets.

It can either:

- Put placeholders in `.env.example`
- Optionally generate local development secrets later

For the first version, `.env.example` is enough.

## MVP Scope

The MVP should stay small.

Recommended first version:

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- UI: none or shadcn/ui
- Database: none or PostgreSQL
- ORM: none or Prisma
- Auth: none or Auth.js
- Output: downloadable zip

This is enough to prove the architecture without drowning in combinations.

Avoid starting with too many frameworks, databases, ORMs, and auth systems.

The hard part is not showing many options. The hard part is generating correct, working projects.

## Suggested Tech Stack

LaunchKit itself:

- Monorepo: pnpm workspaces or Turborepo
- Website: Next.js with App Router
- Language: TypeScript
- Validation: Zod
- Styling: Tailwind CSS
- UI: shadcn/ui or a small custom component system
- Zip generation: server-side zip library
- Generator: custom TypeScript package

Generated projects:

- Next.js
- TypeScript
- Tailwind CSS
- Optional shadcn/ui
- Optional PostgreSQL
- Optional Prisma
- Optional Auth.js

## Important Boundaries

The website should not directly contain project-generation logic.

Avoid:

```txt
apps/web/app/api/generate/route.ts
  # huge file with all generation logic
```

Prefer:

```txt
apps/web/app/api/generate/route.ts
  -> validates request
  -> calls packages/generator
  -> returns zip
```

The CLI should follow the same rule.

Avoid:

```txt
packages/cli/src/index.ts
  # huge file with duplicated generation logic
```

Prefer:

```txt
packages/cli/src/index.ts
  -> collects terminal answers
  -> calls packages/generator
  -> writes generated files
```

## Development Phases

### Phase 1: Architecture Foundation

- Create monorepo structure
- Create shared config schema
- Create generator package
- Create first base template
- Generate a minimal Next.js TypeScript project

### Phase 2: Website MVP

- Build LaunchKit web UI
- Add stack selection form
- Add API route for generation
- Return generated project as zip
- Test by downloading and running the generated app

### Phase 3: Feature Modules

- Add Tailwind support
- Add shadcn/ui support
- Add PostgreSQL support
- Add Prisma support
- Add Auth.js support
- Add compatibility rules

### Phase 4: Hardening

- Add tests for generator output
- Add snapshot tests for generated file trees
- Add validation for invalid combinations
- Add generated project smoke tests
- Improve error messages

### Phase 5: CLI

- Add `create-launchkit` CLI package
- Reuse shared schema
- Reuse generator core
- Add prompts and flags
- Write project to local folder
- Print setup instructions

## Main Engineering Risks

### Too Many Combinations Too Early

Supporting many frameworks, databases, auth providers, and UI libraries from the start will slow development.

Start narrow and make the architecture extensible.

### Duplicated Website and CLI Logic

If the website generator and CLI generator are built separately, they will drift.

The shared generator package prevents this.

### Template Maintenance

Full templates for every combination will become hard to maintain.

Use base templates plus feature modules.

### Broken Generated Projects

The generated output must actually run.

LaunchKit needs tests that verify generated projects can install, typecheck, and start.

## Success Criteria For The First Version

The first successful version should allow a developer to:

1. Visit the LaunchKit website.
2. Choose a small set of stack options.
3. Click a generate button.
4. Download a zip file.
5. Unzip the project.
6. Install dependencies.
7. Run the app locally.

Example:

```bash
cd my-app
pnpm install
pnpm dev
```

The generated project should feel like a clean starter, not a rough file dump.

## Final Architecture Principle

LaunchKit should be designed as:

```txt
A reusable TypeScript project generator
with a website interface first
and a CLI interface later.
```

The website is the first product experience.

The generator core is the foundation.

The CLI should eventually become another interface over the same foundation.
