import type {
  AuthOption,
  DatabaseOption,
  DockerOption,
  FrameworkOption,
  LanguageOption,
  OrmOption,
  PackageManagerOption,
  ProjectStructureOption,
  RouterOption,
  StylingOption,
  UiOption,
} from "./options.js";

export type OptionMetadata<TValue extends string = string> = {
  value: TValue;
  label: string;
  description: string;
  recommended?: boolean;
};

export const frameworkMetadata = [
  {
    value: "next",
    label: "Next.js",
    description: "React framework for full-stack applications.",
    recommended: true,
  },
] satisfies OptionMetadata<FrameworkOption>[];

export const languageMetadata = [
  {
    value: "typescript",
    label: "TypeScript",
    description: "Strongly typed JavaScript for safer application code.",
    recommended: true,
  },
] satisfies OptionMetadata<LanguageOption>[];

export const routerMetadata = [
  {
    value: "app",
    label: "App Router",
    description: "Modern Next.js routing with layouts and server components.",
    recommended: true,
  },
] satisfies OptionMetadata<RouterOption>[];

export const projectStructureMetadata = [
  {
    value: "no-src",
    label: "No src folder",
    description: "Keep app, components, and lib folders at the project root.",
    recommended: true,
  },
] satisfies OptionMetadata<ProjectStructureOption>[];

export const stylingMetadata = [
  {
    value: "tailwind",
    label: "Tailwind CSS",
    description: "Utility-first styling with design tokens.",
    recommended: true,
  },
] satisfies OptionMetadata<StylingOption>[];

export const uiMetadata = [
  {
    value: "none",
    label: "None",
    description: "Start without a component library.",
  },
  {
    value: "shadcn",
    label: "shadcn/ui",
    description: "Copy-paste component system built on Radix UI and Tailwind CSS.",
    recommended: true,
  },
] satisfies OptionMetadata<UiOption>[];

export const databaseMetadata = [
  {
    value: "none",
    label: "None",
    description: "Start without database setup.",
  },
  {
    value: "postgres",
    label: "PostgreSQL",
    description: "Production-ready relational database.",
    recommended: true,
  },
] satisfies OptionMetadata<DatabaseOption>[];

export const ormMetadata = [
  {
    value: "none",
    label: "None",
    description: "Start without an ORM.",
  },
  {
    value: "prisma",
    label: "Prisma",
    description: "Type-safe ORM with schema migrations and generated client.",
    recommended: true,
  },
] satisfies OptionMetadata<OrmOption>[];

export const authMetadata = [
  {
    value: "none",
    label: "None",
    description: "Start without authentication.",
  },
  {
    value: "authjs-credentials",
    label: "Auth.js credentials scaffold",
    description:
      "Adds Auth.js structure for credentials-based auth that you can connect to your user model.",
  },
] satisfies OptionMetadata<AuthOption>[];

export const dockerMetadata = [
  {
    value: "none",
    label: "None",
    description: "Do not include Docker files.",
  },
  {
    value: "postgres",
    label: "PostgreSQL Docker Compose",
    description: "Add a local PostgreSQL service for development.",
  },
] satisfies OptionMetadata<DockerOption>[];

export const packageManagerMetadata = [
  {
    value: "npm",
    label: "npm",
    description: "Use npm commands in generated setup instructions.",
    recommended: true,
  },
  {
    value: "pnpm",
    label: "pnpm",
    description: "Use pnpm commands in generated setup instructions.",
  },
] satisfies OptionMetadata<PackageManagerOption>[];
