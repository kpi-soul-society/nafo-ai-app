import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().gte(1).default(1),
  limit: z.number().gte(6).default(6),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
