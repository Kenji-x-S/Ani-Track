import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { query } from '../../../lib/db'; // Your DB helper

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };

        try {
          const users: any = await query('SELECT * FROM users WHERE email = ?', [email]);

          if (Array.isArray(users) && users.length === 1) {
            const user = users[0];

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
              return { id: user.id, name: user.name, email: user.email };
            } else {
              throw new Error('Invalid password');
            }
          } else {
            throw new Error('No user found');
          }
        } catch (error) {
          console.error('Error authorizing user:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);