import NextAuth, { NextAuthOptions } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextApiHandler } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/authHelper";
import { getPool } from "@/lib/pool";

const authHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuth(req, res, options);
export default authHandler;

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        try {
          const pool = await getPool();

          const [rows]: any = await pool.execute(
            `SELECT * FROM users WHERE username = ?`,
            [username.toLowerCase()]
          );

          const dbuser = rows[0];
          if (!dbuser) {
            throw new Error("User not found");
          }

          const passwordMatch = await verifyPassword(password, dbuser.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          const user = {
            ...dbuser,
            name: dbuser.name,
            id: dbuser.id,
          };

          return user;
        } catch (error: any) {
          console.error("Error in user authorization:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 90,
    updateAge: 30 * 60,
  },
  debug: process.env.ENV !== "PROD",
  secret: process.env.SECRET,

  callbacks: {
    session: async ({ session, token }: any) => {
      const pool = await getPool();

      // Retrieve user details and role info
      const [userRows]: any = await pool.execute(
        `SELECT * FROM users WHERE id = ?`,
        [token.sub]
      );

      const userData = userRows[0];
      if (userData) {
        session.user = {
          ...session.user,
          id: userData.id,
          name: userData.name,
          email: userData.email,
          username: userData.username,
          profilePicture: userData.profilePicture,
          bio: userData.bio,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/404",
  },
};
