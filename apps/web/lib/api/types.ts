export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    issues?: unknown[];
  };
};

export type GeneratedProjectFileResponse = {
  path: string;
  contents: string;
  encoding: "utf8" | "base64";
};

export type GenerateProjectResponse = {
  project: {
    name: string;
    packageManager: "npm" | "pnpm";
    files: GeneratedProjectFileResponse[];
  };
};
