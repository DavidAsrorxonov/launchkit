import {
  BaseForgeConfigSchema,
  defaultBaseForgeConfig,
  validateCompatibility,
  type BaseForgeConfig,
} from "@baseforge/schema";

export type CliValidationResult =
  | {
      ok: true;
      config: BaseForgeConfig;
    }
  | {
      ok: false;
      errors: CliValidationError[];
    };

export type CliValidationError = {
  code: string;
  message: string;
  path?: string[];
};

type SchemaIssue = {
  code: string;
  message: string;
  path: PropertyKey[];
};

const unsupportedOptionMessages: Partial<Record<keyof BaseForgeConfig, string>> = {
  auth: "Unsupported auth option.",
  database: "Unsupported database option.",
  docker: "Unsupported Docker option.",
  framework: "Unsupported framework option.",
  language: "Unsupported language option.",
  orm: "Unsupported ORM option.",
  packageManager: "Unsupported package manager.",
  projectStructure: "Unsupported project structure option.",
  router: "Unsupported router option.",
  styling: "Unsupported styling option.",
  ui: "Unsupported UI option.",
};

const unsupportedOptionCodes: Partial<Record<keyof BaseForgeConfig, string>> = {
  auth: "unsupported_auth",
  database: "unsupported_database",
  docker: "unsupported_docker",
  framework: "unsupported_framework",
  language: "unsupported_language",
  orm: "unsupported_orm",
  packageManager: "unsupported_package_manager",
  projectStructure: "unsupported_project_structure",
  router: "unsupported_router",
  styling: "unsupported_styling",
  ui: "unsupported_ui",
};

export function validateCliConfigDraft(draft: unknown): CliValidationResult {
  const schemaResult = BaseForgeConfigSchema.safeParse(applyConfigDefaults(draft));

  if (!schemaResult.success) {
    return {
      ok: false,
      errors: schemaResult.error.issues.map(mapSchemaIssue),
    };
  }

  const compatibilityIssues = validateCompatibility(schemaResult.data);

  if (compatibilityIssues.length > 0) {
    return {
      ok: false,
      errors: compatibilityIssues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path,
      })),
    };
  }

  return {
    ok: true,
    config: schemaResult.data,
  };
}

function applyConfigDefaults(draft: unknown): unknown {
  if (!isRecord(draft)) {
    return draft;
  }

  const definedDraftEntries = Object.entries(draft).filter(
    ([, value]) => value !== undefined,
  );

  return {
    ...defaultBaseForgeConfig,
    ...Object.fromEntries(definedDraftEntries),
  };
}

function mapSchemaIssue(issue: SchemaIssue): CliValidationError {
  const path = issue.path.map(String);
  const field = path[0] as keyof BaseForgeConfig | undefined;

  if (field === "name") {
    if (issue.message === "Project name is required.") {
      return createSchemaError("project_name_required", issue.message, path);
    }

    return createSchemaError(
      "invalid_project_name",
      "Use lowercase letters, numbers, and hyphens only.",
      path,
    );
  }

  if (field && unsupportedOptionMessages[field]) {
    return createSchemaError(
      unsupportedOptionCodes[field] ?? "unsupported_option",
      unsupportedOptionMessages[field],
      path,
    );
  }

  if (issue.code === "unrecognized_keys") {
    return createSchemaError(
      "unsupported_config_option",
      "Unsupported configuration option.",
      path,
    );
  }

  if (path.length === 0) {
    return createSchemaError(
      "invalid_config",
      "Config draft must be an object.",
      path,
    );
  }

  return createSchemaError("invalid_config", "Invalid BaseForge configuration.", path);
}

function createSchemaError(
  code: string,
  message: string,
  path: string[],
): CliValidationError {
  return {
    code,
    message,
    ...(path.length > 0 ? { path } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
