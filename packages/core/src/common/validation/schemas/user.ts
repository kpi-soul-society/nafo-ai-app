import { z } from 'zod';

export const userPaymentStatusUpdatedEvent = {
  userId: z.string(),
  orderStatus: z.enum(['approved', 'processing', 'expired', 'declined']),
  amount: z.number(),
  currency: z.string(),
  paymentId: z.string(),
  actualAmount: z.string().nullish(),
  actualCurrency: z.string().nullish(),
  paymentSystem: z.string().nullish(),
  cardType: z.string().nullish(),
  senderEmail: z.string().nullish(),
  fee: z.string().nullish(),
};

export const currency = z.enum(['USD', 'UAH', 'EUR']);
export const createCheckoutSessionSchema = z.object({
  currency: currency,
  amount: z.number(),
});

export const updateUserSchema = z.object({
  referrerId: z.string().optional(),
});

const userPaymentStatusUpdatedEventObjectSchema = z.object(userPaymentStatusUpdatedEvent);

export type UserPaymentStatusUpdatedEventSchema = z.infer<typeof userPaymentStatusUpdatedEventObjectSchema>;
export type CreateCheckoutSessionSchema = z.infer<typeof createCheckoutSessionSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
