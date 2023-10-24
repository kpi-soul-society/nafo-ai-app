import { z } from 'zod';

import { PaymentCurrency } from '../../payment';

export const paymentStatusUpdateCallbackSchema = z.object({
  orderStatus: z.enum(['approved', 'processing', 'expired', 'declined']),
  amount: z.string(),
  currency: z.string(),
  merchantData: z.string(),
  paymentId: z.number(),
  actualAmount: z.string().nullish(),
  actualCurrency: z.string().nullish(),
  paymentSystem: z.string().nullish(),
  cardType: z.string().nullish(),
  senderEmail: z.string().nullish(),
  fee: z.string().nullish(),
});

const currency = {
  symbol: z.string(),
  name: z.nativeEnum(PaymentCurrency),
  tokenRate: z.number(),
};

export const paymentShema = z
  .object({
    price: z
      .number({
        invalid_type_error: 'Please enter valid number',
        required_error: 'Please enter a value or choose a pack',
      })
      .max(100000, 'The max donation is 100000')
      .refine((price) => Number.isInteger(price), { message: 'Please enter a round number' }),
    currency: z.object(currency).default({ name: PaymentCurrency.USD, symbol: '$', tokenRate: 5 }),
  })
  .refine(({ currency, price }) => price >= Math.floor(5 / currency.tokenRate), {
    message: 'Your donation should be equal at least 5 tokens',
  });

export type PaymentShema = z.infer<typeof paymentShema>;
export type PaymentStatusUpdateCallbackSchema = z.infer<typeof paymentStatusUpdateCallbackSchema>;
