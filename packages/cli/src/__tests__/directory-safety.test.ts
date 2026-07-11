import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  DirectorySafetyError,
  ensureSafeTargetDirectory,
  findConflictingGeneratedPaths,
  getTargetDirectoryState,
} from "../directory-safety.js";
import { writeGeneratedProject } from "../write-project.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((tempRoot) =>
      rm(tempRoot, { recursive: true, force: true }),
    ),
  );
});

describe("getTargetDirectoryState", () => {
  it("detects a missing target directory", async () => {
    const cwd = await createTempRoot();

    await expect(getTargetDirectoryState(path.join(cwd, "my-app"))).resolves.toEqual({
      kind: "missing",
    });
  });

  it("detects an existing empty target directory", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));

    await expect(getTargetDirectoryState(path.join(cwd, "my-app"))).resolves.toEqual({
      kind: "empty",
    });
  });

  it("detects an existing non-empty target directory", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    await expect(getTargetDirectoryState(path.join(cwd, "my-app"))).resolves.toEqual({
      kind: "non-empty",
      entries: ["existing.txt"],
    });
  });

  it("ignores .DS_Store when detecting emptiness", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", ".DS_Store"), "");

    await expect(getTargetDirectoryState(path.join(cwd, "my-app"))).resolves.toEqual({
      kind: "empty",
    });
  });

  it("detects a target path that is a file", async () => {
    const cwd = await createTempRoot();
    await writeFile(path.join(cwd, "my-app"), "");

    await expect(getTargetDirectoryState(path.join(cwd, "my-app"))).resolves.toEqual({
      kind: "file",
    });
  });
});

describe("ensureSafeTargetDirectory", () => {
  it("allows a missing target directory", async () => {
    const cwd = await createTempRoot();

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json"],
        yes: true,
      }),
    ).resolves.toEqual({ kind: "missing" });
  });

  it("allows an existing empty target directory", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json"],
        yes: true,
      }),
    ).resolves.toEqual({ kind: "empty" });
  });

  it("rejects an existing non-empty target directory with --yes", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json"],
        yes: true,
      }),
    ).rejects.toThrow(DirectorySafetyError);
  });

  it("prompts for an existing non-empty target directory in interactive mode", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");
    const confirmCalls: string[] = [];

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json"],
        yes: false,
        confirm: async (message) => {
          confirmCalls.push(message);
          return true;
        },
      }),
    ).resolves.toEqual({
      kind: "non-empty",
      entries: ["existing.txt"],
    });
    expect(confirmCalls).toEqual([
      "The target directory is not empty. Continue and add BaseForge files?",
    ]);
  });

  it("stops when the user declines non-empty directory confirmation", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "existing.txt"), "");

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json"],
        yes: false,
        confirm: async () => false,
      }),
    ).rejects.toThrow("Project creation cancelled.");
  });

  it("rejects conflicting generated paths and lists them", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "package.json"), "{}");
    await writeFile(path.join(cwd, "my-app", "README.md"), "");

    await expect(
      ensureSafeTargetDirectory({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json", "README.md", ".env.example"],
        yes: false,
        confirm: async () => true,
      }),
    ).rejects.toThrow(
      [
        "Refusing to overwrite existing files:",
        "- package.json",
        "- README.md",
        "Choose an empty directory or remove the conflicting files.",
      ].join("\n"),
    );
  });

  it("handles the current directory as an empty target", async () => {
    const cwd = await createTempRoot();

    await expect(
      ensureSafeTargetDirectory({
        targetDir: cwd,
        generatedPaths: ["package.json"],
        yes: true,
      }),
    ).resolves.toEqual({ kind: "empty" });
  });

  it("rejects the current directory when non-empty with --yes", async () => {
    const cwd = await createTempRoot();
    await writeFile(path.join(cwd, "notes.txt"), "");

    await expect(
      ensureSafeTargetDirectory({
        targetDir: cwd,
        generatedPaths: ["package.json"],
        yes: true,
      }),
    ).rejects.toThrow("Target directory is not empty.");
  });

  it("prompts for the current directory when non-empty in interactive mode", async () => {
    const cwd = await createTempRoot();
    await writeFile(path.join(cwd, "notes.txt"), "");
    let prompted = false;

    await ensureSafeTargetDirectory({
      targetDir: cwd,
      generatedPaths: ["package.json"],
      yes: false,
      confirm: async () => {
        prompted = true;
        return true;
      },
    });

    expect(prompted).toBe(true);
  });
});

describe("findConflictingGeneratedPaths", () => {
  it("returns existing generated file paths", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "package.json"), "{}");

    await expect(
      findConflictingGeneratedPaths({
        targetDir: path.join(cwd, "my-app"),
        generatedPaths: ["package.json", "README.md"],
      }),
    ).resolves.toEqual(["package.json"]);
  });
});

describe("writeGeneratedProject directory safety integration", () => {
  it("continues in a non-empty directory only after confirmation and without conflicts", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "notes.txt"), "");

    await writeGeneratedProject({
      cwd,
      targetDir: "my-app",
      yes: false,
      confirm: async () => true,
      project: {
        name: "my-app",
        packageManager: "npm",
        files: [{ path: "package.json", contents: "{}" }],
      },
    });

    await expect(readFile(path.join(cwd, "my-app", "notes.txt"), "utf8")).resolves.toBe(
      "",
    );
    await expect(readFile(path.join(cwd, "my-app", "package.json"), "utf8")).resolves.toBe(
      "{}",
    );
  });

  it("does not partially write files when conflicts exist", async () => {
    const cwd = await createTempRoot();
    await mkdir(path.join(cwd, "my-app"));
    await writeFile(path.join(cwd, "my-app", "package.json"), "{}");

    await expect(
      writeGeneratedProject({
        cwd,
        targetDir: "my-app",
        yes: false,
        confirm: async () => true,
        project: {
          name: "my-app",
          packageManager: "npm",
          files: [
            { path: "app/page.tsx", contents: "export default function Page() {}" },
            { path: "package.json", contents: "{\"name\":\"my-app\"}" },
          ],
        },
      }),
    ).rejects.toThrow("Refusing to overwrite existing files:");

    await expect(readdir(path.join(cwd, "my-app"))).resolves.toEqual(["package.json"]);
  });
});

async function createTempRoot(): Promise<string> {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "baseforge-cli-"));
  tempRoots.push(tempRoot);

  return tempRoot;
}
