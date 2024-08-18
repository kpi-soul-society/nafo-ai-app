import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import { Inter, Russo_One } from 'next/font/google';
import { getServerSession } from 'next-auth';

import AuthContext from '@/components/authenticator/NextAuthProvider';
import { authOptions } from '@/lib/auth/config';
import { STAGE } from '@/lib/config/next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const russo = Russo_One({ weight: '400', subsets: ['latin'], variable: '--font-russo-one' });

export const metadata: Metadata = {
  title: {
    default: 'NAFO AI',
    template: '%s | NAFO AI',
  },
  applicationName: 'NAFO AI',
  description: 'Create your NAFO themed images with AI and support Ukraine',
  keywords: [
    'NAFO',
    'AI',
    'Artificial Intelligence',
    'Image Generator',
    'NAFO AI',
    'Charity',
    'Ukraine',
    'StandWithUkraine',
  ],
  metadataBase: new URL('https://nafoai.com'),
  openGraph: {
    title: 'NAFO AI',
    description: 'Create your NAFO themed images with AI and support Ukraine',
    type: 'website',
    siteName: 'NAFO AI',
    url: 'https://nafoai.com',
  },
  twitter: {
    title: 'NAFO AI',
    description: 'Create your NAFO themed images with AI and support Ukraine',
    creator: '@ai_nafo',
    site: 'https://nafoai.com',
    card: 'summary',
  },
  robots: {
    index: STAGE === 'prod',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${russo.variable}`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
