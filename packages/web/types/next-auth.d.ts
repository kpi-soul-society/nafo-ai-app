import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    email: string;
    role: string;
    avatarUrl?: string;
    accessToken: string;
    createdAt: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    avatarUrl?: string;
    createdAt: string;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }
}
