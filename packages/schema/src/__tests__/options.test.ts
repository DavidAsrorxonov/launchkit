import { describe, expect, it } from "vitest";

import {
  authOptions,
  databaseOptions,
  dockerOptions,
  frameworkOptions,
  languageOptions,
  ormOptions,
  packageManagerOptions,
  projectStructureOptions,
  routerOptions,
  stylingOptions,
  uiOptions,
} from "../index";
import type {
  AuthOption,
  DatabaseOption,
  DockerOption,
  FrameworkOption,
  LanguageOption,
  OrmOption,
  PackageManagerOption,
  ProjectStructureOption,
  RouterOption,
  StylingOption,
  UiOption,
} from "../index";

describe("option exports", () => {
  it("exports every MVP option array with confirmed values", () => {
    expect(frameworkOptions).toEqual(["next"]);
    expect(languageOptions).toEqual(["typescript"]);
    expect(routerOptions).toEqual(["app"]);
    expect(projectStructureOptions).toEqual(["no-src"]);
    expect(stylingOptions).toEqual(["tailwind"]);
    expect(uiOptions).toEqual(["none", "shadcn"]);
    expect(databaseOptions).toEqual(["none", "postgres"]);
    expect(ormOptions).toEqual(["none", "prisma"]);
    expect(authOptions).toEqual(["none", "authjs-credentials"]);
    expect(dockerOptions).toEqual(["none", "postgres"]);
    expect(packageManagerOptions).toEqual(["npm", "pnpm"]);
  });

  it("keeps option union types aligned with the confirmed MVP values", () => {
    const typedValues: {
      framework: FrameworkOption;
      language: LanguageOption;
      router: RouterOption;
      projectStructure: ProjectStructureOption;
      styling: StylingOption;
      ui: UiOption;
      database: DatabaseOption;
      orm: OrmOption;
      auth: AuthOption;
      docker: DockerOption;
      packageManager: PackageManagerOption;
    } = {
      framework: "next",
      language: "typescript",
      router: "app",
      projectStructure: "no-src",
      styling: "tailwind",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
      packageManager: "pnpm",
    };

    expect(typedValues).toEqual({
      framework: "next",
      language: "typescript",
      router: "app",
      projectStructure: "no-src",
      styling: "tailwind",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
      packageManager: "pnpm",
    });
  });
});
