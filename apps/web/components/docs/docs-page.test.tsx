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
} from "@baseforge/schema";

const appRoot = process.cwd();
const docsSource = readFileSync(
  join(appRoot, "components/docs/docs-page.tsx"),
  "utf8",
);
const docsRouteSource = readFileSync(
  join(appRoot, "app/docs/page.tsx"),
  "utf8",
);
const docsContentSource = readFileSync(
  join(appRoot, "components/docs/docs-content.ts"),
  "utf8",
);
const featureNotesDataSource = readFileSync(
  join(appRoot, "components/docs/feature-notes-data.ts"),
  "utf8",
);
const featureNotesSource = readFileSync(
  join(appRoot, "components/docs/feature-notes.tsx"),
  "utf8",
);
const codeBlockSource = readFileSync(
  join(appRoot, "components/docs/code-block.tsx"),
  "utf8",
);
const docsSidebarSource = readFileSync(
  join(appRoot, "components/docs/docs-sidebar.tsx"),
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
    expect(docsSource).toContain("Web Builder Guide");
    expect(docsSource).toContain("Supported Stack");
    expect(docsSource).toContain("Generated App Setup");
    expect(docsSource).toContain("Feature Guides");
    expect(docsSource).toContain("Generated Files");
    expect(docsSource).toContain("Environment Variables");
    expect(docsSource).toContain("Scripts and Checks");
    expect(docsSource).toContain("Compatibility Rules");
    expect(docsSource).toContain("Troubleshooting");
    expect(docsSource).toContain("Deployment Notes");
    expect(docsSource).toContain("Limitations");

    expect(labels(frameworkMetadata)).toEqual(["Next.js"]);
    expect(labels(languageMetadata)).toEqual(["TypeScript"]);
    expect(labels(routerMetadata)).toEqual(["App Router"]);
    expect(labels(projectStructureMetadata)).toEqual(["No src folder"]);
    expect(labels(stylingMetadata)).toEqual(["Tailwind CSS"]);
    expect(labels(databaseMetadata)).toEqual(["None", "PostgreSQL"]);
    expect(labels(ormMetadata)).toEqual(["None", "Prisma"]);
    expect(labels(authMetadata)).toEqual([
      "None",
      "Auth.js credentials scaffold",
    ]);
    expect(labels(packageManagerMetadata)).toEqual(["npm", "pnpm"]);
  });

  it("documents current limitations and keeps the page focused on web app usage", () => {
    expect(docsSource).not.toContain("CLI Status");
    expect(docsSource).not.toContain("npx @baseforge/create@latest");
    expect(docsSource).not.toContain("npm create @baseforge@latest");
    expect(docsRouteSource).not.toContain("how to use the CLI");
    expect(docsRouteSource).toContain("Use the BaseForge web builder");
    expect(docsContentSource).toContain("Generated projects do not use `src/`.");
    expect(docsContentSource).toContain("Auth.js credentials output is a scaffold");
    expect(docsSource).toContain("website builder flow");
  });

  it("includes practical generated-app guidance for setup, scripts, env vars, and deployment", () => {
    expect(docsSource).toContain("Before downloading");
    expect(docsContentSource).toContain("Do not mix npm and pnpm lockfiles");
    expect(docsContentSource).toContain("BaseForge does not create the database");
    expect(docsContentSource).toContain("Run Prisma scripts only when Prisma is selected");
    expect(docsContentSource).toContain("Set production environment variables");
  });

  it("includes copy-paste examples for generated project workflows and feature setup", () => {
    expect(docsContentSource).toContain("pnpm typecheck");
    expect(docsContentSource).toContain("PostgreSQL plus Auth.js credentials");
    expect(docsContentSource).toContain("Docker PostgreSQL plus Prisma");
    expect(docsSource).toContain("Production environment example");

    expect(featureNotesDataSource).toContain("Use the generated button component");
    expect(featureNotesDataSource).toContain("model Post");
    expect(featureNotesDataSource).toContain("Replace the generated authorize placeholder");
    expect(featureNotesDataSource).toContain("docker compose up -d");
  });

  it("keeps dense docs navigation and code examples readable on small screens", () => {
    expect(docsSidebarSource).toContain("grid gap-1");
    expect(docsSidebarSource).toContain("break-words");
    expect(docsSidebarSource).not.toContain("overflow-x-auto");
    expect(docsSidebarSource).not.toContain("whitespace-nowrap");
    expect(codeBlockSource).toContain("text-xs");
    expect(codeBlockSource).toContain("sm:text-sm");
    expect(codeBlockSource).toContain("min-w-0");
    expect(codeBlockSource).toContain("pr-14");
    expect(featureNotesSource).toContain("min-w-0");
    expect(docsSource).toContain('className="mt-3 grid min-w-0 gap-3"');
    expect(docsSource).toContain('className="mt-2 min-w-0"');
  });

  it("keeps navigation connected between landing, builder, and docs", () => {
    expect(docsSource).toContain('href="/"');
    expect(docsSource).toContain('href="/builder"');
    expect(docsSource).toContain('href="/docs"');
    expect(landingNavSource).toContain('href="/builder"');
    expect(landingNavSource).toContain('href="/docs"');
  });
});
