import { describe, expect, it } from "vitest";

import { InvalidGeneratedPathError } from "./file-tree";
import {
  TemplateNotFoundError,
  applyTemplatePlaceholders,
  createInMemoryTemplateLoader,
} from "./template-loader";

const context = {
  projectName: "my-app",
  packageName: "@demo/my-app",
};

describe("template placeholders", () => {
  it("replaces known placeholders", () => {
    expect(applyTemplatePlaceholders("Welcome to {{projectName}}", context)).toBe(
      "Welcome to my-app",
    );
  });

  it("replaces multiple placeholders", () => {
    expect(
      applyTemplatePlaceholders("Project {{projectName}} uses {{packageName}}", context),
    ).toBe("Project my-app uses @demo/my-app");
  });

  it("replaces repeated placeholders", () => {
    expect(
      applyTemplatePlaceholders("{{projectName}}/{{projectName}}", context),
    ).toBe("my-app/my-app");
  });

  it("leaves unknown placeholders unchanged", () => {
    expect(applyTemplatePlaceholders("{{unknown}} {{projectName}}", context)).toBe(
      "{{unknown}} my-app",
    );
  });

  it("does not mutate the context object", () => {
    const before = structuredClone(context);

    applyTemplatePlaceholders("{{projectName}}", context);

    expect(context).toEqual(before);
  });
});

describe("in-memory template loader", () => {
  it("returns files for a known template ID with text placeholders applied", async () => {
    const loader = createInMemoryTemplateLoader({
      "base/next": [
        {
          sourcePath: "README.md",
          targetPath: "{{projectName}}/README.md",
          contents: "# {{projectName}}\n\nPackage: {{packageName}}\n",
        },
      ],
    });

    await expect(
      loader.loadTemplateFiles({ templateId: "base/next", context }),
    ).resolves.toEqual([
      {
        sourcePath: "README.md",
        targetPath: "my-app/README.md",
        contents: "# my-app\n\nPackage: @demo/my-app\n",
      },
    ]);
  });

  it("preserves binary file contents", async () => {
    const binaryContents = new Uint8Array([1, 2, 3]);
    const loader = createInMemoryTemplateLoader({
      "base/next": [
        {
          sourcePath: "public/logo.png",
          targetPath: "public/logo.png",
          contents: binaryContents,
        },
      ],
    });

    const files = await loader.loadTemplateFiles({ templateId: "base/next", context });

    expect(files[0]?.contents).toEqual(binaryContents);
    expect(files[0]?.contents).not.toBe(binaryContents);
  });

  it("throws for unknown template IDs", async () => {
    const loader = createInMemoryTemplateLoader({});

    await expect(
      loader.loadTemplateFiles({ templateId: "base/next", context }),
    ).rejects.toThrow(TemplateNotFoundError);
  });

  it("rejects unsafe target paths after placeholder replacement", async () => {
    const loader = createInMemoryTemplateLoader({
      unsafe: [
        {
          sourcePath: "README.md",
          targetPath: "../{{projectName}}/README.md",
          contents: "",
        },
      ],
    });

    await expect(loader.loadTemplateFiles({ templateId: "unsafe", context })).rejects.toThrow(
      InvalidGeneratedPathError,
    );
  });

  it("does not mutate source template files", async () => {
    const templates = {
      "base/next": [
        {
          sourcePath: "README.md",
          targetPath: "{{projectName}}/README.md",
          contents: "# {{projectName}}\n",
        },
      ],
    };
    const before = structuredClone(templates);
    const loader = createInMemoryTemplateLoader(templates);

    await loader.loadTemplateFiles({ templateId: "base/next", context });

    expect(templates).toEqual(before);
  });
});
