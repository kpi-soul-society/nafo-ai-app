import { z } from 'zod';

export const updateVariationPublicitySchema = z.object({
  variationId: z.string(),
  isSharedToCommunity: z.number(),
});

export type UpdateVariationPublicitySchema = z.infer<typeof updateVariationPublicitySchema>;
