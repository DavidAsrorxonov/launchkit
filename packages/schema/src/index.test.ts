import { describe, expect, it } from "vitest";

import {
  authOptions,
  authMetadata,
  assertCompatibleConfig,
  databaseOptions,
  databaseMetadata,
  dockerOptions,
  dockerMetadata,
  frameworkOptions,
  frameworkMetadata,
  languageOptions,
  languageMetadata,
  LaunchKitConfigSchema,
  LaunchKitCompatibilityError,
  defaultLaunchKitConfig,
  ormOptions,
  ormMetadata,
  packageManagerOptions,
  packageManagerMetadata,
  parseLaunchKitConfig,
  projectStructureOptions,
  projectStructureMetadata,
  routerOptions,
  routerMetadata,
  stylingOptions,
  stylingMetadata,
  uiOptions,
  uiMetadata,
  validateCompatibility,
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

describe("defaultLaunchKitConfig", () => {
  it("parses successfully with LaunchKitConfigSchema", () => {
    expect(LaunchKitConfigSchema.safeParse(defaultLaunchKitConfig).success).toBe(
      true,
    );
  });

  it("matches the MVP defaults", () => {
    expect(defaultLaunchKitConfig).toEqual({
      name: "my-app",
      framework: "next",
      language: "typescript",
      router: "app",
      projectStructure: "no-src",
      styling: "tailwind",
      ui: "none",
      database: "none",
      orm: "none",
      auth: "none",
      docker: "none",
      packageManager: "npm",
    });
  });
});

type MetadataItem = {
  value: string;
  label: string;
  description: string;
};

const metadataCases: {
  category: string;
  options: readonly string[];
  metadata: readonly MetadataItem[];
}[] = [
  {
    category: "framework",
    options: frameworkOptions,
    metadata: frameworkMetadata,
  },
  {
    category: "language",
    options: languageOptions,
    metadata: languageMetadata,
  },
  {
    category: "router",
    options: routerOptions,
    metadata: routerMetadata,
  },
  {
    category: "project structure",
    options: projectStructureOptions,
    metadata: projectStructureMetadata,
  },
  {
    category: "styling",
    options: stylingOptions,
    metadata: stylingMetadata,
  },
  {
    category: "UI",
    options: uiOptions,
    metadata: uiMetadata,
  },
  {
    category: "database",
    options: databaseOptions,
    metadata: databaseMetadata,
  },
  {
    category: "ORM",
    options: ormOptions,
    metadata: ormMetadata,
  },
  {
    category: "auth",
    options: authOptions,
    metadata: authMetadata,
  },
  {
    category: "Docker",
    options: dockerOptions,
    metadata: dockerMetadata,
  },
  {
    category: "package manager",
    options: packageManagerOptions,
    metadata: packageManagerMetadata,
  },
];

describe("option metadata", () => {
  it("has metadata for every MVP option category", () => {
    expect(metadataCases.map(({ category }) => category)).toEqual([
      "framework",
      "language",
      "router",
      "project structure",
      "styling",
      "UI",
      "database",
      "ORM",
      "auth",
      "Docker",
      "package manager",
    ]);
  });

  it.each(metadataCases)(
    "matches the $category option values exactly",
    ({ options, metadata }) => {
      const metadataValues = metadata.map(({ value }) => value);

      expect(metadataValues).toEqual([...options]);
      expect(new Set(metadataValues).size).toBe(metadataValues.length);
    },
  );

  it.each(metadataCases)(
    "uses only supported $category option values",
    ({ options, metadata }) => {
      for (const item of metadata) {
        expect(options).toContain(item.value);
      }
    },
  );

  it.each(metadataCases)(
    "has exactly one metadata item for every $category option",
    ({ options, metadata }) => {
      const metadataValues = metadata.map(({ value }) => value);

      for (const option of options) {
        expect(metadataValues.filter((value) => value === option)).toHaveLength(
          1,
        );
      }
    },
  );

  it.each(metadataCases)(
    "has non-empty labels and descriptions for $category metadata",
    ({ metadata }) => {
      for (const item of metadata) {
        expect(item.label.trim()).not.toBe("");
        expect(item.description.trim()).not.toBe("");
      }
    },
  );
});

const minimalMvpConfig = {
  name: "my-app",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "none",
  database: "none",
  orm: "none",
  auth: "none",
  docker: "none",
  packageManager: "npm",
} as const;

describe("LaunchKitConfigSchema", () => {
  it("accepts a valid minimal MVP config", () => {
    expect(LaunchKitConfigSchema.safeParse(minimalMvpConfig).success).toBe(
      true,
    );
  });

  it("accepts a valid full MVP config", () => {
    const config = {
      ...minimalMvpConfig,
      name: "launchkit-demo",
      ui: "shadcn",
      database: "postgres",
      orm: "prisma",
      auth: "authjs-credentials",
      docker: "postgres",
      packageManager: "pnpm",
    } as const;

    expect(parseLaunchKitConfig(config)).toEqual(config);
  });

  it("rejects an empty project name", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "" })
        .success,
    ).toBe(false);
  });

  it("rejects a project name with spaces", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "my app" })
        .success,
    ).toBe(false);
  });

  it("rejects an uppercase project name", () => {
    expect(
      LaunchKitConfigSchema.safeParse({ ...minimalMvpConfig, name: "My-App" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown framework", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        framework: "react",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown database", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        database: "mysql",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown package manager", () => {
    expect(
      LaunchKitConfigSchema.safeParse({
        ...minimalMvpConfig,
        packageManager: "yarn",
      }).success,
    ).toBe(false);
  });
});

describe("compatibility rules", () => {
  it("returns no issues for the default config", () => {
    expect(validateCompatibility(defaultLaunchKitConfig)).toEqual([]);
  });

  it("returns an issue when Prisma is selected without PostgreSQL", () => {
    const issues = validateCompatibility({
      ...minimalMvpConfig,
      orm: "prisma",
      database: "none",
    });

    expect(issues).toContainEqual({
      code: "prisma_requires_postgresql",
      message: "Prisma requires PostgreSQL.",
      path: ["orm", "database"],
    });
  });

  it("returns no issues when Prisma is selected with PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...minimalMvpConfig,
        orm: "prisma",
        database: "postgres",
      }),
    ).toEqual([]);
  });

  it("returns an issue when PostgreSQL Docker Compose is selected without PostgreSQL", () => {
    const issues = validateCompatibility({
      ...minimalMvpConfig,
      docker: "postgres",
      database: "none",
    });

    expect(issues).toContainEqual({
      code: "docker_postgres_requires_postgresql",
      message:
        "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
      path: ["docker", "database"],
    });
  });

  it("returns no issues when PostgreSQL Docker Compose is selected with PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...minimalMvpConfig,
        docker: "postgres",
        database: "postgres",
      }),
    ).toEqual([]);
  });

  it("returns no issues for Auth.js credentials without a database", () => {
    expect(
      validateCompatibility({
        ...minimalMvpConfig,
        auth: "authjs-credentials",
        database: "none",
        orm: "none",
      }),
    ).toEqual([]);
  });

  it("returns no issues for Auth.js credentials with Prisma and PostgreSQL", () => {
    expect(
      validateCompatibility({
        ...minimalMvpConfig,
        auth: "authjs-credentials",
        database: "postgres",
        orm: "prisma",
      }),
    ).toEqual([]);
  });

  it("returns an issue for Auth.js credentials with Prisma but no PostgreSQL", () => {
    const issues = validateCompatibility({
      ...minimalMvpConfig,
      auth: "authjs-credentials",
      database: "none",
      orm: "prisma",
    });

    expect(issues).toContainEqual({
      code: "authjs_credentials_prisma_requires_postgresql",
      message: "Auth.js credentials with Prisma requires Prisma and PostgreSQL.",
      path: ["auth", "orm", "database"],
    });
  });

  it("returns no issues when shadcn/ui is selected with Tailwind CSS", () => {
    expect(
      validateCompatibility({
        ...minimalMvpConfig,
        ui: "shadcn",
        styling: "tailwind",
      }),
    ).toEqual([]);
  });

  it("throws a typed error when asserting an incompatible config", () => {
    expect(() =>
      assertCompatibleConfig({
        ...minimalMvpConfig,
        docker: "postgres",
        database: "none",
      }),
    ).toThrow(LaunchKitCompatibilityError);
  });
});
