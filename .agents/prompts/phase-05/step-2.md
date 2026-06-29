# Phase 5 Step 2: Create Base Next.js Template

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 5 Step 1 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 5 Step 3.
Do not add Tailwind-specific template files yet unless they are required for the base Next.js app to compile with the existing MVP decision.
Do not add shadcn/ui files.
Do not add PostgreSQL, Prisma, Auth.js, or Docker files.
Do not add website UI.
Do not add CLI functionality.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the base Next.js template files for generated projects.

This step should add the minimum real project files needed for a generated Next.js App Router project using:

```txt
Next.js
TypeScript
App Router
No src/ folder
npm/pnpm-compatible package metadata
```

Generated projects must use this structure:

```txt
app/
components/
lib/
```

Do not create a `src/` directory.

## Scope

Add base template files under:

```txt
packages/templates/base/next/
```

Recommended structure:

```txt
packages/templates/base/next/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    .gitkeep
  lib/
    .gitkeep
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  .gitignore
  README.md
```

If the existing generator/template loader expects a different template file layout, follow the existing implementation pattern while preserving the generated project structure above.

## Requirements

### 1. Base App Files

Create:

```txt
app/layout.tsx
app/page.tsx
app/globals.css
```

The base app should be minimal, clean, and developer-tool oriented.

`app/layout.tsx` should:

- Export metadata.
- Render the root HTML/body.
- Import `./globals.css`.
- Use TypeScript.

`app/page.tsx` should:

- Render a simple starting page for the generated project.
- Avoid marketing-heavy content.
- Avoid dependencies on shadcn/ui or optional features.
- Compile without database, auth, or Docker selections.

`app/globals.css` should:

- Include only baseline global styles needed at this step.
- Avoid shadcn/ui token setup until the shadcn step.
- Avoid complex visual design.

### 2. Project Config Files

Create:

```txt
package.json
tsconfig.json
next.config.ts
postcss.config.mjs
.gitignore
README.md
```

The generated `package.json` template should include:

- Project name placeholder.
- Next.js scripts.
- Required dependencies for a basic Next.js TypeScript app.
- Required dev dependencies for TypeScript and related types.

Recommended scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "typecheck": "tsc --noEmit"
}
```

Use placeholders already supported by the Phase 4 template loader, such as:

```txt
{{projectName}}
{{packageName}}
```

Do not introduce new placeholder syntax unless the template loader already supports it.

### 3. No Optional Features

Do not add files for:

```txt
shadcn/ui
PostgreSQL
Prisma
Auth.js credentials
Docker Compose
```

Those belong to later Phase 5 steps.

### 4. Template Package Export

Update `packages/templates/src/index.ts` only if useful to expose base template metadata or a simple readiness export.

Keep it minimal.

Possible export:

```ts
export const baseNextTemplateId = "next";
```

Do not implement a full template loader here unless the existing architecture clearly expects it in `@launchkit/templates`.

### 5. Generator Integration

If Phase 4 already created a template loader interface but does not yet load from `packages/templates`, keep this step limited to template files.

Only update `@launchkit/generator` if the current code already has a clear integration point for base templates and tests expect it.

Do not create a zip adapter.
Do not create a filesystem writer.
Do not implement website download behavior.

## Suggested File Contents

Use practical, minimal starter content.

Example `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "{{projectName}}",
  description: "Generated with LaunchKit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Example `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main>
      <section>
        <p>LaunchKit project</p>
        <h1>{{ projectName }}</h1>
        <p>Your generated Next.js app is ready.</p>
      </section>
    </main>
  );
}
```

Adjust styling and markup as needed, but keep the page independent of optional features.

## Tests

If the repository already has template snapshot tests or generator tests that should include the base template, update them narrowly.

Possible tests:

- Base Next.js template directory exists.
- Required base files exist.
- No `src/` directory exists in the base template.
- Template files use supported placeholders only.

Use Vitest only.

Do not add broad generated-project smoke tests unless the repo already has the harness for them.

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
```

If generator tests are affected, run the generator package tests too:

```bash
npm test -w @launchkit/generator
```

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 5 Step 2 completed: Create base Next.js template

Changes made:
- Created base Next.js template directory.
- Added minimal App Router files.
- Added generated project package/config files.
- Verified the template does not use a src/ directory.

Files changed:
- packages/templates/base/next/app/layout.tsx
- packages/templates/base/next/app/page.tsx
- packages/templates/base/next/app/globals.css
- packages/templates/base/next/package.json
- packages/templates/base/next/tsconfig.json
- packages/templates/base/next/next.config.ts
- packages/templates/base/next/postcss.config.mjs
- packages/templates/base/next/.gitignore
- packages/templates/base/next/README.md
- packages/templates/src/index.ts, if changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 5 Step 3: Create Tailwind template
```

## Completion Criteria

This step is complete when:

- `packages/templates/base/next/` exists.
- The base template includes `app/layout.tsx`.
- The base template includes `app/page.tsx`.
- The base template includes `app/globals.css`.
- The base template includes generated project config files.
- The base template does not include a `src/` folder.
- No optional feature files are added.
- Tests pass, or failures are documented if unrelated.
- TypeScript checks pass, or failures are documented if unrelated.
- `progress-tracker.md` is updated.

Then stop.
