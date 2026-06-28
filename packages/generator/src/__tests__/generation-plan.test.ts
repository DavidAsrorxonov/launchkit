import { describe, expect, it } from "vitest";

import { defaultLaunchKitConfig } from "@launchkit/schema";

import { createEmptyGenerationPlan } from "../generation-plan";

describe("generation plan model", () => {
  it("creates an empty generation plan with the provided config", () => {
    const plan = createEmptyGenerationPlan(defaultLaunchKitConfig);

    expect(plan.config).toBe(defaultLaunchKitConfig);
  });

  it("uses the Next.js base template by default", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).baseTemplate).toBe("next");
  });

  it("starts with no resolved features", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).features).toEqual([]);
  });

  it("starts with an empty package.json patch", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).packageJson).toEqual({});
  });

  it("starts with no environment variables", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).env).toEqual([]);
  });

  it("starts with no template file references", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).templateFiles).toEqual([]);
  });

  it("starts with no generated file definitions", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).generatedFiles).toEqual([]);
  });

  it("starts with no notes", () => {
    expect(createEmptyGenerationPlan(defaultLaunchKitConfig).notes).toEqual([]);
  });
});
