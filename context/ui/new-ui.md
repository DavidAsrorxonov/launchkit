# BaseForge New UI Notes

Use this file to continue the landing-page UI work without losing the current design direction.

## Current Direction

- The website UI is being redesigned with inspiration from `insforge.dev`.
- The preferred look is dark/black mode with restrained yellow accents.
- UI work should be changed only when explicitly requested by the user.
- Keep changes scoped. Do not redesign unrelated sections unless asked.
- Avoid broad glow effects. Use glow only when explicitly requested and keep it subtle.
- Several newer landing sections intentionally use black/white/blue accents instead of theme `primary`.

## Completed So Far

### Dark Mode

- The web app is now forced into dark mode from the root layout.
- File changed:
  - `apps/web/app/layout.tsx`
- Implementation:
  - Added `dark` to the root `<html>` class.

### Dark Theme Tokens

- The theme palette was changed from the earlier green-accent direction to a warmer yellow-accent direction.
- File changed:
  - `apps/web/app/globals.css`
- Main changes:
  - `primary`, `ring`, chart colors, and sidebar primary now use yellow/warm values.
  - Dark mode uses neutral black/gray surfaces.
  - `primary-foreground` is black, which works with the yellow primary.
  - The token-based styling model is still intact.
  - Some landing sections intentionally override token accents with `blue-*` utility classes.

### Landing Navbar

- The landing navbar was redesigned to match the InsForge-style layout more closely.
- File changed:
  - `apps/web/components/landing/landing-nav.tsx`
- Current navbar behavior/style:
  - Full-width.
  - Sticky at the top with `sticky top-0 z-50`.
  - Compact height using `min-h-14` and reduced vertical padding.
  - Dark translucent background with a bottom border.
  - No green glow.
  - No pill/background treatment around nav links.
  - Link hover changes text color only.

### Navbar Content

- Left:
  - Uses the local favicon image:
    - `/favicon/favicon-96x96.png`
  - Shows the logo next to `BaseForge`.
  - The logo is not inverted; it should render as provided by the favicon asset.
- Middle nav group:
  - `Builder` -> `/builder`
  - `Supported Stack` -> `#supported-stack`
  - `Docs` -> `/docs`
- Right external link group:
  - NPM icon plus `NPM`
    - `https://www.npmjs.com/package/@baseforge/create`
  - GitHub icon plus `GitHub`
    - `https://github.com/DavidAsrorxonov/baseforge`
  - Telegram icon only
    - `https://t.me/whoisdave02`

### Navbar Icons

- The navbar uses the user-provided icon components:
  - `apps/web/components/icons/npm.tsx`
  - `apps/web/components/icons/github.tsx`
  - `apps/web/components/icons/telegram.tsx`
- These icon files are currently untracked in git status, but they are intentionally used by the navbar.

### Landing Hero

- File changed:
  - `apps/web/components/landing/landing-hero.tsx`
- Current hero direction:
  - Dark full-width section with visible checkered/grid background.
  - No green glow.
  - Headline is lighter weight and smaller than the original oversized version.
  - Primary button: `Open Builder`.
  - Secondary button: `Docs`.
  - Simple command box is rendered below the CTAs.

### Command Box

- File changed:
  - `apps/web/components/landing/command-card.tsx`
- Current behavior/style:
  - Client component.
  - Shows only the command and copy button.
  - Command currently displayed:
    - `npx @baseforge/create@latest`
  - Copy button writes the command to clipboard.
  - Copy success changes the icon to a check and shows `Copied` on larger screens.

### CLI Workflow Section

- File changed:
  - `apps/web/components/landing/cli-demo-section.tsx`
- Wired from:
  - `apps/web/components/landing/landing-page.tsx`
- Current design:
  - Replaces the earlier workflow strip and supported-stack grid.
  - Left side: explanatory cards for what BaseForge assembles.
  - Right side: black terminal UI animation.
  - Terminal text is white with blue `>`/selection markers.
  - No green terminal styling.
  - Animation types through the real CLI flow:
    - `npx @baseforge/create@latest`
    - project name
    - package manager
    - UI library
    - database
    - ORM
    - auth
    - Docker
    - generated project output
  - Section keeps the `id="supported-stack"` anchor so the navbar `Supported Stack` link still lands in this area.

### Stack Power Section

- File changed:
  - `apps/web/components/landing/stack-power-section.tsx`
- Wired from:
  - `apps/web/components/landing/landing-page.tsx`
- Purpose:
  - Shows BaseForge powering the generated stack.
- Current layout:
  - Center BaseForge logo uses `/favicon/favicon.svg`.
  - Logo is inside a tight white-bordered square box.
  - The logo nearly fills the box; the white border remains visible.
  - No logo glow.
  - Stack cards are placed to the left and right of the logo, not above/below.
  - Stack cards are intentionally scattered so they are not too close to each other.
  - Straight segmented connector lines run from the white logo-box border to stack cards.
  - Connector lines touch the logo box border visually but do not cross over the logo.
  - A subtle animated splash travels outward from the logo toward each stack.
  - Each splash uses the corresponding stack color and is short/narrow.
  - Background uses a visible checkered/grid pattern with top fade.
- Stack icons currently used:
  - `apps/web/components/icons/next.tsx`
  - `apps/web/components/icons/tailwind.tsx`
  - `apps/web/components/icons/prisma.tsx`
  - `apps/web/components/icons/docker.tsx`
  - `apps/web/components/icons/postgresql.tsx`
  - `apps/web/components/icons/shadcn.tsx`
  - `apps/web/components/icons/authjs.tsx`
  - `apps/web/components/icons/npm.tsx`

### Workflow Comparison Section

- File changed:
  - `apps/web/components/landing/workflow-comparison-section.tsx`
- Wired from:
  - `apps/web/components/landing/landing-page.tsx`
- Current design:
  - Professional black/white/blue comparison section.
  - No green or yellow token accents inside this section except inherited text/background tokens.
  - No `VS` graphic.
  - Uses one framed comparison surface with shared header:
    - `Same generator, same project output`
  - Left panel: Web Builder mock with selected stack and file preview.
  - Right panel: CLI terminal mock and direct command snippet.
  - Focus rings and terminal markers are blue.

### Landing Footer

- File changed:
  - `apps/web/components/landing/landing-footer.tsx`
- Wired from:
  - `apps/web/components/landing/landing-page.tsx`
- Current design:
  - Simple footer with NPM and GitHub buttons above the wordmark.
  - Buttons use existing NPM and GitHub icons.
  - Button styling is black/white/neutral with blue focus rings; no green styling.
  - Huge footer wordmark uses SVG favicon plus `BaseForge`.
  - Logo scales up to large size and uses `/favicon/favicon.svg`.

## Verification Run

Latest UI work repeatedly passed these checks:

```bash
npm run typecheck -w web
npm run lint -w web
git diff --check
npm run build -w web
```

Note:

- Sandboxed `npm run build -w web` can fail because Next/Turbopack tries to create a process and bind to a local worker port.
- The same build passes when rerun with the required sandbox permission.

## Notes For Next Session

- The user likes the current navbar.
- Do not revert the navbar style unless explicitly asked.
- The user likes the current footer and stack-power section after the latest revisions.
- Preserve the dark/black plus restrained yellow-accent direction unless explicitly changed.
- Keep the stack-power section geometry intact unless the user asks for more layout changes.
- For professional sections, the user prefers black/white/blue over decorative glow.
- Avoid returning to the earlier green-accent direction.
