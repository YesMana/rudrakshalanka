import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getAdmins } from "@/lib/admins-db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Admin Username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Validate against env variables (Master Admin)
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === adminUser &&
          credentials?.password === adminPass
        ) {
          return { id: "master", name: "Master Admin", email: "admin@rudrakshalanka.com", role: "admin" };
        }

        // Validate against admins.json
        const admins = getAdmins();
        const customAdmin = admins.find(a => a.type === 'credentials' && a.username === credentials?.username && a.password === credentials?.password);
        
        if (customAdmin) {
          return { id: customAdmin.id, name: customAdmin.username || "Admin", email: "", role: "admin" };
        }

        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // If logged in via credentials, it already has user.role
        // If logged in via Google, we check the email against env or admins.json
        if (user.email === 'yes.manujaya@gmail.com') {
          token.role = 'admin';
        } else {
          const admins = getAdmins();
          const googleAdmin = admins.find(a => a.type === 'google' && a.email?.toLowerCase() === user.email?.toLowerCase());
          if (googleAdmin) {
            token.role = 'admin';
          } else {
            token.role = (user as any).role || "user";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin', // We will create this custom login page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
