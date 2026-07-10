# Phase 10 Step 6: Update BaseForge Package Command and Public Docs

You are working on the project formerly planned for npm publishing as LaunchKit.

Important publishing change:

```txt
The unscoped LaunchKit/create-launchkit npm name was not available.
The public npm package is now scoped as @baseforge/create.
The user-facing install/run command is:

npx @baseforge/create@latest my-app
```

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm Phase 10 Step 5 status.
4. Confirm whether the stable package has already been published as `@baseforge/create`.
5. Read this step prompt.
6. Implement only this step.

Do not publish in this step unless the user explicitly asks.
Do not change generator behavior.
Do not add new product options.
Do not rename internal packages unless explicitly required.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Update package metadata, public commands, website docs, landing copy, README content, and progress tracking to reflect the final public npm package:

```txt
@baseforge/create
```

and the public command:

```bash
npx @baseforge/create@latest my-app
```

This step should remove stale public references to:

```bash
npx create-launchkit@latest
npm create launchkit@latest
```

unless they are kept only as historical notes in `progress-tracker.md`.

## Scope

Likely files:

```txt
packages/cli/package.json
packages/cli/README.md
README.md
apps/web/app/docs/page.tsx
apps/web/components/docs/...
apps/web/components/landing/...
apps/web/app/page.tsx
progress-tracker.md
```

Also search the repo for stale command references:

```txt
create-launchkit
npm create launchkit
npx create-launchkit
LaunchKit CLI
```

Update only user-facing/public publish references unless the project is intentionally being fully rebranded.

## Branding Decision

First clarify and document the intended naming split:

```txt
Option A:
  Product/project is still LaunchKit.
  Public npm package is @baseforge/create.

Option B:
  Product/project is now BaseForge.
  Public npm package is @baseforge/create.
```

If the user has not explicitly requested a full product rename, prefer Option A:

```txt
Keep internal/product references as LaunchKit where appropriate.
Update public npm CLI command to @baseforge/create.
```

Do not mass-rename internal package names like:

```txt
@launchkit/schema
@launchkit/generator
@launchkit/templates
```

unless the user explicitly asks for a full rebrand.

## Package Metadata Requirements

Update `packages/cli/package.json` for the scoped package.

Expected name:

```json
{
  "name": "@baseforge/create"
}
```

Confirm the `bin` works with:

```bash
npx @baseforge/create@latest my-app
```

Recommended bin:

```json
{
  "bin": {
    "create-baseforge": "./dist/index.js"
  }
}
```

or, if the package currently has one bin and npm can infer it correctly:

```json
{
  "bin": {
    "baseforge": "./dist/index.js"
  }
}
```

Choose the bin name that matches the current CLI behavior and npm test results.

Important:

- `npx @baseforge/create@latest my-app` must work.
- Do not assume `npm create baseforge` works unless tested.
- For scoped packages, document only the commands that have been verified.

## Publish Access Note

Because `@baseforge/create` is scoped, public publishing requires:

```bash
npm publish --access public
```

or workspace equivalent:

```bash
npm publish -w @baseforge/create --access public
```

Do not run publish in this step unless explicitly requested.

Document this for future release steps.

## Documentation Updates

Update docs and README examples to use:

```bash
npx @baseforge/create@latest my-app
```

If beta is still the only published tag, use:

```bash
npx @baseforge/create@beta my-app
```

Only use `@latest` if stable publish succeeded.

Update quick start examples:

```bash
npx @baseforge/create@latest my-app
cd my-app
npm install
npm run dev
```

For pnpm-generated projects, only show pnpm commands where already supported.

## Landing Page Updates

Update command-style UI on the landing page.

Replace old command:

```bash
npx create-launchkit@latest
```

with:

```bash
npx @baseforge/create@latest my-app
```

If stable publishing has not happened yet, label it clearly:

```txt
CLI command
npx @baseforge/create@beta my-app
```

or:

```txt
Coming stable command
npx @baseforge/create@latest my-app
```

Do not show a command as live if it is not published.

## Docs Page Updates

Update the dedicated docs page:

- Overview
- Quick Start
- Future/Current CLI section
- Troubleshooting
- Any command examples

Make sure docs explain:

```txt
The public CLI package is @baseforge/create.
The command is npx @baseforge/create@latest my-app.
```

If the product remains LaunchKit, write:

```txt
LaunchKit is distributed on npm as @baseforge/create.
```

If the product is now BaseForge, update product wording consistently.

## Progress Tracker Update

Record the package-name change clearly.

Recommended entry:

```txt
Phase 10 Step 6 completed: Update BaseForge package command and public docs

Important publishing change:
- Original intended package: create-launchkit
- Final public npm package: @baseforge/create
- Final public command: npx @baseforge/create@latest my-app
- Reason: launchkit/create-launchkit naming was unavailable on npm

Branding decision:
- Product name:
- Public package name:
- Internal package namespace:

Changes made:
- Updated CLI package metadata.
- Updated README command examples.
- Updated CLI README command examples.
- Updated landing page command UI.
- Updated docs page command examples.
- Removed stale create-launchkit public command references.
- Documented scoped package publish requirement: --access public.

Files changed:
- packages/cli/package.json
- packages/cli/README.md
- README.md
- apps/web/..., if docs/landing changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Re-run package tarball verification and scoped-package publish checks.
```

## Verification

Run:

```bash
npm run typecheck -w @baseforge/create
npm test -w @baseforge/create
npm run build -w @baseforge/create
```

If workspace commands still use the old package name temporarily, use actual available commands and document the mismatch.

Also run broader checks if practical:

```bash
npm run typecheck
npm test
npm run build
```

Run search checks:

```bash
rg "create-launchkit|npm create launchkit|npx create-launchkit"
```

Any remaining matches should be intentional historical notes or migration notes.

## Local Command Verification

If stable package is already published, test in a temp directory:

```bash
npx @baseforge/create@latest --help
npx @baseforge/create@latest my-app
```

If beta package is published:

```bash
npx @baseforge/create@beta --help
npx @baseforge/create@beta my-app
```

If not published yet, test the packed tarball as in Phase 10 Step 3 and ensure docs do not claim live availability.

## Completion Criteria

This step is complete when:

- `@baseforge/create` is recorded as the final public npm package.
- Public command examples use `npx @baseforge/create@latest my-app`, or beta wording if stable is not published.
- Stale `npx create-launchkit@latest` public examples are removed.
- Scoped package publish requirement `--access public` is documented.
- Landing page command UI is updated.
- Documentation page command examples are updated.
- README/CLI README command examples are updated.
- Product-vs-package branding decision is documented.
- Internal package names are not renamed unless explicitly requested.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build passes, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
