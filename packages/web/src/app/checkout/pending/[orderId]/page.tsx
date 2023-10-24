'use client';
import React from 'react';

import { PendingPayment } from '@/components/payments/Pending';
import useSocketConnection from '@/lib/hooks/useSocketConnection';

const Pending = ({ params }: Params) => {
  useSocketConnection();

  // id of format: '<merchantId>-<ulid>'
  const orderId = params.orderId.split('-')[1];

  return <PendingPayment orderId={orderId} />;
};
export default Pending;

type Params = {
  params: { orderId: string };
};
