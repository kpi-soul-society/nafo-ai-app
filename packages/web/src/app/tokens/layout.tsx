import { Metadata } from 'next';

import UrqlContext from '@/components/common/UrqlContext';

export const metadata: Metadata = {
  title: 'Tokens',
  description: 'Donate and get your tokens here',
  twitter: {
    title: 'Tokens',
  },
  openGraph: {
    title: 'Tokens',
  },
};

export default async function TokensLayout({ children }: { children: React.ReactNode }) {
  return (
    <UrqlContext>
      <main className="flex min-h-screen flex-col justify-between gap-x-10 font-sans">{children}</main>
    </UrqlContext>
  );
}
