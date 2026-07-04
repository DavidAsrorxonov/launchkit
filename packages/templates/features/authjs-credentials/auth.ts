import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
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
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
