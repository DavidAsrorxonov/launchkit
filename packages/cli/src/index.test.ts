import { describe, expect, it } from "vitest";

import { main, type CliOutput } from "./index.js";

describe("main", () => {
  it("returns zero when config validation succeeds", async () => {
    const output = createOutputCapture();

    const exitCode = await main(["my-app", "--yes"], { output });

    expect(exitCode).toBe(0);
    expect(output.logs).toEqual([
      "LaunchKit config validated.",
      "Generation will be added in the next step.",
    ]);
    expect(output.errors).toEqual([]);
  });

  it("returns non-zero when config validation fails", async () => {
    const output = createOutputCapture();

    const exitCode = await main(["--name", "Invalid_Name", "--yes"], {
      output,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      "Error: Use lowercase letters, numbers, and hyphens only.",
    ]);
  });
});

function createOutputCapture(): CliOutput & {
  logs: string[];
  errors: string[];
} {
  const logs: string[] = [];
  const errors: string[] = [];

  return {
    logs,
    errors,
    log(message) {
      logs.push(message);
    },
    error(message) {
      errors.push(message);
    },
  };
}
