# Phase 10 Step 4: Publish Beta/Canary Release

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 10 Step 3 is complete.
4. Confirm the local npm tarball test passed.
5. Confirm the user explicitly wants to publish a prerelease.
6. Read this step prompt.
7. Implement only this step.

Do not move to Phase 10 Step 5.
Do not publish a stable `latest` release in this step.
Do not publish if tarball testing failed.
Do not publish if npm package metadata is incomplete.
Do not publish if the package still depends on unresolved `workspace:*` dependencies.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Publish a beta/canary prerelease of the LaunchKit CLI package to npm so it can be tested through the real npm registry before a stable release.

The package is:

```txt
create-launchkit
```

The intended stable command will eventually be:

```bash
npx create-launchkit@latest
```

For this prerelease step, users should test with an explicit prerelease tag or version, for example:

```bash
npx create-launchkit@beta
```

or:

```bash
npx create-launchkit@0.1.0-beta.0
```

## Prerelease Strategy

Use a prerelease version and npm dist-tag.

Recommended first beta:

```txt
0.1.0-beta.0
```

Recommended npm dist-tag:

```txt
beta
```

Do not publish this prerelease under:

```txt
latest
```

unless the user explicitly decides to treat the release as stable.

## Scope

Work mainly in:

```txt
packages/cli/package.json
packages/cli/README.md
progress-tracker.md
```

Potentially update docs wording if the beta release succeeds:

```txt
README.md
apps/web/app/docs/page.tsx
apps/web/components/...
```

Do not perform broad documentation rewrites.

## Requirements

### 1. npm Account And Access Check

Confirm npm login status:

```bash
npm whoami
```

If not logged in, stop and ask the user to authenticate.

Do not attempt to work around npm authentication.

### 2. Package Name Availability

Check whether the package name exists:

```bash
npm view create-launchkit name version dist-tags
```

If the package does not exist, npm may return a 404. That is acceptable for a first publish.

If the package already exists:

- verify it belongs to the user/project
- verify the version you plan to publish is not already used
- do not overwrite or reuse a published version

### 3. Version

Set the CLI package version to a prerelease version.

Recommended:

```json
{
  "version": "0.1.0-beta.0"
}
```

If `0.1.0-beta.0` already exists, increment:

```txt
0.1.0-beta.1
0.1.0-beta.2
...
```

Do not reuse an already published version.

### 4. Private Flag

Before publishing, ensure `packages/cli/package.json` does not contain:

```json
{
  "private": true
}
```

Remove `private: true` only when all prerelease checks are satisfied.

### 5. Metadata Check

Confirm package metadata is publish-ready:

```txt
name
version
description
bin
files
license
engines
README
```

Only include real repository/homepage/bugs URLs if known.

Do not invent URLs.

### 6. Build And Test Before Publish

Run:

```bash
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run test:smoke -w create-launchkit
```

Also run broader checks if practical:

```bash
npm run typecheck
npm test
npm run build
```

If any relevant check fails, do not publish.

### 7. Pack Dry Run

Run:

```bash
npm pack --dry-run -w create-launchkit
```

Confirm package contents are correct.

Do not publish if unexpected files are included or required files are missing.

### 8. Publish Beta

Publish with a beta tag:

```bash
npm publish -w create-launchkit --tag beta
```

If the package is scoped and public, use:

```bash
npm publish -w create-launchkit --tag beta --access public
```

For the recommended unscoped package `create-launchkit`, `--access public` is not required.

Do not use:

```bash
npm publish
```

without a prerelease tag in this step.

### 9. Post-Publish Verification

After publish succeeds, verify npm registry metadata:

```bash
npm view create-launchkit version dist-tags
```

Confirm:

```txt
beta points to the prerelease version
latest was not changed by this beta publish
```

Then test the real npm install path in a temporary directory:

```bash
npx create-launchkit@beta --help
npx create-launchkit@beta my-app --yes
```

Verify:

```txt
my-app/package.json exists
my-app/app/page.tsx exists
my-app/README.md exists
my-app/src does not exist
```

Also test all-compatible MVP config if practical:

```bash
npx create-launchkit@beta full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Do not run generated app code.
Do not start Docker.
Do not connect to databases.

### 10. Docs Wording After Beta

If beta publish succeeds, update docs/README wording carefully.

Acceptable wording:

```txt
Beta CLI:
npx create-launchkit@beta
```

Do not change stable docs to:

```txt
npx create-launchkit@latest
```

until the stable release is published in Phase 10 Step 5.

Landing page command UI may still show the future stable command if clearly labeled, but docs should mention beta explicitly.

### 11. Failure Handling

If publish fails:

- do not retry blindly
- record the exact npm error
- verify auth, package name, version, and metadata
- fix only clear in-scope issues
- rerun required checks before another publish attempt

Do not mark this step complete unless the beta publish and post-publish verification succeed, or unless the user explicitly decides to pause with documented blockers.

## Verification Commands

Recommended sequence:

```bash
npm whoami
npm view create-launchkit name version dist-tags
npm run typecheck -w create-launchkit
npm test -w create-launchkit
npm run build -w create-launchkit
npm run test:smoke -w create-launchkit
npm pack --dry-run -w create-launchkit
npm publish -w create-launchkit --tag beta
npm view create-launchkit version dist-tags
```

Then in a temp directory:

```bash
npx create-launchkit@beta --help
npx create-launchkit@beta my-app --yes
npx create-launchkit@beta full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Use actual package name, workspace command names, and available scripts.

If any command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 10 Step 4 completed: Publish beta/canary release

Release details:
- Package:
- Version:
- Dist-tag:
- npm user:
- Registry:

Changes made:
- Set prerelease package version.
- Removed private flag if needed.
- Verified package metadata.
- Ran pre-publish checks.
- Ran npm pack dry-run.
- Published beta/canary release with npm dist-tag.
- Verified npm registry metadata.
- Tested npx create-launchkit@beta in a temp directory.
- Updated docs with beta command if appropriate.

Files changed:
- packages/cli/package.json
- packages/cli/README.md, if changed
- README.md, if changed
- apps/web/..., if docs/landing wording changed
- package-lock.json, if changed
- progress-tracker.md

Commands run:
- ...

Pre-publish verification result:
- ...

Publish result:
- ...

Post-publish verification:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 10 Step 5: Publish stable release
```

If publishing is blocked, record:

```txt
Phase 10 Step 4: Blocked

Blocked by:
- ...

Commands run:
- ...

Exact error:
- ...

Next suggested step:
- Fix the listed publish blocker before retrying beta publish.
```

## Completion Criteria

This step is complete when:

- CLI package version is set to a prerelease version.
- Package is not private at publish time.
- Package metadata is verified.
- Pre-publish tests pass, or unrelated failures are documented and accepted by the user.
- Pack dry-run contents are inspected.
- Package is published with the `beta` dist-tag.
- `latest` is not unintentionally changed.
- `npm view` confirms the beta tag.
- `npx create-launchkit@beta --help` works.
- `npx create-launchkit@beta my-app --yes` works in a temp directory.
- Generated output does not include `src/`.
- Docs do not falsely claim stable `latest` availability.
- `progress-tracker.md` is updated.

Then stop.
