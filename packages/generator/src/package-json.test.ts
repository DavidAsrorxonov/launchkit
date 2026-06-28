import { describe, expect, it } from "vitest";

import type { PackageJsonPatch } from "./generation-plan";
import { PackageJsonMergeConflictError, mergePackageJsonPatches } from "./package-json";

describe("package.json patch merging", () => {
  it("returns an empty patch for an empty patch list", () => {
    expect(mergePackageJsonPatches([])).toEqual({});
  });

  it("merges dependencies successfully", () => {
    expect(
      mergePackageJsonPatches([
        { dependencies: { react: "^19.0.0" } },
        { dependencies: { next: "^16.0.0" } },
      ]),
    ).toEqual({
      dependencies: {
        react: "^19.0.0",
        next: "^16.0.0",
      },
    });
  });

  it("keeps duplicate dependencies with the same version", () => {
    expect(
      mergePackageJsonPatches([
        { dependencies: { react: "^19.0.0" } },
        { dependencies: { react: "^19.0.0" } },
      ]),
    ).toEqual({
      dependencies: {
        react: "^19.0.0",
      },
    });
  });

  it("throws for duplicate dependencies with different versions", () => {
    expect(() =>
      mergePackageJsonPatches([
        { dependencies: { react: "^19.0.0" } },
        { dependencies: { react: "^18.0.0" } },
      ]),
    ).toThrow(PackageJsonMergeConflictError);
  });

  it("merges dev dependencies successfully", () => {
    expect(
      mergePackageJsonPatches([
        { devDependencies: { typescript: "^5.0.0" } },
        { devDependencies: { eslint: "^9.0.0" } },
      ]),
    ).toEqual({
      devDependencies: {
        typescript: "^5.0.0",
        eslint: "^9.0.0",
      },
    });
  });

  it("throws for duplicate dev dependencies with different versions", () => {
    expect(() =>
      mergePackageJsonPatches([
        { devDependencies: { typescript: "^5.0.0" } },
        { devDependencies: { typescript: "^4.0.0" } },
      ]),
    ).toThrow("Conflicting dev dependency version for typescript: ^5.0.0 vs ^4.0.0.");
  });

  it("merges scripts successfully", () => {
    expect(
      mergePackageJsonPatches([
        { scripts: { dev: "next dev" } },
        { scripts: { build: "next build" } },
      ]),
    ).toEqual({
      scripts: {
        dev: "next dev",
        build: "next build",
      },
    });
  });

  it("keeps duplicate scripts with the same command", () => {
    expect(
      mergePackageJsonPatches([
        { scripts: { dev: "next dev" } },
        { scripts: { dev: "next dev" } },
      ]),
    ).toEqual({
      scripts: {
        dev: "next dev",
      },
    });
  });

  it("throws for duplicate scripts with different commands", () => {
    expect(() =>
      mergePackageJsonPatches([
        { scripts: { dev: "next dev" } },
        { scripts: { dev: "vite dev" } },
      ]),
    ).toThrow("Conflicting script command for dev: next dev vs vite dev.");
  });

  it("merges identical metadata fields successfully", () => {
    expect(
      mergePackageJsonPatches([
        { name: "my-app", version: "0.1.0", private: true, type: "module" },
        { name: "my-app", version: "0.1.0", private: true, type: "module" },
      ]),
    ).toEqual({
      name: "my-app",
      version: "0.1.0",
      private: true,
      type: "module",
    });
  });

  it("throws for conflicting metadata fields", () => {
    expect(() =>
      mergePackageJsonPatches([{ type: "module" }, { type: "commonjs" }]),
    ).toThrow('Conflicting package.json field "type": module vs commonjs.');
  });

  it("does not mutate input patches", () => {
    const patches: PackageJsonPatch[] = [
      {
        dependencies: { react: "^19.0.0" },
        scripts: { dev: "next dev" },
      },
      {
        dependencies: { next: "^16.0.0" },
        scripts: { build: "next build" },
      },
    ];
    const before = structuredClone(patches);

    mergePackageJsonPatches(patches);

    expect(patches).toEqual(before);
  });
});
