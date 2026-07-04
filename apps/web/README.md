# LaunchKit Web

Next.js website for the LaunchKit project builder.

## Local Run

```bash
npm install
npm run dev -w apps/web
```

Open `http://localhost:3000`.

## Production

```bash
npm install
npm run build -w apps/web
npm run start -w apps/web
```

The website MVP does not require environment variables. Generated-project values such as `DATABASE_URL` and `AUTH_SECRET` belong inside downloaded projects, not this web app.

`POST /api/generate` validates requests, calls the shared generator, and returns generated file data for browser-side ZIP creation. The website does not install generated dependencies, execute generated code, start generated app servers, or write generated projects to disk.
