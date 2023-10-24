import { Metadata } from 'next';

import UrqlContext from '@/components/common/UrqlContext';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your profile',
};

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <UrqlContext>{children}</UrqlContext>;
}
