import { describe, expect, it } from "vitest";

import { defaultBaseForgeConfig, BaseForgeConfigSchema } from "../index";

describe("defaultBaseForgeConfig", () => {
  it("validates with BaseForgeConfigSchema", () => {
    expect(BaseForgeConfigSchema.parse(defaultBaseForgeConfig)).toEqual(
      defaultBaseForgeConfig,
    );
  });

  it("matches the confirmed MVP defaults", () => {
    expect(defaultBaseForgeConfig).toEqual({
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
