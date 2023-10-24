import { User } from '@nafo-ai/graphql/genql';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { NEXTAUTH_SECRET, REST_ENDPOINT } from '../config/next';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        sessionToken: { label: 'token', type: 'text' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials?.sessionToken) {
          return null;
        }
        const response = await fetch(`${REST_ENDPOINT}/session`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${credentials.sessionToken}`,
          },
        });

        const user: User = await response.json();

        // If no error and we have user data, return it
        if (response.ok && user) {
          return { ...user, accessToken: credentials.sessionToken };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 365 * 24 * 60 * 60, // 365 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.createdAt = user.createdAt;
        token.avatarUrl = user.avatarUrl;
      }

      return token;
    },
    session: async ({ session, token }) => {
      const response = await fetch(`${REST_ENDPOINT}/session`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Unauthorized');
      }
      const user: User = await response.json();
      if (token) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.role = user.role;
        session.user.avatarUrl = user.avatarUrl;
        session.user.accessToken = token.accessToken;
        session.user.createdAt = user.createdAt;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      else if (url.startsWith('https://pay.fondy.eu')) return url;
      return baseUrl;
    },
  },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
  },
};
