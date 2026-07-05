import { CodeBlock } from "@/components/docs/code-block";

type FeatureNote = {
  title: string;
  body: readonly string[];
  code?: string;
};

const features: readonly FeatureNote[] = [
  {
    title: "shadcn/ui",
    body: [
      "Adds shadcn-compatible files and a starter button component.",
      "Depends on Tailwind CSS, which is fixed on in the MVP.",
      "Developers can extend the component set after downloading the project.",
    ],
  },
  {
    title: "PostgreSQL",
    body: [
      "Adds `DATABASE_URL` to `.env.example`.",
      "Does not create or host a database.",
      "Production deployments need a real connection string supplied by the developer.",
    ],
  },
  {
    title: "Prisma",
    body: [
      "Requires PostgreSQL.",
      "Adds Prisma schema, `prisma.config.ts`, and a database client helper.",
      "Use Prisma commands on a development database first, not blindly against production.",
    ],
    code: `npm run db:generate
npm run db:push
npm run db:studio`,
  },
  {
    title: "Auth.js credentials",
    body: [
      "Adds an Auth.js credentials scaffold, not production-ready user management.",
      "The generated authorize logic is a placeholder and real user lookup must be implemented.",
      "Secure password hashing and verification must be added by the developer.",
      "`AUTH_SECRET` must be replaced before using authentication.",
    ],
  },
  {
    title: "Docker PostgreSQL",
    body: [
      "Adds `docker-compose.yml` for local development only.",
      "Requires PostgreSQL selection.",
      "Production database hosting must be configured separately.",
    ],
    code: `docker compose up -d
docker compose down`,
  },
] as const;

export function FeatureNotes() {
  return (
    <div className="grid gap-4">
      {features.map((feature) => (
        <article key={feature.title} className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
          <ul className="mt-3 space-y-2">
            {feature.body.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {feature.code ? (
            <div className="mt-4">
              <CodeBlock>{feature.code}</CodeBlock>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
