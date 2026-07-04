import {
  handleGenerateProjectRequest,
  methodNotAllowedResponse,
} from "../../../lib/api/generate";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return handleGenerateProjectRequest(request);
}

export function GET(): Response {
  return methodNotAllowedResponse();
}
