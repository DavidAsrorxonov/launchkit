import { describe, expect, it } from "vitest";

import type { CliProjectGenerator } from "./generate.js";
import { main, type CliOutput } from "./index.js";

describe("main", () => {
  it("returns zero and prints a preview when generation succeeds", async () => {
    const output = createOutputCapture();
    const projectGenerator = createProjectGenerator({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json", "README.md"],
    });

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toEqual([
      "Generated project preview:",
      "- name: my-app",
      "- package manager: npm",
      "- files: 2",
      "Files:",
      "- package.json",
      "- README.md",
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

  it("returns non-zero and prints a CLI-friendly error when generation fails", async () => {
    const output = createOutputCapture();
    const projectGenerator: CliProjectGenerator = async () => {
      throw new Error("Template loader failed.");
    };

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual(["Error: Template loader failed."]);
  });

  it("returns non-zero when generated output contains an unsafe path", async () => {
    const output = createOutputCapture();
    const projectGenerator = createProjectGenerator({
      name: "my-app",
      packageManager: "npm",
      files: ["src/app/page.tsx"],
    });

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      "Error: Generated project contains an unsafe file path: src/app/page.tsx",
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

function createProjectGenerator(input: {
  name: string;
  packageManager: "npm" | "pnpm";
  files: string[];
}): CliProjectGenerator {
  return async () => ({
    name: input.name,
    packageManager: input.packageManager,
    files: input.files.map((path) => ({
      path,
      contents: "",
    })),
  });
}
