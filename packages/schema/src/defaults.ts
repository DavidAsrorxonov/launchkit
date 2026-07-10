import type { BaseForgeConfig } from "./config.js";

export const defaultBaseForgeConfig = {
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
} satisfies BaseForgeConfig;
