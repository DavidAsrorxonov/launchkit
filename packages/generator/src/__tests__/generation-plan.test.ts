import { describe, expect, it } from "vitest";

import { defaultBaseForgeConfig } from "@baseforge/schema";

import { createEmptyGenerationPlan } from "../generation-plan";

describe("generation plan model", () => {
  it("creates an empty generation plan with the provided config", () => {
    const plan = createEmptyGenerationPlan(defaultBaseForgeConfig);

    expect(plan.config).toBe(defaultBaseForgeConfig);
  });

  it("uses the Next.js base template by default", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).baseTemplate).toBe("next");
  });

  it("starts with no resolved features", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).features).toEqual([]);
  });

  it("starts with an empty package.json patch", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).packageJson).toEqual({});
  });

  it("starts with no environment variables", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).env).toEqual([]);
  });

  it("starts with no template file references", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).templateFiles).toEqual([]);
  });

  it("starts with no generated file definitions", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).generatedFiles).toEqual([]);
  });

  it("starts with no notes", () => {
    expect(createEmptyGenerationPlan(defaultBaseForgeConfig).notes).toEqual([]);
  });
});
