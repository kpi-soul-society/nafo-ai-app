'use client';
import { useEffect } from 'react';
import { CreateCheckoutSessionSchema } from '@nafo-ai/core/common/validation';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn, SignInOptions, signOut } from 'next-auth/react';

import { CheebsLoader } from '@/components/common/CheebsLoader';
import { REST_ENDPOINT } from '@/lib/config/next';
import { useFeatureFlagContext } from '@/lib/contexts/FeatureFlagProvider';

export default function Redirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isFeatureEnabled } = useFeatureFlagContext();
  const isWaitlistEnabled = isFeatureEnabled('isWaitlistEnabled');

  const authorize = async (token: string, referrerId?: string | null) => {
    const signInParams: SignInOptions = {
      sessionToken: token,
      redirect: false,
    };

    if (isWaitlistEnabled) {
      return await signIn('credentials', {
        redirect: true,
        callbackUrl: '/welcome',
        sessionToken: token,
      });
    }

    const donation = localStorage.getItem('donationAmount');
    const donationCurrency = localStorage.getItem('donationCurrency');
    if (!donation || !donationCurrency) {
      signInParams.redirect = true;
      signInParams.callbackUrl = '/editor';
      await signIn('credentials', signInParams);
      return;
    }
    await signIn('credentials', signInParams);

    if (referrerId) {
      const session = await getSession();

      if (!session) {
        throw new Error('Session not found');
      }
      const userId = session?.user.id;

      const now = +new Date();
      const userCreatedAt = +new Date(session?.user.createdAt);

      const minutesSinceUserCreated = Math.floor(Math.abs(now - userCreatedAt) / (1000 * 60));

      if (minutesSinceUserCreated <= 5) {
        await fetch(`${REST_ENDPOINT}/users/${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            referrerId,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('referrerId');
    }

    const donationAmount = parseInt(donation);
    const response = await fetch(`${REST_ENDPOINT}/payments/checkout/session`, {
      method: 'POST',
      body: JSON.stringify({
        amount: donationAmount,
        currency: donationCurrency,
      } as CreateCheckoutSessionSchema),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      await signOut({
        redirect: true,
        callbackUrl: '/',
      });
    }
    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }
    const donationUrl = JSON.parse((await response.json()).body).checkoutUrl;
    localStorage.removeItem('donationAmount');
    localStorage.removeItem('donationCurrency');

    router.push(donationUrl);
  };

  useEffect(() => {
    const token = searchParams.get('token');
    const referrerId = localStorage.getItem('referrerId');
    if (token) {
      authorize(token, referrerId);
    } else {
      redirect('/');
    }
  }, []);

  return (
    <div className="relative flex h-screen min-h-screen flex-col items-center justify-center gap-y-2">
      <CheebsLoader />
    </div>
  );
}
