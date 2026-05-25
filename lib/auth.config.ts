import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session
    },
    async jwt({ token }: any) {
      return token
    },
  },
  providers: [],
} satisfies NextAuthConfig
