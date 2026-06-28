import { describe, expect, it } from "vitest";

import {
  InvalidGeneratedPathError,
  createGeneratedFile,
  createGeneratedProject,
  normalizeGeneratedPath,
} from "./file-tree";

describe("generated file tree paths", () => {
  it("accepts a valid root file path", () => {
    expect(normalizeGeneratedPath("package.json")).toBe("package.json");
  });

  it("accepts a valid nested file path", () => {
    expect(normalizeGeneratedPath("app/page.tsx")).toBe("app/page.tsx");
  });

  it("normalizes Windows-style backslashes to POSIX separators", () => {
    expect(normalizeGeneratedPath("app\\layout.tsx")).toBe("app/layout.tsx");
  });

  it("rejects a leading slash path", () => {
    expect(() => normalizeGeneratedPath("/package.json")).toThrow(InvalidGeneratedPathError);
  });

  it("rejects paths containing parent directory segments", () => {
    expect(() => normalizeGeneratedPath("../package.json")).toThrow(InvalidGeneratedPathError);
    expect(() => normalizeGeneratedPath("app/../package.json")).toThrow(InvalidGeneratedPathError);
  });

  it("rejects paths containing empty segments", () => {
    expect(() => normalizeGeneratedPath("app//page.tsx")).toThrow(InvalidGeneratedPathError);
    expect(() => normalizeGeneratedPath("app/page.tsx/")).toThrow(InvalidGeneratedPathError);
  });

  it("rejects empty and current-directory paths", () => {
    expect(() => normalizeGeneratedPath("")).toThrow(InvalidGeneratedPathError);
    expect(() => normalizeGeneratedPath(".")).toThrow(InvalidGeneratedPathError);
    expect(() => normalizeGeneratedPath("..")).toThrow(InvalidGeneratedPathError);
  });

  it("rejects Windows absolute paths", () => {
    expect(() => normalizeGeneratedPath("C:\\Users\\demo\\package.json")).toThrow(
      InvalidGeneratedPathError,
    );
  });

  it("creates generated files with normalized paths", () => {
    expect(createGeneratedFile("lib\\utils.ts", "export {}")).toEqual({
      path: "lib/utils.ts",
      contents: "export {}",
    });
  });

  it("creates generated projects with valid files", () => {
    const binaryContents = new Uint8Array([1, 2, 3]);

    expect(
      createGeneratedProject({
        name: "my-app",
        packageManager: "npm",
        files: [
          createGeneratedFile("package.json", "{}"),
          createGeneratedFile("public\\icon.png", binaryContents),
        ],
      }),
    ).toEqual({
      name: "my-app",
      packageManager: "npm",
      files: [
        { path: "package.json", contents: "{}" },
        { path: "public/icon.png", contents: binaryContents },
      ],
    });
  });

  it("fails when a generated project contains an invalid file path", () => {
    expect(() =>
      createGeneratedProject({
        name: "my-app",
        packageManager: "pnpm",
        files: [{ path: "app//page.tsx", contents: "" }],
      }),
    ).toThrow(InvalidGeneratedPathError);
  });
});
