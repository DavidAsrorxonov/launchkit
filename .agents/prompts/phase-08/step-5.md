# Phase 8 Step 5: Final Launch QA and Phase 8 Verification

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 8 Steps 1-4 are complete.
4. Read this step prompt.
5. Implement only this final QA and verification step.

Do not start Phase 9.
Do not add CLI functionality.
Do not add new product options.
Do not perform broad redesigns or refactors.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Perform final launch QA for the LaunchKit website MVP and mark Phase 8 complete only if the product is ready for demo or first public use.

Phase 8 should verify:

```txt
landing page
builder
documentation page
API generation route
download flow
production build
responsive UI
docs accuracy
known limitations
```

## Required QA Checklist

### 1. Routing

Confirm routes work:

```txt
/          dedicated landing page
/builder   LaunchKit builder wizard
/docs      dedicated documentation page
```

Confirm there are no broken primary nav links between:

```txt
Landing
Builder
Docs
```

### 2. Landing Page

Confirm:

- Landing page is visually polished.
- It uses LaunchKit copy and green accents.
- It includes command-style UI with `npx create-launchkit@latest`.
- The command is clearly labeled future/planned/coming soon if CLI is not released.
- Primary CTA opens the builder.
- Docs CTA/link opens `/docs`.
- Page is responsive.
- Text and decorative visuals do not overlap.

### 3. Builder

Confirm the full builder flow works:

```txt
1. Project
2. Framework
3. Styling and UI
4. Database
5. ORM
6. Auth
7. Extras
8. Preview
9. Download
```

Confirm:

- state persists across steps
- validation works
- compatibility rules work
- preview reflects selected options
- download produces a zip
- generated zip does not include `src/`

### 4. Documentation

Confirm `/docs` includes:

- overview
- quick start
- website builder flow
- supported stack
- generated project structure
- optional features
- environment variables
- scripts
- downloaded project usage
- compatibility rules
- limitations
- future CLI
- troubleshooting

Confirm docs are accurate and do not advertise unsupported options.

### 5. API And Download Safety

Confirm:

- `POST /api/generate` validates schema
- compatibility validation runs
- malformed/invalid requests are handled
- unsafe generated paths are rejected
- errors are structured
- stack traces/internal paths are not leaked
- generated code is not executed
- generated dependencies are not installed
- generated project files are not written to server disk

### 6. Production Readiness

Confirm:

- production build passes
- runtime boundaries are correct
- client components do not import server-only generator code
- website environment requirements are documented
- package scripts are clear
- no obvious unused launch-blocking dependencies exist

### 7. Responsive QA

Check:

```txt
mobile: 375px wide
tablet: 768px wide
desktop: 1280px wide
wide desktop: 1440px+ wide
```

Verify:

- landing page remains polished
- builder is usable
- docs are readable
- nav does not overflow
- code blocks scroll instead of breaking layout
- buttons remain usable
- no text overlaps
- no button text is clipped

## Verification Commands

Run the full available verification suite.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

App-specific if available:

```bash
npm run typecheck -w apps/web
npm test -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

Package-specific if relevant:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
npm test -w @launchkit/templates
```

Smoke tests if available and reasonable:

```bash
npm run test:smoke
```

Use actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the app can run locally:

1. Open `/`.
2. Verify landing page.
3. Navigate to `/builder`.
4. Complete default builder flow.
5. Download and inspect default zip.
6. Repeat with all compatible MVP features selected.
7. Navigate to `/docs`.
8. Verify docs accuracy and responsive layout.
9. Check mobile, tablet, desktop, and wide desktop layouts.

If local app startup is not possible, document why.

## Fix Policy

If final QA finds small launch-blocking issues:

- Fix them narrowly.
- Re-run relevant checks.
- Update tests if appropriate.

If final QA finds larger issues:

- Do not mark Phase 8 complete.
- Document blockers clearly.
- Suggest the exact next fix step.

## Progress Tracker Update

After verification, update `progress-tracker.md`.

If Phase 8 is complete, mark:

```txt
Phase 8: Complete
Website MVP: Ready
Phase 9: Deferred
```

Add an entry like:

```txt
Phase 8 Step 5 completed: Final launch QA and Phase 8 verification

Changes made:
- Verified landing page.
- Verified builder flow.
- Verified documentation page.
- Verified API generation route.
- Verified download flow.
- Verified production build readiness.
- Verified responsive layouts.
- Verified docs accuracy and limitations.
- Fixed any small in-scope launch QA issues.

Files changed:
- relevant files, if fixes were needed
- relevant test files, if changed
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
- Phase 9 remains deferred until the website MVP is stable in real use.
```

If Phase 8 is not complete, record:

```txt
Phase 8: In progress
Blocked/missing:
- ...

Next suggested step:
- Fix the listed launch blocker before marking the website MVP ready.
```

## Completion Criteria

This step is complete when:

- Landing page is verified.
- Builder is verified.
- Documentation page is verified.
- API route is verified.
- Download zip flow is verified.
- Production build passes, or unrelated blockers are documented.
- Tests pass, or unrelated failures are documented.
- Lint/typecheck pass, or unrelated failures are documented.
- Responsive QA is complete.
- Docs are accurate.
- Known limitations are documented.
- `progress-tracker.md` is updated.
- Phase 8 is marked complete only if the website MVP is genuinely ready.

Then stop.
