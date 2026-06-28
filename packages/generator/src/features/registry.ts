import type { LaunchKitConfig } from "@launchkit/schema";

import type { FeatureId } from "../generation-plan";
import {
  authjsCredentialsFeature,
  dockerPostgresFeature,
  mvpFeatureDefinitions,
  nextFeature,
  postgresFeature,
  prismaFeature,
  shadcnFeature,
  tailwindFeature,
  type FeatureDefinition,
} from "./definitions";

export class UnknownFeatureError extends Error {
  constructor(public readonly id: string) {
    super(`Unknown feature: ${id}`);
    this.name = "UnknownFeatureError";
  }
}

export const featureRegistry: Record<FeatureId, FeatureDefinition> = {
  next: nextFeature,
  tailwind: tailwindFeature,
  shadcn: shadcnFeature,
  postgres: postgresFeature,
  prisma: prismaFeature,
  "authjs-credentials": authjsCredentialsFeature,
  "docker-postgres": dockerPostgresFeature,
};

export function getFeatureDefinition(id: FeatureId | string): FeatureDefinition {
  const feature = featureRegistry[id as FeatureId];

  if (!feature) {
    throw new UnknownFeatureError(id);
  }

  return feature;
}

export function getEnabledFeatures(config: LaunchKitConfig): FeatureDefinition[] {
  return mvpFeatureDefinitions.filter((feature) => feature.isEnabled?.(config) ?? false);
}
