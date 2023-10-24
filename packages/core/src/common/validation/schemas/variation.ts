import { z } from 'zod';

import { MAX_IMAGES_DISPLAYED_IN_HALL_OF_FAME } from '../constants';

import { paginationSchema } from './common';

export const communityVariationsPaginationSchema = paginationSchema.extend({
  page: z.number().gte(1).default(1),
  limit: z.number().lte(MAX_IMAGES_DISPLAYED_IN_HALL_OF_FAME).default(12),
});

export type CommunityVariationsPaginationSchema = z.infer<typeof communityVariationsPaginationSchema>;
