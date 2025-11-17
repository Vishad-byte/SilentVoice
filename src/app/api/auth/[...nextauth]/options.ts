// options.ts
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      // Use `identifier` so the user can provide email OR username
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
        await dbConnect();

        try {
          console.log('Authorize() called - NEXTAUTH_URL=', process.env.NEXTAUTH_URL);
          console.log('Credentials keys:', credentials ? Object.keys(credentials) : 'no credentials');

          if (!credentials || !credentials.identifier || !credentials.password) {
            console.log('Missing credentials or fields');
            throw new Error('Missing credentials');
          }

          const identifier = credentials.identifier;

          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });

          if (!user) {
            console.log('Authorize: user not found for identifier=', identifier);
            throw new Error('No user found with this email or username');
          }

          if (!user.isVerified) {
            console.log('Authorize: user not verified:', user._id?.toString());
            throw new Error('Please verify your account before logging in');
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            console.log('Authorize: incorrect password for userId=', user._id?.toString());
            throw new Error('Incorrect password');
          }

          // Build returned user (only include fields you need)
          const returnedUser = {
            id: user._id?.toString(),
            _id: user._id?.toString(),
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
            username: user.username,
            email: user.email,
            name: user.username ?? user.email,
          } as unknown as User;

          console.log('Authorize: successful for userId=', returnedUser._id);
          return returnedUser;
        } catch (err: unknown) {
          // Let NextAuth handle the error -> will result in 401 for credential failures
          if (err instanceof Error) {
            console.error('Authorize error:', err.message);
            throw new Error(err.message);
          }
          throw new Error(String(err));
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // user might be your returnedUser
        const u = user;
        token._id = u._id ?? u.id;
        token.isVerified = u.isVerified;
        token.isAcceptingMessage = u.isAcceptingMessage;
        token.username = u.username;
        console.log('jwt callback - attaching token._id=', token._id);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
        session.user.username = token.username as string;
        console.log('session callback - session.user._id=', session.user._id);
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
