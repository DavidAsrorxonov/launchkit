# Phase 9 Step 1: Confirm CLI Scope and Package Strategy

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 8 is complete and the website MVP is stable.
4. Read this step prompt.
5. Implement only this planning/scope step.

Do not move to Phase 9 Step 2.
Do not create the CLI package yet unless the user explicitly asks to combine planning with setup.
Do not add CLI implementation code yet.
Do not duplicate generator logic.
Do not change website behavior.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Confirm the CLI scope, package strategy, command name, and implementation boundaries before building the LaunchKit CLI.

The CLI should become another interface over the existing shared generator foundation:

```txt
@launchkit/schema
@launchkit/generator
@launchkit/templates
```

The CLI must not duplicate schema, compatibility, template, or generator logic.

## Intended CLI Commands

The intended future user-facing commands are:

```bash
npx create-launchkit@latest
```

or:

```bash
npm create launchkit@latest
```

Confirm the final package/command naming before implementation.

## Scope

This step should update planning/tracking docs only.

Likely files:

```txt
context/progress-tracker.md
context/architecture.md
context/build-plan.md
README.md, only if Phase 9 planning belongs there
```

Adjust based on the actual repo structure.

Do not make broad docs rewrites.

## Decisions To Confirm

### 1. Package Location

Recommended package location:

```txt
packages/cli/
```

Confirm this fits the existing npm workspace setup:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

### 2. Package Name

Recommended package name:

```txt
create-launchkit
```

This supports:

```bash
npx create-launchkit@latest
```

For `npm create launchkit@latest`, confirm npm create package naming behavior before documenting it as supported.

Do not claim publish availability until the package is actually published.

### 3. Binary Name

Recommended binary name:

```txt
create-launchkit
```

Confirm the future `package.json` should include:

```json
{
  "bin": {
    "create-launchkit": "./dist/index.js"
  }
}
```

Exact path may change based on the build setup.

### 4. CLI MVP Scope

The CLI MVP should:

- ask for project options
- validate config with `@launchkit/schema`
- validate compatibility with shared schema helpers
- call `@launchkit/generator`
- write generated files to a target directory
- prevent unsafe path writes
- handle existing directories safely
- optionally offer dependency installation
- print next steps

The CLI MVP should not:

- support unsupported frameworks
- add JavaScript output
- add Pages Router
- generate `src/`
- implement user accounts
- save presets
- duplicate generator logic
- run generated app code
- automatically start dev servers

### 5. Prompting Strategy

Confirm the interactive prompt library.

Recommended options:

```txt
@inquirer/prompts
prompts
enquirer
```

Choose one based on repo conventions and package simplicity.

Do not add the dependency in this step unless explicitly approved.

### 6. Argument Parsing Strategy

Confirm the argument parsing library.

Recommended options:

```txt
commander
meow
node:util parseArgs
```

Since the project prefers Vitest but not Node's built-in test runner, using Node standard library for argument parsing is acceptable if it is simple enough.

Choose based on complexity and package size.

Do not add the dependency in this step unless explicitly approved.

### 7. Build Strategy

Confirm how the CLI package should build.

Recommended:

```txt
TypeScript source in src/
compiled output in dist/
ESM package
bin points to dist/index.js
```

The future CLI package should likely include:

```txt
packages/cli/
  package.json
  tsconfig.json
  src/
    index.ts
```

### 8. Filesystem Safety Strategy

Confirm that future CLI writing must:

- write only inside the chosen target directory
- reject generated paths with `..`
- reject absolute generated paths
- reject empty path segments
- handle existing files carefully
- never overwrite unrelated user files without confirmation

### 9. Dependency Install Strategy

Confirm that dependency installation should be optional.

Recommended flow:

```txt
Generate project files.
Ask whether to install dependencies.
If yes, run the selected package manager install command in the generated project directory.
If no, print next steps.
```

Do not install dependencies by default without user confirmation.

### 10. Test Strategy

Confirm future CLI tests should use Vitest.

Planned coverage:

- argument parsing
- prompt-to-config mapping
- schema validation
- compatibility handling
- generated file writing
- existing directory safety
- dependency install command construction
- next-step output

Do not use Node's built-in test runner.

## Deliverable

Update `progress-tracker.md` with confirmed Phase 9 Step 1 decisions.

Recommended entry:

```txt
Phase 9 Step 1 completed: Confirm CLI scope and package strategy

Decisions confirmed:
- CLI package location:
- package name:
- binary name:
- npm workspace strategy:
- argument parser:
- prompt library:
- build strategy:
- filesystem safety strategy:
- dependency install strategy:
- test strategy:

CLI MVP scope:
- ...

CLI non-goals:
- ...

Files changed:
- progress-tracker.md
- context/..., if planning docs were updated
- README.md, if appropriate

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 9 Step 2: Create CLI package foundation
```

## Verification

Run only lightweight checks if docs/planning files changed.

Recommended:

```bash
npm run typecheck
npm test
```

If this step only changes markdown planning files and the repo has no markdown checks, document that no code verification was required.

Use actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Completion Criteria

This step is complete when:

- CLI package location is confirmed.
- CLI package name is confirmed.
- CLI binary name is confirmed.
- CLI MVP scope is documented.
- CLI non-goals are documented.
- Argument parsing strategy is selected or explicitly deferred.
- Prompting strategy is selected or explicitly deferred.
- Build strategy is documented.
- Filesystem safety strategy is documented.
- Dependency install strategy is documented.
- Test strategy is documented.
- No CLI implementation code is added.
- `progress-tracker.md` is updated.

Then stop.
