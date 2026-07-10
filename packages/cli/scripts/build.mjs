import { chmod, cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { build } from "esbuild";

const execFileAsync = promisify(execFile);
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = join(packageRoot, "..", "..");
const distDir = join(packageRoot, "dist");
const cliEntry = join(packageRoot, "src", "index.ts");
const bundledEntry = join(distDir, "index.js");
const templatesSource = join(repoRoot, "packages", "templates");
const templatesOutput = join(distDir, "templates");

await rm(distDir, { recursive: true, force: true });
await rm(join(packageRoot, "tsconfig.tsbuildinfo"), { force: true });
await mkdir(distDir, { recursive: true });

await execFileAsync("tsc", [
  "-p",
  join(packageRoot, "tsconfig.json"),
  "--emitDeclarationOnly",
  "--declaration",
  "--declarationMap",
  "false",
]);

await build({
  entryPoints: [cliEntry],
  outfile: bundledEntry,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  sourcemap: false,
  legalComments: "none",
  external: ["@inquirer/prompts"],
  plugins: [baseForgeWorkspacePlugin()],
});

await cp(join(templatesSource, "base"), join(templatesOutput, "base"), {
  recursive: true,
});
await cp(join(templatesSource, "features"), join(templatesOutput, "features"), {
  recursive: true,
});
await rm(join(distDir, "tsconfig.tsbuildinfo"), { force: true });
await rm(join(packageRoot, "tsconfig.tsbuildinfo"), { force: true });
await chmod(bundledEntry, 0o755);

function baseForgeWorkspacePlugin() {
  const sourceEntries = new Map([
    ["@baseforge/generator", join(repoRoot, "packages", "generator", "src", "index.ts")],
    ["@baseforge/schema", join(repoRoot, "packages", "schema", "src", "index.ts")],
  ]);

  return {
    name: "baseforge-workspace-source",
    setup(buildContext) {
      buildContext.onResolve({ filter: /^@baseforge\/(?:generator|schema)$/ }, (args) => ({
        path: sourceEntries.get(args.path),
      }));
    },
  };
}
