# LaunchKit Progress Tracker

Use this file to track development progress, changes made, decisions, notes, blockers, and next steps.

## Current Status

```txt
Project: LaunchKit
Stage: Foundation setup
Current phase: Phase 3 Step 1
Primary focus: Schema package foundation
```

## Phase Progress

| Phase   | Name                                  | Status      | Notes                                                            |
| ------- | ------------------------------------- | ----------- | ---------------------------------------------------------------- |
| Phase 1 | Product and Architecture Foundation   | In Progress | Project purpose, architecture, and build plan are being defined. |
| Phase 2 | Monorepo and Tooling Setup            | In Progress | Schema package blocker fixed; workspace checks still blocked by generator tsconfig. |
| Phase 3 | Shared Schema and Compatibility Rules | In Progress | Step 1 schema package foundation completed; full schema not started. |
| Phase 4 | Generator Core                        | Not Started | Will build reusable project generation engine.                   |
| Phase 5 | Template Implementation               | Not Started | Will add base and feature templates.                             |
| Phase 6 | Website MVP                           | Not Started | Will build wizard UI, preview, and download flow.                |
| Phase 7 | Testing, Validation, and Hardening    | Not Started | Will add tests, smoke checks, and API safety.                    |
| Phase 8 | Launch Preparation                    | Not Started | Will prepare docs, deployment, and final MVP review.             |
| Phase 9 | Future CLI                            | Not Started | Deferred until website MVP is stable.                            |

## Change Log

Add entries in reverse chronological order.

### 2026-06-27

Changes:

- Completed Phase 3 Step 1: Create Schema Package Foundation.
- Reviewed the schema package structure and confirmed `package.json`, `tsconfig.json`, `src/index.ts`, and Vitest config are present.
- Confirmed the package is named `@launchkit/schema` and has `build`, `typecheck`, and `test` scripts.
- Kept the existing placeholder export and test; no real LaunchKit config schema, compatibility rules, option metadata, generator logic, UI, templates, or CLI functionality were added.
- Removed the invalid TypeScript `ignoreDeprecations: "6.0"` setting from `packages/schema/tsconfig.json`.

Files changed:

- `packages/schema/tsconfig.json`
- `context/progress-tracker.md`

Notes:

- `@launchkit/schema` typechecks successfully on its own.
- Workspace typecheck and build now get past `@launchkit/schema`.
- Workspace typecheck and build are still blocked by `packages/generator/tsconfig.json` using the same invalid `ignoreDeprecations: "6.0"` setting. This was left unchanged because it is outside Phase 3 Step 1 scope and was already modified before this step.
- The first sandboxed `npm run build` hit the known Turbopack process/port restriction in `apps/web`. Rerunning the build outside the sandbox confirmed the web app builds successfully.

Commands run:

```bash
sed -n '1,260p' .agents/prompts/phase-03/step-1.md
rg --files packages/schema packages/generator packages/shared packages/templates apps/web
sed -n '1,220p' packages/schema/src/index.ts
sed -n '1,220p' packages/schema/src/index.test.ts
sed -n '1,240p' package.json
sed -n '1,220p' packages/schema/package.json
sed -n '1,220p' packages/schema/tsconfig.json
sed -n '1,220p' packages/schema/vitest.config.ts
sed -n '1,220p' tsconfig.base.json
npm run typecheck
npm run typecheck -w packages/schema
npm run test
npm run build
npm run lint
npm run build
sed -n '1,160p' packages/generator/tsconfig.json
git status --short
```

Verification:

- [ ] Workspace typecheck passed
- [x] Schema package typecheck passed
- [x] Lint passed
- [ ] Workspace build passed
- [x] Package tests passed

Verification result:

- `npm run typecheck -w packages/schema` passed.
- `npm run test` passed: schema package Vitest suite ran 1 test successfully.
- `npm run lint` passed.
- `npm run typecheck` failed in `@launchkit/generator` because `packages/generator/tsconfig.json` contains invalid `ignoreDeprecations: "6.0"`.
- `npm run build` failed in the sandbox because Turbopack could not create/bind its worker process. Rerunning with elevated permissions confirmed the web app builds successfully, but the workspace build still fails in `@launchkit/generator` for the invalid `ignoreDeprecations` setting.

Next suggested step:

- Fix the generator package TypeScript config blocker in `packages/generator/tsconfig.json`, then rerun `npm run typecheck`, `npm run build`, `npm run test`, and `npm run lint`.

### 2026-06-27

Changes:

- Implemented Phase 2.5 testing setup with Vitest.
- Added a root workspace `test` script.
- Added a schema package `test` script and Vitest config.
- Added an initial schema package test for the current schema entry point.
- Excluded schema test files from package build output.
- Updated `package-lock.json` after installing Vitest.

Files changed:

- `package.json`
- `package-lock.json`
- `packages/schema/package.json`
- `packages/schema/tsconfig.json`
- `packages/schema/vitest.config.ts`
- `packages/schema/src/index.test.ts`
- `context/progress-tracker.md`

Notes:

- The initial sandboxed `npm install` failed because network DNS resolution was blocked. It was rerun with approved network access and completed.
- `npm install` reported 2 moderate vulnerabilities from the current dependency graph.
- Broader typecheck/build verification is blocked by `packages/schema/tsconfig.json` using `ignoreDeprecations: "6.0"`, which is invalid for the installed TypeScript version.

Commands run:

```bash
sed -n '1,240p' agent-instructions.md
sed -n '1,260p' context/progress-tracker.md
sed -n '1,260p' context/build-plan.md
sed -n '261,520p' context/build-plan.md
sed -n '521,900p' context/build-plan.md
sed -n '1,260p' context/project-overview.md
sed -n '261,520p' context/project-overview.md
sed -n '521,780p' context/project-overview.md
sed -n '1,260p' context/architecture.md
sed -n '261,520p' context/architecture.md
sed -n '521,780p' context/architecture.md
sed -n '781,980p' context/architecture.md
sed -n '1,260p' context/ui-rules.md
sed -n '261,520p' context/ui-rules.md
rg --files
rg '"vitest"|vitest' package-lock.json package.json packages apps
npm install
npm test
npm run lint
npm run typecheck
npm run build
```

Verification:

- [ ] Typecheck passed
- [x] Lint passed
- [ ] Build passed
- [x] Package tests passed

Verification result:

- `npm test` passed: schema package Vitest suite ran 1 test successfully.
- `npm run lint` passed.
- `npm run typecheck` failed in `@launchkit/schema` because `ignoreDeprecations: "6.0"` is invalid.
- `npm run build` was rerun with elevated permissions after a sandbox-specific Turbopack process/port error. The web app built successfully outside the sandbox, but the workspace build still failed in `@launchkit/schema` for the same invalid `ignoreDeprecations` setting.

Next suggested step:

- Fix the schema package TypeScript config blocker, then rerun `npm run typecheck` and `npm run build` before proceeding beyond Phase 2 tooling completion.

### YYYY-MM-DD

Changes:

-

Notes:

-

Commands run:

```bash

```

Verification:

- [ ] Typecheck passed
- [ ] Lint passed
- [ ] Build passed
- [ ] Manual test completed

## Decisions

Record important product and engineering decisions here.

| Date       | Decision                                                                | Reason                                                                                |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 2026-06-27 | LaunchKit will be TypeScript-first.                                     | Keeps the website, generator, future CLI, and generated projects strongly typed.      |
| 2026-06-27 | Build the website first and CLI later.                                  | Website is the first product surface; CLI should reuse the same generator core later. |
| 2026-06-27 | Use a shared generator core.                                            | Prevents duplicated logic between website and future CLI.                             |
| 2026-06-27 | Use npm workspaces.                                                     | Matches the preferred package manager.                                                |
| 2026-06-27 | Generated projects should use Next.js App Router with no `src/` folder. | Keeps the generated starter simple and modern.                                        |
| 2026-06-27 | Include `.env.example` and README in generated projects.                | Improves setup clarity for developers.                                                |
| 2026-06-27 | Auth.js should start as a credentials scaffold only.                    | Avoids pretending to generate a complete production auth system.                      |
| 2026-06-27 | Docker should be optional.                                              | Useful for PostgreSQL, but should not be forced on every generated project.           |

## Notes

Use this section for general implementation notes.

- Keep generation logic out of `apps/web`.
- Shared config and validation belong in `packages/schema`.
- Reusable generation logic belongs in `packages/generator`.
- Templates belong in `packages/templates`.
- Shared utilities belong in `packages/shared`.
- Future CLI should call the same generator package as the website.

## Blockers

| Date | Blocker | Status | Resolution |
| ---- | ------- | ------ | ---------- |
| 2026-06-27 | `packages/generator/tsconfig.json` has invalid `ignoreDeprecations: "6.0"` for the installed TypeScript version. | Open | Fix the setting, then rerun workspace typecheck and build. |
| 2026-06-27 | `packages/schema/tsconfig.json` has invalid `ignoreDeprecations: "6.0"` for the installed TypeScript version. | Resolved | Removed the invalid setting; schema package typecheck now passes. |

## Open Questions

Track questions that still need a decision.

- Should the first MVP support both `npm` and `pnpm` in generated projects, or only `npm` first?
- Should generated PostgreSQL projects include Docker Compose by default when Docker is selected?
- Should the preview show only file tree and metadata, or also selected file contents later?
- Should generated projects include example tests in the MVP?

## Next Actions

Update this list as development progresses.

- [ ] Create repository structure.
- [ ] Add `context/` planning files.
- [ ] Add `.agents/` instructions.
- [ ] Initialize npm workspaces.
- [ ] Create Next.js app using `npx create-next-app@latest apps/web`.
- [ ] Initialize shadcn/ui in `apps/web`.
- [ ] Create package folders.
- [ ] Add placeholder exports for shared packages.
- [ ] Configure typecheck, lint, and build scripts.
- [x] Add Vitest package-level test runner.
- [x] Complete Phase 3 Step 1 schema package foundation.
- [ ] Fix generator TypeScript config blocker.
- [ ] Run verification commands.

## Verification History

| Date | Command | Result | Notes |
| ---- | ------- | ------ | ----- |
| 2026-06-27 | `npm test` | Passed | Vitest ran the schema package test suite successfully. |
| 2026-06-27 | `npm run lint` | Passed | Workspace lint completed successfully. |
| 2026-06-27 | `npm run typecheck -w packages/schema` | Passed | Schema package typechecked successfully after removing invalid `ignoreDeprecations`. |
| 2026-06-27 | `npm run typecheck` | Failed | Schema passed; workspace blocked by invalid `ignoreDeprecations: "6.0"` in `packages/generator/tsconfig.json`. |
| 2026-06-27 | `npm run build` | Failed | Web app built outside sandbox; workspace build failed at generator TypeScript config. |
| 2026-06-27 | `npm run typecheck` | Failed | Blocked by invalid `ignoreDeprecations: "6.0"` in `packages/schema/tsconfig.json`. |
| 2026-06-27 | `npm run build` | Failed | Web app built outside sandbox; workspace build failed at schema TypeScript config. |

## Release Notes Draft

Use this section to collect user-facing changes for future release notes.

### Unreleased

- Initial LaunchKit planning and repository foundation.
