# Memory - Phase 5 Templates Through shadcn/ui

Last updated: 2026-07-01 18:40 JST

## What was built

- Completed Phase 5 Step 4 and updated `context/progress-tracker.md`.
- Added optional shadcn/ui template files:
  - `packages/templates/features/shadcn/components.json`
  - `packages/templates/features/shadcn/lib/utils.ts`
  - `packages/templates/features/shadcn/components/ui/button.tsx`
  - `packages/templates/features/shadcn/app/globals.css`
- Added `shadcnTemplateId` from `@launchkit/templates`.
- Updated generator shadcn feature metadata to contribute `class-variance-authority`, `clsx`, and `tailwind-merge`.
- Updated generator shadcn feature metadata to reference `components.json`, `lib/utils.ts`, `components/ui/button.tsx`, and shadcn `app/globals.css`.
- Updated generator template loading so a provided `TemplateLoader` uses selected feature `templateFiles` when explicit `templateIds` are not supplied.
- Added tests covering shadcn template files, no-`src` aliases, `cn()` helper, `Button` exports, Tailwind v4 token CSS, no backend files, and selected-feature template loading.

## Decisions made

- shadcn templates use Tailwind v4-compatible CSS tokens.
- The generated shadcn `Button` avoids Radix `Slot`, so no Radix dependency is added.
- `lucide-react` is not added yet because no generated shadcn file imports icons.
- Filesystem template loading is still not implemented; feature files are represented through existing `templateFiles` metadata and optional `TemplateLoader` support.
- Backend templates remain separate and must start at Phase 5 Step 5.

## Problems solved

- Confirmed schema compatibility already enforces `shadcn/ui requires Tailwind CSS`; no schema change was needed.
- Fixed a nondeterministic template test assertion by sorting expected and actual file lists.
- The workspace build still fails inside the sandbox because Next/Turbopack cannot bind its worker process there; rerunning the same build outside the sandbox passes.

## Current state

- Progress tracker says Phase 5 Step 4 is complete and Phase 5 Step 5 is next.
- Verification passed:
  - `npm run typecheck -w @launchkit/templates`
  - `npm test -w @launchkit/templates` with 20 tests
  - `npm run typecheck -w @launchkit/generator`
  - `npm test -w @launchkit/generator` with 92 tests
  - `npm test -w @launchkit/schema` with 72 tests
  - `npm run typecheck`
  - `npm run test`
  - `npm run lint`
  - `npm run build` after elevated rerun outside the sandbox
- Current `git status --short` showed only untracked `.agents/prompts/phase-05/step-5.md` before saving this memory.
- No PostgreSQL, Prisma, Auth.js, Docker, website UI, CLI functionality, zip adapters, filesystem adapters, or filesystem template loading has been added.

## Next session starts with

- Read `context/progress-tracker.md`.
- Implement `.agents/prompts/phase-05/step-5.md`: Create PostgreSQL template.
- Keep the work scoped to PostgreSQL template files and metadata unless the prompt explicitly expands scope.

## Open questions

- None currently documented.
