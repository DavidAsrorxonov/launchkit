import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig } from "@launchkit/schema";

import { generatorPackageReady, getGeneratorDefaultConfig } from "../index";

describe("@launchkit/generator package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(generatorPackageReady()).toBe(true);
  });

  it("can import from @launchkit/schema", () => {
    expect(getGeneratorDefaultConfig()).toBe(defaultLaunchKitConfig);
  });
});
