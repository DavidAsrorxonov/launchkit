type DownloadStatusProps = {
  status: "idle" | "generating" | "success" | "error";
  message?: string;
};

export function DownloadStatus({ status, message }: DownloadStatusProps) {
  if (status === "idle") {
    return null;
  }

  const isError = status === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={[
        "rounded-md border bg-background p-4 text-sm",
        isError
          ? "border-destructive text-destructive"
          : "border-border text-muted-foreground",
      ].join(" ")}
    >
      {message ?? getDefaultMessage(status)}
    </div>
  );
}

function getDefaultMessage(status: DownloadStatusProps["status"]): string {
  if (status === "generating") {
    return "Preparing project zip...";
  }

  if (status === "success") {
    return "ZIP download prepared.";
  }

  return "";
}
