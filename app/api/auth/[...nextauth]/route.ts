import  NextAuth, { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github"

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken as string; 
      return session;
    },
    async jwt({ token, account }: { token: JWT; account: any }) {
      if (account) {
        token.accessToken = account.access_token as string; 
      }
      return token;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }