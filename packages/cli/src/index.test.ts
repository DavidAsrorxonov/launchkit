import { describe, expect, it } from "vitest";

import type { CliProjectGenerator } from "./generate.js";
import { main, type CliOutput } from "./index.js";
import type { CliProjectWriter } from "./write-project.js";

describe("main", () => {
  it("returns zero and prints next steps when project writing succeeds", async () => {
    const output = createOutputCapture();
    const projectGenerator = createProjectGenerator({
      name: "my-app",
      packageManager: "npm",
      files: ["package.json", "README.md"],
    });
    const projectWriter = createProjectWriter();

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator,
      projectWriter,
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toEqual([
      "Created my-app in ./my-app",
      "",
      "Next steps:",
      "  cd my-app",
      "  npm install",
      "  npm run dev",
    ]);
    expect(output.errors).toEqual([]);
    expect(projectWriter.calls).toEqual([
      {
        targetDir: "my-app",
        projectName: "my-app",
        cwd: undefined,
      },
    ]);
  });

  it("uses --name as the default target directory", async () => {
    const output = createOutputCapture();
    const projectWriter = createProjectWriter();

    const exitCode = await main(["--name", "named-app", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "named-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(0);
    expect(projectWriter.calls[0]).toMatchObject({
      targetDir: "named-app",
      projectName: "named-app",
    });
  });

  it("uses positional target directory before config name", async () => {
    const output = createOutputCapture();
    const projectWriter = createProjectWriter();

    const exitCode = await main(["folder-name", "--name", "package-name", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "package-name",
        packageManager: "pnpm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(0);
    expect(output.logs).toContain("Created package-name in ./folder-name");
    expect(output.logs).toContain("  pnpm install");
    expect(output.logs).toContain("  pnpm dev");
    expect(projectWriter.calls[0]).toMatchObject({
      targetDir: "folder-name",
      projectName: "package-name",
    });
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
      projectWriter: createProjectWriter(),
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
      projectWriter: createProjectWriter(),
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual([
      "Error: Generated project contains an unsafe file path: src/app/page.tsx",
    ]);
  });

  it("returns non-zero and prints a CLI-friendly error when writing fails", async () => {
    const output = createOutputCapture();
    const projectWriter: CliProjectWriter = async () => {
      throw new Error("Target directory is not empty: /tmp/my-app");
    };

    const exitCode = await main(["my-app", "--yes"], {
      output,
      projectGenerator: createProjectGenerator({
        name: "my-app",
        packageManager: "npm",
        files: ["package.json"],
      }),
      projectWriter,
    });

    expect(exitCode).toBe(1);
    expect(output.logs).toEqual([]);
    expect(output.errors).toEqual(["Error: Target directory is not empty: /tmp/my-app"]);
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

function createProjectWriter(): CliProjectWriter & {
  calls: Array<{ targetDir: string; projectName: string; cwd?: string }>;
} {
  const calls: Array<{ targetDir: string; projectName: string; cwd?: string }> = [];

  return Object.assign(
    async (input: Parameters<CliProjectWriter>[0]) => {
      calls.push({
        targetDir: input.targetDir,
        projectName: input.project.name,
        cwd: input.cwd,
      });

      return {
        targetDir: input.targetDir,
        filesWritten: input.project.files.map((file) => file.path),
      };
    },
    { calls },
  );
}
