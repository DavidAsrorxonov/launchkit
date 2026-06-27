import { describe, expect, it } from "vitest";

import { launchkitSchemaPlaceholder } from "./index";

describe("schema package", () => {
  it("exposes the current schema entry point", () => {
    expect(launchkitSchemaPlaceholder).toBe("launchkit-schema");
  });
});
