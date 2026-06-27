# Phase 1 Step 4: Define Website UX Requirements

## Goal

Define the LaunchKit website MVP user experience before implementation starts.

The website should be a practical project builder, not a marketing-first landing page.

## Required Reading

Read these files before making changes:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

## Scope

You may:

- Update planning/context files if UX requirements are missing or unclear.
- Update `progress-tracker.md`.
- Add UX notes and constraints.

You must not:

- Build React components.
- Add shadcn/ui components.
- Implement form state.
- Implement API routes.
- Implement generator logic.
- Add CLI functionality.

## Website UX Direction

The LaunchKit website should use:

```txt
Next.js
TypeScript
App Router
Tailwind CSS
shadcn/ui
green accent theme
CSS variables and design tokens
```

The first screen should expose the builder experience.

Avoid a large marketing-only hero.

## Required Wizard Flow

The website should use a step-by-step wizard:

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

## Step Requirements

### Project

Collect:

- project name
- package manager

### Framework

Show fixed MVP choices:

- Next.js
- TypeScript
- App Router
- no `src/` folder

### Styling And UI

Show:

- Tailwind CSS fixed on
- shadcn/ui optional

### Database

Show:

- none
- PostgreSQL

### ORM

Show:

- none
- Prisma

Prisma should require a database.

### Auth

Show:

- none
- Auth.js credentials scaffold

Make clear this is a scaffold, not a complete production user system.

### Extras

Show:

- Docker Compose option
- README included by default
- `.env.example` included by default

Docker should only be available with PostgreSQL.

### Preview

Show:

- selected stack summary
- dependencies
- scripts
- environment variables
- generated file tree

Full file content preview is not required for MVP.

### Download

Show:

- generate ZIP action
- loading state
- error state
- success state
- next-step commands

## Visual Rules

Follow `context/04-ui-rules.md`.

Important constraints:

- Use design tokens, not repeated hardcoded colors.
- Green should be an accent, not the whole interface.
- Keep the UI compact and developer-focused.
- Do not nest cards inside cards.
- Use shadcn/ui components as the base system.
- Ensure mobile usability.

## Tasks

1. Verify UX requirements are documented.
2. Clarify any missing wizard or preview requirements.
3. Ensure UI rules are aligned with the MVP.
4. Update `progress-tracker.md`.

## Expected Output

Planning/tracking updates only.

No UI implementation.

## Done Criteria

This step is complete when:

- Wizard steps are clearly defined.
- Preview requirements are clear.
- Download flow requirements are clear.
- Visual direction is clear.
- `progress-tracker.md` is updated.
