import {
  defaultLaunchKitConfig,
  type LaunchKitConfig,
} from "@launchkit/schema";

export type BuilderState = {
  config: LaunchKitConfig;
};

export type BuilderConfigPatch = Partial<LaunchKitConfig>;

export function createInitialBuilderState(): BuilderState {
  return {
    config: { ...defaultLaunchKitConfig },
  };
}

export function updateBuilderConfig(
  state: BuilderState,
  patch: BuilderConfigPatch,
): BuilderState {
  return {
    ...state,
    config: {
      ...state.config,
      ...patch,
    },
  };
}
