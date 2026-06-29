import { describe, expect, it } from "vitest";

import { templatesPackageReady } from "../index";

describe("@launchkit/templates package foundation", () => {
  it("exports a readiness placeholder", () => {
    expect(templatesPackageReady()).toBe(true);
  });
});
