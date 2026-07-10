# Phase 10 Step 3: Test npm Package Tarball Locally

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 10 Step 2 is complete.
4. Confirm the CLI is bundled for publishing.
5. Read this step prompt.
6. Implement only this step.

Do not move to Phase 10 Step 4.
Do not publish to npm.
Do not run `npm publish`.
Do not create a GitHub release.
Do not change CLI behavior unless tarball testing reveals a packaging bug.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Test the npm package tarball locally before publishing.

This step should prove that the package users will receive from npm contains the right files and that the CLI works when installed from a packed `.tgz` artifact.

No publishing should happen in this step.

## Scope

Work mainly with:

```txt
packages/cli/
```

Potential files:

```txt
packages/cli/package.json
packages/cli/README.md
packages/cli/tsup.config.ts, if packaging issues are found
package-lock.json, if dependency metadata changes
progress-tracker.md
```

Use temp directories for tarball install tests.

Do not commit generated `.tgz` files unless the repo intentionally tracks release artifacts.

## Requirements

### 1. Build Before Packing

Run the CLI build before packing:

```bash
npm run build -w create-launchkit
```

Confirm output exists:

```txt
packages/cli/dist/index.js
```

Confirm the built file has a shebang:

```txt
#!/usr/bin/env node
```

### 2. Inspect Pack Contents With Dry Run

Run:

```bash
npm pack --dry-run -w create-launchkit
```

or, from inside `packages/cli`:

```bash
npm pack --dry-run
```

Inspect the file list.

Expected package contents should include:

```txt
package.json
README.md
dist/index.js
dist/... required bundled files/assets
LICENSE, if present
```

Expected package contents should not include:

```txt
src/
*.test.ts
coverage/
node_modules/
temporary generated projects
workspace-only config files unless needed
```

If unexpected files are included, update the `files` allowlist or `.npmignore` strategy.

### 3. Create Local Tarball

Run:

```bash
npm pack -w create-launchkit
```

or, from inside `packages/cli`:

```bash
npm pack
```

This should produce a `.tgz` file, for example:

```txt
create-launchkit-0.1.0.tgz
```

Use the actual file name.

Do not publish it.

### 4. Install Tarball In A Temp Project

Create a temporary test directory outside the repo source tree.

Inside it, test installing the tarball.

Recommended:

```bash
npm init -y
npm install /absolute/path/to/create-launchkit-0.1.0.tgz
```

Then run the installed binary:

```bash
npx create-launchkit --help
```

Also test generation:

```bash
npx create-launchkit my-app --yes
```

Verify:

```txt
my-app/package.json exists
my-app/app/page.tsx exists
my-app/README.md exists
my-app/src does not exist
```

### 5. Test All-Compatible Config From Tarball

In a temp directory, run:

```bash
npx create-launchkit full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Verify expected optional files:

```txt
full-app/components.json
full-app/components/ui/button.tsx
full-app/lib/utils.ts
full-app/prisma/schema.prisma
full-app/lib/db.ts
full-app/auth.ts
full-app/app/api/auth/[...nextauth]/route.ts
full-app/docker-compose.yml
full-app/.env.example
full-app/package.json
full-app/README.md
```

Verify:

```txt
full-app/src does not exist
```

### 6. Test Workspace Dependency Safety

Inspect the installed package's `package.json` in `node_modules/create-launchkit`.

Confirm it does not contain unresolved workspace dependency specs such as:

```txt
workspace:*
```

unless those packages are intentionally published dependencies.

For the recommended single-package release strategy, the installed CLI should not require unpublished internal workspace packages.

### 7. Test Template Asset Availability

From the tarball-installed CLI, verify generated output includes real template contents, not missing placeholders or empty files.

Check at least:

```txt
app/layout.tsx
app/page.tsx
package.json
README.md
components/ui/button.tsx, for shadcn config
prisma/schema.prisma, for Prisma config
docker-compose.yml, for Docker config
```

If templates are missing, fix the bundling/template asset strategy from Step 2.

### 8. Test Binary Execution

Confirm the installed binary can be run through:

```bash
npx create-launchkit --help
```

and, if practical:

```bash
./node_modules/.bin/create-launchkit --help
```

This verifies the `bin` entry and shebang.

### 9. No Publish

This step must not run:

```bash
npm publish
```

It is okay to run:

```bash
npm pack
npm pack --dry-run
```

### 10. Cleanup

Do not commit:

```txt
*.tgz
temporary install directories
generated tarball test projects
```

If the tarball is created inside the repo, remove it after testing or document why it remains.

Do not use destructive cleanup outside known temp directories.

## Verification Commands

Run:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm pack --dry-run -w create-launchkit
npm pack -w create-launchkit
```

Then perform temp install tests:

```bash
npm init -y
npm install /absolute/path/to/create-launchkit-0.1.0.tgz
npx create-launchkit --help
npx create-launchkit my-app --yes
npx create-launchkit full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Use actual package name, workspace command names, and tarball path.

If any command does not exist, record that clearly in `progress-tracker.md`.

If network access is required and unavailable, document the exact blocker.

## Fix Policy

If tarball testing reveals small packaging issues:

- fix package metadata, files allowlist, bundler config, or template asset handling
- rebuild
- recreate tarball
- retest

If larger issues are found:

- do not proceed to publish
- document the blocker in `progress-tracker.md`

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 10 Step 3 completed: Test npm package tarball locally

Changes made:
- Built CLI package.
- Inspected npm pack dry-run output.
- Created local npm tarball.
- Installed tarball in a temporary project.
- Verified installed binary runs.
- Verified default project generation from tarball.
- Verified all-compatible project generation from tarball.
- Verified package does not rely on unresolved workspace dependencies.
- Verified template assets are included.
- Fixed any small packaging issues found during testing.

Files changed:
- packages/cli/package.json, if packaging metadata changed
- packages/cli/README.md, if changed
- packages/cli/tsup.config.ts, if changed
- package-lock.json, if changed
- progress-tracker.md

Commands run:
- ...

Pack dry-run result:
- ...

Tarball install result:
- ...

Generation verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 10 Step 4: Publish beta/canary release
```

## Completion Criteria

This step is complete when:

- CLI package builds.
- `npm pack --dry-run` has been inspected.
- Package contents are correct.
- Local `.tgz` tarball has been created.
- Tarball installs into a temp project.
- Installed binary runs through `npx create-launchkit`.
- Tarball-installed CLI generates default project.
- Tarball-installed CLI generates all-compatible MVP project.
- Generated output includes template contents.
- Generated output does not include `src/`.
- Installed package does not rely on unresolved workspace dependencies.
- Temporary tarball/test artifacts are cleaned up or documented.
- No npm publish command is run.
- `progress-tracker.md` is updated.

Then stop.
