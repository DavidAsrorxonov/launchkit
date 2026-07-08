# Memory - Phase 9 CLI Handoff

Last updated: 2026-07-06 11:41 JST

## What was built

Phase 9 CLI work is implemented through Step 4 and documented in `context/progress-tracker.md`.

Completed Phase 9 work:

- Step 1: confirmed CLI scope and package strategy.
- Step 2: created the `packages/cli` workspace package named `create-launchkit`.
- Step 3: added typed CLI argument parsing with `node:util` `parseArgs`.
- Step 4: added interactive prompt flow and config draft assembly.

Current CLI files of interest:

- `packages/cli/package.json`
- `packages/cli/src/index.ts`
- `packages/cli/src/args.ts`
- `packages/cli/src/args.test.ts`
- `packages/cli/src/prompts.ts`
- `packages/cli/src/prompts.test.ts`

Step 4 added `@inquirer/prompts` and updated `package-lock.json`.

## Decisions made

The CLI package is `create-launchkit` with binary name `create-launchkit`.

The CLI remains a thin interface over shared packages. It must not duplicate schema, compatibility, template, or generator logic.

Argument parsing uses Node standard library `node:util` `parseArgs`.

Interactive prompts use `@inquirer/prompts`.

Prompt code is structured with injectable prompt functions so tests do not require real terminal input.

The CLI draft always includes fixed MVP values:

- `framework: "next"`
- `language: "typescript"`
- `router: "app"`
- `projectStructure: "no-src"`
- `styling: "tailwind"`

Unsupported framework, language, router, project-structure, and styling prompts must not be added.

Vitest remains the test runner. Do not introduce Node's built-in test runner.

## Problems solved

The CLI now handles:

- optional positional target directory;
- `--name`;
- `--package-manager npm|pnpm`;
- `--ui none|shadcn`;
- `--database none|postgres`;
- `--orm none|prisma`;
- `--auth none|authjs-credentials`;
- `--docker none|postgres`;
- `--yes/-y`;
- `--help/-h`;
- `--version/-v`;
- typed argument errors through `CliArgumentError`;
- help and version output.

The prompt flow now handles:

- `--yes` without running prompts;
- using CLI args as defaults or skip conditions;
- defaulting missing values from `defaultLaunchKitConfig`;
- project-name default from positional target dir;
- `--name` overriding positional target dir for config name;
- Prisma skipped/reset to `none` unless database is PostgreSQL;
- Docker PostgreSQL skipped/reset to `none` unless database is PostgreSQL;
- Auth.js credentials without forcing PostgreSQL.

Known environment behavior:

- Sandboxed `npm install @inquirer/prompts -w create-launchkit` failed with DNS `ENOTFOUND registry.npmjs.org`; escalated install passed.
- Sandboxed `npm run build` fails because Next/Turbopack cannot create a process or bind to a port in the sandbox.
- Escalated `npm run build` passes.

## Current state

`context/progress-tracker.md` currently says:

- Phase 6: `Complete`
- Phase 7: `Complete`
- Phase 8: `Complete`
- Phase 9: `In Progress`
- Current phase: Phase 9 Step 4 CLI interactive prompts completed.
- Next scope: schema validation.

Latest verification from Step 4:

- `npm run typecheck -w create-launchkit` passed.
- `npm test -w create-launchkit` passed: 3 files, 37 tests.
- `npm run build -w create-launchkit` passed.
- `npm run typecheck` passed across workspaces.
- `npm test` passed across workspaces:
  - web: 5 files, 49 tests;
  - cli: 3 files, 37 tests;
  - generator: 11 files, 127 tests;
  - schema: 5 files, 87 tests;
  - templates: 1 file, 52 tests.
- `npm run lint` passed.
- Escalated `npm run build` passed across workspaces.
- `git diff --check` passed.

Current visible git state before this memory save showed:

- `.agents/prompts/phase-09/step-5.md` untracked.

## Next session starts with

Implement Phase 9 Step 5: connect the CLI config draft to shared schema validation.

Start by reading:

1. `memory.md`
2. all files in `context/`
3. `context/progress-tracker.md`
4. `.agents/prompts/phase-09/step-5.md`
5. current CLI files under `packages/cli/src/`
6. schema validation and compatibility helpers under `packages/schema/src/`

Keep Step 5 scoped to validation only unless the prompt explicitly says otherwise. Do not connect to the generator, write files to disk, install generated project dependencies, or add full generation behavior.

## Open questions

What exact Step 5 validation shape should the prompt require: raw `LaunchKitConfigSchema` validation only, compatibility validation too, or a CLI-specific wrapper around both?

Should invalid CLI draft errors be formatted with the existing `CliArgumentError` style or a new CLI validation error type?
