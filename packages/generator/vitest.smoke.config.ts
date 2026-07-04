import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/smoke/**/*.test.ts"],
    testTimeout: 600_000,
    hookTimeout: 120_000,
  },
});
