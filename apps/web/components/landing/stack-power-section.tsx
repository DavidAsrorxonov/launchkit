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
  connectorPath: string;
};

const stacks = [
  {
    name: "Next.js",
    color: "#f8fafc",
    icon: Nextjs,
    x: 18,
    y: 22,
    connectorPath: "M 41 40 H 31 V 22 H 22",
  },
  {
    name: "Tailwind CSS",
    color: "#38bdf8",
    icon: TailwindCSS,
    x: 10,
    y: 39,
    connectorPath: "M 41 47 H 22 V 39 H 14",
  },
  {
    name: "Prisma",
    color: "#5eead4",
    icon: Prisma,
    x: 13,
    y: 63,
    connectorPath: "M 41 53 H 24 V 63 H 17",
  },
  {
    name: "Docker",
    color: "#2496ed",
    icon: Docker,
    x: 23,
    y: 80,
    connectorPath: "M 41 60 H 31 V 80 H 27",
  },
  {
    name: "PostgreSQL",
    color: "#336791",
    icon: PostgreSQL,
    x: 82,
    y: 22,
    connectorPath: "M 59 40 H 69 V 22 H 78",
  },
  {
    name: "shadcn/ui",
    color: "#f8fafc",
    icon: shadcnui,
    x: 90,
    y: 39,
    connectorPath: "M 59 47 H 78 V 39 H 86",
  },
  {
    name: "Auth.js",
    color: "#a855f7",
    icon: Authjs,
    x: 87,
    y: 63,
    connectorPath: "M 59 53 H 76 V 63 H 83",
  },
  {
    name: "npm",
    color: "#cc0000",
    icon: NPM,
    x: 77,
    y: 80,
    connectorPath: "M 59 60 H 69 V 80 H 73",
  },
] satisfies StackItem[];

export function StackPowerSection() {
  return (
    <section
      aria-labelledby="stack-power-heading"
      className="relative overflow-hidden border-t border-border py-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-180 max-w-5xl bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_78%,white)_1px,transparent_1px)] bg-size-[42px_42px] opacity-55 mask-[radial-gradient(ellipse_at_center,black_0%,black_36%,transparent_78%)]"
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

      <div className="relative z-10 mt-10 hidden h-165 md:block">
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
          id="connector-splash-glow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="1.1" />
        </filter>

        {stacks.map((stack) => (
          <radialGradient
            key={stack.name}
            id={`puff-${stack.name.replace(/[^a-zA-Z0-9]/g, "")}`}
          >
            <stop offset="0%" stopColor={stack.color} stopOpacity="0.9" />
            <stop offset="60%" stopColor={stack.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={stack.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {stacks.map((stack, index) => {
        const gradientId = `puff-${stack.name.replace(/[^a-zA-Z0-9]/g, "")}`;
        const dur = 2.6;

        return (
          <g key={stack.name}>
            {/* dim static wire */}
            <path
              d={stack.connectorPath}
              fill="none"
              stroke={stack.color}
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeOpacity="0.72"
              strokeWidth="0.22"
            />

            {/* soft flowing puff traveling logo -> stack */}
            <ellipse
              rx="2.6"
              ry="1.5"
              fill={`url(#${gradientId})`}
              filter="url(#connector-splash-glow)"
              opacity="0"
            >
              <animateMotion
                dur={`${dur}s`}
                begin={`${index * 0.22}s`}
                repeatCount="indefinite"
                path={stack.connectorPath}
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.18;0.75;1"
                dur={`${dur}s`}
                begin={`${index * 0.22}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="rx"
                values="1.6;2.8;2.8;1.8"
                keyTimes="0;0.3;0.7;1"
                dur={`${dur}s`}
                begin={`${index * 0.22}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="ry"
                values="1.3;1.6;1.6;1.4"
                keyTimes="0;0.3;0.7;1"
                dur={`${dur}s`}
                begin={`${index * 0.22}s`}
                repeatCount="indefinite"
              />
            </ellipse>
          </g>
        );
      })}
    </svg>
  );
}

function CenterLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/80 bg-card/80">
      <Image
        src="/favicon/favicon.svg"
        alt="BaseForge"
        width={196}
        height={196}
        className="h-49 w-49"
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
