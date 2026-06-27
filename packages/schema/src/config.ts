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
} from "./options";

const projectNameSchema = z
  .string()
  .min(1, "Project name is required.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Project name must use lowercase letters, numbers, and hyphen-separated words.",
  );

export const LaunchKitConfigSchema = z
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

export type LaunchKitConfig = z.infer<typeof LaunchKitConfigSchema>;

export function parseLaunchKitConfig(input: unknown): LaunchKitConfig {
  return LaunchKitConfigSchema.parse(input);
}
