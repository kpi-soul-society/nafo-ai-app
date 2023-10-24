'use client';
import React, { useState } from 'react';
import type { CreateCheckoutSessionSchema } from '@nafo-ai/core/common/validation';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { REST_ENDPOINT } from '@/lib/config/next';

import { SignInDialog } from '../common/SignInDialog';
import { PaymentForm } from '../payments/PaymentForm';

export const Donation = () => {
  const { data: session } = useSession();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const router = useRouter();

  const handlePayment = async ({ amount = 1, currency = 'USD' }) => {
    if (!session) {
      localStorage.setItem('donationAmount', amount.toString());
      localStorage.setItem('donationCurrency', 'USD');
      setIsAuthDialogOpen(true);
    } else {
      const response = await fetch(`${REST_ENDPOINT}/payments/checkout/session`, {
        method: 'POST',
        body: JSON.stringify({
          amount: amount,
          currency: currency,
        } as CreateCheckoutSessionSchema),
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
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

      router.push(donationUrl);
    }
  };
  return (
    <>
      <PaymentForm handlePayment={handlePayment} />
      <SignInDialog
        text={'One step before proceeding to payment'}
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </>
  );
};
