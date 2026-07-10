# BaseForge New UI Notes

Use this file to continue the landing-page UI work without losing the current design direction.

## Current Direction

- The website UI is being redesigned with inspiration from `insforge.dev`.
- The preferred look is dark/black mode with green accents.
- UI work should be changed only when explicitly requested by the user.
- Keep changes scoped. Do not redesign unrelated sections unless asked.

## Completed So Far

### Dark Mode

- The web app is now forced into dark mode from the root layout.
- File changed:
  - `apps/web/app/layout.tsx`
- Implementation:
  - Added `dark` to the root `<html>` class.

### Dark Theme Tokens

- The dark theme palette was tuned toward black surfaces and green accents.
- File changed:
  - `apps/web/app/globals.css`
- Main changes:
  - Added `color-scheme: dark`.
  - Darkened `background`, `card`, `popover`, `sidebar`.
  - Adjusted `primary`, `accent`, `ring`, and chart colors toward green.
  - Kept the existing token-based styling model intact.

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
    - `https://github.com/DavidAsrorxonov/launchkit`
  - Telegram icon only
    - `https://t.me/whoisdave02`

### Navbar Icons

- The navbar uses the user-provided icon components:
  - `apps/web/components/icons/npm.tsx`
  - `apps/web/components/icons/github.tsx`
  - `apps/web/components/icons/telegram.tsx`
- These icon files are currently untracked in git status, but they are intentionally used by the navbar.

## Verification Run

After the navbar changes, these checks passed:

```bash
npm run typecheck -w web
npm run lint -w web
git diff --check
```

## Notes For Next Session

- The user likes the current navbar.
- Do not revert the navbar style unless explicitly asked.
- The next likely UI work will continue from the landing page below the navbar.
- Preserve the dark/black plus green-accent visual direction.
