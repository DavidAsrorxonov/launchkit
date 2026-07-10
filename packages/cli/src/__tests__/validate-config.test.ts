import { defaultLaunchKitConfig } from "@baseforge/schema";
import { describe, expect, it } from "vitest";

import { validateCliConfigDraft } from "../validate-config.js";

describe("validateCliConfigDraft", () => {
  it("passes a valid default draft", () => {
    const result = validateCliConfigDraft(defaultLaunchKitConfig);

    expect(result).toMatchObject({
      ok: true,
      config: defaultLaunchKitConfig,
    });
  });

  it("passes a valid fully selected MVP draft", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      name: "full-app",
      packageManager: "pnpm",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });

    expect(result).toMatchObject({
      ok: true,
      config: {
        name: "full-app",
        packageManager: "pnpm",
        ui: "shadcn",
        database: "postgres",
        orm: "prisma",
        auth: "authjs-credentials",
        docker: "postgres",
      },
    });
  });

  it("fails invalid project names with a CLI-friendly message", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      name: "Invalid_Name",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "invalid_project_name",
          message: "Use lowercase letters, numbers, and hyphens only.",
          path: ["name"],
        },
      ],
    });
  });

  it("fails unsupported package managers", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      packageManager: "yarn",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "unsupported_package_manager",
          message: "Unsupported package manager.",
          path: ["packageManager"],
        },
      ],
    });
  });

  it("fails unsupported UI options", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      ui: "radix",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "unsupported_ui",
          message: "Unsupported UI option.",
          path: ["ui"],
        },
      ],
    });
  });

  it("fails unsupported database options", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      database: "mysql",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "unsupported_database",
          message: "Unsupported database option.",
          path: ["database"],
        },
      ],
    });
  });

  it("fails Prisma without PostgreSQL using shared compatibility validation", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      database: "none",
      orm: "prisma",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "prisma_requires_postgresql",
          message: "Prisma requires PostgreSQL.",
          path: ["orm", "database"],
        },
      ],
    });
  });

  it("fails Docker PostgreSQL without PostgreSQL using shared compatibility validation", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      database: "none",
      docker: "postgres",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          code: "docker_postgres_requires_postgresql",
          message:
            "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
          path: ["docker", "database"],
        },
      ],
    });
  });

  it("allows Auth.js credentials without a database", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      auth: "authjs-credentials",
      database: "none",
      orm: "none",
    });

    expect(result).toMatchObject({
      ok: true,
      config: {
        auth: "authjs-credentials",
        database: "none",
        orm: "none",
      },
    });
  });

  it("fills missing values from defaults", () => {
    const result = validateCliConfigDraft({ name: "partial-app" });

    expect(result).toMatchObject({
      ok: true,
      config: {
        ...defaultLaunchKitConfig,
        name: "partial-app",
      },
    });
  });

  it("preserves fixed MVP values", () => {
    const result = validateCliConfigDraft({ name: "fixed-app" });

    expect(result).toMatchObject({
      ok: true,
      config: {
        framework: "next",
        language: "typescript",
        router: "app",
        projectStructure: "no-src",
        styling: "tailwind",
      },
    });
  });

  it("maps schema errors without exposing raw Zod messages", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      packageManager: "bun",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          message: "Unsupported package manager.",
        },
      ],
    });
    expect(JSON.stringify(result)).not.toContain("Invalid option");
  });

  it("maps compatibility errors to CLI-friendly messages", () => {
    const result = validateCliConfigDraft({
      ...defaultLaunchKitConfig,
      database: "none",
      orm: "prisma",
    });

    expect(result).toMatchObject({
      ok: false,
      errors: [
        {
          message: "Prisma requires PostgreSQL.",
        },
      ],
    });
  });
});
