# @baseforge/create

Create a TypeScript-first Next.js project with Baseforge.

The package is prepared for beta npm publishing under `@baseforge/create`.
After the beta publish succeeds, test it with:

```bash
npx @baseforge/create@beta
```

Stable npm usage is planned for a future release:

```bash
npx @baseforge/create@latest
```

## What It Generates

The current MVP generates:

- Next.js
- TypeScript
- App Router
- no `src/` folder
- Tailwind CSS
- optional shadcn/ui
- optional PostgreSQL setup
- optional Prisma setup
- optional Auth.js credentials scaffold
- optional PostgreSQL Docker Compose
- npm or pnpm project metadata
- `.env.example`
- README setup notes

Unsupported frameworks, languages, routers, project structures, styling systems,
databases, ORMs, auth providers, Docker setups, and package managers are not
available in the MVP.

## npm Usage

Planned beta command:

```bash
npx @baseforge/create@beta
```

After the stable release, the intended public command is:

```bash
npx @baseforge/create@latest
```

The installed binary is `create-baseforge`.

## Local Repository Usage

From this repository, build the CLI and run the compiled entrypoint directly:

```bash
npm run build -w @baseforge/create
node packages/cli/dist/index.js my-app --yes
```

Then follow the printed next steps:

```bash
cd my-app
npm install
npm run dev
```

## Options

```txt
create-baseforge [project-name] [options]

Options:
  --name <name>                         Set the generated project name.
  --package-manager <npm|pnpm>          Select the package manager.
  --ui <none|shadcn>                    Select UI scaffolding.
  --database <none|postgres>            Select database scaffolding.
  --orm <none|prisma>                   Select ORM scaffolding.
  --auth <none|authjs-credentials>      Select auth scaffolding.
  --docker <none|postgres>              Select Docker Compose scaffolding.
  --install                             Install dependencies after project creation.
  --no-install                          Skip dependency installation.
  -y, --yes                             Accept defaults where possible.
  -h, --help                            Show help text.
  -v, --version                         Show the CLI version.
```

Examples:

```bash
node packages/cli/dist/index.js my-app --yes
node packages/cli/dist/index.js my-app --database postgres --orm prisma
node packages/cli/dist/index.js --name my-app --package-manager pnpm --ui shadcn
```

## Notes And Limitations

Prisma requires PostgreSQL. PostgreSQL Docker Compose is only available when
PostgreSQL is selected.

Auth.js credentials output is a scaffold. Replace `AUTH_SECRET`, implement real
user lookup, and add secure password verification before production use.

Dependency installation is optional. `--yes` does not install dependencies by
default; pass `--install` when you want the CLI to run the selected package
manager's install command after files are written.
