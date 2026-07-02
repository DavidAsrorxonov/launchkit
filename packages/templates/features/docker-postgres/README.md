# Docker PostgreSQL

This Docker Compose file starts PostgreSQL for local development.

```bash
docker compose up -d
docker compose down
```

The default username, password, and database name are development defaults. Keep `DATABASE_URL` aligned with the Docker Compose service:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/{{packageName}}"
```

Configure production database hosting separately.
