import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig } from "@baseforge/schema";

import { generatorPackageReady, getGeneratorDefaultConfig } from "../index";

describe("@baseforge/generator package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(generatorPackageReady()).toBe(true);
  });

  it("can import from @baseforge/schema", () => {
    expect(getGeneratorDefaultConfig()).toBe(defaultLaunchKitConfig);
  });
});
