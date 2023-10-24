import { KeysToSnakeCase } from '@nafo-ai/core/common/types';
import { PaymentStatusUpdateCallbackSchema } from '@nafo-ai/core/common/validation';
import { User } from '@nafo-ai/core/user';
import { defaultLambdaMiddleware } from 'src/middleware/lambda';
import { ApiHandler } from 'sst/node/api';

export const paymentCallback = ApiHandler(async (req) => {
  if (!req.body) {
    throw new Error('No body');
  }

  const res: KeysToSnakeCase<PaymentStatusUpdateCallbackSchema> = JSON.parse(req.body);
  const merchantData: { key: string; value: string }[] = JSON.parse(res.merchant_data);
  const userId = merchantData.find((m) => m.key === 'userId')?.value;
  if (!userId) {
    throw new Error('No userId');
  }

  const user = await User.getOne({ id: userId });
  if (!user) {
    throw new Error('No user');
  }

  await User.Events.PaymentStatusUpdated.publish({
    orderStatus: res.order_status,
    amount: parseInt(res.amount),
    currency: res.currency,
    actualAmount: res.actual_amount,
    actualCurrency: res.actual_currency,
    paymentSystem: res.payment_system,
    cardType: res.card_type,
    paymentId: res.payment_id.toString(),
    senderEmail: res.sender_email,
    fee: res.fee,
    userId: user.id,
  });

  return {
    body: JSON.stringify({ ok: true }),
  };
});

export const handler = defaultLambdaMiddleware()(paymentCallback);
