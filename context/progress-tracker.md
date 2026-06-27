# LaunchKit Progress Tracker

Use this file to track development progress, changes made, decisions, notes, blockers, and next steps.

## Current Status

```txt
Project: LaunchKit
Stage: Foundation setup
Current phase: Phase 1 / Phase 2
Primary focus: Repository structure, planning docs, and initial monorepo setup
```

## Phase Progress

| Phase   | Name                                  | Status      | Notes                                                            |
| ------- | ------------------------------------- | ----------- | ---------------------------------------------------------------- |
| Phase 1 | Product and Architecture Foundation   | In Progress | Project purpose, architecture, and build plan are being defined. |
| Phase 2 | Monorepo and Tooling Setup            | Not Started | Initial npm workspace setup, Next.js app, and packages.          |
| Phase 3 | Shared Schema and Compatibility Rules | Not Started | Will define config schema, options, defaults, and validation.    |
| Phase 4 | Generator Core                        | Not Started | Will build reusable project generation engine.                   |
| Phase 5 | Template Implementation               | Not Started | Will add base and feature templates.                             |
| Phase 6 | Website MVP                           | Not Started | Will build wizard UI, preview, and download flow.                |
| Phase 7 | Testing, Validation, and Hardening    | Not Started | Will add tests, smoke checks, and API safety.                    |
| Phase 8 | Launch Preparation                    | Not Started | Will prepare docs, deployment, and final MVP review.             |
| Phase 9 | Future CLI                            | Not Started | Deferred until website MVP is stable.                            |

## Change Log

Add entries in reverse chronological order.

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
|      |         |        |            |

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
- [ ] Run verification commands.

## Verification History

| Date | Command | Result | Notes |
| ---- | ------- | ------ | ----- |
|      |         |        |       |

## Release Notes Draft

Use this section to collect user-facing changes for future release notes.

### Unreleased

- Initial LaunchKit planning and repository foundation.
