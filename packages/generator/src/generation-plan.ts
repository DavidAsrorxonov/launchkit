import type { BaseForgeConfig } from "@baseforge/schema";

export type BaseTemplateId = "next";

export type FeatureId =
  | "next"
  | "tailwind"
  | "shadcn"
  | "postgres"
  | "prisma"
  | "authjs-credentials"
  | "docker-postgres";

export type DependencyMap = Record<string, string>;

export type ScriptMap = Record<string, string>;

export type EnvVarDefinition = {
  name: string;
  value: string;
  description?: string;
  required?: boolean;
};

export type TemplateFileReference = {
  sourcePath: string;
  targetPath: string;
};

export type GeneratedFileDefinition = {
  path: string;
  contents: string;
};

export type PackageJsonPatch = {
  name?: string;
  version?: string;
  private?: boolean;
  type?: string;
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
  scripts?: ScriptMap;
};

export type ResolvedFeature = {
  id: FeatureId;
  label: string;
};

export type GenerationPlan = {
  config: BaseForgeConfig;
  baseTemplate: BaseTemplateId;
  features: ResolvedFeature[];
  packageJson: PackageJsonPatch;
  env: EnvVarDefinition[];
  templateFiles: TemplateFileReference[];
  generatedFiles: GeneratedFileDefinition[];
  notes: string[];
};

export function createEmptyGenerationPlan(config: BaseForgeConfig): GenerationPlan {
  return {
    config,
    baseTemplate: "next",
    features: [],
    packageJson: {},
    env: [],
    templateFiles: [],
    generatedFiles: [],
    notes: [],
  };
}
