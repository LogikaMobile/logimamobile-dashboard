import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
  
  interface User {
    id?: string
    role?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GSSO_ID_CLIENT,
      clientSecret: process.env.GSSO_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        console.log("LOGIN ATTEMPT WITH EMAIL:", user.email);
        
        try {
          // Fetch developer by email to see if they exist in our CRM DB
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/lookup?email=${encodeURIComponent(user.email)}`, {
            method: 'GET',
            cache: 'no-store'
          });
          
          if (!res.ok) {
            console.log("LOGIN FAILED: DB lookup returned", res.status);
            // If developer not found (e.g. 404), reject login (Strict Invite-Only)
            return false
          }
          
          const dbUser = await res.json()
          console.log("LOGIN SUCCESS: User found in DB", dbUser);
          user.role = dbUser.role // Attach CRM role to NextAuth user object
          user.id = dbUser.id
          
          return true
        } catch (error) {
          console.error("Error during strict login lookup:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.dbId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.dbId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login', // Optional custom login page
    error: '/login?error=AccessDenied', // Redirect if signIn callback returns false
  }
})
