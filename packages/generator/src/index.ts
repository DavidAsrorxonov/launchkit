import { defaultLaunchKitConfig } from "@launchkit/schema";

export function generatorPackageReady() {
  return true;
}

export function getGeneratorDefaultConfig() {
  return defaultLaunchKitConfig;
}
