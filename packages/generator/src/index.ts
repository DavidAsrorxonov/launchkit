import { defaultLaunchKitConfig } from "@launchkit/schema";

export * from "./file-tree";
export * from "./generation-plan";

export function generatorPackageReady() {
  return true;
}

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
