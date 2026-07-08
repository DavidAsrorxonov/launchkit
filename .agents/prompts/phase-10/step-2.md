# Phase 10 Step 2: Bundle CLI for Publishing

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 10 Step 1 is complete.
4. Confirm the chosen dependency strategy.
5. Read this step prompt.
6. Implement only this step.

Do not move to Phase 10 Step 3.
Do not publish to npm.
Do not run `npm publish`.
Do not change CLI behavior unless required for bundling correctness.
Do not add new product options.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Bundle the LaunchKit CLI so the public npm package:

```txt
create-launchkit
```

can be published as a single usable package.

The first public release should not require users to separately install unpublished workspace packages such as:

```txt
@launchkit/schema
@launchkit/generator
@launchkit/templates
```

Recommended first-release strategy:

```txt
Bundle internal LaunchKit packages into the CLI output.
```

## Scope

Work mainly inside:

```txt
packages/cli/
```

Potential files:

```txt
packages/cli/package.json
packages/cli/tsconfig.json
packages/cli/tsup.config.ts
packages/cli/src/index.ts
package.json
package-lock.json
```

The exact bundler config depends on the repo.

## Requirements

### 1. Choose Bundler

Choose a practical bundler for the CLI.

Recommended:

```txt
tsup
```

Alternative:

```txt
esbuild
```

Use the simplest bundler that:

- supports TypeScript
- outputs ESM or CJS reliably for Node
- preserves the CLI shebang
- can bundle workspace packages
- can mark true external dependencies external if needed

Document the choice in `progress-tracker.md`.

### 2. Output Format

Choose output format based on the existing package style.

Recommended:

```txt
ESM
```

if the repo already uses:

```json
{
  "type": "module"
}
```

Expected output:

```txt
packages/cli/dist/index.js
```

The `bin` entry should point to:

```json
{
  "bin": {
    "create-launchkit": "./dist/index.js"
  }
}
```

### 3. Preserve Shebang

Ensure the bundled CLI output starts with:

```js
#!/usr/bin/env node
```

Without this, the package may not execute correctly as a binary.

### 4. Bundle Internal Workspace Packages

Bundle or otherwise include code from:

```txt
@launchkit/schema
@launchkit/generator
@launchkit/templates
```

The published `create-launchkit` package should not depend on local workspace-only references like:

```json
"workspace:*"
```

unless those packages are also going to be published first.

For first public release, avoid requiring separate unpublished internal packages.

### 5. Handle Template Assets

Confirm how templates are included in the published CLI.

Depending on the generator implementation, templates may be:

```txt
bundled as imported strings/data
copied into dist
included through package files
read from package-relative paths
```

The published CLI must be able to generate projects after npm installation.

If the generator currently reads templates from filesystem paths under `packages/templates`, add a publishing-safe asset strategy.

Possible approaches:

```txt
1. bundle templates into code
2. copy template files into packages/cli/dist/templates
3. include templates in package files and resolve relative to import.meta.url
```

Choose the smallest reliable approach and document it.

### 6. External Dependencies

Review dependencies.

Runtime dependencies should either be:

- bundled into the CLI output, or
- listed as normal npm dependencies in `packages/cli/package.json`

Do not leave runtime dependencies only in devDependencies if the published CLI needs them.

Prompt library, zip library, or other CLI runtime packages should be handled correctly.

### 7. Build Script

Update the CLI build script.

Recommended:

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format esm --target node18 --out-dir dist --clean --dts"
  }
}
```

or use:

```txt
tsup.config.ts
```

Prefer config file if template asset copying or externals are non-trivial.

### 8. Typecheck Script

Keep a separate typecheck script:

```json
{
  "typecheck": "tsc --noEmit"
}
```

Do not rely on bundling as the only type check.

### 9. Package Files

Update package files allowlist as needed.

Recommended:

```json
{
  "files": ["dist", "README.md", "LICENSE", "package.json"]
}
```

If template assets are copied outside `dist`, include them explicitly.

Do not include source/test files unless intentionally required.

### 10. Local Binary Test

After build, verify the built CLI can run locally:

```bash
node packages/cli/dist/index.js --help
node packages/cli/dist/index.js my-app --yes
```

Run generation in a temp directory only.

Do not run generated app code.
Do not install generated project dependencies unless intentionally testing install behavior.

### 11. No Publish Yet

This step must not run:

```bash
npm publish
```

Tarball testing belongs to Phase 10 Step 3.

Beta/canary publish belongs to Phase 10 Step 4.

Stable publish belongs to Phase 10 Step 5.

## Tests

Use Vitest only.

Add or update tests if bundling changes require it.

Recommended checks:

- build output exists
- built CLI `--help` runs
- built CLI can generate default project in temp dir
- built CLI can generate all-compatible project in temp dir
- built CLI output includes templates correctly
- no generated `src/` folder

If these are better handled by existing smoke tests, update the smoke tests instead of duplicating.

Do not run real npm package publishing tests in this step.

## Verification

Run:

```bash
npm install
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
```

Then run smoke checks if available:

```bash
npm run test:smoke -w create-launchkit
```

Also run broader checks if practical:

```bash
npm run typecheck
npm test
npm run build
```

Use the actual package name and workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

If bundler installation requires network and fails due to environment restrictions, document the exact failure and blocker.

## Manual Verification

In a temporary directory, run:

```bash
node /absolute/path/to/packages/cli/dist/index.js my-app --yes
```

Verify:

```txt
my-app/package.json exists
my-app/app/page.tsx exists
my-app/README.md exists
my-app/src does not exist
```

Also test all-compatible MVP config:

```bash
node /absolute/path/to/packages/cli/dist/index.js full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Verify expected optional files exist:

```txt
components.json
components/ui/button.tsx
lib/utils.ts
prisma/schema.prisma
lib/db.ts
auth.ts
app/api/auth/[...nextauth]/route.ts
docker-compose.yml
```

Do not run generated app code.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 10 Step 2 completed: Bundle CLI for publishing

Decisions confirmed:
- Bundler:
- Output format:
- Internal package strategy:
- Template asset strategy:
- Runtime dependency strategy:

Changes made:
- Added or updated CLI bundler configuration.
- Updated CLI build script.
- Preserved CLI bin/shebang behavior.
- Bundled or included internal LaunchKit packages.
- Bundled or included template assets.
- Updated package files allowlist.
- Verified built CLI runs locally.

Files changed:
- packages/cli/package.json
- packages/cli/tsup.config.ts, if added
- packages/cli/tsconfig.json, if changed
- packages/cli/src/..., if needed
- package.json, if root scripts changed
- package-lock.json, if dependencies changed
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
- Phase 10 Step 3: Test npm package tarball locally
```

## Completion Criteria

This step is complete when:

- CLI bundler is configured.
- CLI build outputs `dist/index.js`.
- Built CLI preserves shebang.
- Bin entry points to built CLI.
- Internal workspace packages are bundled or otherwise publish-safe.
- Template assets are included in a publish-safe way.
- Runtime dependencies are correctly bundled or declared.
- Package files allowlist includes required publish files.
- Built CLI runs locally.
- Built CLI can generate default project in temp dir.
- Built CLI can generate all-compatible project in temp dir.
- No npm publish command is run.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build passes, or blockers are documented.
- `progress-tracker.md` is updated.

Then stop.
