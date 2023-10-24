import { z } from 'zod';

export const paymentSuccessfulMessageSchema = z.object({
  actionType: z.literal('PAYMENT_SUCCESSFUL'),
  donationId: z.string(),
});

export type PaymentSuccessfulMessage = z.infer<typeof paymentSuccessfulMessageSchema>;
