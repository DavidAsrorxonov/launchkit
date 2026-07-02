# Auth.js Credentials

This project includes an Auth.js credentials scaffold.

Replace `AUTH_SECRET` before using the generated project. The default `authorize` implementation is a placeholder and always rejects sign-ins.

Implement real user lookup and secure password hashing and verification before relying on credentials authentication. This scaffold is intentionally not production-complete.

If Prisma is selected, `lib/db.ts` is available for database access, but you still need to connect the Auth.js authorize logic to your user model.
