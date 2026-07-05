type CodeBlockProps = {
  children: string;
  language?: string;
};

export function CodeBlock({ children, language = "bash" }: CodeBlockProps) {
  return (
    <pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6 text-foreground">
      <code className="font-mono" data-language={language}>
        {children}
      </code>
    </pre>
  );
}
