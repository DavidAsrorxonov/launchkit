import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      "dist/**",
      "node_modules/**",
      "src/__tests__/smoke.test.ts",
    ],
  },
});
