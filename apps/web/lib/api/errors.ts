export type ApiErrorLike = {
  code?: string;
  message?: string;
  issues?: unknown[];
};

export function getFriendlyApiErrorMessage(error: ApiErrorLike): string {
  switch (error.code) {
    case "invalid_content_type":
      return "The generation request could not be sent. Refresh and try again.";
    case "request_too_large":
      return "The generation request is too large. Review the selected project and try again.";
    case "invalid_json":
      return "The generation request was malformed. Refresh and try again.";
    case "invalid_config":
      return "Check the project settings before generating.";
    case "incompatible_config":
      return getFirstIssueMessage(error.issues) ?? "Some selected options are not compatible.";
    case "generation_failed":
      return "Project generation failed. Retry in a moment.";
    case "unsafe_generated_output":
      return "Generated files did not pass safety checks. Review the selection and try again.";
    case "method_not_allowed":
      return "Use the Generate ZIP button to create a project.";
    default:
      return "Project generation failed. Retry in a moment.";
  }
}

function getFirstIssueMessage(issues: unknown[] | undefined): string | undefined {
  const issue = issues?.find(
    (candidate): candidate is { message: string } =>
      typeof candidate === "object" &&
      candidate !== null &&
      "message" in candidate &&
      typeof candidate.message === "string" &&
      candidate.message.length > 0,
  );

  return issue?.message;
}
