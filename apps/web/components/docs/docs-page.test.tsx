import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  authMetadata,
  databaseMetadata,
  frameworkMetadata,
  languageMetadata,
  ormMetadata,
  packageManagerMetadata,
  projectStructureMetadata,
  routerMetadata,
  stylingMetadata,
} from "@launchkit/schema";

const appRoot = process.cwd();
const docsSource = readFileSync(
  join(appRoot, "components/docs/docs-page.tsx"),
  "utf8",
);
const landingNavSource = readFileSync(
  join(appRoot, "components/landing/landing-nav.tsx"),
  "utf8",
);

function labels(metadata: readonly { label: string }[]): string[] {
  return metadata.map((option) => option.label);
}

describe("Phase 8 docs page", () => {
  it("includes the required documentation sections and MVP stack source", () => {
    expect(docsSource).toContain("Overview");
    expect(docsSource).toContain("Quick Start");
    expect(docsSource).toContain("Website Builder Flow");
    expect(docsSource).toContain("Supported Stack");
    expect(docsSource).toContain("Generated Project Structure");
    expect(docsSource).toContain("Optional Features");
    expect(docsSource).toContain("Environment Variables");
    expect(docsSource).toContain("Compatibility Rules");
    expect(docsSource).toContain("CLI Status");
    expect(docsSource).toContain("Troubleshooting");

    expect(labels(frameworkMetadata)).toEqual(["Next.js"]);
    expect(labels(languageMetadata)).toEqual(["TypeScript"]);
    expect(labels(routerMetadata)).toEqual(["App Router"]);
    expect(labels(projectStructureMetadata)).toEqual(["No src folder"]);
    expect(labels(stylingMetadata)).toEqual(["Tailwind CSS"]);
    expect(labels(databaseMetadata)).toEqual(["None", "PostgreSQL"]);
    expect(labels(ormMetadata)).toEqual(["None", "Prisma"]);
    expect(labels(authMetadata)).toEqual(["None", "Auth.js credentials scaffold"]);
    expect(labels(packageManagerMetadata)).toEqual(["npm", "pnpm"]);
  });

  it("documents current limitations without claiming the CLI is available", () => {
    expect(docsSource).toContain(
      "The CLI package exists in the repo for local use but has not been published yet.",
    );
    expect(docsSource).toContain("Future publish command, not available yet");
    expect(docsSource).toContain("npx @baseforge/create@latest");
    expect(docsSource).toContain("Generated projects do not use `src/`.");
    expect(docsSource).toContain("Auth.js credentials output is a scaffold");
  });

  it("keeps navigation connected between landing, builder, and docs", () => {
    expect(docsSource).toContain('href="/"');
    expect(docsSource).toContain('href="/builder"');
    expect(docsSource).toContain('href="/docs"');
    expect(landingNavSource).toContain('href="/builder"');
    expect(landingNavSource).toContain('href="/docs"');
  });
});
