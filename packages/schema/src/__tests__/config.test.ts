import { describe, expect, it } from "vitest";

import {
  defaultBaseForgeConfig,
  BaseForgeConfigSchema,
  parseBaseForgeConfig,
} from "../index";
import type { BaseForgeConfig } from "../index";

const validFullConfig = {
  name: "launchkit-demo",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "shadcn",
  database: "postgres",
  orm: "prisma",
  auth: "authjs-credentials",
  docker: "postgres",
  packageManager: "pnpm",
} satisfies BaseForgeConfig;

describe("BaseForgeConfigSchema", () => {
  it("accepts the valid default config", () => {
    expect(BaseForgeConfigSchema.safeParse(defaultBaseForgeConfig).success).toBe(
      true,
    );
  });

  it("accepts a valid full MVP config", () => {
    expect(parseBaseForgeConfig(validFullConfig)).toEqual(validFullConfig);
  });

  it("rejects invalid project names", () => {
    const invalidNames = [
      "",
      "My App",
      "my app",
      "My-App",
      "../app",
      "app/name",
      "my_app",
      "app!",
      "my/app",
      "my.app",
      "-my-app",
      "my-app-",
    ];

    for (const name of invalidNames) {
      expect(
        BaseForgeConfigSchema.safeParse({
          ...defaultBaseForgeConfig,
          name,
        }).success,
      ).toBe(false);
    }
  });

  it("accepts project names with lowercase letters, numbers, and hyphens", () => {
    const validNames = ["my-app", "launchkit-demo", "app123", "app-123"];

    for (const name of validNames) {
      expect(
        BaseForgeConfigSchema.safeParse({
          ...defaultBaseForgeConfig,
          name,
        }).success,
      ).toBe(true);
    }
  });

  it.each([
    ["framework", "react"],
    ["language", "javascript"],
    ["router", "pages"],
    ["projectStructure", "src"],
    ["styling", "css"],
    ["ui", "material-ui"],
    ["database", "mysql"],
    ["orm", "drizzle"],
    ["auth", "clerk"],
    ["docker", "compose"],
    ["packageManager", "yarn"],
  ] as const)("rejects an unknown %s option", (field, value) => {
    expect(
      BaseForgeConfigSchema.safeParse({
        ...defaultBaseForgeConfig,
        [field]: value,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown object keys", () => {
    expect(
      BaseForgeConfigSchema.safeParse({
        ...defaultBaseForgeConfig,
        unknownOption: true,
      }).success,
    ).toBe(false);
  });
});
