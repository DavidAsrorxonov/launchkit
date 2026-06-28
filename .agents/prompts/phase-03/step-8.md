# Phase 3 Step 8: Verify Phase 3 Completion

## Goal

Verify that Phase 3 is complete and the schema package is ready for the generator phase.

This is a checkpoint step.

Do **not** start Phase 4 in this step.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

Also review all Phase 3 prompt files:

```txt
.agents/prompts/phase-03/step-1.md
.agents/prompts/phase-03/step-2.md
.agents/prompts/phase-03/step-3.md
.agents/prompts/phase-03/step-4.md
.agents/prompts/phase-03/step-5.md
.agents/prompts/phase-03/step-6.md
.agents/prompts/phase-03/step-7.md
.agents/prompts/phase-03/step-8.md
```

## Scope

### You may

- Review `packages/schema`.
- Run verification commands.
- Fix small issues inside Phase 3 scope.
- Update `progress-tracker.md`.
- Mark Phase 3 complete if appropriate.

### You must not

- Start generator implementation.
- Build templates.
- Build website UI.
- Add CLI functionality.
- Add unsupported options.

## Phase 3 Completion Checklist

Verify that:

- `@launchkit/schema` exists.
- MVP option arrays exist.
- MVP option types are exported.
- `LaunchKitConfigSchema` exists.
- `LaunchKitConfig` type is exported.
- Default config exists.
- Option metadata exists.
- Compatibility rules exist.
- Compatibility errors/messages are useful.
- All schema exports are available from the package entry.
- Vitest is used for schema tests.
- Node's built-in test runner is not used.
- Typecheck passes.
- Tests pass.
- Build passes if configured.
- Lint passes if configured.

## Required Verification Commands

Run:

```bash
npm run typecheck
npm run test
```

If available, also run:

```bash
npm run build
npm run lint
```

If the repo uses workspace-specific scripts, run the schema package checks directly as well.

Examples:

```bash
npm run typecheck --workspace @launchkit/schema
npm run test --workspace @launchkit/schema
npm run build --workspace @launchkit/schema
```

Use the commands that match the actual workspace setup.

## Progress Tracker Update

Update `progress-tracker.md` with:

- Phase 3 status
- Completed schema work
- Files changed
- Commands run
- Verification results
- Remaining open questions
- Blockers, if any
- Recommended next step

If everything is ready, set:

```txt
Phase 3: Complete
Phase 4: Ready
```

If not ready, leave Phase 3 as:

```txt
Phase 3: In Progress
```

Then explain what is missing.

## Done Criteria

This step is complete when:

- Phase 3 completeness has been reviewed.
- All required verification commands have been run.
- Any Phase 3 issues are fixed or documented.
- `progress-tracker.md` accurately reflects the status.
- The next action is clearly identified.
- No Phase 4 implementation has been started.
