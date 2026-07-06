import { describe, expect, it } from "vitest";

import { cliPackageReady } from "./index.js";

describe("cli package", () => {
  it("is ready", () => {
    expect(cliPackageReady()).toBe(true);
  });
});
