import { Toaster } from 'react-hot-toast';
import { InMemoryStorageProvider, TOGGLED_PLATFORM_URLS, ToggledClient } from '@toggled.dev/toggled-client-js';
import { Metadata } from 'next';
import { Inter, Russo_One } from 'next/font/google';
import Script from 'next/script';
import { getServerSession } from 'next-auth';

import AuthContext from '@/components/authenticator/NextAuthProvider';
import { authOptions } from '@/lib/auth/config';
import { STAGE, TOGGLED_FEATURE_FLAGS_CLIENT_KEY } from '@/lib/config/next';
import { FeatureFlagProvider } from '@/lib/contexts/FeatureFlagProvider';

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
  const session = await getServerSession(authOptions);
  const toggled = new ToggledClient({
    url: TOGGLED_PLATFORM_URLS.EUC1,
    clientKey: TOGGLED_FEATURE_FLAGS_CLIENT_KEY,
    storageProvider: new InMemoryStorageProvider(),
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error - we want to just fetch once instead of polling since we're using SSR and Lambda
  await toggled.fetchToggles();
  const toggles = toggled.getAllToggles();

  return (
    <html lang="en">
      {STAGE === 'prod' && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-YBLQBLE9G3" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-YBLQBLE9G3');
              `}
          </Script>

          <Script type="text/javascript" src="/hotjar.js"></Script>
        </>
      )}
      <body className={`${inter.className} ${russo.variable}`}>
        <AuthContext session={session}>
          <Toaster />
          <FeatureFlagProvider featureFlags={toggles}>{children}</FeatureFlagProvider>
        </AuthContext>
      </body>
    </html>
  );
}
