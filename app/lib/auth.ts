import prisma from "@/prisma/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { z } from "zod";

interface Credentials {
  email: string;
  password: string;
  name?: string;
}

const credentialsSchema = z.object({
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return "anonymous";
    }
    return value;
  }, z.string())
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", optional: true },
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Credentials | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          console.error(parsed.error);
          return null;
        }

        const { email, name, password } = parsed.data;
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            } as User;
          }
          return null;
        }

        try {
          const user = await prisma.user.create({
            data: {
              name: name,
              password: hashedPassword,
              email: email,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          } as User;
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "",
  callbacks: {
    async session({
      token,
      session,
    }: {
      token: JWT;
      session: Session;
    }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin"
  }
};
