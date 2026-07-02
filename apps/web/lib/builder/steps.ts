export type BuilderStepId =
  | "project"
  | "framework"
  | "styling-ui"
  | "database"
  | "orm"
  | "auth"
  | "extras"
  | "preview"
  | "download";

export type BuilderStep = {
  id: BuilderStepId;
  label: string;
  shortLabel: string;
  placeholder: string;
};

export const builderSteps = [
  {
    id: "project",
    label: "Project",
    shortLabel: "Project",
    placeholder: "Project step coming next.",
  },
  {
    id: "framework",
    label: "Framework",
    shortLabel: "Stack",
    placeholder: "Framework step coming next.",
  },
  {
    id: "styling-ui",
    label: "Styling and UI",
    shortLabel: "UI",
    placeholder: "Styling and UI step coming next.",
  },
  {
    id: "database",
    label: "Database",
    shortLabel: "Data",
    placeholder: "Database step coming next.",
  },
  {
    id: "orm",
    label: "ORM",
    shortLabel: "ORM",
    placeholder: "Choose ORM setup.",
  },
  {
    id: "auth",
    label: "Auth",
    shortLabel: "Auth",
    placeholder: "Choose auth scaffold.",
  },
  {
    id: "extras",
    label: "Extras",
    shortLabel: "Extras",
    placeholder: "Choose optional extras.",
  },
  {
    id: "preview",
    label: "Preview",
    shortLabel: "Preview",
    placeholder: "Inspect generated project details.",
  },
  {
    id: "download",
    label: "Download",
    shortLabel: "ZIP",
    placeholder: "Download step coming later.",
  },
] as const satisfies readonly BuilderStep[];
