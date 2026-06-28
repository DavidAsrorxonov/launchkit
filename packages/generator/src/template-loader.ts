import { normalizeGeneratedPath } from "./file-tree";

export type TemplateContext = {
  projectName: string;
  packageName: string;
};

export type TemplateFile = {
  sourcePath: string;
  targetPath: string;
  contents: string | Uint8Array;
};

export type TemplateLoader = {
  loadTemplateFiles(input: {
    templateId: string;
    context: TemplateContext;
  }): Promise<TemplateFile[]>;
};

export class TemplateNotFoundError extends Error {
  constructor(public readonly templateId: string) {
    super(`Template not found: ${templateId}.`);
    this.name = "TemplateNotFoundError";
  }
}

export function applyTemplatePlaceholders(value: string, context: TemplateContext): string {
  return value
    .replaceAll("{{projectName}}", context.projectName)
    .replaceAll("{{packageName}}", context.packageName);
}

export function createInMemoryTemplateLoader(
  templates: Record<string, TemplateFile[]>,
): TemplateLoader {
  return {
    async loadTemplateFiles(input) {
      const files = templates[input.templateId];

      if (!files) {
        throw new TemplateNotFoundError(input.templateId);
      }

      return files.map((file) => applyTemplateFileContext(file, input.context));
    },
  };
}

function applyTemplateFileContext(file: TemplateFile, context: TemplateContext): TemplateFile {
  return {
    sourcePath: file.sourcePath,
    targetPath: normalizeGeneratedPath(applyTemplatePlaceholders(file.targetPath, context)),
    contents:
      typeof file.contents === "string"
        ? applyTemplatePlaceholders(file.contents, context)
        : new Uint8Array(file.contents),
  };
}
