import type { ComponentType, SVGProps } from "react";
import Image from "next/image";

import { Authjs } from "@/components/icons/authjs";
import { Docker } from "@/components/icons/docker";
import { Nextjs } from "@/components/icons/next";
import { NPM } from "@/components/icons/npm";
import { PostgreSQL } from "@/components/icons/postgresql";
import { Prisma } from "@/components/icons/prisma";
import { shadcnui } from "@/components/icons/shadcn";
import { TailwindCSS } from "@/components/icons/tailwind";

type StackItem = {
  name: string;
  color: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  x: number;
  y: number;
  anchorX: number;
  side: "left" | "right";
};

const stacks = [
  {
    name: "Next.js",
    color: "#f8fafc",
    icon: Nextjs,
    x: 18,
    y: 15,
    anchorX: 22,
    side: "left",
  },
  {
    name: "Tailwind CSS",
    color: "#38bdf8",
    icon: TailwindCSS,
    x: 10,
    y: 33,
    anchorX: 14,
    side: "left",
  },
  {
    name: "Prisma",
    color: "#5eead4",
    icon: Prisma,
    x: 13,
    y: 58,
    anchorX: 17,
    side: "left",
  },
  {
    name: "Docker",
    color: "#2496ed",
    icon: Docker,
    x: 23,
    y: 82,
    anchorX: 27,
    side: "left",
  },
  {
    name: "PostgreSQL",
    color: "#336791",
    icon: PostgreSQL,
    x: 82,
    y: 15,
    anchorX: 78,
    side: "right",
  },
  {
    name: "shadcn/ui",
    color: "#f8fafc",
    icon: shadcnui,
    x: 90,
    y: 33,
    anchorX: 86,
    side: "right",
  },
  {
    name: "Auth.js",
    color: "#a855f7",
    icon: Authjs,
    x: 87,
    y: 58,
    anchorX: 83,
    side: "right",
  },
  {
    name: "npm",
    color: "#cc0000",
    icon: NPM,
    x: 77,
    y: 82,
    anchorX: 73,
    side: "right",
  },
] satisfies StackItem[];

export function StackPowerSection() {
  return (
    <section
      aria-labelledby="stack-power-heading"
      className="relative overflow-hidden border-t border-border py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-140 max-w-5xl bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px)] bg-size-[42px_42px] opacity-55 mask-[radial-gradient(ellipse_at_center,black_0%,black_36%,transparent_78%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-20 h-56 bg-linear-to-b from-background via-background/85 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center">
        <h2
          id="stack-power-heading"
          className="text-3xl font-normal leading-tight text-foreground sm:text-4xl"
        >
          Powers the stack you already use.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          BaseForge connects the core app scaffold to styling, database, auth,
          container, and package tooling from one generated project.
        </p>
      </div>

      <div className="relative z-10 mt-10 hidden h-140 md:block">
        <ConnectorLayer />
        <CenterLogo />

        {stacks.map((stack) => (
          <StackCard key={stack.name} stack={stack} />
        ))}
      </div>

      <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-2 md:hidden">
        {stacks.map((stack) => {
          const Icon = stack.icon;

          return (
            <div
              key={stack.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/80 p-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {stack.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ConnectorLayer() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="stack-line-glow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {stacks.map((stack) => {
        const startX = stack.side === "left" ? 43 : 57;
        const startY = 50 + (stack.y - 50) * 0.34;
        const controlOneX = stack.side === "left" ? 38 : 62;
        const controlTwoX =
          stack.side === "left" ? stack.anchorX + 8 : stack.anchorX - 8;
        const path = `M ${startX} ${startY} C ${controlOneX} ${startY}, ${controlTwoX} ${stack.y}, ${stack.anchorX} ${stack.y}`;

        return (
          <g key={stack.name}>
            <path
              d={path}
              fill="none"
              stroke={stack.color}
              strokeOpacity="0.16"
              strokeWidth="0.72"
              filter="url(#stack-line-glow)"
            />
            <path
              d={path}
              fill="none"
              stroke={stack.color}
              strokeLinecap="round"
              strokeOpacity="0.64"
              strokeWidth="0.24"
              filter="url(#stack-line-glow)"
            />
          </g>
        );
      })}
    </svg>
  );
}

function CenterLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.2),transparent_66%)] blur-2xl" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.34),rgba(255,255,255,0.12)_34%,transparent_70%)] blur-2xl" />
      <Image
        src="/favicon/favicon.svg"
        alt="BaseForge"
        width={196}
        height={196}
        className="relative z-10"
      />
    </div>
  );
}

function StackCard({ stack }: { stack: StackItem }) {
  const Icon = stack.icon;

  return (
    <div
      className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-border bg-card/70 backdrop-blur-sm"
      style={{
        left: `${stack.x}%`,
        top: `${stack.y}%`,
        borderColor: `${stack.color}55`,
        boxShadow: `0 0 26px ${stack.color}1f`,
      }}
      title={stack.name}
    >
      <Icon className="h-10 w-10" aria-hidden="true" />
      <span className="sr-only">{stack.name}</span>
    </div>
  );
}
