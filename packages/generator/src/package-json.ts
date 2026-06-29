import type {
  DependencyMap,
  PackageJsonPatch,
  ScriptMap,
} from "./generation-plan.js";

export class PackageJsonMergeConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageJsonMergeConflictError";
  }
}

type PackageJsonMetadataField = "name" | "version" | "private" | "type";

const metadataFields = [
  "name",
  "version",
  "private",
  "type",
] as const satisfies readonly PackageJsonMetadataField[];

export function mergePackageJsonPatches(
  patches: PackageJsonPatch[],
): PackageJsonPatch {
  const merged: PackageJsonPatch = {};

  for (const patch of patches) {
    mergeMetadataFields(merged, patch);
    merged.dependencies = mergeNamedValues({
      existing: merged.dependencies,
      incoming: patch.dependencies,
      conflictMessage: (name, existing, incoming) =>
        `Conflicting dependency version for ${name}: ${existing} vs ${incoming}.`,
    });
    merged.devDependencies = mergeNamedValues({
      existing: merged.devDependencies,
      incoming: patch.devDependencies,
      conflictMessage: (name, existing, incoming) =>
        `Conflicting dev dependency version for ${name}: ${existing} vs ${incoming}.`,
    });
    merged.scripts = mergeNamedValues({
      existing: merged.scripts,
      incoming: patch.scripts,
      conflictMessage: (name, existing, incoming) =>
        `Conflicting script command for ${name}: ${existing} vs ${incoming}.`,
    });
  }

  return removeUndefinedMaps(merged);
}

function mergeMetadataFields(
  target: PackageJsonPatch,
  patch: PackageJsonPatch,
) {
  for (const field of metadataFields) {
    const incomingValue = patch[field];

    if (incomingValue === undefined) {
      continue;
    }

    const existingValue = target[field];

    if (existingValue !== undefined && existingValue !== incomingValue) {
      throw new PackageJsonMergeConflictError(
        `Conflicting package.json field "${field}": ${String(existingValue)} vs ${String(
          incomingValue,
        )}.`,
      );
    }

    target[field] = incomingValue as never;
  }
}

function mergeNamedValues(input: {
  existing?: DependencyMap | ScriptMap;
  incoming?: DependencyMap | ScriptMap;
  conflictMessage: (name: string, existing: string, incoming: string) => string;
}): DependencyMap | ScriptMap | undefined {
  if (!input.existing && !input.incoming) {
    return undefined;
  }

  const merged: Record<string, string> = { ...input.existing };

  for (const [name, incomingValue] of Object.entries(input.incoming ?? {})) {
    const existingValue = merged[name];

    if (existingValue !== undefined && existingValue !== incomingValue) {
      throw new PackageJsonMergeConflictError(
        input.conflictMessage(name, existingValue, incomingValue),
      );
    }

    merged[name] = incomingValue;
  }

  return merged;
}

function removeUndefinedMaps(patch: PackageJsonPatch): PackageJsonPatch {
  return {
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.version !== undefined ? { version: patch.version } : {}),
    ...(patch.private !== undefined ? { private: patch.private } : {}),
    ...(patch.type !== undefined ? { type: patch.type } : {}),
    ...(patch.scripts !== undefined ? { scripts: patch.scripts } : {}),
    ...(patch.dependencies !== undefined
      ? { dependencies: patch.dependencies }
      : {}),
    ...(patch.devDependencies !== undefined
      ? { devDependencies: patch.devDependencies }
      : {}),
  };
}
