// next-auth.d.ts
import NextAuth from "next-auth";

// Extend the Session and User types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      roleId: number;
      role: string;
    } & DefaultSession["user"]; // Extends default fields (name, email, image)
  }

  interface User {
    id: string;
    username: string;
    roleId: number;
    role: string;
  }
}
