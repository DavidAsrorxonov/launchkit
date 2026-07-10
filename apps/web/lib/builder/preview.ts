import { createGenerationPlan } from "@baseforge/generator";
import {
  authMetadata,
  databaseMetadata,
  dockerMetadata,
  frameworkMetadata,
  languageMetadata,
  ormMetadata,
  packageManagerMetadata,
  projectStructureMetadata,
  routerMetadata,
  stylingMetadata,
  uiMetadata,
  type BaseForgeConfig,
  type OptionMetadata,
} from "@baseforge/schema";

type PackageEntry = {
  name: string;
  version: string;
};

export type StackSummaryItem = {
  label: string;
  value: string;
};

export type ScriptPreviewItem = {
  name: string;
  command: string;
};

export type EnvVarPreviewItem = {
  name: string;
  description?: string;
  required: boolean;
};

export type BuilderPreview = {
  stackSummary: StackSummaryItem[];
  dependencies: PackageEntry[];
  devDependencies: PackageEntry[];
  scripts: ScriptPreviewItem[];
  envVars: EnvVarPreviewItem[];
  filePaths: string[];
};

const baseNextPreviewFiles = [
  ".gitignore",
  "app/layout.tsx",
  "app/page.tsx",
  "next.config.ts",
  "tsconfig.json",
] as const;

const generatedSupportFiles = ["package.json", ".env.example", "README.md"] as const;

export function createBuilderPreview(config: BaseForgeConfig): BuilderPreview {
  const plan = createGenerationPlan(config);
  const packageJson = plan.packageJson;

  return {
    stackSummary: createStackSummary(config),
    dependencies: mapPackageEntries(packageJson.dependencies),
    devDependencies: mapPackageEntries(packageJson.devDependencies),
    scripts: mapScriptEntries(packageJson.scripts),
    envVars: plan.env.map((envVar) => ({
      name: envVar.name,
      description: envVar.description,
      required: envVar.required ?? false,
    })),
    filePaths: createPreviewFilePaths([
      ...baseNextPreviewFiles,
      ...plan.templateFiles.map((file) => file.targetPath),
      ...plan.generatedFiles.map((file) => file.path),
      ...generatedSupportFiles,
    ]),
  };
}

function createStackSummary(config: BaseForgeConfig): StackSummaryItem[] {
  return [
    {
      label: "Project name",
      value: config.name,
    },
    {
      label: "Framework",
      value: getMetadataLabel(frameworkMetadata, config.framework),
    },
    {
      label: "Language",
      value: getMetadataLabel(languageMetadata, config.language),
    },
    {
      label: "Router",
      value: getMetadataLabel(routerMetadata, config.router),
    },
    {
      label: "Project structure",
      value: getMetadataLabel(projectStructureMetadata, config.projectStructure),
    },
    {
      label: "Styling",
      value: getMetadataLabel(stylingMetadata, config.styling),
    },
    {
      label: "UI",
      value: getMetadataLabel(uiMetadata, config.ui),
    },
    {
      label: "Database",
      value: getMetadataLabel(databaseMetadata, config.database),
    },
    {
      label: "ORM",
      value: getMetadataLabel(ormMetadata, config.orm),
    },
    {
      label: "Auth",
      value: getMetadataLabel(authMetadata, config.auth),
    },
    {
      label: "Docker",
      value: getMetadataLabel(dockerMetadata, config.docker),
    },
    {
      label: "Package manager",
      value: getMetadataLabel(packageManagerMetadata, config.packageManager),
    },
  ];
}

function getMetadataLabel<TValue extends string>(
  metadata: readonly OptionMetadata<TValue>[],
  value: TValue,
): string {
  return metadata.find((option) => option.value === value)?.label ?? value;
}

function mapPackageEntries(packages: Record<string, string> = {}): PackageEntry[] {
  return Object.entries(packages).map(([name, version]) => ({
    name,
    version,
  }));
}

function mapScriptEntries(scripts: Record<string, string> = {}): ScriptPreviewItem[] {
  return Object.entries(scripts).map(([name, command]) => ({
    name,
    command,
  }));
}

function createPreviewFilePaths(paths: readonly string[]): string[] {
  return [...new Set(paths)].sort((firstPath, secondPath) =>
    firstPath.localeCompare(secondPath),
  );
}
