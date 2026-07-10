"use client";

import { useEffect, useState } from "react";
import { Check, FileCode2, FolderTree, PackageCheck } from "lucide-react";

const terminalSteps = [
  { kind: "command", text: "npx @baseforge/create@latest" },
  { kind: "input", prompt: "Project name", answer: "baseforge-demo" },
  {
    kind: "select",
    prompt: "Package manager",
    answer: "npm",
    options: ["npm", "pnpm"],
  },
  {
    kind: "select",
    prompt: "UI library",
    answer: "shadcn/ui",
    options: ["None", "shadcn/ui"],
  },
  {
    kind: "select",
    prompt: "Database",
    answer: "PostgreSQL",
    options: ["None", "PostgreSQL"],
  },
  {
    kind: "select",
    prompt: "ORM",
    answer: "Prisma",
    options: ["None", "Prisma"],
  },
  {
    kind: "select",
    prompt: "Auth",
    answer: "Auth.js credentials scaffold",
    options: ["None", "Auth.js credentials scaffold"],
  },
  {
    kind: "select",
    prompt: "Docker",
    answer: "PostgreSQL Docker Compose",
    options: ["None", "PostgreSQL Docker Compose"],
  },
  { kind: "output", text: "Validated selected stack." },
  { kind: "output", text: "Generated app, components, Prisma, auth, and env files." },
  { kind: "output", text: "Done. cd baseforge-demo && npm install" },
] as const;

const outputFiles = [
  "app/page.tsx",
  "components/ui/button.tsx",
  "prisma/schema.prisma",
  "app/api/auth/[...nextauth]/route.ts",
  "docker-compose.yml",
] as const;

const buildSteps = [
  {
    label: "Prompts become config",
    description: "Every answer maps to the same schema used by the website builder.",
    icon: PackageCheck,
  },
  {
    label: "Templates are composed",
    description: "Base app files and selected features are merged into one project.",
    icon: FolderTree,
  },
  {
    label: "Ready for local edits",
    description: "Install dependencies, run the dev server, and continue in your editor.",
    icon: FileCode2,
  },
] as const;

export function CliDemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (activeStep >= terminalSteps.length) {
      const resetTimer = window.setTimeout(() => {
        setActiveStep(0);
        setTypedLength(0);
      }, 2400);

      return () => window.clearTimeout(resetTimer);
    }

    const step = terminalSteps[activeStep];
    const target = getTypedText(step);

    if (typedLength < target.length) {
      const typingTimer = window.setTimeout(() => {
        setTypedLength((current) => current + 1);
      }, 38);

      return () => window.clearTimeout(typingTimer);
    }

    const nextTimer = window.setTimeout(() => {
      setActiveStep((current) => current + 1);
      setTypedLength(0);
    }, step.kind === "select" ? 900 : 520);

    return () => window.clearTimeout(nextTimer);
  }, [activeStep, typedLength]);

  const completedSteps = terminalSteps.slice(0, activeStep);
  const currentStep =
    activeStep < terminalSteps.length ? terminalSteps[activeStep] : null;

  return (
    <section
      id="supported-stack"
      aria-labelledby="cli-demo-heading"
      className="grid gap-8 border-t border-border py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
    >
      <div className="grid gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          CLI workflow
        </p>
        <h2
          id="cli-demo-heading"
          className="mt-3 max-w-2xl text-3xl font-normal leading-tight text-foreground sm:text-4xl"
        >
          Generate the same starter from your terminal.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          BaseForge asks for the project name, package manager, UI, database,
          ORM, auth, and Docker choices, then writes a ready-to-edit Next.js
          project locally.
        </p>

        <div className="rounded-lg border border-border bg-card p-5 text-card-foreground">
          <p className="text-sm font-medium text-foreground">
            What gets assembled
          </p>
          <div className="mt-4 grid gap-3">
            {buildSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.label} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {step.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 text-card-foreground">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-foreground">
              Example output
            </p>
            <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
              baseforge-demo
            </span>
          </div>
          <ul className="mt-4 grid gap-2">
            {outputFiles.map((file) => (
              <li
                key={file}
                className="flex items-center gap-2 rounded-md bg-background px-3 py-2 font-mono text-xs text-muted-foreground"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-blue-300/80" aria-hidden="true" />
                <span className="min-w-0 truncate">{file}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-black text-white shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
          <span className="ml-2 text-xs text-white/60">baseforge create</span>
        </div>

        <div className="min-h-132 overflow-hidden bg-black px-4 py-4 text-left font-mono text-xs leading-6 text-white sm:text-sm">
          {completedSteps.map((step, index) => (
            <TerminalStep
              key={`${getTypedText(step)}-${index}`}
              step={step}
              typedText={getTypedText(step)}
              isCurrent={false}
            />
          ))}
          {currentStep ? (
            <TerminalStep
              step={currentStep}
              typedText={getTypedText(currentStep).slice(0, typedLength)}
              isCurrent
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TerminalStep({
  step,
  typedText,
  isCurrent,
}: {
  step: (typeof terminalSteps)[number];
  typedText: string;
  isCurrent: boolean;
}) {
  const cursor = isCurrent ? (
    <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-white" />
  ) : null;

  if (step.kind === "command") {
    return (
      <p>
        <span className="text-blue-400">&gt;</span>{" "}
        <span>{typedText}</span>
        {cursor}
      </p>
    );
  }

  if (step.kind === "input") {
    return (
      <p>
        <span className="text-white/65">?</span> {step.prompt}{" "}
        <span>{typedText}</span>
        {cursor}
      </p>
    );
  }

  if (step.kind === "select") {
    return (
      <div>
        <p>
          <span className="text-white/65">?</span> {step.prompt}{" "}
          <span>{typedText}</span>
          {cursor}
        </p>
        {isCurrent ? (
          <div className="mt-1 pl-4">
            {step.options.map((option) => {
              const isSelected = option === step.answer;

              return (
                <p key={option} className={isSelected ? "text-white" : "text-white/45"}>
                  <span className={isSelected ? "text-blue-400" : "text-transparent"}>
                    &gt;
                  </span>{" "}
                  {option}
                </p>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <p>
      <span className="text-white/65">-</span> {typedText}
      {cursor}
    </p>
  );
}

function getTypedText(step: (typeof terminalSteps)[number]): string {
  if (step.kind === "command" || step.kind === "output") {
    return step.text;
  }

  return step.answer;
}
