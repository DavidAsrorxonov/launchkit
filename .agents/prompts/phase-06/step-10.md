# Phase 6 Step 10: Create API Generate Route

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 6 Step 9 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 6 Step 11.
Do not implement final browser download UI yet.
Do not implement CLI functionality.
Do not put generator logic in UI components.
Do not run generated project code on the LaunchKit server.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Create the server-side API route that validates a LaunchKit config and generates project output using the shared generator.

This route should be the server boundary between the website and:

```txt
@launchkit/schema
@launchkit/generator
```

It should prepare the website for the download flow in Phase 6 Step 11.

## Scope

Work inside:

```txt
apps/web/
```

Recommended files:

```txt
apps/web/app/api/generate/route.ts
apps/web/lib/api/generate.ts
apps/web/lib/api/errors.ts
apps/web/lib/api/response.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. API Route

Create a Next.js App Router API route:

```txt
apps/web/app/api/generate/route.ts
```

It should handle:

```txt
POST /api/generate
```

The request body should be JSON containing a LaunchKit config.

Do not support GET for generation.

### 2. Request Validation

Validate the request body using:

```txt
@launchkit/schema
```

Use:

```txt
LaunchKitConfigSchema
```

and compatibility validation helpers such as:

```txt
validateCompatibility
```

or the equivalent exports from the schema package.

Do not duplicate schema rules inside the API route.

### 3. Generator Integration

Call the shared generator package:

```txt
@launchkit/generator
```

Use the existing generator function, likely:

```ts
generateProject(config);
```

or the equivalent exported API.

Do not place generator logic in `apps/web`.
Do not duplicate template logic in the route.
Do not import from `packages/templates` directly unless the generator API already requires that integration.

### 4. Response Shape

Return generated project data in a shape the website can use in Step 11.

Recommended JSON response:

```ts
type GenerateProjectResponse = {
  project: {
    name: string;
    packageManager: "npm" | "pnpm";
    files: Array<{
      path: string;
      contents: string;
      encoding: "utf8" | "base64";
    }>;
  };
};
```

If the generator can return `Uint8Array` contents, encode binary files as base64.

For MVP template files, most contents should be UTF-8 strings.

Do not return Node `Buffer` objects directly in JSON.

### 5. Error Responses

Return structured JSON errors.

Recommended shape:

```ts
type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    issues?: unknown[];
  };
};
```

Use appropriate HTTP statuses:

```txt
400 invalid JSON or invalid config
422 compatibility failure
405 unsupported method, if needed
500 unexpected generation failure
```

Do not leak stack traces or internal filesystem paths to the client.

### 6. Request Size And Safety

Add basic request safety.

Requirements:

- Reject non-JSON content where practical.
- Reject malformed JSON.
- Reject request bodies that are too large.
- Do not write generated files to disk.
- Do not execute generated project code.
- Do not install generated project dependencies.
- Do not run shell commands from API input.

Recommended maximum request body size:

```txt
64 KB
```

Use the simplest safe approach that works in Next.js App Router.

### 7. Path Safety

The generator should already enforce safe generated paths from Phase 4.

Still, before returning files from the API, verify generated file paths are safe:

- relative paths only
- no leading `/`
- no `..`
- no empty path segments
- no `src/` directory

If the generator exports a path normalization/helper, use it.

Do not duplicate complex path logic if the generator already has a helper.

### 8. No Zip Yet

Do not create the zip archive in this step unless the earlier architecture explicitly decided the API route returns a zip directly.

Preferred Phase 6 flow:

```txt
Step 10: API returns generated project data safely.
Step 11: Download flow turns generated project data into a downloadable zip.
```

If the project architecture already expects the route to return a zip, document that decision in `progress-tracker.md` and keep the implementation minimal and server-side.

### 9. Website Integration

Do not wire the final Download button yet.

It is acceptable to add a small typed client helper if useful:

```txt
apps/web/lib/api/client.ts
```

But the visible download flow belongs to Phase 6 Step 11.

## Tests

Use Vitest only.

Add route/helper tests if the repo already has a pattern for testing Next.js route handlers.

Recommended tests:

- Valid config returns generated project data.
- Invalid config returns `400`.
- Incompatible config returns `422`.
- Malformed JSON returns `400`.
- Oversized body returns an error.
- Response does not include unsafe file paths.
- Response does not include `src/` paths.
- Unexpected generator failure returns structured `500` without leaking stack traces.

If route-handler testing is not already configured, add focused tests for extracted pure helpers instead of introducing a large new test stack.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

If app-specific commands exist, also run:

```bash
npm run typecheck -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
```

If generator/schema package tests may be affected, run:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 6 Step 10 completed: Create API generate route

Changes made:
- Added POST /api/generate route.
- Added request validation using @launchkit/schema.
- Added compatibility validation.
- Connected route to @launchkit/generator.
- Added structured success and error responses.
- Added basic request size and JSON safety checks.
- Added generated path safety checks before response.
- Confirmed no generated project code is executed.
- Confirmed no generated project dependencies are installed.
- Confirmed zip download UI remains for the next step.

Files changed:
- apps/web/app/api/generate/route.ts
- apps/web/lib/api/generate.ts, if added
- apps/web/lib/api/errors.ts, if added
- apps/web/lib/api/response.ts, if added
- apps/web/lib/api/client.ts, if added
- relevant test files, if added or changed
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 6 Step 11: Create download flow
```

## Completion Criteria

This step is complete when:

- `POST /api/generate` exists.
- The route validates request JSON using `@launchkit/schema`.
- The route validates compatibility using shared schema helpers.
- The route calls `@launchkit/generator`.
- Valid configs return generated project data.
- Invalid configs return structured errors.
- Compatibility failures return structured errors.
- Malformed or oversized requests are handled safely.
- The route does not write generated files to disk.
- The route does not execute generated project code.
- The route does not install generated project dependencies.
- Generated paths are checked before response.
- No generated `src/` paths are returned.
- Final zip download UI is not implemented yet.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass if configured, or missing/unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
