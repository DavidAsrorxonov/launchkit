# Phase 5 Step 3: Create Tailwind Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 2 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 4.
Do not add shadcn/ui files.
Do not add PostgreSQL, Prisma, Auth.js, or Docker files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the Tailwind CSS template layer for generated LaunchKit projects.

LaunchKit MVP always uses Tailwind CSS for generated projects, so this step should make sure the generated Next.js app has a complete, working Tailwind setup while keeping shadcn/ui-specific token work for the next step.

## Scope

Add Tailwind feature template files under:

```txt
packages/templates/features/tailwind/
```

Recommended structure:

```txt
packages/templates/features/tailwind/
  app/
    globals.css
  postcss.config.mjs
```

If the base Next.js template from Step 2 already contains `app/globals.css` and `postcss.config.mjs`, update the architecture in the smallest sensible way:

- Keep common non-Tailwind files in `packages/templates/base/next/`.
- Move or override Tailwind-specific CSS/config through `packages/templates/features/tailwind/` if the generator supports feature template files.
- If the current generator cannot yet compose feature templates, keep the files in the base template and add tests/metadata documenting that Tailwind is required for the MVP.

Follow the existing Phase 4 generator/template model if it already defines how feature template files are referenced.

## Requirements

### 1. Tailwind CSS Setup

Ensure generated projects include a working Tailwind CSS global stylesheet.

The generated `app/globals.css` should include Tailwind imports/directives appropriate for the Tailwind version used by the repo.

For Tailwind v4 style:

```css
@import "tailwindcss";
```

For Tailwind v3 style:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Use the style that matches the LaunchKit website setup and current dependency versions.

### 2. PostCSS Config

Ensure generated projects include:

```txt
postcss.config.mjs
```

Use the correct PostCSS plugin config for the Tailwind version in use.

For Tailwind v4, this may use:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

For Tailwind v3, this may use:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

Do not guess blindly. Match the dependency set used in the generated project template.

### 3. Package Metadata Contributions

If Phase 4 created feature definitions for package contributions, update the Tailwind feature definition so generated projects receive the correct Tailwind dependencies.

Required dependency/dev dependency set depends on Tailwind version:

Tailwind v4 example:

```json
{
  "devDependencies": {
    "tailwindcss": "...",
    "@tailwindcss/postcss": "..."
  }
}
```

Tailwind v3 example:

```json
{
  "devDependencies": {
    "tailwindcss": "...",
    "postcss": "...",
    "autoprefixer": "..."
  }
}
```

Also ensure the generated project has any required Next.js/TypeScript dependencies from the base template.

### 4. Keep shadcn/ui Separate

Do not add:

```txt
components.json
lib/utils.ts
components/ui/button.tsx
CSS variable theme tokens for shadcn/ui
Radix dependencies
class-variance-authority
clsx
tailwind-merge
lucide-react
```

Those belong to Phase 5 Step 4.

### 5. Keep Optional Backend Features Separate

Do not add:

```txt
DATABASE_URL
prisma/schema.prisma
lib/db.ts
auth route handlers
docker-compose.yml
```

Those belong to later Phase 5 steps.

## Tests

Use Vitest only.

Add or update narrow tests for Tailwind template behavior.

Recommended tests:

- Tailwind feature template directory exists.
- Tailwind global CSS exists.
- PostCSS config exists.
- Tailwind feature contributes required package dependencies.
- shadcn/ui files are not added by the Tailwind-only feature.
- No `src/` directory is introduced.

If the generator can already produce a project, add/update a test that verifies a default generated project includes Tailwind setup.

Do not add expensive smoke tests unless the repo already has a smoke-test harness.

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
```

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 5 Step 3 completed: Create Tailwind template

Changes made:
- Created or verified Tailwind feature template files.
- Added or verified generated project Tailwind CSS setup.
- Added or verified generated project PostCSS config.
- Added or verified Tailwind dependency contributions.
- Confirmed shadcn/ui remains separate.

Files changed:
- packages/templates/features/tailwind/app/globals.css
- packages/templates/features/tailwind/postcss.config.mjs
- packages/templates/src/index.ts, if changed
- packages/generator/src/..., if feature metadata was updated
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 4: Create shadcn/ui template
```

## Completion Criteria

This step is complete when:

- Tailwind template files exist or Tailwind setup is clearly represented according to the repo architecture.
- Generated projects include Tailwind CSS setup.
- Generated projects include PostCSS config.
- Tailwind dependencies are contributed correctly.
- shadcn/ui files are not added.
- No backend feature files are added.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
