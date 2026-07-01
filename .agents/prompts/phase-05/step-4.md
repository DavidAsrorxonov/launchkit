# Phase 5 Step 4: Create shadcn/ui Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 3 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 5.
Do not add PostgreSQL, Prisma, Auth.js, or Docker files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the optional shadcn/ui template layer for generated LaunchKit projects.

This step should make generated projects support:

```txt
ui: "shadcn"
```

The shadcn/ui feature should build on top of the existing Tailwind setup from Phase 5 Step 3.

## Scope

Add shadcn/ui feature template files under:

```txt
packages/templates/features/shadcn/
```

Recommended structure:

```txt
packages/templates/features/shadcn/
  components.json
  components/
    ui/
      button.tsx
  lib/
    utils.ts
  app/
    globals.css
```

If the existing generator/template architecture handles file overrides differently, follow the existing pattern while preserving the generated project output.

## Requirements

### 1. shadcn/ui Required Files

Generated projects with `ui: "shadcn"` should include:

```txt
components.json
lib/utils.ts
components/ui/button.tsx
```

The generated project should still use:

```txt
app/
components/
lib/
```

Do not create a `src/` directory.

### 2. components.json

Add a `components.json` template compatible with a no-`src` Next.js App Router project.

It should use aliases similar to:

```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Match the exact format expected by the currently supported shadcn/ui version and the repo's conventions.

### 3. lib/utils.ts

Add the standard `cn` helper:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4. Button Component

Add a minimal shadcn/ui-compatible button component at:

```txt
components/ui/button.tsx
```

It should:

- Use React and TypeScript.
- Use `class-variance-authority`.
- Use the `cn` helper from `@/lib/utils`.
- Export `Button`.
- Export `buttonVariants` if using the standard shadcn/ui pattern.
- Avoid optional dependencies not needed for the button.

### 5. CSS Tokens

Update or add the shadcn-specific global CSS template so generated projects get shadcn-compatible theme tokens.

Use CSS variables and Tailwind/shadcn token conventions.

Do not repeatedly hardcode green utility classes in generated components.

If the project uses Tailwind v4, use the correct v4-compatible shadcn token setup.

If the project uses Tailwind v3, use the correct v3-compatible shadcn token setup.

Match the Tailwind version selected in Phase 5 Step 3.

### 6. Package Metadata Contributions

Update the shadcn feature definition so generated projects with `ui: "shadcn"` receive required dependencies.

Expected dependencies may include:

```txt
class-variance-authority
clsx
tailwind-merge
lucide-react
```

Only include packages actually required by the generated shadcn files.

Do not add Radix packages unless the generated component needs them.

### 7. Compatibility

The schema should already have this rule:

```txt
shadcn/ui requires Tailwind CSS.
```

Do not duplicate compatibility logic unless the existing implementation is missing it.

If compatibility logic is missing despite earlier phases, add the smallest fix in `@launchkit/schema` and document it in `progress-tracker.md`.

### 8. No Backend Features

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

Add or update narrow tests for shadcn template behavior.

Recommended tests:

- shadcn feature template directory exists.
- `components.json` exists.
- `lib/utils.ts` exists.
- `components/ui/button.tsx` exists.
- shadcn feature contributes required dependencies.
- shadcn feature does not add backend files.
- shadcn feature does not introduce a `src/` directory.
- generated project output includes shadcn files only when `ui: "shadcn"` is selected.
- generated project output does not include shadcn files when `ui: "none"` is selected.

If existing generator tests already verify selected feature files, update those tests narrowly.

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
Phase 5 Step 4 completed: Create shadcn/ui template

Changes made:
- Created or verified shadcn/ui feature template files.
- Added or verified components.json for no-src App Router projects.
- Added or verified lib/utils.ts.
- Added or verified components/ui/button.tsx.
- Added or verified shadcn-compatible CSS tokens.
- Added or verified shadcn dependency contributions.
- Confirmed backend features remain separate.

Files changed:
- packages/templates/features/shadcn/components.json
- packages/templates/features/shadcn/lib/utils.ts
- packages/templates/features/shadcn/components/ui/button.tsx
- packages/templates/features/shadcn/app/globals.css
- packages/templates/src/index.ts, if changed
- packages/generator/src/..., if feature metadata was updated
- packages/schema/src/..., only if compatibility was missing
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 5: Create PostgreSQL template
```

## Completion Criteria

This step is complete when:

- shadcn template files exist.
- Generated projects with `ui: "shadcn"` include `components.json`.
- Generated projects with `ui: "shadcn"` include `lib/utils.ts`.
- Generated projects with `ui: "shadcn"` include `components/ui/button.tsx`.
- Generated projects with `ui: "none"` do not include shadcn files.
- shadcn dependency contributions are correct.
- shadcn CSS tokens are present and compatible with the Tailwind version in use.
- No backend feature files are added.
- No `src/` folder is introduced.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
