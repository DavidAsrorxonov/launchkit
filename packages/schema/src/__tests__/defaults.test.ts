import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig, LaunchKitConfigSchema } from "../index";

describe("defaultLaunchKitConfig", () => {
  it("validates with LaunchKitConfigSchema", () => {
    expect(LaunchKitConfigSchema.parse(defaultLaunchKitConfig)).toEqual(
      defaultLaunchKitConfig,
    );
  });

  it("matches the confirmed MVP defaults", () => {
    expect(defaultLaunchKitConfig).toEqual({
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
    });
  });
});
