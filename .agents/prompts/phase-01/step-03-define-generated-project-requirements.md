# Phase 1 Step 3: Define Generated Project Requirements

## Goal

Define what a generated LaunchKit project must contain for the website MVP.

This step clarifies the output requirements before schema, generator, and template implementation begin.

## Required Reading

Read these files before making changes:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/progress-tracker.md
```

## Scope

You may:

- Update planning/context files if requirements are missing or unclear.
- Update `progress-tracker.md`.
- Add notes about generated project expectations.

You must not:

- Create actual templates.
- Implement generator logic.
- Implement schema logic.
- Build website UI.
- Add CLI functionality.
- Install dependencies.

## Generated Project Requirements

Generated projects should use:

```txt
Framework: Next.js
Language: TypeScript
Router: App Router
Folder style: no src folder
Styling: Tailwind CSS
UI: optional shadcn/ui
Database: optional PostgreSQL
ORM: optional Prisma
Auth: optional Auth.js credentials scaffold
Docker: optional Docker Compose for PostgreSQL
Package manager instructions: npm or pnpm
```

Generated projects must include:

```txt
app/
  layout.tsx
  page.tsx

package.json
tsconfig.json
next.config.ts or next.config.mjs
postcss.config.mjs
app/globals.css
.gitignore
.env.example
README.md
```

When shadcn/ui is selected, generated projects should include:

```txt
components.json
lib/utils.ts
components/ui/button.tsx
```

When PostgreSQL is selected, generated projects should include:

```txt
DATABASE_URL in .env.example
database setup notes in README.md
```

When Prisma is selected, generated projects should include:

```txt
prisma/schema.prisma
lib/db.ts
Prisma dependencies
Prisma scripts
Prisma setup notes in README.md
```

When Auth.js credentials scaffold is selected, generated projects should include:

```txt
auth configuration files
auth route handler
AUTH_SECRET in .env.example
README notes explaining that real user/password logic must be implemented by the developer
```

When Docker is selected, generated projects should include:

```txt
docker-compose.yml
PostgreSQL service
Docker setup notes in README.md
```

## Tasks

1. Verify generated project requirements are documented.
2. Clarify any missing requirements in the context docs.
3. Make sure requirements do not imply unsupported MVP features.
4. Update `progress-tracker.md` with decisions, notes, and next step.

## Expected Output

Planning/tracking updates only.

No generated project files should be created in this step.

## Done Criteria

This step is complete when:

- Generated project structure expectations are clear.
- Optional feature output expectations are clear.
- `.env.example` and README requirements are documented.
- Auth.js credentials scaffold limitations are documented.
- `progress-tracker.md` is updated.
