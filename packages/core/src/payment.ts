export * as Payment from './payment';
import CloudIpsp, { MerchantData } from 'cloudipsp-node-js-sdk';
import { Config } from 'sst/node/config';
import { ulid } from 'ulid';

import { calculateTokensFromPrice, CURRENCY_TO_TOKEN_EXCHANGE_RATE } from './common/payment';
import { CreateCheckoutSessionSchema, PaymentStatusUpdateCallbackSchema } from './common/validation';
import { SQL } from './db/sql';
import { TokenAcquisition } from './db/sql.generated';

export const getTokenAcquisitionById = async (id: string) => {
  return SQL.DB.selectFrom('tokenAcquisition').selectAll().where('id', '=', id).executeTakeFirst();
};

export const createCheckoutSession = async (payload: CreateCheckoutSession) => {
  const fondy = new CloudIpsp({
    merchantId: parseInt(Config.FONDY_MERCHANT_ID),
    secretKey: Config.FONDY_SECRET_KEY,
  });

  const { currency, amount, onSuccessRedirectUrl, orderDescription, metadata } = payload;
  const userId = metadata.find((data) => data.key === 'userId')?.value as string;

  const { checkoutUrl, tokenAcquisiton } = await SQL.DB.transaction().execute(async (trx) => {
    const tokenRate = CURRENCY_TO_TOKEN_EXCHANGE_RATE.find((rate) => rate.name === currency)?.tokenRate;
    if (!tokenRate) {
      throw new Error(`Could not find token rate for currency ${currency}`);
    }
    // convert the value from cents to decimal
    const price = amount / 100;
    const tokenNumber = calculateTokensFromPrice(price, tokenRate);

    const tokenAcquisitionId = ulid().toLowerCase();
    await trx
      .insertInto('tokenAcquisition')
      .values([
        {
          id: tokenAcquisitionId,
          donationCurrencyToTokenExchangeRate: tokenRate,
          tokenNumber,
          status: 'INITIATED',
          userId,
          donation: amount,
          donationCurrency: currency,
        },
      ])
      .execute();
    const initialTokenAcquisition = await trx
      .selectFrom('tokenAcquisition')
      .selectAll()
      .where('id', '=', tokenAcquisitionId)
      .executeTakeFirstOrThrow();

    const orderId = `${Config.FONDY_MERCHANT_ID}-${initialTokenAcquisition.id}`;

    const requestData = {
      order_id: orderId,
      currency,
      amount: amount.toString(),
      order_desc: orderDescription,
      response_url: `${onSuccessRedirectUrl}/${orderId}` || `${Config.WEBSITE_URL}/editor`,
      server_callback_url: Config.FONDY_CALLBACK_URL,
      merchant_data: JSON.stringify(metadata),
    };

    const { checkout_url: checkoutUrl, payment_id: paymentProviderTransactionId } = await fondy.Checkout(requestData);
    await trx
      .updateTable('tokenAcquisition')
      .set({ paymentProviderTransactionId })
      .where('id', '=', initialTokenAcquisition.id)
      .execute();
    const tokenAcquisitonWithTransactionId = await trx
      .selectFrom('tokenAcquisition')
      .selectAll()
      .where('id', '=', initialTokenAcquisition.id)
      .executeTakeFirstOrThrow();

    return { checkoutUrl, tokenAcquisiton: tokenAcquisitonWithTransactionId };
  });

  return { checkoutUrl, tokenAcquisitionId: tokenAcquisiton.id };
};

export const fondyPaymentStatusToSystemPaymentStatus = new Map<FondyPaymentStatus, TokenAcquisition['status']>([
  ['approved', 'APPROVED'],
  ['declined', 'DECLINED'],
  ['processing', 'IN_PROGRESS'],
  ['expired', 'EXPIRED'],
]);

export interface CreateCheckoutSession extends CreateCheckoutSessionSchema {
  onSuccessRedirectUrl: string;
  orderDescription: string;
  metadata: MerchantData[];
}

type FondyPaymentStatus = PaymentStatusUpdateCallbackSchema['orderStatus'];
