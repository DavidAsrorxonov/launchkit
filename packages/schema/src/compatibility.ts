import type { BaseForgeConfig } from "./config.js";

export type CompatibilityIssue = {
  code: string;
  message: string;
  path?: string[];
};

export class BaseForgeCompatibilityError extends Error {
  readonly issues: CompatibilityIssue[];

  constructor(issues: CompatibilityIssue[]) {
    super(formatCompatibilityErrorMessage(issues));
    this.name = "BaseForgeCompatibilityError";
    this.issues = issues;
  }
}

export function validateCompatibility(
  config: BaseForgeConfig,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  if (config.orm === "prisma" && config.database !== "postgres") {
    issues.push({
      code: "prisma_requires_postgresql",
      message: "Prisma requires PostgreSQL.",
      path: ["orm", "database"],
    });
  }

  if (config.docker === "postgres" && config.database !== "postgres") {
    issues.push({
      code: "docker_postgres_requires_postgresql",
      message:
        "PostgreSQL Docker Compose is only available when PostgreSQL is selected.",
      path: ["docker", "database"],
    });
  }

  if (
    config.auth === "authjs-credentials" &&
    config.orm === "prisma" &&
    config.database !== "postgres"
  ) {
    issues.push({
      code: "authjs_credentials_prisma_requires_postgresql",
      message: "Auth.js credentials with Prisma requires Prisma and PostgreSQL.",
      path: ["auth", "orm", "database"],
    });
  }

  if (config.ui === "shadcn" && config.styling !== "tailwind") {
    issues.push({
      code: "shadcn_requires_tailwind",
      message: "shadcn/ui requires Tailwind CSS.",
      path: ["ui", "styling"],
    });
  }

  return issues;
}

export function assertCompatibleConfig(config: BaseForgeConfig): void {
  const issues = validateCompatibility(config);

  if (issues.length > 0) {
    throw new BaseForgeCompatibilityError(issues);
  }
}

function formatCompatibilityErrorMessage(
  issues: CompatibilityIssue[],
): string {
  if (issues.length === 0) {
    return "BaseForge config is compatible.";
  }

  return issues.map(({ message }) => message).join(" ");
}
