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
} from "./index";

describe("schema package", () => {
  it("exports framework options", () => {
    expect(frameworkOptions).toEqual(["next"]);
  });

  it("exports language options", () => {
    expect(languageOptions).toEqual(["typescript"]);
  });

  it("exports router options", () => {
    expect(routerOptions).toEqual(["app"]);
  });

  it("exports project structure options", () => {
    expect(projectStructureOptions).toEqual(["no-src"]);
  });

  it("exports styling options", () => {
    expect(stylingOptions).toEqual(["tailwind"]);
  });

  it("exports UI options", () => {
    expect(uiOptions).toEqual(["none", "shadcn"]);
  });

  it("exports database options", () => {
    expect(databaseOptions).toEqual(["none", "postgres"]);
  });

  it("exports ORM options", () => {
    expect(ormOptions).toEqual(["none", "prisma"]);
  });

  it("exports auth options", () => {
    expect(authOptions).toEqual(["none", "authjs-credentials"]);
  });

  it("exports Docker options", () => {
    expect(dockerOptions).toEqual(["none", "postgres"]);
  });

  it("exports package manager options", () => {
    expect(packageManagerOptions).toEqual(["npm", "pnpm"]);
  });
});
