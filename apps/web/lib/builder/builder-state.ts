import {
  defaultBaseForgeConfig,
  type BaseForgeConfig,
} from "@baseforge/schema";

export type BuilderState = {
  config: BaseForgeConfig;
};

export type BuilderConfigPatch = Partial<BaseForgeConfig>;

export function createInitialBuilderState(): BuilderState {
  return {
    config: { ...defaultBaseForgeConfig },
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
