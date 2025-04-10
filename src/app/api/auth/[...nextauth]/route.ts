import NextAuth, { Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const checkResponse = await fetch(`${API_BASE_URL}/users/email/${user.email}`);
        if (checkResponse.ok) {
          // User already exists, no need to re-create
          return true;
        }

        // If not found, create the user
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: user.name || '',
            email: user.email || '',
            password: '',
            address: '',
            phoneNumber: '',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('User creation failed:', errorData);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error in Google sign-in:', error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub
        },
        accessToken: token.accessToken as string
      }
    },
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      // Persist token data
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

