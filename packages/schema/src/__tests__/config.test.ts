import { describe, expect, it } from "vitest";

import {
  defaultLaunchKitConfig,
  LaunchKitConfigSchema,
  parseLaunchKitConfig,
} from "../index";
import type { LaunchKitConfig } from "../index";

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
} satisfies LaunchKitConfig;

describe("LaunchKitConfigSchema", () => {
  it("accepts the valid default config", () => {
    expect(LaunchKitConfigSchema.safeParse(defaultLaunchKitConfig).success).toBe(
      true,
    );
  });

  it("accepts a valid full MVP config", () => {
    expect(parseLaunchKitConfig(validFullConfig)).toEqual(validFullConfig);
  });

  it("rejects invalid project names", () => {
    const invalidNames = [
      "",
      "my app",
      "My-App",
      "my_app",
      "my/app",
      "my.app",
      "-my-app",
      "my-app-",
    ];

    for (const name of invalidNames) {
      expect(
        LaunchKitConfigSchema.safeParse({
          ...defaultLaunchKitConfig,
          name,
        }).success,
      ).toBe(false);
    }
  });

  it("accepts project names with lowercase letters, numbers, and hyphens", () => {
    const validNames = ["my-app", "launchkit-demo", "app123", "app-123"];

    for (const name of validNames) {
      expect(
        LaunchKitConfigSchema.safeParse({
          ...defaultLaunchKitConfig,
          name,
        }).success,
      ).toBe(true);
    }
  });

  it.each([
    ["framework", "react"],
    ["ui", "material-ui"],
    ["database", "mysql"],
    ["orm", "drizzle"],
    ["auth", "clerk"],
    ["docker", "compose"],
    ["packageManager", "yarn"],
  ] as const)("rejects an unknown %s option", (field, value) => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...defaultLaunchKitConfig,
        [field]: value,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown object keys", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...defaultLaunchKitConfig,
        unknownOption: true,
      }).success,
    ).toBe(false);
  });
});
