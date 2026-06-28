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

  it("enables shadcn/ui when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, ui: "shadcn" }).map((feature) => feature.id),
    ).toContain("shadcn");
  });

  it("enables PostgreSQL when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, database: "postgres" }).map(
        (feature) => feature.id,
      ),
    ).toContain("postgres");
  });

  it("enables Prisma when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, orm: "prisma" }).map((feature) => feature.id),
    ).toContain("prisma");
  });

  it("enables Auth.js credentials when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, auth: "authjs-credentials" }).map(
        (feature) => feature.id,
      ),
    ).toContain("authjs-credentials");
  });

  it("enables PostgreSQL Docker Compose when selected", () => {
    expect(
      getEnabledFeatures({ ...defaultLaunchKitConfig, docker: "postgres" }).map(
        (feature) => feature.id,
      ),
    ).toContain("docker-postgres");
  });

  it("describes the required Prisma package contributions", () => {
    expect(getFeatureDefinition("prisma").packageJson).toEqual({
      dependencies: {
        "@prisma/client": "latest",
      },
      devDependencies: {
        prisma: "latest",
      },
      scripts: {
        "db:generate": "prisma generate",
        "db:migrate": "prisma migrate dev",
      },
    });
  });
});
