import { z } from 'zod';

export const createSupportRequestSchema = z.object({
  customerEmail: z.string().email(),
  subject: z.string().nonempty({ message: 'Subject should not be empty' }),
  details: z.string().nonempty({ message: 'Details should not be empty' }),
});
export type CreateSupportRequestSchema = z.infer<typeof createSupportRequestSchema>;

export const supportRequestCreatedEvent = {
  id: z.string(),
};
const supportRequestCreatedEventSchema = z.object(supportRequestCreatedEvent);
export type SupportRequestCreatedEventSchema = z.infer<typeof supportRequestCreatedEventSchema>;
