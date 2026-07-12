import { CodeBlock } from "@/components/docs/code-block";
import {
  baseStructure,
  coreFiles,
  optionalFiles,
} from "@/components/docs/generated-files-data";

export function GeneratedFilesSection() {
  return (
    <div className="space-y-5">
      <p>
        The generated project keeps `app/`, `components/`, and `lib/` at the
        project root. Generated projects do not use a `src/` directory.
      </p>
      <CodeBlock language="txt">{baseStructure}</CodeBlock>
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Core files to edit first
        </h3>
        <dl className="mt-3 grid gap-2">
          {coreFiles.map(([file, purpose]) => (
            <div
              key={file}
              className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt className="font-mono text-xs font-semibold text-foreground">
                {file}
              </dt>
              <dd>{purpose}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {optionalFiles.map((group) => (
          <div
            key={group.title}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              {group.title}
            </h3>
            <p className="mt-2">{group.purpose}</p>
            <ul className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
              {group.files.map((file) => (
                <li key={file} className="break-all">
                  {file}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
