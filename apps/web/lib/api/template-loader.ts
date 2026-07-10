import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

import {
  applyTemplatePlaceholders,
  normalizeGeneratedPath,
  type GenerationPlan,
  type TemplateContext,
  type TemplateFile,
  type TemplateLoader,
} from "@baseforge/generator";

const templatesRoot = join(process.cwd(), "..", "..", "packages", "templates");

export function createWebTemplateLoader(plan: GenerationPlan): TemplateLoader {
  const targetPathBySourcePath = new Map(
    plan.templateFiles.map((file) => [file.sourcePath, file.targetPath]),
  );

  return {
    async loadTemplateFiles(input) {
      const templateId = normalizeGeneratedPath(input.templateId);

      if (templateId === `base/${plan.baseTemplate}`) {
        return loadTemplateDirectory(templateId, input.context);
      }

      const targetPath = targetPathBySourcePath.get(templateId);

      if (!targetPath) {
        throw new Error("Generator requested an unexpected template file.");
      }

      return [
        await loadTemplateFile({
          sourcePath: templateId,
          targetPath,
          context: input.context,
        }),
      ];
    },
  };
}

async function loadTemplateDirectory(
  templateId: string,
  context: TemplateContext,
): Promise<TemplateFile[]> {
  const root = join(templatesRoot, templateId);
  const filePaths = await listFiles(root);

  return Promise.all(
    filePaths.map((filePath) => {
      const targetPath = relative(root, filePath).replaceAll("\\", "/");

      return loadTemplateFile({
        sourcePath: `${templateId}/${targetPath}`,
        targetPath,
        context,
      });
    }),
  );
}

async function loadTemplateFile(input: {
  sourcePath: string;
  targetPath: string;
  context: TemplateContext;
}): Promise<TemplateFile> {
  const safeSourcePath = normalizeGeneratedPath(input.sourcePath);
  const safeTargetPath = normalizeGeneratedPath(input.targetPath);
  const contents = await readFile(join(templatesRoot, safeSourcePath), "utf8");

  return {
    sourcePath: safeSourcePath,
    targetPath: normalizeGeneratedPath(
      applyTemplatePlaceholders(safeTargetPath, input.context),
    ),
    contents: applyTemplatePlaceholders(contents, input.context),
  };
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}
