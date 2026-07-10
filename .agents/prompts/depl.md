# BaseForge Deployment Preparation Manual

This guide is for manually preparing BaseForge for public use.

It covers:

- final local verification
- website deployment preparation
- CLI package publishing preparation
- npm command verification
- documentation checks
- post-deployment sanity checks

The current public CLI package is:

```bash
npx @baseforge/create@latest my-app
```

## 1. Confirm Current Status

Before deploying or publishing, confirm the project is actually ready:

```bash
git status
npm install
npm run typecheck
npm test
npm run build
```

If the repo has lint:

```bash
npm run lint
```

If the repo has smoke tests:

```bash
npm run test:smoke
```

Do not deploy if core checks are failing for project-related reasons.

## 2. Verify Website Routes

Run the web app locally.

Common commands:

```bash
npm run dev -w apps/web
```

Then check:

```txt
/          landing page
/builder   builder wizard
/docs      documentation page
```

Verify manually:

- landing page loads
- command UI uses `npx @baseforge/create@latest my-app`
- builder opens from landing CTA
- builder completes default flow
- preview works
- download creates a zip
- docs page loads
- docs do not mention stale `create-launchkit` commands

## 3. Check Public Command References

Search for stale command names:

```bash
rg "create-launchkit|npm create launchkit|npx create-launchkit"
```

Remaining matches should only be historical notes if intentionally kept.

Search for the final command:

```bash
rg "@baseforge/create"
```

Make sure public docs and landing copy use:

```bash
npx @baseforge/create@latest my-app
```

If the package is not stable-published yet, use beta wording instead:

```bash
npx @baseforge/create@beta my-app
```

## 4. Prepare Website Deployment

The website should not require generated-project secrets like:

```txt
DATABASE_URL
AUTH_SECRET
```

Those belong to generated projects, not the BaseForge website, unless you intentionally added database/auth to the website itself.

Before deploying, confirm:

- `apps/web` builds successfully
- API route `/api/generate` works
- generated code is not executed on the server
- generated dependencies are not installed on the server
- download flow works
- docs are accurate

Build the website:

```bash
npm run build -w apps/web
```

If using Vercel or a similar host:

```txt
Root directory: repo root, or apps/web depending on setup
Build command: npm run build -w apps/web
Install command: npm install
Output: Next.js default
```

Use the exact settings your host expects for a Next.js app in an npm workspace.

## 5. Verify CLI Package Metadata

Check:

```bash
cat packages/cli/package.json
```

Confirm:

```json
{
  "name": "@baseforge/create",
  "bin": {
    "...": "./dist/index.js"
  }
}
```

Also confirm:

- package is not private when publishing
- version is correct
- README exists
- license is set
- `files` allowlist includes `dist`
- no unresolved `workspace:*` dependencies are needed at runtime
- scoped package publishing uses `--access public`

## 6. Build And Pack CLI

Build:

```bash
npm run build -w @baseforge/create
```

Inspect the package contents:

```bash
npm pack --dry-run -w @baseforge/create
```

The package should include:

```txt
package.json
README.md
dist/index.js
required template/runtime assets
LICENSE, if present
```

It should not include:

```txt
src/
tests
coverage
node_modules
temporary generated projects
local .tgz files
```

Create a local tarball:

```bash
npm pack -w @baseforge/create
```

## 7. Test The Tarball Locally

Create a temp directory outside the repo.

```bash
mkdir /tmp/baseforge-package-test
cd /tmp/baseforge-package-test
npm init -y
npm install /absolute/path/to/baseforge-create-version.tgz
```

Test the binary:

```bash
npx @baseforge/create --help
npx @baseforge/create my-app --yes
```

Check:

```bash
ls my-app
test -f my-app/package.json
test -f my-app/app/page.tsx
test ! -d my-app/src
```

Test full feature generation:

```bash
npx @baseforge/create full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Check expected files:

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
```

Do not publish if this fails.

## 8. Publish npm Package

Log in:

```bash
npm whoami
```

If not logged in:

```bash
npm login
```

Check registry:

```bash
npm view @baseforge/create name version dist-tags versions
```

For a scoped public package, publish with:

```bash
npm publish -w @baseforge/create --access public
```

For beta:

```bash
npm publish -w @baseforge/create --tag beta --access public
```

For stable:

```bash
npm publish -w @baseforge/create --tag latest --access public
```

Do not reuse an already-published version.

## 9. Verify Published CLI

In a fresh temp directory:

```bash
npx @baseforge/create@latest --help
npx @baseforge/create@latest my-app --yes
```

Verify:

```bash
test -f my-app/package.json
test -f my-app/app/page.tsx
test ! -d my-app/src
```

Test full feature generation:

```bash
npx @baseforge/create@latest full-app --yes --ui shadcn --database postgres --orm prisma --auth authjs-credentials --docker postgres
```

Do not run generated app code as part of publish verification unless you intentionally want a separate smoke test.

## 10. Deploy Website

Deploy after:

- website build passes
- CLI command is correct
- docs are accurate
- npm package is published or docs clearly say beta/not yet stable

After deployment, open the production URL and test:

```txt
/
/builder
/docs
```

Verify:

- landing CTA opens builder
- docs link works
- command UI is correct
- builder preview works
- download works
- no console/server errors
- mobile layout is usable

## 11. Post-Launch Checklist

After website deployment and npm publish:

```bash
npm view @baseforge/create version dist-tags
```

Verify public command:

```bash
npx @baseforge/create@latest my-app
```

Update docs if needed:

- remove beta wording after stable release
- remove "coming soon" CLI wording
- keep limitations accurate
- keep Auth.js credentials described as scaffold only

## 12. Rollback Notes

If website deployment fails:

- roll back to the previous deployment in your hosting provider
- fix locally
- rerun build/tests
- redeploy

If npm package has a bug:

- do not delete/reuse the version
- publish a patched version instead

Example:

```txt
0.1.0 broken
0.1.1 fixed
```

Then verify:

```bash
npm view @baseforge/create version dist-tags
npx @baseforge/create@latest my-app
```

## Final Ready Criteria

BaseForge is ready when:

- website production deployment works
- `/`, `/builder`, and `/docs` are live
- npm package is published
- `npx @baseforge/create@latest my-app` works
- generated project has no `src/`
- default generation works
- full-feature generation works
- docs match actual behavior
- no stale `create-launchkit` public command remains
