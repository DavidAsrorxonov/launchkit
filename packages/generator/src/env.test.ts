import { describe, expect, it } from "vitest";

import type { EnvVarDefinition } from "./generation-plan";
import { EnvVarMergeConflictError, mergeEnvVars, renderEnvExample } from "./env";

describe("env var merging", () => {
  it("returns an empty array for empty input", () => {
    expect(mergeEnvVars([])).toEqual([]);
  });

  it("merges distinct env vars successfully", () => {
    expect(
      mergeEnvVars([
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
        [{ name: "AUTH_SECRET", value: "replace-me" }],
      ]),
    ).toEqual([
      { name: "DATABASE_URL", value: "postgresql://localhost/app" },
      { name: "AUTH_SECRET", value: "replace-me" },
    ]);
  });

  it("merges duplicate env vars with the same value", () => {
    expect(
      mergeEnvVars([
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
      ]),
    ).toEqual([{ name: "DATABASE_URL", value: "postgresql://localhost/app" }]);
  });

  it("throws for duplicate env vars with different values", () => {
    expect(() =>
      mergeEnvVars([
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
        [{ name: "DATABASE_URL", value: "mysql://localhost/app" }],
      ]),
    ).toThrow(EnvVarMergeConflictError);
  });

  it("keeps the first description for duplicate env vars", () => {
    expect(
      mergeEnvVars([
        [
          {
            name: "DATABASE_URL",
            value: "postgresql://localhost/app",
            description: "PostgreSQL connection string.",
          },
        ],
        [
          {
            name: "DATABASE_URL",
            value: "postgresql://localhost/app",
            description: "Database connection URL.",
          },
        ],
      ]),
    ).toEqual([
      {
        name: "DATABASE_URL",
        value: "postgresql://localhost/app",
        description: "PostgreSQL connection string.",
      },
    ]);
  });

  it("keeps a later description when the first env var has none", () => {
    expect(
      mergeEnvVars([
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
        [
          {
            name: "DATABASE_URL",
            value: "postgresql://localhost/app",
            description: "PostgreSQL connection string.",
          },
        ],
      ]),
    ).toEqual([
      {
        name: "DATABASE_URL",
        value: "postgresql://localhost/app",
        description: "PostgreSQL connection string.",
      },
    ]);
  });

  it("marks duplicate env vars as required when either definition is required", () => {
    expect(
      mergeEnvVars([
        [{ name: "AUTH_SECRET", value: "replace-me", required: false }],
        [{ name: "AUTH_SECRET", value: "replace-me", required: true }],
      ]),
    ).toEqual([{ name: "AUTH_SECRET", value: "replace-me", required: true }]);
  });

  it("keeps output order by first appearance", () => {
    expect(
      mergeEnvVars([
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
        [{ name: "AUTH_SECRET", value: "replace-me" }],
        [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
      ]).map((envVar) => envVar.name),
    ).toEqual(["DATABASE_URL", "AUTH_SECRET"]);
  });

  it("does not mutate input arrays", () => {
    const groups: EnvVarDefinition[][] = [
      [{ name: "DATABASE_URL", value: "postgresql://localhost/app" }],
      [{ name: "AUTH_SECRET", value: "replace-me", required: true }],
    ];
    const before = structuredClone(groups);

    mergeEnvVars(groups);

    expect(groups).toEqual(before);
  });
});

describe("env example rendering", () => {
  it("includes comments for descriptions and quotes values", () => {
    expect(
      renderEnvExample([
        {
          name: "DATABASE_URL",
          value: "postgresql://postgres:postgres@localhost:5432/my_app",
          description: "PostgreSQL connection string.",
        },
      ]),
    ).toBe(
      '# PostgreSQL connection string.\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"\n',
    );
  });

  it("preserves ordering and includes a trailing newline", () => {
    expect(
      renderEnvExample([
        { name: "DATABASE_URL", value: "postgresql://localhost/app" },
        { name: "AUTH_SECRET", value: "replace-me" },
      ]),
    ).toBe('DATABASE_URL="postgresql://localhost/app"\n\nAUTH_SECRET="replace-me"\n');
  });

  it("escapes quoted values", () => {
    expect(renderEnvExample([{ name: "EXAMPLE", value: 'value with "quotes"' }])).toBe(
      'EXAMPLE="value with \\"quotes\\""\n',
    );
  });

  it("does not generate a real secret value", () => {
    expect(renderEnvExample([{ name: "AUTH_SECRET", value: "replace-me" }])).toBe(
      'AUTH_SECRET="replace-me"\n',
    );
  });
});
