import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig } from "@launchkit/schema";

import { featureRegistry, getEnabledFeatures, getFeatureDefinition } from "../features/registry";

const mvpFeatureIds = [
  "next",
  "tailwind",
  "shadcn",
  "postgres",
  "prisma",
  "authjs-credentials",
  "docker-postgres",
] as const;

describe("feature registry", () => {
  it("contains all MVP feature IDs", () => {
    expect(Object.keys(featureRegistry).sort()).toEqual([...mvpFeatureIds].sort());
  });

  it("returns the Next.js feature by ID", () => {
    expect(getFeatureDefinition("next")).toMatchObject({
      id: "next",
      label: "Next.js",
      description: "Base Next.js App Router project.",
      packageJson: {
        version: "0.1.0",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          typecheck: "tsc --noEmit",
        },
        dependencies: {
          next: "16.2.9",
          react: "19.2.4",
          "react-dom": "19.2.4",
        },
        devDependencies: {
          "@types/node": "^20",
          "@types/react": "^19",
          "@types/react-dom": "^19",
          typescript: "^5",
        },
      },
    });
  });

  it("throws a predictable error for unknown feature IDs", () => {
    expect(() => getFeatureDefinition("unknown")).toThrow("Unknown feature: unknown");
  });

  it("enables Next.js and Tailwind for the default config", () => {
    expect(getEnabledFeatures(defaultLaunchKitConfig).map((feature) => feature.id)).toEqual([
      "next",
      "tailwind",
    ]);
  });

  it("does not enable shadcn/ui for the default config", () => {
    expect(getEnabledFeatures(defaultLaunchKitConfig).map((feature) => feature.id)).not.toContain(
      "shadcn",
    );
  });

  it("describes the required Tailwind package and file contributions", () => {
    expect(getFeatureDefinition("tailwind")).toMatchObject({
      packageJson: {
        devDependencies: {
          "@tailwindcss/postcss": "^4",
          tailwindcss: "^4",
        },
      },
      templateFiles: [
        {
          sourcePath: "features/tailwind/app/globals.css",
          targetPath: "app/globals.css",
        },
        {
          sourcePath: "features/tailwind/postcss.config.mjs",
          targetPath: "postcss.config.mjs",
        },
      ],
    });
  });

  it("enables shadcn/ui when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, ui: "shadcn" }).map((feature) => feature.id),
    ).toContain("shadcn");
  });

  it("describes the required shadcn/ui package and file contributions", () => {
    expect(getFeatureDefinition("shadcn")).toMatchObject({
      packageJson: {
        dependencies: {
          "class-variance-authority": "^0.7.1",
          clsx: "^2.1.1",
          "tailwind-merge": "^3.6.0",
        },
      },
      templateFiles: [
        {
          sourcePath: "features/shadcn/components.json",
          targetPath: "components.json",
        },
        {
          sourcePath: "features/shadcn/lib/utils.ts",
          targetPath: "lib/utils.ts",
        },
        {
          sourcePath: "features/shadcn/components/ui/button.tsx",
          targetPath: "components/ui/button.tsx",
        },
        {
          sourcePath: "features/shadcn/app/globals.css",
          targetPath: "app/globals.css",
        },
      ],
    });
  });

  it("enables PostgreSQL when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, database: "postgres" }).map(
        (feature) => feature.id,
      ),
    ).toContain("postgres");
  });

  it("does not enable PostgreSQL when no database is selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, database: "none" }).map(
        (feature) => feature.id,
      ),
    ).not.toContain("postgres");
  });

  it("describes the PostgreSQL env contribution and README notes", () => {
    expect(getFeatureDefinition("postgres")).toMatchObject({
      env: [
        {
          name: "DATABASE_URL",
          value: "postgresql://postgres:postgres@localhost:5432/{{packageName}}",
          description: "PostgreSQL connection string.",
          required: true,
        },
      ],
      notes: expect.arrayContaining([
        "This project expects a PostgreSQL database.",
        "`DATABASE_URL` must be configured before running database-backed code.",
        "The local PostgreSQL connection string in `.env.example` is a development default only.",
        "Docker Compose support is optional and belongs to the Docker PostgreSQL feature.",
        "Prisma setup is optional and belongs to the Prisma feature.",
      ]),
    });
    expect(getFeatureDefinition("postgres").packageJson).toBeUndefined();
  });

  it("enables Prisma when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, orm: "prisma" }).map((feature) => feature.id),
    ).toContain("prisma");
  });

  it("does not enable Prisma when no ORM is selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, orm: "none" }).map((feature) => feature.id),
    ).not.toContain("prisma");
  });

  it("enables Auth.js credentials when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, auth: "authjs-credentials" }).map(
        (feature) => feature.id,
      ),
    ).toContain("authjs-credentials");
  });

  it("does not enable Auth.js credentials when auth is none", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, auth: "none" }).map(
        (feature) => feature.id,
      ),
    ).not.toContain("authjs-credentials");
  });

  it("describes Auth.js credentials package, env, file, and README contributions", () => {
    expect(getFeatureDefinition("authjs-credentials")).toMatchObject({
      packageJson: {
        dependencies: {
          "next-auth": "latest",
        },
      },
      env: [
        {
          name: "AUTH_SECRET",
          value: "replace-me",
          description: "Secret used by Auth.js for session and token signing.",
          required: true,
        },
      ],
      templateFiles: [
        {
          sourcePath: "features/authjs-credentials/auth.ts",
          targetPath: "auth.ts",
        },
        {
          sourcePath: "features/authjs-credentials/app/api/auth/[...nextauth]/route.ts",
          targetPath: "app/api/auth/[...nextauth]/route.ts",
        },
      ],
      notes: expect.arrayContaining([
        "Auth.js credentials scaffold was generated.",
        "`AUTH_SECRET` must be replaced before using authentication.",
        "The default `authorize` logic is a placeholder and always rejects sign-ins.",
        "Real user lookup must be implemented by the developer.",
        "Secure password hashing and verification must be implemented by the developer.",
        "Credentials auth is intentionally not production-complete.",
        "If Prisma is selected, `lib/db.ts` is available but auth logic still needs to be connected to a user model.",
      ]),
    });
  });

  it("enables PostgreSQL Docker Compose when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, docker: "postgres" }).map(
        (feature) => feature.id,
      ),
    ).toContain("docker-postgres");
  });

  it("does not enable PostgreSQL Docker Compose when Docker is none", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, docker: "none" }).map(
        (feature) => feature.id,
      ),
    ).not.toContain("docker-postgres");
  });

  it("describes Docker PostgreSQL file and README contributions without npm packages", () => {
    expect(getFeatureDefinition("docker-postgres")).toMatchObject({
      requires: ["postgres"],
      templateFiles: [
        {
          sourcePath: "features/docker-postgres/docker-compose.yml",
          targetPath: "docker-compose.yml",
        },
      ],
      notes: expect.arrayContaining([
        "Docker PostgreSQL is configured for local development.",
        "Run `docker compose up -d` to start PostgreSQL.",
        "Run `docker compose down` to stop the service.",
        "The Docker PostgreSQL username, password, and database name are development defaults.",
        "`DATABASE_URL` should match the Docker Compose PostgreSQL service.",
        "Configure production database hosting separately.",
        "If Prisma is selected, run `npm run db:push` after PostgreSQL is running.",
      ]),
    });
    expect(getFeatureDefinition("docker-postgres").packageJson).toBeUndefined();
    expect(getFeatureDefinition("docker-postgres").env).toBeUndefined();
  });

  it("describes the required Prisma package contributions", () => {
    expect(getFeatureDefinition("prisma")).toMatchObject({
      requires: ["postgres"],
      packageJson: {
        type: "module",
        dependencies: {
          "@prisma/adapter-pg": "latest",
          "@prisma/client": "latest",
          dotenv: "latest",
        },
        devDependencies: {
          prisma: "latest",
        },
        scripts: {
          "db:generate": "prisma generate",
          "db:push": "prisma db push",
          "db:studio": "prisma studio",
        },
      },
      templateFiles: [
        {
          sourcePath: "features/prisma/prisma/schema.prisma",
          targetPath: "prisma/schema.prisma",
        },
        {
          sourcePath: "features/prisma/lib/db.ts",
          targetPath: "lib/db.ts",
        },
        {
          sourcePath: "features/prisma/prisma.config.ts",
          targetPath: "prisma.config.ts",
        },
      ],
      notes: expect.arrayContaining([
        "Prisma v7 uses `prisma.config.ts` to load the PostgreSQL `DATABASE_URL` from `.env.example`.",
        "The Prisma client helper uses `@prisma/adapter-pg` for direct PostgreSQL connections.",
        "Run `npm run db:generate` after installing dependencies to generate the Prisma client.",
        "Run `npm run db:push` to sync the Prisma schema to your development database.",
        "Run `npm run db:studio` to inspect data with Prisma Studio.",
      ]),
    });
  });
});
