# Phase 7 Step 5: Harden API Validation and Safety Limits

You are working on LaunchKit.

Before making changes:

1. Read all files in `context/` in order.
2. Read `progress-tracker.md`.
3. Confirm that Phase 7 Step 4 is complete.
4. Read this step prompt.
5. Implement only this step.

Do not move to Phase 7 Step 6.
Do not add broad UI error polishing yet.
Do not change supported product options.
Do not add CLI functionality.
Do not run generated project code on the LaunchKit server.
Do not install generated project dependencies from the API route.
Use npm workspaces.
Use Vitest for tests.
Do not use Node's built-in test runner.

## Goal

Harden the website API generation route so it safely handles invalid input, oversized requests, compatibility failures, generator failures, and unsafe generated output.

The main target is:

```txt
apps/web/app/api/generate/route.ts
```

and any supporting API helper files.

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
apps/web/lib/api/safety.ts
```

Adjust paths to match the existing app structure and conventions.

## Requirements

### 1. Method Handling

Confirm the generate route supports:

```txt
POST /api/generate
```

Do not support generation through GET.

If method handling is explicit, unsupported methods should return a structured error.

### 2. Content Type Handling

Reject non-JSON requests where practical.

Expected accepted content type:

```txt
application/json
```

Be tolerant of common variants such as:

```txt
application/json; charset=utf-8
```

Return a structured error for unsupported content types.

### 3. Request Size Limit

Enforce a small request size limit.

Recommended limit:

```txt
64 KB
```

If the current route reads `request.json()` directly and cannot check size first, update it to safely read text, check length, then parse JSON.

Do not accept arbitrarily large request bodies.

### 4. JSON Parsing

Handle malformed JSON safely.

Malformed JSON should return:

```txt
400
```

with a structured error response.

Do not leak stack traces.

### 5. Schema Validation

Validate parsed input using:

```txt
@launchkit/schema
LaunchKitConfigSchema
```

Invalid config shape should return:

```txt
400
```

with useful structured issues.

Do not duplicate schema rules inside the API route.

### 6. Compatibility Validation

Validate compatibility using shared schema helpers:

```txt
validateCompatibility
assertCompatibleConfig
```

or the equivalent current exports.

Compatibility failures should return:

```txt
422
```

with stable issue codes/messages.

Required compatibility behavior:

```txt
Prisma requires PostgreSQL.
PostgreSQL Docker Compose is only available when PostgreSQL is selected.
Auth.js credentials scaffold may work without a database.
shadcn/ui requires Tailwind CSS.
```

### 7. Generator Failure Handling

Wrap generator execution in safe error handling.

Unexpected generator failures should return:

```txt
500
```

with a generic message.

Do not expose:

```txt
stack traces
absolute filesystem paths
internal source paths
raw Error objects
```

to the client.

### 8. Generated Path Safety

Before returning generated files, validate every generated file path.

Reject generated output if any path:

```txt
starts with /
contains ..
contains empty path segments
is "."
is ".."
contains src/ as a path segment
```

Use existing generator path helpers if available.

Do not duplicate complex path logic if the generator already exports a safe helper.

### 9. Response Shape

Confirm success responses are stable and JSON-safe.

Recommended shape:

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

Do not return:

```txt
Buffer objects
Uint8Array objects directly in JSON
class instances
raw generator internals
```

### 10. Error Shape

Confirm error responses are stable.

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

Use stable error codes such as:

```txt
invalid_content_type
request_too_large
invalid_json
invalid_config
incompatible_config
generation_failed
unsafe_generated_output
```

### 11. Server Safety

Confirm the API route does not:

- write generated project files to disk
- execute generated project code
- install generated dependencies
- run shell commands from request input
- start dev servers
- start Docker containers
- connect to databases

This route should only validate input, call the generator, validate output, and return generated file data.

## Tests

Use Vitest only.

Add or update focused tests for the API route or extracted pure helpers.

Recommended tests:

- valid config returns generated project data
- non-JSON request returns structured error
- oversized body returns structured error
- malformed JSON returns structured error
- invalid config returns structured error
- incompatible config returns structured error
- generator failure returns structured 500
- unsafe generated path returns structured error
- binary file contents are encoded safely if supported
- response does not include raw buffers
- response does not include `src/` paths

If route-handler testing is awkward in the current setup, extract pure helper functions and test those.

Do not introduce a large new API test framework if small Vitest tests cover the behavior.

## Verification

Run the relevant checks available in the repo.

Recommended:

```bash
npm run typecheck -w apps/web
npm test -w apps/web
npm run lint -w apps/web
npm run build -w apps/web
npm test
npm run typecheck
```

If schema/generator behavior is touched, also run:

```bash
npm test -w @launchkit/schema
npm test -w @launchkit/generator
```

Run smoke tests if they are available and reasonable:

```bash
npm run test:smoke
```

Use the actual workspace command names from the repo.

If a command does not exist, record that clearly in `progress-tracker.md`.

## Progress Tracker Update

After implementation, update `progress-tracker.md` with:

```txt
Phase 7 Step 5 completed: Harden API validation and safety limits

Changes made:
- Hardened POST /api/generate content-type handling.
- Added or verified request size limit.
- Added or verified malformed JSON handling.
- Added or verified schema validation error responses.
- Added or verified compatibility error responses.
- Added or verified generator failure handling.
- Added or verified generated path safety checks.
- Stabilized API success/error response shapes.
- Confirmed API does not execute generated code or install dependencies.

Files changed:
- apps/web/app/api/generate/route.ts
- apps/web/lib/api/generate.ts, if changed
- apps/web/lib/api/errors.ts, if changed
- apps/web/lib/api/response.ts, if changed
- apps/web/lib/api/safety.ts, if added
- relevant test files
- progress-tracker.md

Commands run:
- ...

Verification result:
- ...

Notes/blockers:
- ...

Next suggested step:
- Phase 7 Step 6: Improve user-facing errors and failure states
```

## Completion Criteria

This step is complete when:

- API rejects non-JSON requests where practical.
- API rejects oversized requests.
- API handles malformed JSON safely.
- API validates config using `@launchkit/schema`.
- API returns structured schema validation errors.
- API returns structured compatibility errors.
- API handles generator failures without leaking internals.
- API validates generated output paths before response.
- API response shape is JSON-safe and stable.
- API does not write generated project files to disk.
- API does not execute generated code.
- API does not install dependencies.
- API hardening tests are added or updated.
- Tests use Vitest.
- No Node built-in test runner usage is introduced.
- TypeScript checks pass, or unrelated failures are documented.
- Tests pass, or unrelated failures are documented.
- Build/lint pass if configured, or missing/unrelated failures are documented.
- `progress-tracker.md` is updated.

Then stop.
