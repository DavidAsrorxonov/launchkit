# Phase 7 Step 6: Improve User-Facing Errors and Failure States

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Step 5 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 7 Step 7.
Do not add new product options.
Do not add CLI functionality.
Do not change generator behavior unless a tiny fix is required for a clear error.
Do not put generator logic in `apps/web`.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Improve the website's user-facing errors and failure states across the builder wizard, preview, API generation, and download flow.

This step should make failures clear, actionable, and consistent without leaking internal implementation details.

## Scope

Work mainly inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/...
apps/web/components/builder/steps/...
apps/web/components/builder/download/...
apps/web/lib/builder/validation.ts
apps/web/lib/api/client.ts
apps/web/lib/api/errors.ts
apps/web/lib/download/create-project-zip.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Error Message Inventory

Review existing user-facing errors for:

- Project name validation.
- Incompatible selections.
- Preview generation/planning failures.
- API validation failures.
- API compatibility failures.
- API unexpected failures.
- Download request failures.
- Zip creation failures.
- Unsafe generated output failures.

Make messages consistent and useful.

### 2. Validation Errors

Project name errors should be concise and specific.

Good examples:

```txt
Use lowercase letters, numbers, and hyphens only.
Project name is required.
Project name cannot contain path separators.
```

Avoid vague messages:

```txt
Invalid input.
Something went wrong.
```

### 3. Compatibility Errors

Compatibility errors should explain what the user can change.

Required cases:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
shadcn/ui requires Tailwind CSS.
```

Auth.js credentials should not incorrectly require a database.

Messages should be shown near the relevant step or in a clear wizard-level error area.

### 4. Preview Failure States

If preview cannot be generated:

- Show a concise error.
- Keep the user's selections intact.
- Do not show stale preview data as if it is current.
- Do not expose stack traces.

If preview data is unavailable because generator planning is server-only, show a useful fallback state rather than a broken UI.

### 5. API Error Handling

The client should parse structured API errors from Phase 7 Step 5.

Handle error codes such as:

```txt
invalid_content_type
request_too_large
invalid_json
invalid_config
incompatible_config
generation_failed
unsafe_generated_output
```

Map them to user-facing messages.

Do not display raw server errors, stack traces, or internal file paths.

### 6. Download Failure States

The Download step should clearly handle:

```txt
idle
generating
success
error
```

Confirm:

- Button is disabled while generating.
- User can retry after failure.
- Error state does not clear selected config.
- Success state confirms the zip was prepared/downloaded.
- Zip creation errors show a concise message.

### 7. Empty And Loading States

Review empty/loading states for:

- Preview dependency lists.
- Preview env vars.
- Preview file tree.
- Download generation.

Use compact, practical messages.

Examples:

```txt
No environment variables for this selection.
No optional dependencies added.
Preparing project zip...
```

Do not over-explain implementation details.

### 8. Accessibility Basics

Improve error accessibility where practical:

- Associate input errors with the relevant input.
- Use `aria-invalid` for invalid fields.
- Use `aria-describedby` for inline errors.
- Ensure alert/error areas are announced where appropriate.
- Preserve keyboard navigation.

Do not introduce a large accessibility refactor.

### 9. Visual Consistency

Errors should match the existing UI style.

Use token-based classes:

```txt
text-destructive
border-destructive
bg-destructive/...
text-muted-foreground
border-border
```

Use existing shadcn/ui components if available:

```txt
Alert
Button
Badge
Separator
```

Avoid repeated hardcoded color utilities:

```txt
text-red-500
bg-red-100
border-red-400
```

Do not nest cards inside cards.
Do not add decorative gradient blobs/orbs.

### 10. No Scope Expansion

Do not add:

- new generated project options
- new auth providers
- new database providers
- new template features
- CLI behavior
- account/login behavior for LaunchKit itself
- saved presets

This step is only error and failure-state polish.

## Tests

Use Vitest only.

Add or update focused tests where the current setup supports it.

Possible tests:

- Invalid project name shows useful message.
- Incompatible Prisma/PostgreSQL state shows useful message.
- API structured errors map to friendly messages.
- Download button disables while generating.
- Download error allows retry.
- Zip helper unsafe path error maps to a friendly message.
- Raw stack traces are not rendered.

If the repo does not have frontend component testing configured, test pure helpers such as error mappers and validation helpers, then document manual UI verification in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w apps/web
npm test -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
npm test
npm run typecheck
```

Run smoke tests if available and reasonable:

```bash
npm run test:smoke
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the web app can run locally, manually verify:

1. Invalid project names show clear inline errors.
2. Prisma cannot be selected without PostgreSQL, or shows a clear reason.
3. Docker PostgreSQL cannot be selected without PostgreSQL, or shows a clear reason.
4. Preview errors are clear and do not show stale data.
5. Download API errors are clear.
6. Download can be retried after failure.
7. Loading and success states are visible.
8. No raw stack trace or internal path appears in the UI.

If local app startup is not possible, document why in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 7 Step 6 completed: Improve user-facing errors and failure states

Changes made:
- Reviewed builder validation and failure states.
- Improved project name validation messages.
- Improved compatibility error display.
- Improved preview failure states.
- Improved API error mapping.
- Improved download loading, success, and error states.
- Added or verified accessibility basics for errors.
- Confirmed internal errors are not leaked to users.

Files changed:
- apps/web/components/builder/..., if changed
- apps/web/components/builder/steps/..., if changed
- apps/web/components/builder/download/..., if changed
- apps/web/lib/builder/validation.ts, if changed
- apps/web/lib/api/client.ts, if changed
- apps/web/lib/api/errors.ts, if changed
- apps/web/lib/download/create-project-zip.ts, if changed
- relevant test files
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
- Phase 7 Step 7: Verify Phase 7 completion
```

## Completion Criteria

This step is complete when:

- Project name errors are clear.
- Compatibility errors are clear.
- Preview failure states are clear.
- API errors are mapped to friendly messages.
- Download loading, success, and error states work.
- Retry after download failure is possible.
- Errors do not clear user selections unnecessarily.
- Raw stack traces and internal paths are not shown to users.
- Basic error accessibility is improved where practical.
- Tests are added or updated where practical.
- Tests use Vitest.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
