import { describe, expect, it } from "vitest";

import {
  authMetadata,
  authOptions,
  databaseMetadata,
  databaseOptions,
  dockerMetadata,
  dockerOptions,
  frameworkMetadata,
  frameworkOptions,
  languageMetadata,
  languageOptions,
  ormMetadata,
  ormOptions,
  packageManagerMetadata,
  packageManagerOptions,
  projectStructureMetadata,
  projectStructureOptions,
  routerMetadata,
  routerOptions,
  stylingMetadata,
  stylingOptions,
  uiMetadata,
  uiOptions,
} from "../index";

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
  it("exports metadata for every MVP option category", () => {
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
    "matches $category option values exactly",
    ({ metadata, options }) => {
      expect(metadata.map(({ value }) => value)).toEqual([...options]);
    },
  );

  it.each(metadataCases)(
    "has exactly one metadata item for every $category option",
    ({ metadata, options }) => {
      const metadataValues = metadata.map(({ value }) => value);

      expect(new Set(metadataValues).size).toBe(metadataValues.length);

      for (const option of options) {
        expect(metadataValues.filter((value) => value === option)).toHaveLength(
          1,
        );
      }
    },
  );

  it.each(metadataCases)(
    "uses only supported $category option values",
    ({ metadata, options }) => {
      for (const item of metadata) {
        expect(options).toContain(item.value);
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
