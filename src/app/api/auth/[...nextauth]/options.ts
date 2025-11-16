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
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<User | null> {
        await dbConnect();

        try {
          if (!credentials || !credentials.identifier || !credentials.password) {
            throw new Error('Missing credentials');
          }

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Return a plain object that matches/extends NextAuth's `User` shape.
            const returnedUser: User = {
              id: user._id?.toString(),
              _id: user._id?.toString(),
              isVerified: user.isVerified,
              isAcceptingMessage: user.isAcceptingMessage,
              username: user.username,
              email: user.email,
            } as unknown as User;

            return returnedUser;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: unknown) {
          if (err instanceof Error) throw new Error(err.message);
          throw new Error(String(err));
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
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