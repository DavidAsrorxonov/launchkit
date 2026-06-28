import { defaultLaunchKitConfig } from "@launchkit/schema";

export * from "./env";
export * from "./file-tree";
export * from "./features/definitions";
export * from "./features/registry";
export * from "./generation-plan";
export * from "./package-json";
export * from "./template-loader";

export function generatorPackageReady() {
  return true;
}

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
