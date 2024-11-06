import NextAuth from "next-auth"

import { prisma } from "./lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
})

// Add middleware to protect routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
}