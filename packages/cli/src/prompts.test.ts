import { describe, expect, it } from "vitest";

import type { CliArgs } from "./args.js";
import {
  createConfigDraftFromAnswers,
  getPromptFields,
  promptForConfig,
  type PromptFunctions,
} from "./prompts.js";

const emptyArgs: CliArgs = {
  yes: false,
  help: false,
  version: false,
};

describe("createConfigDraftFromAnswers", () => {
  it("--yes uses defaults without prompt answers", async () => {
    const prompts = createPromptFunctions();

    const draft = await promptForConfig({ ...emptyArgs, yes: true }, prompts);

    expect(draft).toMatchObject({
      name: "my-app",
      framework: "next",
      language: "typescript",
      router: "app",
      projectStructure: "no-src",
      styling: "tailwind",
      packageManager: "npm",
      ui: "none",
      database: "none",
      orm: "none",
      auth: "none",
      docker: "none",
    });
    expect(prompts.calls).toEqual([]);
  });

  it("uses positional target directory as the default project name", () => {
    const draft = createConfigDraftFromAnswers({
      args: { ...emptyArgs, targetDir: "custom-app" },
      answers: {},
    });

    expect(draft.name).toBe("custom-app");
  });

  it("--name overrides positional target directory for config name", () => {
    const draft = createConfigDraftFromAnswers({
      args: { ...emptyArgs, targetDir: "folder-name", name: "package-name" },
      answers: {},
    });

    expect(draft.name).toBe("package-name");
  });

  it("preserves provided args", () => {
    const draft = createConfigDraftFromAnswers({
      args: {
        ...emptyArgs,
        name: "my-app",
        packageManager: "pnpm",
        ui: "shadcn",
        database: "postgres",
        orm: "prisma",
        auth: "authjs-credentials",
        docker: "postgres",
      },
      answers: {
        packageManager: "npm",
        ui: "none",
        database: "none",
        orm: "none",
        auth: "none",
        docker: "none",
      },
    });

    expect(draft).toMatchObject({
      name: "my-app",
      packageManager: "pnpm",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });
  });

  it("fills missing values from prompt answers", () => {
    const draft = createConfigDraftFromAnswers({
      args: emptyArgs,
      answers: {
        name: "answered-app",
        packageManager: "pnpm",
        ui: "shadcn",
        database: "postgres",
        orm: "prisma",
        auth: "authjs-credentials",
        docker: "postgres",
      },
    });

    expect(draft).toMatchObject({
      name: "answered-app",
      packageManager: "pnpm",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });
  });

  it("includes fixed MVP values", () => {
    const draft = createConfigDraftFromAnswers({ args: emptyArgs, answers: {} });

    expect(draft).toMatchObject({
      framework: "next",
      language: "typescript",
      router: "app",
      projectStructure: "no-src",
      styling: "tailwind",
    });
  });

  it("forces Prisma to none without PostgreSQL", () => {
    const draft = createConfigDraftFromAnswers({
      args: { ...emptyArgs, database: "none", orm: "prisma" },
      answers: {},
    });

    expect(draft).toMatchObject({ database: "none", orm: "none" });
  });

  it("forces Docker PostgreSQL to none without PostgreSQL", () => {
    const draft = createConfigDraftFromAnswers({
      args: { ...emptyArgs, database: "none", docker: "postgres" },
      answers: {},
    });

    expect(draft).toMatchObject({ database: "none", docker: "none" });
  });

  it("does not force PostgreSQL for Auth.js credentials", () => {
    const draft = createConfigDraftFromAnswers({
      args: { ...emptyArgs, auth: "authjs-credentials" },
      answers: {},
    });

    expect(draft).toMatchObject({
      database: "none",
      auth: "authjs-credentials",
    });
  });
});

describe("promptForConfig", () => {
  it("uses positional target directory as the project-name prompt default", async () => {
    const prompts = createPromptFunctions({
      inputAnswers: ["from-prompt"],
    });

    await promptForConfig({ ...emptyArgs, targetDir: "folder-name" }, prompts);

    expect(prompts.calls[0]).toMatchObject({
      kind: "input",
      message: "Project name",
      default: "folder-name",
    });
  });

  it("does not re-prompt values provided by args", async () => {
    const prompts = createPromptFunctions({
      selectAnswers: ["none", "none"],
    });

    await promptForConfig(
      {
        ...emptyArgs,
        name: "my-app",
        packageManager: "pnpm",
        ui: "shadcn",
        database: "postgres",
        orm: "prisma",
        auth: "authjs-credentials",
        docker: "postgres",
      },
      prompts,
    );

    expect(prompts.calls).toEqual([]);
  });

  it("prompts for missing values", async () => {
    const prompts = createPromptFunctions({
      inputAnswers: ["my-app"],
      selectAnswers: ["pnpm", "shadcn", "postgres", "prisma", "authjs-credentials", "postgres"],
    });

    const draft = await promptForConfig(emptyArgs, prompts);

    expect(draft).toMatchObject({
      name: "my-app",
      packageManager: "pnpm",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
    });
    expect(prompts.calls.map((call) => call.message)).toEqual([
      "Project name",
      "Package manager",
      "UI library",
      "Database",
      "ORM",
      "Auth",
      "Docker",
    ]);
  });

  it("skips Prisma and Docker prompts when database is not PostgreSQL", async () => {
    const prompts = createPromptFunctions({
      inputAnswers: ["my-app"],
      selectAnswers: ["npm", "none", "none", "authjs-credentials"],
    });

    const draft = await promptForConfig(emptyArgs, prompts);

    expect(draft).toMatchObject({
      database: "none",
      orm: "none",
      auth: "authjs-credentials",
      docker: "none",
    });
    expect(prompts.calls.map((call) => call.message)).toEqual([
      "Project name",
      "Package manager",
      "UI library",
      "Database",
      "Auth",
    ]);
  });
});

describe("getPromptFields", () => {
  it("returns no prompts for --yes", () => {
    expect(getPromptFields({ ...emptyArgs, yes: true })).toEqual([]);
  });

  it("does not include unsupported framework/language/router/styling prompts", () => {
    const fields = getPromptFields(emptyArgs);

    expect(fields).not.toContain("framework");
    expect(fields).not.toContain("language");
    expect(fields).not.toContain("router");
    expect(fields).not.toContain("projectStructure");
    expect(fields).not.toContain("styling");
  });

  it("includes Prisma and Docker only when PostgreSQL is already selected in args", () => {
    expect(getPromptFields({ ...emptyArgs, database: "none" })).not.toContain("orm");
    expect(getPromptFields({ ...emptyArgs, database: "none" })).not.toContain("docker");
    expect(getPromptFields({ ...emptyArgs, database: "postgres" })).toContain("orm");
    expect(getPromptFields({ ...emptyArgs, database: "postgres" })).toContain("docker");
  });
});

type PromptCall = {
  kind: "input" | "select";
  message: string;
  default?: string;
};

function createPromptFunctions(options?: {
  inputAnswers?: string[];
  selectAnswers?: string[];
}): PromptFunctions & { calls: PromptCall[] } {
  const calls: PromptCall[] = [];
  const inputAnswers = [...(options?.inputAnswers ?? [])];
  const selectAnswers = [...(options?.selectAnswers ?? [])];

  return {
    calls,
    async input(config) {
      calls.push({
        kind: "input",
        message: config.message,
        default: config.default,
      });

      return inputAnswers.shift() ?? config.default ?? "my-app";
    },
    async select(config) {
      calls.push({
        kind: "select",
        message: config.message,
        default: config.default,
      });

      return (selectAnswers.shift() ?? config.default ?? config.choices[0]?.value) as never;
    },
  };
}
