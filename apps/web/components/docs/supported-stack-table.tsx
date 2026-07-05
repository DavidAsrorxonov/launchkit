import {
  authMetadata,
  databaseMetadata,
  dockerMetadata,
  frameworkMetadata,
  languageMetadata,
  ormMetadata,
  packageManagerMetadata,
  projectStructureMetadata,
  routerMetadata,
  stylingMetadata,
  uiMetadata,
  type OptionMetadata,
} from "@launchkit/schema";

type StackRow = {
  category: string;
  options: readonly OptionMetadata[];
  note?: string;
};

const rows: readonly StackRow[] = [
  { category: "Framework", options: frameworkMetadata },
  { category: "Language", options: languageMetadata },
  { category: "Router", options: routerMetadata },
  { category: "Project structure", options: projectStructureMetadata },
  { category: "Styling", options: stylingMetadata },
  { category: "UI", options: uiMetadata },
  { category: "Database", options: databaseMetadata },
  { category: "ORM", options: ormMetadata },
  { category: "Auth", options: authMetadata, note: "Credentials scaffold only." },
  { category: "Docker", options: dockerMetadata, note: "Local PostgreSQL only." },
  { category: "Package manager", options: packageManagerMetadata },
];

export function SupportedStackTable() {
  return (
    <div className="max-w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
        <thead className="bg-muted text-foreground">
          <tr>
            <th className="border-b border-border px-4 py-3 font-semibold">
              Category
            </th>
            <th className="border-b border-border px-4 py-3 font-semibold">
              Supported options
            </th>
            <th className="border-b border-border px-4 py-3 font-semibold">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.category} className="border-b border-border last:border-b-0">
              <th className="bg-card px-4 py-3 align-top font-medium text-foreground">
                {row.category}
              </th>
              <td className="px-4 py-3 align-top">
                <ul className="flex flex-wrap gap-2">
                  {row.options.map((option) => (
                    <li
                      key={option.value}
                      className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">
                {row.note ?? "MVP-supported."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
