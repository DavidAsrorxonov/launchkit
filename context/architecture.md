# BaseForge Architecture

## Architecture Goal

BaseForge should be built as a reusable TypeScript project-generation system with two product interfaces:

```txt
1. Website interface
2. CLI interface
```

The website is the first interface.

The CLI will be added later.

Both interfaces must use the same generator core so the generated output stays consistent.

## Core Principle

The architecture should separate these responsibilities:

```txt
User interface
Configuration validation
Generation planning
Template application
Feature composition
Output writing
```

The website should not know how to manually generate a project.

The CLI should not know how to manually generate a project.

Both should pass a validated config into the generator package.

## High-Level System

```txt
apps/web
  |
  | calls
  v
packages/generator
  |
  | uses
  v
packages/schema
  |
  | uses
  v
packages/templates
  |
  | produces
  v
Generated file tree
  |
  | written by
  v
Zip adapter or filesystem adapter
```

Future CLI:

```txt
packages/cli
  |
  | calls
  v
packages/generator
```

## Recommended Monorepo Layout

```txt
baseforge/
  apps/
    web/
      app/
      components/
      lib/
      public/
      package.json

  packages/
    schema/
      src/
        config.ts
        options.ts
        compatibility.ts
        index.ts
      package.json

    generator/
      src/
        generate-project.ts
        plan-generation.ts
        apply-template.ts
        merge-package-json.ts
        file-tree.ts
        adapters/
          zip.ts
          filesystem.ts
        features/
          registry.ts
        index.ts
      package.json

    templates/
      base/
        next/
      features/
        tailwind/
        shadcn/
        postgres/
        prisma/
        authjs/
      package.json

    shared/
      src/
        strings.ts
        paths.ts
        errors.ts
        index.ts
      package.json

    cli/
      src/
        index.ts
        prompts.ts
        flags.ts
      package.json
```

The `cli` package can be created later, but the architecture should leave room for it from the beginning.

## Package Responsibilities

### `apps/web`

The website package is responsible for:

- Rendering the BaseForge UI
- Showing available stack choices
- Preventing obviously invalid selections in the UI
- Submitting generation requests
- Receiving zip files
- Triggering browser downloads

The website package should not:

- Own generation rules
- Manually create generated project files
- Duplicate compatibility rules
- Duplicate dependency lists

The web app should import shared options and types from `packages/schema`.

It should call `packages/generator` from an API route or server action.

### `packages/schema`

The schema package defines the contract for a BaseForge project configuration.

It is responsible for:

- Config shape
- TypeScript types
- Zod validation
- Option enums
- Compatibility rules
- Default values
- Human-readable option metadata

Example responsibilities:

```ts
export const BaseForgeConfigSchema = z.object({
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

export type BaseForgeConfig = z.infer<typeof BaseForgeConfigSchema>;
```

This package should be used by:

- Website
- Generator
- Future CLI
- Tests

### `packages/generator`

The generator package is the core of BaseForge.

It is responsible for turning a config into a generated project.

Main responsibilities:

- Accept validated config
- Validate config again at the boundary
- Resolve selected features
- Build a generation plan
- Apply base templates
- Apply feature templates
- Merge `package.json`
- Generate `.env.example`
- Generate framework config files
- Normalize paths
- Return a generated file tree
- Write output through adapters

The generator should expose a small public API.

Example:

```ts
export async function generateProject(
  config: BaseForgeConfig,
): Promise<GeneratedProject>;
```

The returned object should not be tied to zip files or the local filesystem.

Example:

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

Output-specific behavior should live in adapters.

### `packages/templates`

The templates package contains raw project templates and feature files.

It is responsible for:

- Base app templates
- Feature-specific files
- Template placeholders
- Template assets
- Starter source files

Example:

```txt
packages/templates/
  base/
    next/
      package.json
      tsconfig.json
      next.config.ts
      src/app/page.tsx

  features/
    prisma/
      prisma/schema.prisma
      src/lib/db.ts

    authjs/
      src/auth.ts
      src/app/api/auth/[...nextauth]/route.ts

    shadcn/
      components.json
      src/components/ui/button.tsx
      src/lib/utils.ts
```

Templates should avoid business logic when possible.

Feature metadata should live in the generator package or schema package.

### `packages/shared`

The shared package contains small utilities used across packages.

Examples:

- Slug formatting
- Path helpers
- Error classes
- Naming helpers
- Constants

This package should stay small.

If a helper is only used by the generator, keep it in `packages/generator`.

### `packages/cli`

The CLI package will be added later.

It should be responsible for:

- Parsing command flags
- Asking terminal prompts
- Validating input using `packages/schema`
- Calling `packages/generator`
- Writing the generated project to disk
- Printing next steps
- Optionally installing dependencies

The CLI should not duplicate website generation logic.

## Runtime Data Flow

### Website Data Flow

```txt
User selects options
  |
  v
React form state
  |
  v
Client-side validation
  |
  v
POST /api/generate
  |
  v
Server-side schema validation
  |
  v
generateProject(config)
  |
  v
GeneratedProject file tree
  |
  v
writeZip(project)
  |
  v
HTTP response: application/zip
  |
  v
Browser download
```

### Future CLI Data Flow

```txt
User runs npx @baseforge/create@latest my-app
  |
  v
Flags and prompts
  |
  v
Schema validation
  |
  v
generateProject(config)
  |
  v
GeneratedProject file tree
  |
  v
writeToDirectory(project, targetDir)
  |
  v
Local project folder
```

## Generator Internal Flow

The generator should be implemented as a pipeline.

```txt
generateProject(config)
  |
  v
validateConfig(config)
  |
  v
resolveFeatures(config)
  |
  v
createGenerationPlan(config, features)
  |
  v
loadBaseTemplate(plan)
  |
  v
applyFeatureTemplates(plan)
  |
  v
mergeGeneratedFiles()
  |
  v
mergePackageJson()
  |
  v
generateEnvExample()
  |
  v
normalizeFileTree()
  |
  v
return GeneratedProject
```

Each step should have a clear input and output.

This makes the generator easier to test.

## Generation Plan

The generator should create a generation plan before writing files.

Example:

```ts
type GenerationPlan = {
  config: BaseForgeConfig;
  baseTemplate: BaseTemplateId;
  features: ResolvedFeature[];
  packageJson: PackageJsonPatch;
  env: EnvVarDefinition[];
  files: TemplateFileReference[];
};
```

The plan answers:

- Which base template should be used?
- Which features should be included?
- Which files should be copied?
- Which files should be generated?
- Which dependencies should be added?
- Which scripts should be added?
- Which environment variables should be included?

This separates decision-making from file writing.

## Feature Registry

The generator should use a feature registry.

Example:

```ts
export const featureRegistry = {
  tailwind: tailwindFeature,
  shadcn: shadcnFeature,
  postgres: postgresFeature,
  prisma: prismaFeature,
  authjs: authjsFeature,
};
```

Each feature should describe its contributions.

Example:

```ts
type FeatureDefinition = {
  id: string;
  label: string;
  requires?: string[];
  conflicts?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  env?: EnvVarDefinition[];
  files?: TemplateFileReference[];
  apply?: (context: GeneratorContext) => Promise<void>;
};
```

Most features should be declarative.

Use an `apply` function only when a feature needs custom logic.

## Template Application

Templates should support placeholders.

Example:

```txt
{{projectName}}
{{packageName}}
{{databaseUrl}}
```

The generator should replace placeholders using a controlled context.

Example:

```ts
type TemplateContext = {
  projectName: string;
  packageName: string;
  framework: string;
  database: string;
  orm: string;
  auth: string;
};
```

Path names may also need placeholder replacement.

Example:

```txt
{{projectName}}/src/app/page.tsx
```

Template processing should be simple and predictable.

Avoid complex template logic inside files early in the project.

## File Tree Model

The generator should use an in-memory file tree before writing output.

Example:

```ts
type FileTree = Map<string, GeneratedFile>;
```

Benefits:

- Easier to test
- Easier to zip
- Easier to write to disk later
- Easier to detect duplicate files
- Easier to handle conflicts

File paths should always use POSIX-style `/` separators internally.

The filesystem adapter can translate paths if needed.

## Conflict Handling

The generator needs clear conflict behavior.

Examples:

- Two features try to write the same file.
- Two features define the same script differently.
- A feature requires another feature that was not selected.
- A selected stack combination is unsupported.

Recommended behavior:

- Throw a typed generator error.
- Include a human-readable message.
- Include the related feature IDs.
- Let the website show the error cleanly.
- Let the CLI print the error cleanly.

Example:

```ts
throw new FeatureConflictError({
  message: "shadcn/ui requires Tailwind CSS.",
  features: ["shadcn", "tailwind"],
});
```

## Output Adapters

The generator should not directly decide how output is delivered.

Use adapters.

### Zip Adapter

Used by the website.

```ts
const project = await generateProject(config);
const zip = await createProjectZip(project);
```

The website returns the zip as:

```txt
Content-Type: application/zip
Content-Disposition: attachment; filename="my-app.zip"
```

### Filesystem Adapter

Used by the future CLI.

```ts
const project = await generateProject(config);
await writeProjectToDirectory(project, "./my-app");
```

The filesystem adapter should:

- Create directories
- Write files
- Avoid overwriting existing folders unless explicitly allowed
- Preserve binary files
- Use safe path joining

## Validation Strategy

Validation should happen in multiple places.

### Website Client

Used for immediate feedback.

Examples:

- Disable invalid choices
- Show missing required selections
- Prevent empty project names

### Website Server

Required for security and correctness.

The API route must validate incoming JSON before calling the generator.

### Generator Boundary

The generator should validate config again.

This makes the generator safe to use from:

- Website
- CLI
- Tests
- Future APIs

## Error Types

Use typed errors instead of generic thrown strings.

Recommended error types:

```txt
BaseForgeError
ValidationError
UnsupportedCombinationError
FeatureConflictError
TemplateNotFoundError
FileConflictError
OutputAdapterError
```

This allows the website and CLI to display better messages.

## Testing Architecture

Testing should focus most heavily on the generator.

Recommended test layers:

### Schema Tests

- Valid configs pass.
- Invalid configs fail.
- Unsupported combinations are rejected.

### Generator Unit Tests

- Feature resolution works.
- Package dependencies are merged correctly.
- Environment variables are generated correctly.
- Duplicate file conflicts are caught.

### Snapshot Tests

Generate a project and snapshot the file list.

Example:

```txt
next + tailwind
next + tailwind + prisma
next + tailwind + prisma + authjs
```

### Smoke Tests

For important combinations:

```bash
npm install
npm typecheck
npm build
```

These tests prove the generated project actually works.

## Website API Architecture

The website should expose a generation endpoint.

Example:

```txt
POST /api/generate
```

The route should:

1. Parse JSON body.
2. Validate with `BaseForgeConfigSchema`.
3. Call `generateProject`.
4. Convert generated project to zip.
5. Return zip response.

The route should not:

- Manually create files
- Manually merge dependencies
- Hardcode template content

## Security Considerations

Project generation accepts user input, so the system must treat it carefully.

Important rules:

- Sanitize project names.
- Prevent path traversal.
- Never allow template output outside the generated project root.
- Do not execute generated project code on the server.
- Do not install dependencies during website generation.
- Limit zip size.
- Limit request body size.
- Rate-limit generation endpoint before public launch.

For the website MVP, generation should create files only and return a zip.

It should not run arbitrary package manager commands.

## Generated Project Structure

A generated Next.js project may look like:

```txt
my-app/
  src/
    app/
      page.tsx
      layout.tsx
    lib/
      utils.ts
      db.ts
    components/
      ui/
        button.tsx
  prisma/
    schema.prisma
  public/
  .env.example
  .gitignore
  components.json
  next.config.ts
  package.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
```

The exact structure depends on selected features.

## Initial MVP Architecture

The first implementation should support a narrow set of options.

Recommended MVP:

```txt
Framework: Next.js
Language: TypeScript
Styling: Tailwind CSS
UI: none or shadcn/ui
Database: none or PostgreSQL
ORM: none or Prisma
Auth: none or Auth.js
Output: zip download
```

This gives enough complexity to prove the architecture without creating too many combinations.

## Future CLI Architecture

The future CLI package should be thin.

Example:

```txt
packages/cli/src/index.ts
  -> parse flags
  -> ask prompts
  -> validate config
  -> call generateProject
  -> writeProjectToDirectory
  -> print next steps
```

CLI-specific concerns:

- Prompt library
- Flags
- Target directory
- Existing directory handling
- Package manager detection
- Optional install command

All actual generation should remain in `packages/generator`.

### CLI Package Strategy

The future CLI should live at:

```txt
packages/cli
```

This fits the root npm workspace pattern:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

The public package is named:

```txt
@baseforge/create
```

The primary stable invocation is:

```bash
npx @baseforge/create@latest my-app
```

The original unscoped `create-launchkit` package name was unavailable on npm.
Document the verified scoped `npx` command unless another create/init form has
been explicitly tested.

The CLI binary is named:

```txt
create-baseforge
```

The package manifest should point the binary at compiled output:

```json
{
  "bin": {
    "create-baseforge": "./dist/index.js"
  }
}
```

The CLI should be an ESM TypeScript package with source in `src/` and compiled output in `dist/`.

Recommended implementation choices:

- prompt library: `@inquirer/prompts`
- argument parsing: `node:util` `parseArgs`
- tests: Vitest

Use an external argument parser later only if the flag surface outgrows the standard library.

Filesystem writes must stay inside the selected target directory, reject absolute paths and `..` segments, reject empty path segments, and avoid overwriting unrelated user files without confirmation.

Dependency installation must be optional. Generate files first, then ask whether to run the selected package manager's install command. If the user declines, print next steps instead.

## Dependency Direction

The dependency graph should point inward toward shared packages.

Recommended:

```txt
apps/web -> packages/schema
apps/web -> packages/generator

packages/cli -> packages/schema
packages/cli -> packages/generator

packages/generator -> packages/schema
packages/generator -> packages/templates
packages/generator -> packages/shared
```

Avoid:

```txt
packages/generator -> apps/web
packages/schema -> apps/web
packages/templates -> apps/web
packages/shared -> apps/web
```

Core packages should not depend on product interfaces.

## Versioning Strategy

In the early project, all packages can move together in one repo.

Later, package versions matter because the CLI may be published to npm.

Current package namespace split:

```txt
@baseforge/schema
@baseforge/generator
@baseforge/templates
@baseforge/create
```

The CLI package published to npm should depend on the same generator package used by the website.

## Deployment Architecture

The website can be deployed as a Next.js app.

Important deployment requirements:

- Server-side API route support
- Enough memory for zip creation
- Request duration long enough for generation
- No dependency installation during generation
- Temporary file cleanup if temporary files are used

If generation becomes heavy, it can later move to:

- Background jobs
- Queue workers
- Object storage for generated zips

For the MVP, synchronous zip generation from an API route is acceptable.

## Final Architecture Summary

BaseForge should be structured as:

```txt
apps/web
  Website interface

packages/schema
  Shared config contract

packages/generator
  Core project generation engine

packages/templates
  Base and feature templates

packages/shared
  Small shared utilities

packages/cli
  Future CLI interface
```

The most important rule:

```txt
Website and CLI must both call the same generator core.
```

That keeps BaseForge maintainable as the number of supported stacks grows.
