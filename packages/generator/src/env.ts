import type { EnvVarDefinition } from "./generation-plan.js";

export class EnvVarMergeConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvVarMergeConflictError";
  }
}

export function mergeEnvVars(groups: EnvVarDefinition[][]): EnvVarDefinition[] {
  const merged = new Map<string, EnvVarDefinition>();

  for (const group of groups) {
    for (const envVar of group) {
      const existing = merged.get(envVar.name);

      if (!existing) {
        merged.set(envVar.name, { ...envVar });
        continue;
      }

      if (existing.value !== envVar.value) {
        throw new EnvVarMergeConflictError(`Conflicting env var value for ${envVar.name}.`);
      }

      merged.set(envVar.name, mergeMatchingEnvVar(existing, envVar));
    }
  }

  return Array.from(merged.values());
}

export function renderEnvExample(envVars: EnvVarDefinition[]): string {
  if (envVars.length === 0) {
    return "";
  }

  return `${envVars.map(renderEnvVar).join("\n\n")}\n`;
}

function mergeMatchingEnvVar(
  existing: EnvVarDefinition,
  incoming: EnvVarDefinition,
): EnvVarDefinition {
  const description = existing.description ?? incoming.description;
  const required =
    existing.required === true || incoming.required === true
      ? true
      : existing.required ?? incoming.required;

  return {
    name: existing.name,
    value: existing.value,
    ...(description !== undefined ? { description } : {}),
    ...(required !== undefined ? { required } : {}),
  };
}

function renderEnvVar(envVar: EnvVarDefinition): string {
  const assignment = `${envVar.name}="${escapeEnvValue(envVar.value)}"`;

  if (!envVar.description) {
    return assignment;
  }

  return `# ${envVar.description}\n${assignment}`;
}

function escapeEnvValue(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
