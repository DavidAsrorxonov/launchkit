import {
  LaunchKitConfigSchema,
  type LaunchKitConfig,
} from "@launchkit/schema";

type ValidationErrors = Partial<Record<keyof LaunchKitConfig, string>>;

export type ProjectStepValidation = {
  isValid: boolean;
  errors: Pick<ValidationErrors, "name" | "packageManager">;
};

export function validateBuilderConfig(config: LaunchKitConfig): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const result = LaunchKitConfigSchema.safeParse(config);

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    };
  }

  const errors: ValidationErrors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof LaunchKitConfig] = issue.message;
    }
  }

  return {
    isValid: false,
    errors,
  };
}

export function validateProjectStep(
  config: LaunchKitConfig,
): ProjectStepValidation {
  const validation = validateBuilderConfig(config);
  const errors = {
    name: validation.errors.name,
    packageManager: validation.errors.packageManager,
  };

  return {
    isValid: !errors.name && !errors.packageManager,
    errors,
  };
}
