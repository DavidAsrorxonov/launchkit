import {
  defaultLaunchKitConfig,
  type LaunchKitConfig,
} from "@launchkit/schema";

export type BuilderState = {
  config: LaunchKitConfig;
};

export function createInitialBuilderState(): BuilderState {
  return {
    config: { ...defaultLaunchKitConfig },
  };
}
