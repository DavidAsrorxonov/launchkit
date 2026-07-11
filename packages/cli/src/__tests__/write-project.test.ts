import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import type { GeneratedProject } from "@baseforge/generator";
import { afterEach, describe, expect, it } from "vitest";

import { DirectorySafetyError } from "../directory-safety.js";
import {
  ProjectWriteError,
  UnsafeGeneratedPathError,
  formatNextSteps,
  formatTargetDirForDisplay,
  resolveTargetDir,
  writeGeneratedProject,
} from "../write-project.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((tempRoot) =>
      rm(tempRoot, { recursive: true, force: true }),
    ),
  );
});

describe("writeGeneratedProject", () => {
  it("writes generated files to a new temp directory", async () => {
    const cwd = await createTempRoot();
    const result = await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "package.json", contents: "{}" }],
      }),
    });

    await expect(readFile(path.join(cwd, "my-app", "package.json"), "utf8")).resolves.toBe(
      "{}",
    );
    expect(result).toEqual({
      targetDir: path.join(cwd, "my-app"),
      filesWritten: ["package.json"],
    });
  });

  it("creates nested directories", async () => {
    const cwd = await createTempRoot();

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "app/api/health/route.ts", contents: "export {};" }],
      }),
    });

    const nestedDirectory = await stat(path.join(cwd, "my-app", "app", "api", "health"));

    expect(nestedDirectory.isDirectory()).toBe(true);
    await expect(
      readFile(path.join(cwd, "my-app", "app", "api", "health", "route.ts"), "utf8"),
    ).resolves.toBe("export {};");
  });

  it("writes string contents", async () => {
    const cwd = await createTempRoot();

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "README.md", contents: "# My App\n" }],
      }),
    });

    await expect(readFile(path.join(cwd, "my-app", "README.md"), "utf8")).resolves.toBe(
      "# My App\n",
    );
  });

  it("writes Uint8Array contents", async () => {
    const cwd = await createTempRoot();
    const contents = new Uint8Array([1, 2, 3]);

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "public/icon.bin", contents }],
      }),
    });

    await expect(readFile(path.join(cwd, "my-app", "public", "icon.bin"))).resolves.toEqual(
      Buffer.from(contents),
    );
  });

  it("rejects absolute generated paths", async () => {
    const cwd = await createTempRoot();

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "/package.json", contents: "{}" }],
        }),
      }),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("rejects parent-directory traversal", async () => {
    const cwd = await createTempRoot();

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "../package.json", contents: "{}" }],
        }),
      }),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("rejects empty path segments", async () => {
    const cwd = await createTempRoot();

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "app//page.tsx", contents: "" }],
        }),
      }),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("rejects paths escaping the target directory", async () => {
    const cwd = await createTempRoot();

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "app/../../outside.ts", contents: "" }],
        }),
      }),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("rejects src paths", async () => {
    const cwd = await createTempRoot();

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "src/app/page.tsx", contents: "" }],
        }),
      }),
    ).rejects.toThrow(UnsafeGeneratedPathError);
  });

  it("writes into an existing empty directory", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "package.json", contents: "{}" }],
      }),
    });

    await expect(readFile(path.join(cwd, "my-app", "package.json"), "utf8")).resolves.toBe(
      "{}",
    );
  });

  it("fails on an existing non-empty directory with --yes behavior by default", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "package.json", contents: "{}" }],
        }),
      }),
    ).rejects.toThrow(DirectorySafetyError);
  });

  it("fails when the target path is an existing file", async () => {
    const cwd = await createTempRoot();
    await writeFile(path.join(cwd, "my-app"), "");

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        project: createProject({
          files: [{ path: "package.json", contents: "{}" }],
        }),
      }),
    ).rejects.toThrow(DirectorySafetyError);
  });

  it("does not install dependencies", async () => {
    const cwd = await createTempRoot();

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      project: createProject({
        files: [{ path: "package.json", contents: "{}" }],
      }),
    });

    await expect(readdir(path.join(cwd, "my-app"))).resolves.toEqual(["package.json"]);
  });
});

describe("target directory and output formatting", () => {
  it("resolves target directory from positional input first", () => {
    expect(resolveTargetDir({ targetDir: "folder-name", projectName: "my-app" })).toBe(
      "folder-name",
    );
  });

  it("resolves target directory from project name by default", () => {
    expect(resolveTargetDir({ projectName: "my-app" })).toBe("my-app");
  });

  it("formats target directory display", () => {
    expect(formatTargetDirForDisplay("my-app")).toBe(`.${path.sep}my-app`);
    expect(formatTargetDirForDisplay(".")).toBe(".");
  });

  it("formats npm next steps", () => {
    expect(formatNextSteps({ targetDir: "my-app", packageManager: "npm" })).toEqual([
      "Next steps:",
      "  cd my-app",
      "  npm install",
      "  npm run dev",
    ]);
  });

  it("formats current-directory npm next steps without cd .", () => {
    expect(formatNextSteps({ targetDir: ".", packageManager: "npm" })).toEqual([
      "Next steps:",
      "  npm install",
      "  npm run dev",
    ]);
  });

  it("omits install step when dependencies were installed", () => {
    expect(
      formatNextSteps({
        targetDir: "my-app",
        packageManager: "npm",
        dependenciesInstalled: true,
      }),
    ).toEqual([
      "Next steps:",
      "  cd my-app",
      "  npm run dev",
    ]);
  });

  it("omits install step for current directory when dependencies were installed", () => {
    expect(
      formatNextSteps({
        targetDir: ".",
        packageManager: "pnpm",
        dependenciesInstalled: true,
      }),
    ).toEqual([
      "Next steps:",
      "  pnpm dev",
    ]);
  });

  it("formats pnpm next steps", () => {
    expect(formatNextSteps({ targetDir: "my-app", packageManager: "pnpm" })).toEqual([
      "Next steps:",
      "  cd my-app",
      "  pnpm install",
      "  pnpm dev",
    ]);
  });
});

async function createTempRoot(): Promise<string> {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "baseforge-cli-"));
  tempRoots.push(tempRoot);

  return tempRoot;
}

function createProject(input: {
  files: Array<{ path: string; contents: string | Uint8Array }>;
}): GeneratedProject {
  return {
    name: "my-app",
    packageManager: "npm",
    files: input.files,
  };
}
