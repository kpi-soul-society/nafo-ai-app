'use client';
import React from 'react';
import { CreateCheckoutSessionSchema } from '@nafo-ai/core/common/validation';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { CommonFooter } from '@/components/common/CommonFooter';
import { CommonHeader } from '@/components/common/CommonHeader';
import { ContactSupportButton } from '@/components/common/ContactSupportButton';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { REST_ENDPOINT } from '@/lib/config/next';
import { MAIN_PAGES } from '@/lib/constants/pages';

const Tokens = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handlePayment = async ({ amount = 1, currency = 'USD' }) => {
    if (!session) {
      localStorage.setItem('donationAmount', amount.toString());
      localStorage.setItem('donationCurrency', 'USD');
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
    <div className="flex h-full flex-col">
      <div className="px-10 lg:px-20">
        <CommonHeader linkPreset={MAIN_PAGES} />
      </div>

      <div className="flex flex-col gap-y-12 px-10 pb-10 sm:gap-y-20 lg:px-20">
        <PaymentForm handlePayment={handlePayment} titleClass="text-3xl lg:text-4xl" />
        <HowItWorks />
      </div>
      <CommonFooter linkPreset={MAIN_PAGES} />
      <ContactSupportButton bg="bg-primary" />
    </div>
  );
};
export default Tokens;
