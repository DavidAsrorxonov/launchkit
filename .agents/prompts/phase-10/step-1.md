# Phase 10 Step 1: Prepare npm Package Metadata and Release Strategy

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 9 is complete.
4. Confirm the CLI works locally.
5. Read this step prompt.
6. Implement only this step.

Do not publish to npm in this step.
Do not run `npm publish`.
Do not create a GitHub release.
Do not change the CLI behavior unless a tiny metadata-related fix is required.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Prepare the LaunchKit CLI package for future npm publishing by confirming package metadata, release strategy, package naming, and dependency strategy.

This step should make the package ready for later bundling/packing work, but it must not publish anything.

## Intended Public Commands

The intended public commands are:

```bash
npx create-launchkit@latest
```

and:

```bash
npm create launchkit@latest
```

Important npm behavior:

```txt
npm create launchkit
```

resolves to a package named:

```txt
create-launchkit
```

So the public CLI package should be named:

```txt
create-launchkit
```

## Scope

Work mainly in:

```txt
packages/cli/package.json
README.md
apps/web/app/docs/page.tsx, if CLI docs mention availability
apps/web/components/..., if landing/docs command status needs wording updates
progress-tracker.md
```

Do not perform broad docs rewrites.

## Key Decision: Dependency Strategy

Decide how the published CLI will include LaunchKit internals.

There are two possible strategies:

### Option A: Publish Internal Packages Separately

Publish:

```txt
@launchkit/schema
@launchkit/generator
@launchkit/templates
create-launchkit
```

Pros:

- packages stay modular
- internal packages can be reused independently

Cons:

- more publishing coordination
- more package names to reserve
- versioning becomes more complex
- all packages must be public-ready

### Option B: Bundle Internals Into CLI

Publish only:

```txt
create-launchkit
```

The CLI build bundles or packages schema/generator/templates into the published CLI.

Pros:

- simplest for users
- one package to publish
- fewer npm package names
- easier first release

Cons:

- build setup must bundle internal packages correctly
- internal packages are not independently reusable from npm yet

Recommended for first public release:

```txt
Option B: Bundle internals into create-launchkit
```

Confirm this decision in `progress-tracker.md`.

## Requirements

### 1. Package Name

Confirm:

```json
{
  "name": "create-launchkit"
}
```

Do not use a scoped package name for the initializer unless the user intentionally wants a scoped command.

### 2. Version

Set or confirm an initial publish-ready version.

Recommended first public version:

```txt
0.1.0
```

Do not reuse an already-published version.

If unsure whether the package name/version has been published, do not guess. Check npm before publishing in a later step.

### 3. Private Flag

For publishing, `packages/cli/package.json` eventually must not have:

```json
{
  "private": true
}
```

In this step, decide whether to remove it now or leave it until the final publish step.

Recommended:

```txt
Keep private true until package tarball tests pass, then remove it in the final publish-prep step.
```

If you remove it now, document that publishing still must not happen until later steps.

### 4. Bin Entry

Confirm:

```json
{
  "bin": {
    "create-launchkit": "./dist/index.js"
  }
}
```

Confirm the built file has a valid shebang:

```ts
#!/usr/bin/env node
```

### 5. Files Included In Package

Add or confirm a package `files` allowlist.

Recommended:

```json
{
  "files": ["dist", "README.md", "LICENSE", "package.json"]
}
```

Adjust based on actual package contents.

Do not include:

```txt
src/
tests
coverage
node_modules
temporary generated projects
```

unless intentionally required.

### 6. Package Metadata

Add or confirm package metadata:

```json
{
  "description": "Create a TypeScript-first Next.js project with LaunchKit.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "..."
  },
  "homepage": "...",
  "bugs": {
    "url": "..."
  },
  "keywords": [
    "create",
    "nextjs",
    "typescript",
    "tailwind",
    "starter",
    "project-generator"
  ],
  "engines": {
    "node": ">=18"
  }
}
```

Only add real URLs if known.

Do not invent repository, homepage, or bugs URLs.

If URLs are not known yet, leave them out or add a TODO in `progress-tracker.md`.

### 7. README For npm Package

Ensure the CLI package has a README appropriate for npm users.

Recommended:

```txt
packages/cli/README.md
```

Include:

- what LaunchKit CLI does
- current MVP stack
- command usage
- examples
- options
- limitations
- note that generated projects do not use `src/`
- note that Auth.js credentials is a scaffold

Do not claim unsupported options.

If the CLI is not published yet, docs should say:

```txt
Publishing is pending.
```

or keep public command examples marked as upcoming until publish is complete.

### 8. Public Availability Wording

Update website/docs wording if needed.

Before npm publish, do not say:

```txt
npx create-launchkit@latest
```

is live.

Use wording such as:

```txt
CLI package is being prepared for npm publishing.
```

or:

```txt
Future npm command: npx create-launchkit@latest
```

After actual publish in a later step, this wording can change.

### 9. npm Ignore Strategy

Confirm package contents will be controlled by:

```txt
files field
```

or:

```txt
.npmignore
```

Recommended:

```txt
Use package.json files allowlist.
```

Do not rely on broad defaults.

### 10. Release Checklist

Add a release checklist to `progress-tracker.md`.

Recommended future steps:

```txt
Phase 10 Step 2: Bundle CLI for publishing
Phase 10 Step 3: Test npm package tarball locally
Phase 10 Step 4: Publish beta/canary release
Phase 10 Step 5: Publish stable release
Phase 10 Step 6: Update docs and landing page command status
```

## Verification

Run lightweight verification.

Recommended:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
```

Also run if package metadata changes could affect the workspace:

```bash
npm install
npm test
npm run typecheck
```

Do not run:

```bash
npm publish
```

Do not run:

```bash
npm publish --dry-run
```

unless this project already treats dry-run packing as part of metadata verification. The tarball test belongs to a later step.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 10 Step 1 completed: Prepare npm package metadata and release strategy

Decisions confirmed:
- Public package name:
- Public command:
- npm create command:
- Initial version:
- Dependency strategy:
- Private flag strategy:
- Package files strategy:
- Node engine:
- License:
- Repository/homepage/bugs URLs:

Changes made:
- Reviewed CLI package metadata.
- Added or updated publish-ready package metadata.
- Added or updated CLI package README if needed.
- Confirmed public availability wording is not misleading.
- Added release checklist for remaining publish steps.

Files changed:
- packages/cli/package.json
- packages/cli/README.md, if added or changed
- README.md, if changed
- apps/web/..., if CLI availability wording changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 10 Step 2: Bundle CLI for publishing
```

## Completion Criteria

This step is complete when:

- Public package name is confirmed as `create-launchkit`.
- Public command strategy is confirmed.
- Dependency strategy is confirmed.
- Package metadata is reviewed and updated where appropriate.
- Bin entry is confirmed.
- Files allowlist or npm ignore strategy is confirmed.
- CLI npm README exists or is planned with a blocker noted.
- Docs do not falsely claim public npm availability before publish.
- Release checklist is added to `progress-tracker.md`.
- No npm publish command is run.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build passes, or unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
