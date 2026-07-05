# LaunchKit

LaunchKit is a TypeScript-first developer project generator.

The MVP is website-first: users configure a project, preview the generated
output, and download a zip. The future CLI is deferred and does not exist in
this repo yet.

## Supported MVP Stack

LaunchKit currently generates this stack:

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

Unsupported frameworks, languages, routers, project structures, styling
systems, databases, ORMs, auth providers, Docker setups, and package managers
are intentionally not available in the MVP.

## Downloaded Project Usage

For an npm project:

```bash
unzip my-app.zip
cd my-app
npm install
npm run dev
```

Before relying on the project output, run:

```bash
npm run typecheck
npm run build
```

For a pnpm project, use the equivalent generated instructions:

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm build
```

## Feature Notes

PostgreSQL-backed features require `DATABASE_URL` before use.

Prisma projects include:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

Auth.js credentials output is a scaffold. Replace `AUTH_SECRET`, implement real
user lookup, and add secure password verification before production use.

Docker PostgreSQL is local development support:

```bash
docker compose up -d
docker compose down
```

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
