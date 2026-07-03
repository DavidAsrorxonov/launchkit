# Memory — LaunchKit Phase 6 Download Flow

Last updated: 2026-07-03 12:01 JST

## What was built

Phase 6 Website MVP wizard is complete through Step 11, Download flow.

Completed recent steps:

- Step 10 API route:
  - Added `apps/web/app/api/generate/route.ts`.
  - Added server API helpers under `apps/web/lib/api/`.
  - `POST /api/generate` validates JSON/config/compatibility, calls `@launchkit/generator`, uses a web template loader, returns generated project JSON, and rejects unsafe generated paths.
  - Added focused API helper tests.
- Step 11 Download flow:
  - Added `apps/web/components/builder/steps/download-step.tsx`.
  - Added `apps/web/components/builder/download/download-button.tsx`.
  - Added `apps/web/components/builder/download/download-status.tsx`.
  - Added typed API client in `apps/web/lib/api/client.ts`.
  - Added shared API response types in `apps/web/lib/api/types.ts`.
  - Added browser-side zip helper in `apps/web/lib/download/create-project-zip.ts`.
  - Added API client and zip helper tests.
  - Wired Download into `apps/web/components/builder/builder-shell.tsx`.
  - Updated `apps/web/lib/builder/steps.ts`.
  - Added `jszip` to `apps/web/package.json` and updated `package-lock.json`.
  - Updated `context/progress-tracker.md` through Phase 6 Step 11. It now says the next suggested step is Phase 6 Step 12: Responsive UI polish and Phase 6 verification.

## Decisions made

- Step 10 API returns generated project JSON, and Step 11 creates the ZIP in the browser from that JSON response.
- The browser download flow uses `Blob`, object URL, temporary anchor click, and URL revocation.
- ZIP contents are always nested under a top-level project folder named after the generated project.
- ZIP helper validates response paths again on the client even though the API already validates generated paths.
- ZIP helper rejects absolute paths, `..`, empty segments, generated `src/` directory paths, and unsafe project folder names.
- `jszip` is used only in `apps/web`; no ZIP logic was added to `@launchkit/generator`.
- No generator logic belongs in UI components. UI calls the typed API client and browser ZIP helper only.
- No CLI functionality has been added.

## Problems solved

- `npm install jszip -w apps/web` failed in the sandbox because DNS could not resolve the npm registry. Rerunning with elevated permissions succeeded.
- npm audit output after installing `jszip` reports 2 moderate vulnerabilities. No `npm audit fix --force` was run because that would be an unrelated broad dependency change.
- Turbopack builds continue to fail inside the sandbox because worker process or port binding is not permitted. The same web and workspace builds pass when rerun with elevated permissions.
- Local browser/manual download QA was not run because the user said they will run the dev server locally.

## Current state

- Current tracker status: Phase 6 in progress; Download flow complete; Responsive UI polish and Phase 6 verification next.
- Step 11 verification passed:
  - `npm run typecheck -w apps/web`
  - `npm run lint -w apps/web`
  - `npm run test -w apps/web` passed: 3 test files, 16 tests.
  - `git diff --check`
  - `npm run build -w apps/web` passed outside sandbox.
  - `npm run typecheck`
  - `npm run test` passed across workspaces: web 16 tests, generator 111, schema 73, templates 51.
  - `npm run lint`
  - `npm run build` passed outside sandbox.
- Source search found no generated-code execution, generated dependency installation, CLI work, or Node built-in test runner usage in the Step 11 implementation.
- Workspace still has uncommitted Phase 6 changes and untracked Step prompt files.
- No local dev server is running from this session.

## Next session starts with

Implement Phase 6 Step 12: Responsive UI polish and Phase 6 verification. Start by reading `context/progress-tracker.md` and the Step 12 prompt in `.agents/prompts/phase-06/` if present.

Manual browser QA is important next: run the app locally, complete the wizard, click Generate ZIP, confirm the ZIP downloads, inspect that it contains a top-level project folder, expected generated files, and no `src/` folder.

## Open questions

- The Step 12 prompt has not been loaded yet.
- Decide whether to address npm audit's 2 moderate vulnerabilities now, defer to Phase 7 hardening, or document them as a known dependency audit item.
- The generator still does not expose a production filesystem template loader; the web API owns a server-side template loader under `apps/web/lib/api/template-loader.ts`.
