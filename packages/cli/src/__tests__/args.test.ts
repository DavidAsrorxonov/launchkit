import { describe, expect, it } from "vitest";

import {
  CliArgumentError,
  getHelpText,
  getVersionText,
  parseCliArgs,
} from "../args.js";

describe("parseCliArgs", () => {
  it("parses empty args", () => {
    expect(parseCliArgs([])).toEqual({
      install: undefined,
      yes: false,
      help: false,
      version: false,
    });
  });

  it("parses a positional target directory", () => {
    expect(parseCliArgs(["my-app"])).toMatchObject({ targetDir: "my-app" });
  });

  it("parses --name", () => {
    expect(parseCliArgs(["--name", "my-app"])).toMatchObject({ name: "my-app" });
  });

  it("parses --package-manager npm", () => {
    expect(parseCliArgs(["--package-manager", "npm"])).toMatchObject({
      packageManager: "npm",
    });
  });

  it("parses --package-manager pnpm", () => {
    expect(parseCliArgs(["--package-manager", "pnpm"])).toMatchObject({
      packageManager: "pnpm",
    });
  });

  it("parses --ui shadcn", () => {
    expect(parseCliArgs(["--ui", "shadcn"])).toMatchObject({ ui: "shadcn" });
  });

  it("parses --database postgres", () => {
    expect(parseCliArgs(["--database", "postgres"])).toMatchObject({
      database: "postgres",
    });
  });

  it("parses --orm prisma", () => {
    expect(parseCliArgs(["--orm", "prisma"])).toMatchObject({ orm: "prisma" });
  });

  it("parses --auth authjs-credentials", () => {
    expect(parseCliArgs(["--auth", "authjs-credentials"])).toMatchObject({
      auth: "authjs-credentials",
    });
  });

  it("parses --docker postgres", () => {
    expect(parseCliArgs(["--docker", "postgres"])).toMatchObject({
      docker: "postgres",
    });
  });

  it("parses --yes", () => {
    expect(parseCliArgs(["--yes"])).toMatchObject({ yes: true });
  });

  it("parses --install", () => {
    expect(parseCliArgs(["--install"])).toMatchObject({ install: true });
  });

  it("parses --no-install", () => {
    expect(parseCliArgs(["--no-install"])).toMatchObject({ install: false });
  });

  it("throws a typed error when --install and --no-install are combined", () => {
    expect(() => parseCliArgs(["--install", "--no-install"])).toThrow(
      CliArgumentError,
    );
  });

  it("parses --help", () => {
    expect(parseCliArgs(["--help"])).toMatchObject({ help: true });
  });

  it("parses --version", () => {
    expect(parseCliArgs(["--version"])).toMatchObject({ version: true });
  });

  it("parses aliases", () => {
    expect(parseCliArgs(["-y", "-h", "-v"])).toMatchObject({
      yes: true,
      help: true,
      version: true,
    });
  });

  it("throws a typed error for unknown flags", () => {
    expect(() => parseCliArgs(["--framework", "next"])).toThrow(CliArgumentError);
  });

  it("throws a typed error for invalid option values", () => {
    expect(() => parseCliArgs(["--package-manager", "yarn"])).toThrow(
      CliArgumentError,
    );
  });

  it("throws a typed error for multiple positional target directories", () => {
    expect(() => parseCliArgs(["my-app", "other-app"])).toThrow(CliArgumentError);
  });
});

describe("help and version text", () => {
  it("includes supported options", () => {
    const helpText = getHelpText();

    expect(helpText).toContain("create-launchkit [project-name] [options]");
    expect(helpText).toContain("--name <name>");
    expect(helpText).toContain("--package-manager <npm|pnpm>");
    expect(helpText).toContain("--ui <none|shadcn>");
    expect(helpText).toContain("--database <none|postgres>");
    expect(helpText).toContain("--orm <none|prisma>");
    expect(helpText).toContain("--auth <none|authjs-credentials>");
    expect(helpText).toContain("--docker <none|postgres>");
    expect(helpText).toContain("--install");
    expect(helpText).toContain("--no-install");
    expect(helpText).toContain("-y, --yes");
    expect(helpText).toContain("-h, --help");
    expect(helpText).toContain("-v, --version");
  });

  it("does not include unsupported options", () => {
    const helpText = getHelpText();

    expect(helpText).not.toContain("--framework");
    expect(helpText).not.toContain("--language");
    expect(helpText).not.toContain("--router");
    expect(helpText).not.toContain("--project-structure");
    expect(helpText).not.toContain("--styling");
  });

  it("returns the CLI version", () => {
    expect(getVersionText()).toBe("0.0.0");
  });
});
