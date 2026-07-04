type DownloadButtonProps = {
  isGenerating: boolean;
  onClick: () => void;
};

export function DownloadButton({
  isGenerating,
  onClick,
}: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isGenerating}
      aria-busy={isGenerating ? "true" : "false"}
      className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 sm:w-auto"
    >
      {isGenerating ? "Preparing..." : "Generate ZIP"}
    </button>
  );
}
