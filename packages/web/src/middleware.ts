import { User } from '@nafo-ai/graphql/genql';
import {
  InMemoryStorageProvider,
  IToggle,
  TOGGLED_PLATFORM_URLS,
  ToggledClient,
  TOGGLES_STATUS,
} from '@toggled.dev/toggled-client-js';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import { NEXTAUTH_SECRET, REST_ENDPOINT, TOGGLED_FEATURE_FLAGS_CLIENT_KEY } from './lib/config/next';

export default withAuth(
  // `authorized` callback augments `Request` with the user's token.
  async (req) => {
    if (req.nextUrl.pathname === '/editor') {
      const token = req.nextauth.token;
      const response = await fetch(`${REST_ENDPOINT}/session`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
        },
      });
      if (!response.ok) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      const user: User = await response.json();

      if (!user?.isActive) {
        return NextResponse.redirect(new URL('/tokens', req.url));
      }
    }
  },
  {
    callbacks: {
      async authorized({ req, token }) {
        // `/admin` requires admin role
        if (!token) {
          return false;
        }

        const toggled = new ToggledClient({
          url: TOGGLED_PLATFORM_URLS.EUC1,
          clientKey: TOGGLED_FEATURE_FLAGS_CLIENT_KEY,
          storageProvider: new InMemoryStorageProvider(),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error - we want to just fetch once instead of polling since we're using SSR and Lambda
        await toggled.fetchToggles();
        const toggles = toggled.getAllToggles();
        const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled', toggles);

        const response = await fetch(`${REST_ENDPOINT}/session`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        if (!response.ok) {
          return false;
        }
        const user: User = await response.json();

        return isWaitlistEnabled ? user.role === 'ADMIN' : !!user.id;
      },
    },
    pages: { signIn: '/', signOut: '/' },
    secret: NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ['/editor', '/checkout/pending/:orderId', '/tokens', '/profile'],
};

const isFeatureEnabled = (feature: string, featureFlags: IToggle[]) => {
  const toggle = featureFlags.find((t) => t.toggleName === feature);
  const enabled = toggle ? toggle.toggleStatus === TOGGLES_STATUS.ON : false;

  return enabled;
};
