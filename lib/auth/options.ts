import { compare } from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้หรืออีเมล"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

const hasDatabase = Boolean(
  process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
);

export const authOptions: NextAuthOptions = {
  adapter: hasDatabase ? PrismaAdapter(getPrisma()) : undefined,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ชื่อผู้ใช้", type: "text" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        const prisma = getPrisma();
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const identifier = parsed.data.username.trim();

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: identifier },
              { email: identifier.toLowerCase() },
            ],
          },
        });

        console.log("LOGIN_IDENTIFIER:", identifier);
        console.log("FOUND_USER:", user?.username, user?.email, user?.status);

        if (!user?.passwordHash || user.status !== "active") {
          return null;
        }

        const valid = await compare(parsed.data.password, user.passwordHash);
        console.log("PASSWORD_VALID:", valid);

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name ?? user.username,
          email: user.email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "employee";
        session.user.username = token.username ?? session.user.email ?? "";
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id || !hasDatabase) {
        return;
      }

      await getPrisma().user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLoginAt: new Date(),
        },
      });
    },
  },
};