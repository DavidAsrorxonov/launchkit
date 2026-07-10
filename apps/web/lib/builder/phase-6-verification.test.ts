import { describe, expect, it } from "vitest";

import {
  authOptions,
  databaseOptions,
  defaultBaseForgeConfig,
  dockerOptions,
  frameworkOptions,
  languageOptions,
  ormOptions,
  packageManagerOptions,
  projectStructureOptions,
  routerOptions,
  stylingOptions,
  uiOptions,
  type BaseForgeConfig,
} from "@baseforge/schema";

import { createBuilderPreview } from "./preview";
import { builderSteps } from "./steps";
import {
  getProjectNameError,
  validateAuthStep,
  validateBuilderConfig,
  validateProjectStep,
} from "./validation";

describe("Phase 6 website wizard contract", () => {
  it("renders the required MVP step order", () => {
    expect(builderSteps.map((step) => step.id)).toEqual([
      "project",
      "framework",
      "styling-ui",
      "database",
      "orm",
      "auth",
      "extras",
      "preview",
      "download",
    ]);
  });

  it("exposes only the supported MVP option values", () => {
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

  it("uses schema validation for project names and supported package managers", () => {
    expect(
      validateProjectStep({
        ...defaultBaseForgeConfig,
        name: "Invalid Name",
      }).errors.name,
    ).toBeTruthy();

    expect(
      validateProjectStep({
        ...defaultBaseForgeConfig,
        packageManager: "yarn",
      } as unknown as BaseForgeConfig).errors.packageManager,
    ).toBeTruthy();
  });

  it("returns concise project name validation messages", () => {
    expect(getProjectNameError("")).toBe("Project name is required.");
    expect(getProjectNameError("my/app")).toBe(
      "Project name cannot contain path separators.",
    );
    expect(getProjectNameError("My App")).toBe(
      "Use lowercase letters, numbers, and hyphens only.",
    );
    expect(getProjectNameError("-my-app")).toBe("Use hyphens only between words.");
  });

  it("keeps Auth.js credentials independent from database and ORM choices", () => {
    expect(
      validateAuthStep({
        ...defaultBaseForgeConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "none",
      }).isValid,
    ).toBe(true);
  });

  it("rejects Prisma and PostgreSQL Docker without PostgreSQL", () => {
    expect(
      validateBuilderConfig({
        ...defaultBaseForgeConfig,
        database: "none",
        orm: "prisma",
      }).errors.orm,
    ).toBeTruthy();

    expect(
      validateBuilderConfig({
        ...defaultBaseForgeConfig,
        database: "none",
        docker: "postgres",
      }).errors.docker,
    ).toBeTruthy();
  });

  it("previews the selected stack without unselected optional files or src paths", () => {
    const preview = createBuilderPreview(defaultBaseForgeConfig);

    expect(preview.stackSummary).toEqual(
      expect.arrayContaining([
        { label: "Framework", value: "Next.js" },
        { label: "Project structure", value: "No src folder" },
        { label: "UI", value: "None" },
        { label: "Database", value: "None" },
      ]),
    );
    expect(preview.filePaths).toEqual(
      expect.arrayContaining(["app/layout.tsx", "app/page.tsx", "package.json"]),
    );
    expect(preview.filePaths).not.toEqual(
      expect.arrayContaining([
        "components.json",
        "prisma/schema.prisma",
        "docker-compose.yml",
      ]),
    );
    expect(preview.filePaths.every((path) => !path.startsWith("src/"))).toBe(
      true,
    );
  });

  it("previews full selected stack additions", () => {
    const preview = createBuilderPreview({
      ...defaultBaseForgeConfig,
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
      packageManager: "pnpm",
    });

    expect(preview.dependencies.map((dependency) => dependency.name)).toEqual(
      expect.arrayContaining(["@prisma/client", "next-auth"]),
    );
    expect(preview.devDependencies.map((dependency) => dependency.name)).toEqual(
      expect.arrayContaining(["prisma"]),
    );
    expect(preview.scripts.map((script) => script.name)).toEqual(
      expect.arrayContaining(["dev", "db:generate", "db:push"]),
    );
    expect(preview.envVars.map((envVar) => envVar.name)).toEqual(
      expect.arrayContaining(["DATABASE_URL", "AUTH_SECRET"]),
    );
    expect(preview.filePaths).toEqual(
      expect.arrayContaining([
        "components.json",
        "prisma/schema.prisma",
        "app/api/auth/[...nextauth]/route.ts",
        "docker-compose.yml",
      ]),
    );
    expect(preview.filePaths.every((path) => !path.startsWith("src/"))).toBe(
      true,
    );
  });
});
