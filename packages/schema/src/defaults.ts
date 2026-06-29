import type { LaunchKitConfig } from "./config.js";

export const defaultLaunchKitConfig = {
  name: "my-app",
  framework: "next",
  language: "typescript",
  router: "app",
  projectStructure: "no-src",
  styling: "tailwind",
  ui: "none",
  database: "none",
  orm: "none",
  auth: "none",
  docker: "none",
  packageManager: "npm",
} satisfies LaunchKitConfig;
