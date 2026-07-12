export type FeatureNote = {
  title: string;
  summary: string;
  body: readonly string[];
  examples?: readonly {
    title: string;
    language: string;
    code: string;
  }[];
};

export const features: readonly FeatureNote[] = [
  {
    title: "shadcn/ui",
    summary:
      "Use this when the generated app should start with shadcn-compatible component conventions.",
    body: [
      "Adds shadcn-compatible files and a starter button component.",
      "Depends on Tailwind CSS, which is fixed on in the MVP.",
      "After download, keep generated UI primitives in `components/ui/` and place product-specific components outside that folder.",
      "Use `lib/utils.ts` for shared class-name helpers instead of duplicating class merge logic.",
    ],
    examples: [
      {
        title: "Use the generated button component",
        language: "tsx",
        code: `import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button type="submit">Save changes</Button>;
}`,
      },
    ],
  },
  {
    title: "PostgreSQL",
    summary:
      "Use this when the app needs a PostgreSQL connection string and database-ready configuration.",
    body: [
      "Adds `DATABASE_URL` to `.env.example`.",
      "Does not create or host a database.",
      "For local development, point `DATABASE_URL` at your own PostgreSQL instance or the generated Docker Compose service when Docker is selected.",
      "For production, provide a managed database connection string through your hosting provider's environment variable system.",
    ],
    examples: [
      {
        title: "Local PostgreSQL connection string",
        language: "dotenv",
        code: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/my_app"`,
      },
    ],
  },
  {
    title: "Prisma",
    summary:
      "Use this when the generated app should include a typed database schema and Prisma Client workflow.",
    body: [
      "Requires PostgreSQL.",
      "Adds Prisma schema, `prisma.config.ts`, and a database client helper.",
      "The starter schema includes a minimal `User` model so the project has a real Prisma shape without pretending to model your product.",
      "Edit `prisma/schema.prisma` before pushing schema changes to any shared database.",
      "Use the generated database helper from `lib/db.ts` instead of creating Prisma clients in route handlers or components.",
    ],
    examples: [
      {
        title: "Add a model before pushing schema changes",
        language: "prisma",
        code: `model Post {
  id        String   @id @default(cuid())
  title     String
  body      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
      },
      {
        title: "Use the generated Prisma helper",
        language: "ts",
        code: `import { db } from "@/lib/db";

export async function listUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}`,
      },
    ],
  },
  {
    title: "Auth.js credentials",
    summary:
      "Use this when the app needs the file structure for credentials auth, with real auth logic added by the developer.",
    body: [
      "Adds an Auth.js credentials scaffold, not production-ready user management.",
      "The generated authorize logic is a placeholder and real user lookup must be implemented.",
      "Secure password hashing and verification must be added by the developer.",
      "`AUTH_SECRET` must be replaced before using authentication.",
      "When combined with Prisma, connect the authorize function to your user table instead of leaving it as a null-returning placeholder.",
    ],
    examples: [
      {
        title: "Replace the generated authorize placeholder",
        language: "ts",
        code: `async authorize(credentials) {
  if (!credentials?.email || !credentials.password) {
    return null;
  }

  const user = await findUserByEmail(credentials.email);
  if (!user) {
    return null;
  }

  const passwordIsValid = await verifyPassword(
    credentials.password,
    user.passwordHash,
  );

  if (!passwordIsValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}`,
      },
    ],
  },
  {
    title: "Docker PostgreSQL",
    summary:
      "Use this when the generated app should include a local PostgreSQL service for development.",
    body: [
      "Adds `docker-compose.yml` for local development only.",
      "Requires PostgreSQL selection.",
      "Start the database before running Prisma commands or booting app code that reads from PostgreSQL.",
      "Do not treat the local Docker service as production infrastructure; production database hosting must be configured separately.",
    ],
    examples: [
      {
        title: "Start and stop the local database",
        language: "bash",
        code: `docker compose up -d
docker compose down`,
      },
    ],
  },
] as const;
