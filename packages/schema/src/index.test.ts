import { describe, expect, it } from "vitest";

import {
  authOptions,
  databaseOptions,
  dockerOptions,
  frameworkOptions,
  languageOptions,
  LaunchKitConfigSchema,
  ormOptions,
  packageManagerOptions,
  parseLaunchKitConfig,
  projectStructureOptions,
  routerOptions,
  stylingOptions,
  uiOptions,
} from "./index";

describe("schema package", () => {
  it("exports framework options", () => {
    expect(frameworkOptions).toEqual(["next"]);
  });

  it("exports language options", () => {
    expect(languageOptions).toEqual(["typescript"]);
  });

  it("exports router options", () => {
    expect(routerOptions).toEqual(["app"]);
  });

  it("exports project structure options", () => {
    expect(projectStructureOptions).toEqual(["no-src"]);
  });

  it("exports styling options", () => {
    expect(stylingOptions).toEqual(["tailwind"]);
  });

  it("exports UI options", () => {
    expect(uiOptions).toEqual(["none", "shadcn"]);
  });

  it("exports database options", () => {
    expect(databaseOptions).toEqual(["none", "postgres"]);
  });

  it("exports ORM options", () => {
    expect(ormOptions).toEqual(["none", "prisma"]);
  });

  it("exports auth options", () => {
    expect(authOptions).toEqual(["none", "authjs-credentials"]);
  });

  it("exports Docker options", () => {
    expect(dockerOptions).toEqual(["none", "postgres"]);
  });

  it("exports package manager options", () => {
    expect(packageManagerOptions).toEqual(["npm", "pnpm"]);
  });
});

const minimalMvpConfig = {
  name: "my-app",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "none",
  database: "none",
  orm: "none",
  auth: "none",
  docker: "none",
  packageManager: "npm",
} as const;

describe("LaunchKitConfigSchema", () => {
  it("accepts a valid minimal MVP config", () => {
    expect(LaunchKitConfigSchema.safeParse(minimalMvpConfig).success).toBe(
      true,
    );
  });

  it("accepts a valid full MVP config", () => {
    const config = {
      ...minimalMvpConfig,
      name: "launchkit-demo",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
      packageManager: "pnpm",
    } as const;

    expect(parseLaunchKitConfig(config)).toEqual(config);
  });

  it("rejects an empty project name", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "" })
        .success,
    ).toBe(false);
  });

  it("rejects a project name with spaces", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "my app" })
        .success,
    ).toBe(false);
  });

  it("rejects an uppercase project name", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "My-App" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown framework", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        framework: "react",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown database", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        database: "mysql",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown package manager", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        packageManager: "yarn",
      }).success,
    ).toBe(false);
  });
});
