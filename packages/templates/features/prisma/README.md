# Prisma

This project uses Prisma v7 with PostgreSQL through `DATABASE_URL`.

`prisma.config.ts` loads `DATABASE_URL` for Prisma CLI commands. `lib/db.ts` uses `@prisma/adapter-pg` for runtime Prisma Client queries.

Run Prisma commands after installing dependencies and configuring `.env`:

```bash
npm run db:generate
npm run db:push
npm run db:studio
```

Docker Compose and Auth.js setup are optional separate features.
