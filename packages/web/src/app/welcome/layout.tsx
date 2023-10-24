import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Thanks for joinin us! We will let you know once we launch',
};

export default async function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
