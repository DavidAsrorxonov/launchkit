import { describe, expect, it } from "vitest";

import {
  assertCompatibleConfig,
  defaultLaunchKitConfig,
  LaunchKitCompatibilityError,
  validateCompatibility,
} from "../index";
import type { LaunchKitConfig } from "../index";

describe("compatibility rules", () => {
  it("returns no issues for the default config", () => {
    expect(validateCompatibility(defaultLaunchKitConfig)).toEqual([]);
  });

  it("returns an issue when Prisma is selected without PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        orm: "prisma",
        database: "none",
      }),
    ).toContainEqual({
      code: "prisma_requires_postgresql",
      message: "Prisma requires PostgreSQL.",
      path: ["orm", "database"],
    });
  });

  it("returns no issues when Prisma is selected with PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        orm: "prisma",
        database: "postgres",
      }),
    ).toEqual([]);
  });

  it("returns an issue when PostgreSQL Docker Compose is selected without PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        docker: "postgres",
        database: "none",
      }),
    ).toContainEqual({
      code: "docker_postgres_requires_postgresql",
      message:
        "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
      path: ["docker", "database"],
    });
  });

  it("returns no issues when PostgreSQL Docker Compose is selected with PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        docker: "postgres",
        database: "postgres",
      }),
    ).toEqual([]);
  });

  it("allows Auth.js credentials without a database", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "none",
      }),
    ).toEqual([]);
  });

  it("allows Auth.js credentials with PostgreSQL and no Prisma", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "postgres",
        orm: "none",
      }),
    ).toEqual([]);
  });

  it("allows Auth.js credentials with Prisma and PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "postgres",
        orm: "prisma",
      }),
    ).toEqual([]);
  });

  it("returns an issue for Auth.js credentials with Prisma but no PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "prisma",
      }),
    ).toContainEqual({
      code: "prisma_requires_postgresql",
      message: "Prisma requires PostgreSQL.",
      path: ["orm", "database"],
    });
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "prisma",
      }),
    ).toContainEqual({
      code: "authjs_credentials_prisma_requires_postgresql",
      message: "Auth.js credentials with Prisma requires Prisma and PostgreSQL.",
      path: ["auth", "orm", "database"],
    });
  });

  it("returns an issue when shadcn/ui is selected without Tailwind CSS", () => {
    const configWithoutTailwind = {
      ...defaultLaunchKitConfig,
      ui: "shadcn",
      styling: "css",
    } as unknown as LaunchKitConfig;

    expect(validateCompatibility(configWithoutTailwind)).toContainEqual({
      code: "shadcn_requires_tailwind",
      message: "shadcn/ui requires Tailwind CSS.",
      path: ["ui", "styling"],
    });
  });

  it("returns no issues when shadcn/ui is selected with Tailwind CSS", () => {
    expect(
      validateCompatibility({
        ...defaultLaunchKitConfig,
        ui: "shadcn",
        styling: "tailwind",
      }),
    ).toEqual([]);
  });

  it("throws a typed compatibility error with issue details", () => {
    expect(() =>
      assertCompatibleConfig({
        ...defaultLaunchKitConfig,
        docker: "postgres",
        database: "none",
      }),
    ).toThrow(LaunchKitCompatibilityError);

    try {
      assertCompatibleConfig({
        ...defaultLaunchKitConfig,
        docker: "postgres",
        database: "none",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(LaunchKitCompatibilityError);
      expect((error as LaunchKitCompatibilityError).issues).toContainEqual({
        code: "docker_postgres_requires_postgresql",
        message:
          "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
        path: ["docker", "database"],
      });
      expect((error as Error).message).toContain(
        "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
      );
    }
  });
});
