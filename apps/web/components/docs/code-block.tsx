type CodeBlockProps = {
  children: string;
  language?: string;
};

export function CodeBlock({ children, language = "bash" }: CodeBlockProps) {
  return (
    <pre className="w-full max-w-full min-w-0 overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs leading-6 text-foreground sm:rounded-lg sm:p-4 sm:text-sm">
      <code className="font-mono" data-language={language}>
        {children}
      </code>
    </pre>
  );
}
