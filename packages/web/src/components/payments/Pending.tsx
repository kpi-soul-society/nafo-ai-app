'use client';
import React, { useCallback, useEffect } from 'react';
import { PaymentSuccessfulMessage } from '@nafo-ai/core/common/validation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useTypedQuery } from '@/lib/client/graphqlClient';
import useSocketData from '@/lib/hooks/useSocketData';

export const PendingPayment = ({ orderId }: Props) => {
  const [tokenAcquistionQuery, refetchTokenAcquistions] = useTypedQuery({
    query: {
      tokenAcquisition: [
        { tokenAcquisitionId: orderId },
        {
          status: true,
        },
      ],
    },
  });
  const { socketData } = useSocketData() as SocketData;
  const router = useRouter();

  const handleWebsocketPaymentStatusUpdate = useCallback(() => {
    if (socketData && socketData.actionType === 'PAYMENT_SUCCESSFUL' && orderId.includes(socketData.donationId)) {
      router.push(`/editor`);
    }
  }, [socketData, orderId, router]);

  useEffect(() => {
    handleWebsocketPaymentStatusUpdate();
  }, [handleWebsocketPaymentStatusUpdate]);

  useEffect(() => {
    const interval = setInterval(() => refetchTokenAcquistions({ requestPolicy: 'network-only' }), 5000); // additionally poll payment status every 5 seconds
    return () => clearInterval(interval);
  }, [refetchTokenAcquistions]);

  useEffect(() => {
    if (tokenAcquistionQuery.data?.tokenAcquisition.status === 'APPROVED') {
      router.push(`/editor`);
    }
  }, [tokenAcquistionQuery, router]);

  return (
    <p>
      <div className="relative flex h-screen flex-col items-center justify-center gap-y-14">
        <div className="animate-spin-slow relative h-12 w-24 sm:h-20 sm:w-36 lg:h-24 lg:w-48">
          <Image
            src="/assets/cheebs.png"
            alt="cheebs"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span className="text-2xl">We&apos;re processing your payment. Please wait...</span>
      </div>
    </p>
  );
};

interface SocketData {
  socketData: PaymentSuccessfulMessage | undefined;
}

type Props = {
  orderId: string;
};
