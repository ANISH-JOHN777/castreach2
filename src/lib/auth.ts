/**
 * NextAuth Authentication Configuration
 * Handles Google OAuth and Email/Password authentication
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, createUser } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // In production, validate password against hashed value
        // For now, accept any non-empty password for demo
        const user = await getUserByEmail(credentials.email);

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }

        // Create new user if doesn't exist
        if (credentials.password.length >= 6) {
          const newUser = await createUser({
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: (credentials.role as 'creator' | 'brand' | 'admin') || 'creator'
          });

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists, if not create them
        let dbUser = await getUserByEmail(user.email || '');

        if (!dbUser) {
          dbUser = await createUser({
            email: user.email || '',
            name: user.name || 'User',
            role: 'creator'
          });
        }

        return true;
      }

      return true;
    },
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
        session.user.role = token.role as any;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET
};
