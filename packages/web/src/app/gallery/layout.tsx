import { Metadata } from 'next';

import UrqlContext from '@/components/common/UrqlContext';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Check out works by our community',
  twitter: {
    title: 'Gallery',
  },
  openGraph: {
    title: 'Gallery',
  },
};

export default async function HallOfFameLayout({ children }: { children: React.ReactNode }) {
  return <UrqlContext>{children}</UrqlContext>;
}
