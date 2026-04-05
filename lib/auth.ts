import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db as prisma } from "@/lib/db"; 
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET || "fallback-secret-for-dev-only",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth: Missing email or password");
          return null;
        }
        
        console.log("Auth: Attempting login for", credentials.email);
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          console.log("Auth: User not found");
          return null;
        }

        if (!user.password) {
          console.log("Auth: User has no password set");
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isValid) {
          console.log("Auth: Password mismatch");
          return null;
        }

        console.log("Auth: Login successful for", user.email, "Role:", user.role);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
