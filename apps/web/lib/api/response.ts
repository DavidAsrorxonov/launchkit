import type { ApiErrorResponse } from "./types";

export function jsonResponse<TBody>(body: TBody, status: number): Response {
  return Response.json(body, { status });
}

export function jsonErrorResponse(input: {
  status: number;
  code: string;
  message: string;
  issues?: unknown[];
}): Response {
  return jsonResponse<ApiErrorResponse>(
    {
      error: {
        code: input.code,
        message: input.message,
        ...(input.issues ? { issues: input.issues } : {}),
      },
    },
    input.status,
  );
}
