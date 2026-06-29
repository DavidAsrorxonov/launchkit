import { defaultLaunchKitConfig } from "@launchkit/schema";

export * from "./env.js";
export * from "./file-tree.js";
export * from "./features/definitions.js";
export * from "./features/registry.js";
export * from "./generate-project.js";
export * from "./generation-plan.js";
export * from "./package-json.js";
export * from "./template-loader.js";

export function generatorPackageReady() {
  return true;
}

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
