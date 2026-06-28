# Phase 4 Step 9: Add Generator Tests

## Goal

Expand Vitest coverage for `packages/generator`.

This step should focus on testing the generator foundation created in Phase 4. It should **not** add new generator behavior unless a test exposes a real bug in already-scoped Phase 4 code.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review previous Phase 4 work:

```txt
.agents/prompts/phase-04/step-1.md
.agents/prompts/phase-04/step-2.md
.agents/prompts/phase-04/step-3.md
.agents/prompts/phase-04/step-4.md
.agents/prompts/phase-04/step-5.md
.agents/prompts/phase-04/step-6.md
.agents/prompts/phase-04/step-7.md
.agents/prompts/phase-04/step-8.md
```

## Scope

### You may

- Add or improve Vitest tests in `packages/generator`.
- Add test helpers.
- Refactor tests for clarity.
- Fix bugs found by tests if they are inside Phase 4 scope.
- Update `progress-tracker.md`.

### You must not

- Add real Next.js templates.
- Add real `shadcn/ui` templates.
- Add real Prisma/Auth.js template files.
- Add zip adapter.
- Add filesystem adapter.
- Build website UI.
- Add CLI functionality.
- Expand MVP option scope.

## Testing Tool

Use **Vitest only**.

Do **not** use:

- `node:test`
- Jest
- Mocha

Unless explicitly requested later.

If any `node:test` usage exists in `packages/generator`, replace it with Vitest.

## Suggested Test Structure

Follow the existing repository pattern.

Recommended structure:

```txt
packages/generator/src/
  file-tree.test.ts
  generation-plan.test.ts
  features/
    registry.test.ts
  package-json.test.ts
  env.test.ts
  template-loader.test.ts
  generate-project.test.ts
```

Or:

```txt
packages/generator/src/__tests__/
  file-tree.test.ts
  generation-plan.test.ts
  feature-registry.test.ts
  package-json.test.ts
  env.test.ts
  template-loader.test.ts
  generate-project.test.ts
```

## Required Test Coverage

### File Tree Model

Test:

- Valid root file path is accepted.
- Valid nested file path is accepted.
- Unsafe paths are rejected.
- Empty paths are rejected.
- Path traversal is rejected.
- Generated files preserve text contents.
- Generated files preserve binary contents.
- Generated project stores normalized safe file paths.

### Generation Plan Model

Test:

- Empty generation plan stores provided config.
- Base template is `"next"`.
- Features start empty.
- Package patch starts empty.
- Env list starts empty.
- Template files start empty.
- Generated files start empty.
- Notes start empty.

### Feature Registry

Test:

- Registry contains all MVP feature IDs.
- Default config enables `next` and `tailwind`.
- `shadcn` config enables `shadcn`.
- PostgreSQL config enables `postgres`.
- Prisma config enables `prisma`.
- Auth.js credentials config enables `authjs-credentials`.
- Docker postgres config enables `docker-postgres`.
- Feature definitions include labels and descriptions.

### Package.json Merge Utility

Test:

- Empty patch list returns an empty patch.
- Dependencies merge.
- Duplicate dependency with same version succeeds.
- Duplicate dependency with different version throws.
- Dev dependencies merge.
- Duplicate dev dependency with different version throws.
- Scripts merge.
- Duplicate script with same command succeeds.
- Duplicate script with different command throws.
- Metadata conflicts throw.
- Input patches are not mutated.

### Env Var Merge Utility

Test:

- Empty env groups return an empty array.
- Distinct env vars merge.
- Duplicate env with same value succeeds.
- Duplicate env with different value throws.
- First description is preserved.
- `required: true` wins.
- Output order follows first appearance.
- Input arrays are not mutated.
- `.env.example` rendering works if implemented.

### Template Loader Interface

Test:

- Known placeholders are replaced.
- Repeated placeholders are replaced.
- Unknown placeholders behave consistently.
- Context object is not mutated.
- Binary file contents are preserved.
- In-memory loader behavior works if implemented.
- Unsafe target paths are rejected if validation is implemented.

### Generate Project Pipeline

Test:

- Default config generates a project.
- Generated project name matches config.
- Package manager matches config.
- `package.json` exists.
- `.env.example` exists.
- `README.md` exists.
- `package.json` has correct name.
- npm README commands are used for npm config.
- pnpm README commands are used for pnpm config.
- PostgreSQL config includes `DATABASE_URL`.
- Auth.js config includes `AUTH_SECRET`.
- Prisma config includes Prisma dependencies/scripts.
- Invalid config rejects.
- Incompatible config rejects.
- Generated file paths are safe.

## Tasks

1. Review current generator tests.
2. Replace any non-Vitest tests with Vitest.
3. Add missing file tree tests.
4. Add missing generation plan tests.
5. Add missing feature registry tests.
6. Add missing `package.json` merge tests.
7. Add missing env var merge tests.
8. Add missing template loader tests.
9. Add missing generate project pipeline tests.
10. Fix Phase 4 bugs exposed by these tests.
11. Run relevant checks.
12. Update `progress-tracker.md`.

## Verification

Run:

```bash
npm run test
npm run typecheck
```

If available, also run:

```bash
npm run build
npm run lint
```

If the repo has workspace-specific scripts, also run generator-specific tests.

Examples:

```bash
npm run test --workspace @launchkit/generator
npm run typecheck --workspace @launchkit/generator
npm run build --workspace @launchkit/generator
```

Use the commands that match the actual workspace setup.

If a command fails, fix issues that are inside this step’s scope.

If the failure belongs to another phase or package, record it in `progress-tracker.md`.

## Progress Tracker Update

Update `progress-tracker.md` with:

- Step completed
- Files changed
- Test coverage added
- Bugs fixed, if any
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- Generator tests use Vitest.
- Tests cover all Phase 4 modules.
- Required test cases are covered.
- Phase 4 bugs found by tests are fixed or documented.
- Typecheck passes or unrelated failure is documented.
- Test command passes or unrelated failure is documented.
- No real templates are added.
- No zip/filesystem adapters are added.
- `progress-tracker.md` is updated.
