import { z } from "zod";

import {
  authOptions,
  databaseOptions,
  dockerOptions,
  frameworkOptions,
  languageOptions,
  ormOptions,
  packageManagerOptions,
  projectStructureOptions,
  routerOptions,
  stylingOptions,
  uiOptions,
} from "./options.js";

const projectNameSchema = z
  .string()
  .min(1, "Project name is required.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Project name must use lowercase letters, numbers, and hyphen-separated words.",
  );

export const BaseForgeConfigSchema = z
  .object({
    name: projectNameSchema,
    framework: z.enum(frameworkOptions),
    language: z.enum(languageOptions),
    router: z.enum(routerOptions),
    projectStructure: z.enum(projectStructureOptions),
    styling: z.enum(stylingOptions),
    ui: z.enum(uiOptions),
    database: z.enum(databaseOptions),
    orm: z.enum(ormOptions),
    auth: z.enum(authOptions),
    docker: z.enum(dockerOptions),
    packageManager: z.enum(packageManagerOptions),
  })
  .strict();

export type BaseForgeConfig = z.infer<typeof BaseForgeConfigSchema>;

export function parseBaseForgeConfig(input: unknown): BaseForgeConfig {
  return BaseForgeConfigSchema.parse(input);
}
