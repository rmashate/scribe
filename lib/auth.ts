import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch username from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        });
        if (dbUser?.username) {
          session.user.username = dbUser.username;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Generate a unique username from email or name
      if (user.email) {
        const baseUsername = user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
        let username = baseUsername;
        let counter = 1;

        // Ensure username is unique
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { username },
        });
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});

// Extend the session type to include username
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
