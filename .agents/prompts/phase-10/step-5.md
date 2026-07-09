# Phase 10 Step 5: Publish Stable Release

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 10 Step 4 is complete.
4. Confirm the beta/canary release was published and tested successfully.
5. Confirm the user explicitly wants to publish a stable release.
6. Read this step prompt.
7. Implement only this step.

Do not move to Phase 10 Step 6.
Do not publish stable if beta verification failed.
Do not publish stable if docs still describe the CLI as unavailable.
Do not publish stable if package metadata is incomplete.
Do not publish stable if the package depends on unresolved `workspace:*` dependencies.
Use npm.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Publish the stable LaunchKit CLI package to npm so users can run:

```bash
npx @baseforge/create@latest
```

and:

```bash
npm create @baseforge@latest
```

This step should publish the stable release under the npm `latest` dist-tag only after beta verification has passed.

## Package

Public package:

```txt
@baseforge/create
```

Public binary:

```txt
create-baseforge
```

Stable dist-tag:

```txt
latest
```

## Stable Version Strategy

Recommended first stable version:

```txt
0.1.0
```

Use this only if it has not already been published.

If `0.1.0` already exists, choose the next appropriate semver version:

```txt
0.1.1
0.2.0
```

Do not reuse an already published version.

## Scope

Work mainly in:

```txt
packages/cli/package.json
packages/cli/README.md
README.md
apps/web/app/docs/page.tsx
apps/web/components/...
progress-tracker.md
```

Do not perform broad unrelated docs rewrites.

## Requirements

### 1. Verify Beta Release First

Confirm beta release is good:

```bash
npm view @baseforge/create dist-tags versions
npx @baseforge/create@beta --help
npx @baseforge/create@beta my-app --yes
```

If beta is broken, do not publish stable.

### 2. npm Auth Check

Confirm npm login:

```bash
npm whoami
```

If not logged in, stop and ask the user to authenticate.

### 3. Package Name And Version Check

Check npm registry:

```bash
npm view @baseforge/create name version dist-tags versions
```

Confirm:

- package belongs to the user/project
- stable version is not already published
- current `latest` tag behavior is understood

Do not overwrite or reuse a published version.

### 4. Set Stable Version

Set `packages/cli/package.json` to the chosen stable version.

Recommended:

```json
{
  "version": "0.1.0"
}
```

If moving from:

```txt
0.1.0-beta.0
```

to:

```txt
0.1.0
```

verify this is the intended stable promotion.

### 5. Ensure Package Is Publishable

Confirm:

- `private` is not `true`
- `bin` points to `./dist/index.js`
- `files` allowlist includes required files
- README exists
- license is set
- engines are set
- package metadata is accurate
- no unresolved `workspace:*` runtime dependencies

### 6. Pre-Publish Checks

Run:

```bash
npm run typecheck -w @baseforge/create
npm test -w @baseforge/create
npm run build -w @baseforge/create
npm run test:smoke -w @baseforge/create
```

Also run broader checks if practical:

```bash
npm run typecheck
npm test
npm run build
```

If any relevant check fails, do not publish stable.

### 7. Pack Dry Run

Run:

```bash
npm pack --dry-run -w @baseforge/create
```

Inspect package contents.

Required:

```txt
package.json
README.md
dist/index.js
dist required files/assets
LICENSE, if present
```

Must not include:

```txt
src/
tests
coverage
node_modules
temporary generated projects
local .tgz files
```

### 8. Optional Final Tarball Test

If practical, run a final local tarball test after setting the stable version:

```bash
npm pack -w @baseforge/create
```

Install in a temp directory:

```bash
npm init -y
npm install /absolute/path/to/baseforge-create-0.1.0.tgz
npx create-baseforge --help
npx create-baseforge my-app --yes
```

Do not publish if tarball test fails.

Clean up or document local `.tgz` artifacts.

### 9. Publish Stable

Publish stable:

```bash
npm publish -w @baseforge/create --tag latest
```

If package is scoped and public, use:

```bash
npm publish -w @baseforge/create --tag latest --access public
```

For scoped `@baseforge/create`, `--access public` is required.

Do not run publish unless all checks are complete.

### 10. Post-Publish Registry Verification

Verify:

```bash
npm view @baseforge/create version dist-tags
```

Confirm:

```txt
latest points to the stable version
beta remains available if desired
```

### 11. Post-Publish User Command Test

In a temporary directory, test:

```bash
npx @baseforge/create@latest --help
npx @baseforge/create@latest my-app --yes
npm create @baseforge@latest my-create-app -- --yes
```

Note: npm create argument forwarding may require `--` before options. Test and document the correct working command.

Verify:

```txt
my-app/package.json exists
my-app/app/page.tsx exists
my-app/README.md exists
my-app/src does not exist
```

Also test all-compatible config if practical:

```bash
npx @baseforge/create@latest full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Do not run generated app code.
Do not start Docker.
Do not connect to databases.

### 12. Update Docs For Stable Availability

After stable publish succeeds, update docs and landing copy.

Now it is valid to say:

```bash
npx @baseforge/create@latest
```

and:

```bash
npm create @baseforge@latest
```

Update:

- README
- CLI README
- website docs
- landing command UI if it was labeled future/coming soon

Remove or adjust wording like:

```txt
future CLI
coming soon
not published yet
```

Only after stable publish succeeds.

### 13. Failure Handling

If publish fails:

- do not retry blindly
- record the exact error
- verify auth, version, metadata, package ownership
- fix only clear in-scope issues
- rerun checks before retry

Do not mark stable release complete unless publish and post-publish verification succeed.

## Verification Commands

Recommended sequence:

```bash
npm whoami
npm view @baseforge/create name version dist-tags versions
npm run typecheck -w @baseforge/create
npm test -w @baseforge/create
npm run build -w @baseforge/create
npm run test:smoke -w @baseforge/create
npm pack --dry-run -w @baseforge/create
npm publish -w @baseforge/create --tag latest
npm view @baseforge/create version dist-tags
```

Then in a temp directory:

```bash
npx @baseforge/create@latest --help
npx @baseforge/create@latest my-app --yes
npm create @baseforge@latest my-create-app -- --yes
npx @baseforge/create@latest full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Use actual package name, workspace command names, and available scripts.

If any command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 10 Step 5 completed: Publish stable release

Release details:
- Package:
- Version:
- Dist-tag:
- npm user:
- Registry:

Changes made:
- Verified beta release before stable publish.
- Set stable package version.
- Verified package metadata.
- Ran pre-publish checks.
- Ran npm pack dry-run.
- Published stable release with latest dist-tag.
- Verified npm registry metadata.
- Tested npx @baseforge/create@latest in a temp directory.
- Tested npm create @baseforge@latest command.
- Updated docs and landing page command status for stable availability.

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

Docs update:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 10 Step 6: Update docs and landing page command status, if not fully completed here
```

If publishing is blocked, record:

```txt
Phase 10 Step 5: Blocked

Blocked by:
- ...

Commands run:
- ...

Exact error:
- ...

Next suggested step:
- Fix the listed stable publish blocker before retrying.
```

## Completion Criteria

This step is complete when:

- Beta release was verified first.
- Stable version is set.
- Package is publishable and not private.
- Pre-publish checks pass.
- Pack dry-run contents are inspected.
- Stable package is published with `latest`.
- `npm view` confirms latest points to stable version.
- `npx @baseforge/create@latest --help` works.
- `npx @baseforge/create@latest my-app --yes` works.
- `npm create @baseforge@latest` is tested and documented.
- Generated output does not include `src/`.
- Docs and landing page no longer falsely describe the CLI as future-only.
- `progress-tracker.md` is updated.

Then stop.
