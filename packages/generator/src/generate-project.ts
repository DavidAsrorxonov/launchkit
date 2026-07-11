import {
  assertCompatibleConfig,
  parseBaseForgeConfig,
  type BaseForgeConfig,
} from "@baseforge/schema";

import { mergeEnvVars, renderEnvExample } from "./env.js";
import { createGeneratedFile, createGeneratedProject, type GeneratedProject } from "./file-tree.js";
import { getEnabledFeatures } from "./features/registry.js";
import {
  createEmptyGenerationPlan,
  type EnvVarDefinition,
  type GenerationPlan,
  type PackageJsonPatch,
} from "./generation-plan.js";
import { mergePackageJsonPatches } from "./package-json.js";
import {
  applyTemplatePlaceholders,
  type TemplateContext,
  type TemplateLoader,
} from "./template-loader.js";

export type GenerateProjectOptions = {
  templateLoader?: TemplateLoader;
  templateIds?: string[];
};

export function createGenerationPlan(config: BaseForgeConfig): GenerationPlan {
  const parsedConfig = parseBaseForgeConfig(config);
  assertCompatibleConfig(parsedConfig);

  const features = getEnabledFeatures(parsedConfig);
  const plan = createEmptyGenerationPlan(parsedConfig);
  const packageJson = mergePackageJsonPatches([
    createBasePackageJsonPatch(parsedConfig.name),
    ...features.map((feature) => feature.packageJson ?? {}),
  ]);
  const context = {
    projectName: parsedConfig.name,
    packageName: packageJson.name ?? parsedConfig.name,
  };
  const env = mergeEnvVars(features.map((feature) => feature.env ?? [])).map((envVar) => ({
    ...envVar,
    value: applyTemplatePlaceholders(envVar.value, context),
  }));

  return {
    ...plan,
    features: features.map((feature) => ({
      id: feature.id,
      label: feature.label,
    })),
    packageJson,
    env,
    templateFiles: features.flatMap((feature) => feature.templateFiles ?? []),
    generatedFiles: features.flatMap((feature) => feature.generatedFiles ?? []),
    notes: features.flatMap((feature) => feature.notes ?? []),
  };
}

export async function generateProject(
  config: BaseForgeConfig,
  options: GenerateProjectOptions = {},
): Promise<GeneratedProject> {
  const plan = createGenerationPlan(config);
  const templateFiles = await loadTemplateFiles(plan, options);
  const generatedFiles = createMinimalGeneratedFiles(plan);

  return createGeneratedProject({
    name: plan.config.name,
    packageManager: plan.config.packageManager,
    files: mergeGeneratedProjectFiles([
      ...templateFiles.map((file) => createGeneratedFile(file.targetPath, file.contents)),
      ...generatedFiles.map((file) => createGeneratedFile(file.path, file.contents)),
    ]),
  });
}

function createBasePackageJsonPatch(name: string): PackageJsonPatch {
  return {
    name,
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };
}

async function loadTemplateFiles(
  plan: GenerationPlan,
  options: GenerateProjectOptions,
) {
  if (!options.templateLoader) {
    return [];
  }

  const templateIds =
    options.templateIds ?? [
      `base/${plan.baseTemplate}`,
      ...plan.templateFiles.map((file) => file.sourcePath),
    ];

  if (templateIds.length === 0) {
    return [];
  }

  const context = createTemplateContext(plan);
  const groups = await Promise.all(
    templateIds.map((templateId) =>
      options.templateLoader?.loadTemplateFiles({
        templateId,
        context,
      }),
    ),
  );

  return groups.flatMap((group) => group ?? []);
}

function mergeGeneratedProjectFiles(files: ReturnType<typeof createGeneratedFile>[]) {
  const merged = new Map<string, ReturnType<typeof createGeneratedFile>>();

  for (const file of files) {
    merged.set(file.path, file);
  }

  return [...merged.values()];
}

function createTemplateContext(plan: GenerationPlan): TemplateContext {
  return {
    projectName: plan.config.name,
    packageName: plan.packageJson.name ?? plan.config.name,
  };
}

function createMinimalGeneratedFiles(plan: GenerationPlan) {
  return [
    {
      path: "package.json",
      contents: `${JSON.stringify(createPackageJsonFile(plan.packageJson), null, 2)}\n`,
    },
    {
      path: ".env.example",
      contents: renderEnvExample(plan.env),
    },
    {
      path: "README.md",
      contents: renderReadme(plan),
    },
  ];
}

function createPackageJsonFile(packageJson: PackageJsonPatch) {
  return {
    name: packageJson.name,
    ...(packageJson.version !== undefined ? { version: packageJson.version } : {}),
    private: packageJson.private ?? true,
    ...(packageJson.type !== undefined ? { type: packageJson.type } : {}),
    scripts: packageJson.scripts ?? {},
    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
  };
}

function renderReadme(plan: GenerationPlan): string {
  const installCommand = `${plan.config.packageManager} install`;
  const devCommand = plan.config.packageManager === "pnpm" ? "pnpm dev" : "npm run dev";
  const selectedFeatures = renderSelectedFeatures(plan);
  const notes = renderNotes(plan.notes);
  const envNote = renderEnvNote(plan.env);

  return `# ${plan.config.name}

Generated by BaseForge.

## Selected Features

${selectedFeatures}

## Getting Started

\`\`\`bash
${installCommand}
${devCommand}
\`\`\`
${envNote}${notes}`;
}

function renderSelectedFeatures(plan: GenerationPlan): string {
  if (plan.features.length === 0) {
    return "- None";
  }

  return plan.features.map((feature) => `- ${feature.label}`).join("\n");
}

function renderEnvNote(env: EnvVarDefinition[]): string {
  if (env.length === 0) {
    return "";
  }

  return `
## Environment

Copy \`.env.example\` to \`.env\` and fill in any required values before running the project.
`;
}

function renderNotes(notes: string[]): string {
  if (notes.length === 0) {
    return "";
  }

  return `
## Notes

${notes.map((note) => `- ${note}`).join("\n")}
`;
}
