# Phase 1 Step 2: Finalize MVP Options

## Goal

Finalize the exact stack options LaunchKit will support in the website MVP.

This step should make the MVP boundaries explicit so later agents do not add unsupported choices.

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

- Update planning/context files if they need clarification.
- Update `progress-tracker.md`.
- Record the final MVP option set.

You must not:

- Implement schema code.
- Implement generator code.
- Build website UI.
- Add templates.
- Add CLI code.
- Install new dependencies.

## Confirmed MVP Options

The MVP should support only these options:

```txt
Framework:
  - Next.js

Language:
  - TypeScript

Router:
  - App Router

Project structure:
  - No src folder

Styling:
  - Tailwind CSS

UI:
  - none
  - shadcn/ui

Database:
  - none
  - PostgreSQL

ORM:
  - none
  - Prisma

Auth:
  - none
  - Auth.js credentials scaffold

Docker:
  - no
  - yes, only for PostgreSQL development

Package manager:
  - npm
  - pnpm
```

## MVP Non-Goals

The MVP should not support:

- Multiple frontend frameworks
- JavaScript output
- Pages Router
- `src/` folder generation
- MySQL
- SQLite
- MongoDB
- Drizzle
- Clerk
- GitHub auth provider
- Full production credentials auth
- CLI generation
- User accounts in LaunchKit
- Saved presets
- Server-side dependency installation

## Tasks

1. Verify the confirmed MVP options are represented in the planning docs.
2. If a planning doc disagrees, update it to match the confirmed MVP options.
3. Add or update notes in `progress-tracker.md`.
4. Record any remaining questions, but do not expand the MVP.

## Expected Output

Planning file updates only if needed.

No implementation code.

## Done Criteria

This step is complete when:

- MVP options are explicit.
- MVP non-goals are explicit.
- No unsupported stack options are implied as part of the MVP.
- `progress-tracker.md` is updated.
