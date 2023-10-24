'use client';

import { UrqlProvider } from '@urql/next';
import { SessionProviderProps } from 'next-auth/react';

import { createClientSideUrqlClient } from '@/lib/client/graphqlClient';

export interface AuthContextProps extends SessionProviderProps {
  children: React.ReactNode;
}

const { client, ssr } = createClientSideUrqlClient();

export default function UrqlContext({ children }: AuthContextProps) {
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}
