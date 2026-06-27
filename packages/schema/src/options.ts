export const frameworkOptions = ["next"] as const;
export type FrameworkOption = (typeof frameworkOptions)[number];

export const languageOptions = ["typescript"] as const;
export type LanguageOption = (typeof languageOptions)[number];

export const routerOptions = ["app"] as const;
export type RouterOption = (typeof routerOptions)[number];

export const projectStructureOptions = ["no-src"] as const;
export type ProjectStructureOption = (typeof projectStructureOptions)[number];

export const stylingOptions = ["tailwind"] as const;
export type StylingOption = (typeof stylingOptions)[number];

export const uiOptions = ["none", "shadcn"] as const;
export type UiOption = (typeof uiOptions)[number];

export const databaseOptions = ["none", "postgres"] as const;
export type DatabaseOption = (typeof databaseOptions)[number];

export const ormOptions = ["none", "prisma"] as const;
export type OrmOption = (typeof ormOptions)[number];

export const authOptions = ["none", "authjs-credentials"] as const;
export type AuthOption = (typeof authOptions)[number];

export const dockerOptions = ["none", "postgres"] as const;
export type DockerOption = (typeof dockerOptions)[number];

export const packageManagerOptions = ["npm", "pnpm"] as const;
export type PackageManagerOption = (typeof packageManagerOptions)[number];
