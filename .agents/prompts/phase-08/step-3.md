# Phase 8 Step 3: Create Dedicated Landing Page

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 8 Step 2 is complete, or confirm this revised Phase 8 plan with the user if the tracker still expects final QA as Step 3.
4. Review the attached landing-page inspiration screenshot from the user.
5. Read this step prompt.
6. Implement only this step.

Do not implement the dedicated documentation page in this step.
Do not start final launch QA in this step.
Do not add CLI functionality.
Do not claim the CLI is available unless it actually exists.
Do not add new generator options.
Do not change generator behavior.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create a dedicated LaunchKit landing page inspired by the attached screenshot.

The page should feel like a polished developer-product landing page with:

- premium interface
- large rounded hero frame
- green accent lighting
- command-style UI showing the future LaunchKit command
- clear path into the builder
- responsive behavior across mobile, tablet, and desktop

The landing page and documentation page should be separate surfaces.

## Revised Phase 8 Direction

The user wants Phase 8 to include separate landing and documentation work.

Recommended revised Phase 8 order:

```txt
Step 1: Prepare deployment and production readiness
Step 2: Add docs, supported stack, and limitations, if already completed
Step 3: Create dedicated landing page
Step 4: Create dedicated documentation page, if not already handled
Step 5: Final launch QA and Phase 8 verification
```

If the repo's `progress-tracker.md` still says Phase 8 has only 3 steps, update it carefully to reflect this revised plan.

## Scope

Work inside:

```txt
apps/web/
```

Recommended route structure:

```txt
apps/web/app/page.tsx
apps/web/app/builder/page.tsx
apps/web/components/landing/
  landing-page.tsx
  landing-nav.tsx
  landing-hero.tsx
  command-card.tsx
  hero-orbit-lines.tsx
  logo-strip.tsx
```

Adjust paths to match the existing app structure and conventions.

## Routing Requirement

Create a dedicated landing page and keep the builder accessible separately.

Recommended:

```txt
/          landing page
/builder   existing LaunchKit builder wizard
/docs      future dedicated documentation page
```

If the existing builder currently lives at `/`, move it to `/builder` with the smallest safe change.

Do not break the builder.

## Visual Inspiration

Use the attached screenshot as inspiration, not a direct copy.

The landing page should include similar high-level qualities:

- app themed outer background
- large rounded central hero surface
- soft green/cyan glow across the hero
- translucent pill navigation
- centered large headline
- subtle technical line/grid/orbit details
- small floating labels or nodes
- command-style UI block
- compact CTA buttons
- responsive composition

Use LaunchKit's brand direction instead of the screenshot's finance/asset language.

## Landing Content

Suggested content:

```txt
Headline:
One-click project generation for modern Next.js apps

Subheadline:
Choose your stack, preview the output, and download a ready-to-edit TypeScript project.

Primary CTA:
Open Builder

Secondary CTA:
View Docs
```

You may refine the copy, but keep it accurate and concise.

Do not claim unsupported features.

## Command UI

Add a command-style UI block that shows:

```bash
npx create-launchkit@latest
```

Important:

- The CLI is Phase 9 and is not built yet.
- If the command is shown before CLI release, label it clearly as planned, coming soon, or future CLI.
- Do not imply the command works today unless the package actually exists and is released.

Recommended UI text:

```txt
Future CLI
npx create-launchkit@latest
```

or:

```txt
CLI coming soon
npx create-launchkit@latest
```

The primary working CTA should be:

```txt
Open Builder
```

## Navigation

Add a compact nav appropriate for the landing page.

Recommended links:

```txt
LaunchKit logo/name
Builder
Docs
Supported Stack
GitHub, only if repo URL exists
```

Do not include irrelevant nav items from the screenshot such as pricing, DeFi app, assets, or account creation.

Do not add authentication/account UI.

## Design Requirements

Use:

- green accent theme
- dark background
- rounded hero container
- subtle border and glow
- token-based styling where possible
- responsive spacing
- readable text contrast

Avoid:

- one-note purple/blue gradients
- beige/brown palette
- decorative gradient blobs/orbs as standalone elements
- text overflow
- nested cards inside cards
- huge marketing-only layout that hides the actual product path

The screenshot has a dramatic glow; implement it as a restrained hero background treatment using CSS gradients or pseudo-elements, not random floating orb decorations.

## Responsive Requirements

Verify the landing page at:

```txt
mobile: 375px wide
tablet: 768px wide
desktop: 1280px wide
wide desktop: 1440px+ wide
```

Requirements:

- headline wraps cleanly
- nav does not overflow
- command UI fits on mobile
- CTA buttons remain usable
- hero frame remains visible and polished
- decorative technical lines do not overlap text
- landing content does not hide the builder CTA

Do not scale font size with viewport width.
Do not use negative letter spacing.

## Builder Preservation

The existing builder must continue to work.

Confirm:

- `/builder` renders the full wizard
- builder state still works
- preview still works
- download still works
- API route still works

If the builder remains at `/`, document why and ensure the landing page is reachable at a dedicated route such as `/landing`.

## Documentation Separation

Do not implement the documentation page in this step.

Add links or placeholders only if needed:

```txt
/docs
```

If `/docs` does not exist yet, the link may point to the future route only if the app handles it gracefully, or it may be disabled/omitted until the documentation step.

Prefer not to ship broken links.

## Tests

Use Vitest only.

Add or update tests where the current app setup supports it.

Possible tests:

- landing page renders headline
- landing page renders command UI
- command UI is labeled as future/coming soon if CLI is not released
- primary CTA links to `/builder`
- builder route still renders
- docs link is valid only if `/docs` exists

If frontend testing is not configured, document manual verification in `progress-tracker.md`.

## Verification

Run the relevant checks available in the repo.

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

Use actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Manual Verification

If the app can run locally:

1. Open `/`.
2. Confirm the dedicated landing page renders.
3. Confirm the design is inspired by the screenshot but branded for LaunchKit.
4. Confirm green accent lighting is present.
5. Confirm command UI displays `npx create-launchkit@latest`.
6. Confirm the command is labeled as future/coming soon if CLI is not released.
7. Click Open Builder and confirm `/builder` works.
8. Check mobile, tablet, desktop, and wide desktop sizes.
9. Confirm text and controls do not overlap.

If local app startup is not possible, document why.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 8 Step 3 completed: Create dedicated landing page

Changes made:
- Added dedicated landing page.
- Preserved builder as a separate route.
- Added landing hero inspired by the provided screenshot.
- Added green accent visual treatment.
- Added command-style UI for the future CLI command.
- Added CTA to the builder.
- Verified landing page responsiveness.
- Confirmed documentation remains a separate follow-up surface.

Files changed:
- apps/web/app/page.tsx
- apps/web/app/builder/page.tsx, if builder was moved
- apps/web/components/landing/..., if added
- relevant tests, if added or changed
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
- Phase 8 Step 4: Create dedicated documentation page
```

## Completion Criteria

This step is complete when:

- A dedicated landing page exists.
- The landing page is visually inspired by the attached screenshot.
- The landing page uses LaunchKit copy and green accents.
- The landing page includes a command-style UI with `npx create-launchkit@latest`.
- The command is clearly marked future/coming soon if CLI is not released.
- The builder remains accessible separately.
- Primary CTA opens the builder.
- Landing page is responsive on mobile, tablet, desktop, and wide desktop.
- Text and UI do not overlap.
- Documentation page is not implemented in this step.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
