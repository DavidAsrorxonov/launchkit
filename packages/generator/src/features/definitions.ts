import type { LaunchKitConfig } from "@launchkit/schema";

import type {
  EnvVarDefinition,
  FeatureId,
  GeneratedFileDefinition,
  PackageJsonPatch,
  TemplateFileReference,
} from "../generation-plan.js";

export type FeatureDefinition = {
  id: FeatureId;
  label: string;
  description: string;
  requires?: FeatureId[];
  conflicts?: FeatureId[];
  packageJson?: PackageJsonPatch;
  env?: EnvVarDefinition[];
  templateFiles?: TemplateFileReference[];
  generatedFiles?: GeneratedFileDefinition[];
  notes?: string[];
  isEnabled?: (config: LaunchKitConfig) => boolean;
};

export const nextFeature: FeatureDefinition = {
  id: "next",
  label: "Next.js",
  description: "Base Next.js App Router project.",
  isEnabled: () => true,
};

export const tailwindFeature: FeatureDefinition = {
  id: "tailwind",
  label: "Tailwind CSS",
  description: "Utility-first styling system.",
  packageJson: {
    devDependencies: {
      "@tailwindcss/postcss": "^4",
      tailwindcss: "^4",
    },
  },
  templateFiles: [
    {
      sourcePath: "features/tailwind/app/globals.css",
      targetPath: "app/globals.css",
    },
    {
      sourcePath: "features/tailwind/postcss.config.mjs",
      targetPath: "postcss.config.mjs",
    },
  ],
  isEnabled: () => true,
};

export const shadcnFeature: FeatureDefinition = {
  id: "shadcn",
  label: "shadcn/ui",
  description: "Component system built on Tailwind CSS.",
  requires: ["tailwind"],
  packageJson: {
    dependencies: {
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "tailwind-merge": "^3.6.0",
    },
  },
  templateFiles: [
    {
      sourcePath: "features/shadcn/components.json",
      targetPath: "components.json",
    },
    {
      sourcePath: "features/shadcn/lib/utils.ts",
      targetPath: "lib/utils.ts",
    },
    {
      sourcePath: "features/shadcn/components/ui/button.tsx",
      targetPath: "components/ui/button.tsx",
    },
    {
      sourcePath: "features/shadcn/app/globals.css",
      targetPath: "app/globals.css",
    },
  ],
  isEnabled: (config) => config.ui === "shadcn",
};

export const postgresFeature: FeatureDefinition = {
  id: "postgres",
  label: "PostgreSQL",
  description: "Relational database configuration.",
  env: [
    {
      name: "DATABASE_URL",
      value: "postgresql://postgres:postgres@localhost:5432/my_app",
      description: "PostgreSQL connection string.",
      required: true,
    },
  ],
  isEnabled: (config) => config.database === "postgres",
};

export const prismaFeature: FeatureDefinition = {
  id: "prisma",
  label: "Prisma",
  description: "Type-safe ORM and migration toolkit.",
  requires: ["postgres"],
  packageJson: {
    dependencies: {
      "@prisma/client": "latest",
    },
    devDependencies: {
      prisma: "latest",
    },
    scripts: {
      "db:generate": "prisma generate",
      "db:migrate": "prisma migrate dev",
    },
  },
  isEnabled: (config) => config.orm === "prisma",
};

export const authjsCredentialsFeature: FeatureDefinition = {
  id: "authjs-credentials",
  label: "Auth.js credentials scaffold",
  description: "Credentials-ready Auth.js structure.",
  env: [
    {
      name: "AUTH_SECRET",
      value: "replace-me",
      description: "Secret used by Auth.js for session and token signing.",
      required: true,
    },
  ],
  notes: ["Real user lookup and password verification must be implemented by the developer."],
  isEnabled: (config) => config.auth === "authjs-credentials",
};

export const dockerPostgresFeature: FeatureDefinition = {
  id: "docker-postgres",
  label: "PostgreSQL Docker Compose",
  description: "Local PostgreSQL service for development.",
  requires: ["postgres"],
  isEnabled: (config) => config.docker === "postgres",
};

export const mvpFeatureDefinitions = [
  nextFeature,
  tailwindFeature,
  shadcnFeature,
  postgresFeature,
  prismaFeature,
  authjsCredentialsFeature,
  dockerPostgresFeature,
] as const;
