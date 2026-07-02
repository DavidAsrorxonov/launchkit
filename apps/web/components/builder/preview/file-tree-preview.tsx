type FileTreePreviewProps = {
  projectName: string;
  filePaths: string[];
};

export function FileTreePreview({
  projectName,
  filePaths,
}: FileTreePreviewProps) {
  return (
    <section className="rounded-md border border-border bg-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          Generated file tree
        </h3>
        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {filePaths.length}
        </span>
      </div>
      <pre className="max-h-96 overflow-auto rounded-md border border-border bg-muted p-3 text-xs leading-6 text-foreground">
        <code>{formatFileTree(projectName, filePaths)}</code>
      </pre>
    </section>
  );
}

function formatFileTree(projectName: string, filePaths: string[]): string {
  const lines = [`${projectName}/`];
  const seenDirectories = new Set<string>();

  for (const filePath of filePaths) {
    const segments = filePath.split("/");

    segments.forEach((segment, index) => {
      const isFile = index === segments.length - 1;
      const directoryKey = segments.slice(0, index + 1).join("/");

      if (!isFile) {
        if (seenDirectories.has(directoryKey)) {
          return;
        }

        seenDirectories.add(directoryKey);
      }

      lines.push(`${"  ".repeat(index + 1)}${segment}${isFile ? "" : "/"}`);
    });
  }

  return lines.join("\n");
}
