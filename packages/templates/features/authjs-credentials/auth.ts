import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Scaffold only: replace this with real user lookup and password verification.
        // Never compare plain text passwords or hardcode users in production code.
        void credentials;

        return null;
      },
    }),
  ],
});
