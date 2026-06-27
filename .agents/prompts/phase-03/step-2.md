# Phase 3 Step 2: Define Config Option Enums

## Goal

Define the supported MVP option values for LaunchKit in `packages/schema`.

This step should create the enum/value layer only. Do **not** create the full config schema yet.

## Required Reading

Before making changes, read:

```txt
context/project-overview.md
context/architecture.md
context/build-plan.md
context/ui-rules.md
context/progress-tracker.md
```

## Scope

### You may

- Add supported option constants/enums in `packages/schema`.
- Export TypeScript union types for each option.
- Add simple tests for supported option values.
- Update `progress-tracker.md`.

### You must not

- Create the full `LaunchKitConfigSchema`.
- Add default config.
- Add option metadata.
- Add compatibility rules.
- Build generator logic.
- Build website UI.
- Add templates.
- Add CLI functionality.

## Required MVP Options

Define supported values for these categories:

### Framework

```txt
next
```

### Language

```txt
typescript
```

### Router

```txt
app
```

### Project structure

```txt
no-src
```

### Styling

```txt
tailwind
```

### UI

```txt
none
shadcn
```

### Database

```txt
none
postgres
```

### ORM

```txt
none
prisma
```

### Auth

```txt
none
authjs-credentials
```

### Docker

```txt
none
postgres
```

### Package manager

```txt
npm
pnpm
```

## Suggested File Structure

Use a focused file structure inside `packages/schema/src`.

Example:

```txt
packages/schema/src/
  index.ts
  options.ts
```

`options.ts` can export readonly arrays and inferred union types.

Example style:

```ts
export const frameworkOptions = ["next"] as const;
export type FrameworkOption = (typeof frameworkOptions)[number];

export const languageOptions = ["typescript"] as const;
export type LanguageOption = (typeof languageOptions)[number];
```

Prefer simple string literal unions derived from readonly arrays.

Do **not** add labels, descriptions, or UI metadata in this step.

## Tasks

1. Create or update `packages/schema/src/options.ts`.
2. Define readonly option arrays for every MVP option category.
3. Export TypeScript types for every option category.
4. Re-export the option arrays and types from `packages/schema/src/index.ts`.
5. Add minimal Vitest tests for option exports if the test setup already exists.
6. Run relevant checks.
7. Update `progress-tracker.md`.

## Testing Requirements

Use **Vitest**.

Do **not** use Node's built-in test runner.

Suggested test coverage:

- `frameworkOptions` contains only `"next"`.
- `languageOptions` contains only `"typescript"`.
- `uiOptions` contains `"none"` and `"shadcn"`.
- `databaseOptions` contains `"none"` and `"postgres"`.
- `ormOptions` contains `"none"` and `"prisma"`.
- `authOptions` contains `"none"` and `"authjs-credentials"`.
- `packageManagerOptions` contains `"npm"` and `"pnpm"`.

## Verification

Run:

```bash
npm run typecheck
npm run test
```

If available, also run:

```bash
npm run build
npm run lint
```

If a command fails, fix issues that are inside this step’s scope.

If the failure belongs to another phase or package, record it in `progress-tracker.md`.

## Progress Tracker Update

Update `progress-tracker.md` with:

- Step completed
- Files changed
- Option categories added
- Commands run
- Verification results
- Notes or blockers
- Next suggested step

## Done Criteria

This step is complete when:

- All MVP option categories are defined.
- Option values match the confirmed MVP exactly.
- Option types are exported.
- `@launchkit/schema` re-exports the options.
- Vitest is used for any tests.
- Typecheck passes or unrelated failures are documented.
- `progress-tracker.md` is updated.
