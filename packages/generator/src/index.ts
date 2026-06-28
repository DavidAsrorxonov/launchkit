import { defaultLaunchKitConfig } from "@launchkit/schema";

export * from "./file-tree";

export function generatorPackageReady() {
  return true;
}

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
