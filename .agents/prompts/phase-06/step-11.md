# Phase 6 Step 11: Create Download Flow

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 10 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 12.
Do not add CLI functionality.
Do not put generator logic in UI components.
Do not run generated project code on the LaunchKit server.
Do not install generated project dependencies.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Implement the website download flow for generated LaunchKit projects.

Users should be able to:

1. Review their selected config.
2. Click a generate/download button.
3. Receive a zip file containing the generated project.

The flow should use the API route from Phase 6 Step 10:

```txt
POST /api/generate
```

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/components/builder/steps/download-step.tsx
apps/web/components/builder/download/download-button.tsx
apps/web/components/builder/download/download-status.tsx
apps/web/lib/download/create-project-zip.ts
apps/web/lib/api/client.ts
apps/web/components/builder/builder-shell.tsx
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Download Step UI

Implement the Download step in the wizard.

It should show:

- Project name.
- Selected package manager.
- Short selected stack summary.
- Generate/download button.
- Loading state.
- Success state.
- Error state.

Keep the UI compact and practical.

Do not make this a marketing confirmation page.

### 2. API Client

Create or update a typed client helper for:

```txt
POST /api/generate
```

It should:

- Send the current `LaunchKitConfig`.
- Handle non-2xx responses.
- Parse structured API errors.
- Return generated project data.

Do not duplicate generator logic in the client.

### 3. Zip Creation

Create a zip file from the generated project response.

Preferred browser-side approach:

- Use a small zip library if already installed.
- If no zip library exists, add one only if appropriate for the repo.

Good option:

```txt
jszip
```

If adding a dependency, add it to the correct workspace package:

```txt
apps/web
```

Do not add zip logic to `@launchkit/generator` unless the existing architecture already planned a zip adapter there.

### 4. Zip Contents

The zip should contain generated files under a top-level project folder:

```txt
{{projectName}}/
  package.json
  app/page.tsx
  ...
```

Example zip file name:

```txt
{{projectName}}.zip
```

File contents should come from the API response.

For each file:

- Use `utf8` contents as text.
- Use `base64` contents for binary files if present.

Do not include unsafe paths.
Do not include absolute paths.
Do not include paths containing `..`.
Do not include empty path segments.
Do not include `src/`.

### 5. Browser Download

Trigger the browser download after zip creation.

Use a safe browser approach:

- Create a Blob.
- Create an object URL.
- Create/click a temporary anchor.
- Revoke the object URL after use.

Do not write files to the server filesystem.

### 6. State Handling

The download flow should handle:

```txt
idle
generating
success
error
```

Disable the download button while generating.

Show a concise error message if:

- API validation fails.
- Compatibility validation fails.
- Generation fails.
- Zip creation fails.

Do not leak stack traces.

### 7. Validation Before Download

Before calling the API, validate the current config using:

```txt
@launchkit/schema
```

If invalid:

- Show concise errors.
- Do not call the API.

The API should still validate again server-side.

### 8. No Generated Code Execution

The download flow must not:

- Run generated project code.
- Install generated dependencies.
- Execute shell commands.
- Upload generated code anywhere.

It should only request generated file data and package it as a zip.

### 9. Visual Direction

Use token-based styling:

```txt
bg-background
text-foreground
bg-primary
text-primary-foreground
border-border
text-muted-foreground
ring-ring
bg-accent
```

Avoid repeated hardcoded color utilities:

```txt
bg-green-500
text-emerald-600
border-lime-400
```

Use existing shadcn/ui components if available:

```txt
Button
Alert
Badge
Separator
Progress
```

Do not nest cards inside cards.

## Tests

Use the test setup already present in the repo.

Add or update focused tests where practical.

Possible tests:

- Download step renders project summary.
- Download button is disabled while generating.
- Invalid config prevents API call.
- API errors render concise messages.
- Zip helper rejects unsafe paths.
- Zip helper rejects `src/` paths.
- Zip helper includes files under the top-level project folder.
- Zip helper handles UTF-8 file contents.
- Zip helper handles base64 file contents if supported.

If browser download behavior is hard to test in the current setup, test the pure zip/path helper and document UI manual verification in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

If app-specific commands exist, also run:

```bash
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

If adding a dependency, run:

```bash
npm install
```

or the appropriate workspace install command for the existing repo setup.

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the app can be run locally, manually verify:

1. Start the web app.
2. Complete the wizard with the default config.
3. Go to Download.
4. Click download.
5. Confirm a zip downloads.
6. Confirm the zip contains a top-level project folder.
7. Confirm the zip contains expected generated files.
8. Confirm no `src/` folder exists.

If local app startup is not possible, document why in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 6 Step 11 completed: Create download flow

Changes made:
- Added Download step UI.
- Added API client for POST /api/generate.
- Added zip creation helper.
- Added browser download trigger.
- Added loading, success, and error states.
- Added client-side validation before generation.
- Added path safety checks for zip contents.
- Confirmed generated code is not executed or installed.

Files changed:
- apps/web/components/builder/steps/download-step.tsx
- apps/web/components/builder/download/download-button.tsx
- apps/web/components/builder/download/download-status.tsx
- apps/web/lib/download/create-project-zip.ts
- apps/web/lib/api/client.ts
- apps/web/components/builder/builder-shell.tsx
- apps/web/package.json, if a dependency was added
- package-lock.json, if dependencies changed
- relevant test files, if added or changed
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
- Phase 6 Step 12: Responsive UI polish and Phase 6 verification
```

## Completion Criteria

This step is complete when:

- Download step renders in the wizard.
- Download button calls `POST /api/generate`.
- Generated project data is turned into a zip.
- Zip downloads in the browser.
- Zip contains a top-level project folder.
- Zip contains only safe relative paths.
- Zip does not include `src/`.
- Invalid config prevents API calls.
- API errors are shown clearly.
- Loading, success, and error states work.
- No generator logic is duplicated in UI components.
- Generated project code is not executed.
- Generated project dependencies are not installed.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
