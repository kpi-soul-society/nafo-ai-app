'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';

export interface AuthContextProps extends SessionProviderProps {
  children: React.ReactNode;
}

export default function AuthContext({ children, session }: AuthContextProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
