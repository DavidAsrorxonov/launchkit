# LaunchKit Web

Next.js website for the LaunchKit project builder.

LaunchKit is a TypeScript-first developer project generator. The MVP is a
website-first generator where users configure a project, preview the output, and
download a zip. The future CLI is deferred.

## Supported MVP Stack

| Area | Supported options |
| --- | --- |
| Framework | Next.js |
| Language | TypeScript |
| Router | App Router |
| Project structure | No `src/` folder |
| Styling | Tailwind CSS |
| UI | none, shadcn/ui |
| Database | none, PostgreSQL |
| ORM | none, Prisma |
| Auth | none, Auth.js credentials scaffold |
| Docker | none, PostgreSQL Docker Compose |
| Package manager | npm, pnpm instructions/generated metadata where supported |

## Local Run

```bash
npm install
npm run dev -w apps/web
```

Open `http://localhost:3000`.

Routes:

- `/` is the dedicated landing page.
- `/builder` is the working project builder.
- `/api/generate` validates a builder config and returns generated project data.
- `/docs` is the dedicated documentation page.

## Production

```bash
npm install
npm run build -w apps/web
npm run start -w apps/web
```

The website MVP does not require environment variables. Generated-project values such as `DATABASE_URL` and `AUTH_SECRET` belong inside downloaded projects, not this web app.

`POST /api/generate` validates requests, calls the shared generator, and returns generated file data for browser-side ZIP creation. The website does not install generated dependencies, execute generated code, start generated app servers, or write generated projects to disk.

## Downloaded Project Usage

For npm output:

```bash
unzip my-app.zip
cd my-app
npm install
npm run dev
npm run typecheck
npm run build
```

For pnpm output, use the equivalent generated instructions:

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

Feature-specific notes:

- PostgreSQL: configure `DATABASE_URL` before using database-backed features.
- Prisma: run `npm run db:generate`, `npm run db:push`, and `npm run db:studio` as needed.
- Auth.js credentials: replace `AUTH_SECRET`, implement real user lookup, and add secure password verification.
- Docker PostgreSQL: use `docker compose up -d` and `docker compose down` for local development only.

## Roadmap

- Keep the website MVP stable first.
- Add a shared-generator CLI later.
- Add more stack options only after the core generation flow is reliable.

## Limitations

- CLI generation is not part of the MVP.
- Only Next.js is supported.
- Only TypeScript is supported.
- Only App Router is supported.
- Generated projects do not use `src/`.
- Only Tailwind CSS is supported.
- Auth.js credentials output is a scaffold, not production-ready auth.
- PostgreSQL Docker Compose is for local development only.
- LaunchKit does not install dependencies for generated projects.
- LaunchKit does not run generated project code on the server.
- Users must configure real secrets and production environment variables.
